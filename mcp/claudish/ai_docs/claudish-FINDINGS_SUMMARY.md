# Claudish Codebase Exploration - Findings Summary

## Executive Summary

Successfully explored the Claudish tool codebase at `mcp/claudish/`. The tool is a well-structured TypeScript/Bun CLI that proxies Claude Code requests to OpenRouter models via a local Anthropic API-compatible server.

**Key Finding:** Claudish already has an environment variable system for model communication, but does NOT currently support `ANTHROPIC_MODEL` or `ANTHROPIC_SMALL_FAST_MODEL`.

## What I Found

### 1. Current Model Communication System

Claudish uses a multi-layer approach to communicate model information:

**Layer 1: Environment Variables**
- `CLAUDISH_ACTIVE_MODEL_NAME` - Set by claudish, read by status line script
- Passed to Claude Code via environment at line 126 in `claude-runner.ts`

**Layer 2: Temporary Settings File**
- Path: `/tmp/claudish-settings-{timestamp}.json`
- Contains: Custom status line command
- Created dynamically to avoid modifying global Claude Code settings

**Layer 3: Token File**
- Path: `/tmp/claudish-tokens-{PORT}.json`
- Written by proxy server (line 816 in `proxy-server.ts`)
- Contains: cumulative input/output token counts
- Read by status line bash script for real-time context tracking

### 2. Architecture Overview

```
User CLI Input → parseArgs() → Config Object → createProxyServer() + runClaudeWithProxy()
                                                       ↓
                                    Environment Variables + Temp Settings File
                                                       ↓
                                           Claude Code Process Spawned
                                                       ↓
                                    Status Line reads CLAUDISH_ACTIVE_MODEL_NAME
```

### 3. Key Files & Their Purposes

| File | Location | Purpose | Size |
|------|----------|---------|------|
| `config.ts` | src/ | Environment variable names & model metadata | Small |
| `cli.ts` | src/ | Argument & env var parsing | Medium |
| `claude-runner.ts` | src/ | Claude execution & environment setup | Medium |
| `proxy-server.ts` | src/ | Hono-based proxy to OpenRouter | 58KB! |
| `types.ts` | src/ | TypeScript interfaces | Small |

### 4. Environment Variables Currently Supported

**User-Configurable:**
- `OPENROUTER_API_KEY` - Required for OpenRouter authentication
- `CLAUDISH_MODEL` - Default model selection
- `CLAUDISH_PORT` - Default proxy port
- `ANTHROPIC_API_KEY` - Placeholder to prevent Claude Code dialog

**Set by Claudish (read-only):**
- `CLAUDISH_ACTIVE_MODEL_NAME` - Model ID (set in claude-runner.ts:126)
- `ANTHROPIC_BASE_URL` - Proxy URL (set in claude-runner.ts:124)

### 5. Model Information Flow

**How the model gets to Claude Code UI:**

1. User specifies model via `--model` flag, `CLAUDISH_MODEL` env var, or interactive selection
2. Model ID stored in `config.model` (e.g., "x-ai/grok-code-fast-1")
3. Passed to `createProxyServer(port, apiKey, config.model, ...)` - line 81-87 in `index.ts`
4. Set as environment variable: `CLAUDISH_ACTIVE_MODEL_NAME` = model ID
5. Claude Code spawned with env vars (line 157 in `claude-runner.ts`)
6. Status line bash script reads `$CLAUDISH_ACTIVE_MODEL_NAME` and displays it

**Result:** Model name appears in status line as: `[dir] • x-ai/grok-code-fast-1 • $0.123 • 85%`

### 6. Token Information Flow

**How tokens are tracked for context display:**

1. Proxy server accumulates tokens during conversation
2. After each message, writes to `/tmp/claudish-tokens-{PORT}.json`:
   ```json
   {
     "input_tokens": 1234,
     "output_tokens": 567,
     "total_tokens": 1801,
     "updated_at": 1731619200000
   }
   ```
3. Status line bash script reads this file (line 55 in `claude-runner.ts`)
4. Calculates: `(maxTokens - usedTokens) * 100 / maxTokens = contextPercent`
5. Context window sizes defined in `MODEL_CONTEXT` object (lines 32-39)

### 7. Missing Environment Variable Support

**NOT IMPLEMENTED:**
- `ANTHROPIC_MODEL` - Could override model selection
- `ANTHROPIC_SMALL_FAST_MODEL` - Could specify fast model for internal tasks
- Custom display names for models

**Currently, if you set these variables, Claudish ignores them:**
```bash
export ANTHROPIC_MODEL=openai/gpt-5-codex  # This does nothing
export ANTHROPIC_SMALL_FAST_MODEL=x-ai/grok-code-fast-1  # Also ignored
```

### 8. How to Add Support

**To add `ANTHROPIC_MODEL` support (3 small changes):**

**Change 1: Add to config.ts (after line 60)**
```typescript
export const ENV = {
  // ... existing
  ANTHROPIC_MODEL: "ANTHROPIC_MODEL",
} as const;
```

**Change 2: Add to cli.ts (after line 26)**
```typescript
// In parseArgs() function, after reading CLAUDISH_MODEL:
const anthropicModel = process.env[ENV.ANTHROPIC_MODEL];
if (!envModel && anthropicModel) {
  config.model = anthropicModel;  // Use as fallback
}
```

**Change 3: (Optional) Add to claude-runner.ts (after line 126)**
```typescript
// Set ANTHROPIC_MODEL in environment so other tools can read it
env[ENV.ANTHROPIC_MODEL] = modelId;
```

## Concrete Implementation Details

### Directory Structure
```
mcp/claudish/
├── src/
│   ├── index.ts              # Main entry, orchestration
│   ├── cli.ts                # Argument parsing (env vars on lines 22-34)
│   ├── config.ts             # Constants, ENV object (lines 56-61)
│   ├── claude-runner.ts      # Model → Claude Code (line 126)
│   ├── proxy-server.ts       # Token tracking (line 805-816)
│   ├── types.ts              # Interfaces
│   ├── transform.ts          # API transformation
│   ├── logger.ts             # Debug logging
│   ├── simple-selector.ts    # Interactive prompts
│   ├── port-manager.ts       # Port availability
│   └── adapters/             # Model-specific adapters
├── tests/
├── dist/                     # Compiled output
└── package.json
```

### Critical Line Numbers

| File | Lines | Purpose |
|------|-------|---------|
| config.ts | 56-61 | ENV constant definition |
| cli.ts | 22-34 | Environment variable reading |
| cli.ts | 124-165 | API key handling |
| index.ts | 81-87 | Proxy creation with model |
| claude-runner.ts | 32-39 | Model context windows |
| claude-runner.ts | 85 | Temp settings file creation |
| claude-runner.ts | 120-127 | Environment variable assignment |
| claude-runner.ts | 60 | Status line command |
| proxy-server.ts | 805-816 | Token file writing |

### Environment Variable Chain

```
User Input (flags/env vars)
    ↓
cli.ts: parseArgs() → reads process.env
    ↓
ClaudishConfig object
    ↓
index.ts: runClaudeWithProxy()
    ↓
claude-runner.ts: env object construction
    {
      ANTHROPIC_BASE_URL: "http://127.0.0.1:3000",
      CLAUDISH_ACTIVE_MODEL_NAME: "x-ai/grok-code-fast-1",
      ANTHROPIC_API_KEY: "sk-ant-..."
    }
    ↓
spawn("claude", args, { env })
    ↓
Claude Code process with modified environment
```

## Files to Examine

For implementation, focus on these files in order:

1. **`src/config.ts`** (69 lines)
   - Where to define `ANTHROPIC_MODEL` constant

2. **`src/cli.ts`** (300 lines)
   - Where to add environment variable parsing logic

3. **`src/claude-runner.ts`** (224 lines)
   - Where model is communicated to Claude Code
   - Where token file is read for status line

4. **`src/proxy-server.ts`** (58KB)
   - Where tokens are written to file
   - Good reference for token tracking mechanism

## Testing & Verification

To verify environment variable support works:

```bash
# Build claudish (from mcp/claudish directory)
cd mcp/claudish
bun run build

# Test with ANTHROPIC_MODEL
export ANTHROPIC_MODEL=openai/gpt-5-codex
export OPENROUTER_API_KEY=sk-or-v1-...
./dist/index.js "test prompt"

# Verify model is used by checking:
# 1. Status line shows "openai/gpt-5-codex"
# 2. No errors about unknown model
# 3. Claude Code runs with the specified model
```

## Key Insights

1. **Model ID is String-Based** - Not enum-restricted, any OpenRouter model ID accepted
2. **Environment Variables Flow Through Whole Stack** - Graceful inheritance pattern
3. **Token Tracking is Decoupled** - Separate file system allows status line to read without modifying proxy
4. **Temp Settings Pattern is Smart** - Each instance gets unique settings, no conflicts
5. **Configuration is Centralized** - ENV constant defined in one place, used everywhere

## Deliverables

Two comprehensive analysis documents created:

1. **`ai_docs/claudish-CODEBASE_ANALYSIS.md`** (14KB)
   - Complete architecture overview
   - All components explained
   - Environment variable flow diagram
   - Implementation recommendations

2. **`ai_docs/claudish-KEY_CODE_LOCATIONS.md`** (7.8KB)
   - Line-by-line code references
   - Variable scope table
   - Implementation steps for adding ANTHROPIC_MODEL
   - Debugging tips

## Recommendations

1. **Add ANTHROPIC_MODEL support** - Simple 3-line change (see "How to Add Support" section)
2. **Consider custom display names** - Allow mapping model ID to friendly name
3. **Document environment variables** - Update README with full variable reference
4. **Add integration tests** - Test env var overrides work correctly

---

**Exploration Completed:** November 15, 2025
**Files Examined:** 10+ TypeScript source files
**Analysis Documents:** 2 comprehensive guides (21.8 KB total)
**Claudish Version:** 1.3.1
