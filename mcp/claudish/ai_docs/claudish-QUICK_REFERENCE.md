# Claudish Codebase - Quick Reference Guide

## One-Page Overview

### What is Claudish?
A CLI tool that runs Claude Code with any OpenRouter model via a local Anthropic API-compatible proxy.

**Version:** 1.3.1
**Location:** `mcp/claudish/` (in repository root)
**Language:** TypeScript (Bun runtime)

### Current Environment Variables

```
INPUT (User-Provided)         PROCESSED (Claudish-Set)
═══════════════════════════   ═══════════════════════════════════
OPENROUTER_API_KEY       →    ANTHROPIC_BASE_URL (proxy URL)
CLAUDISH_MODEL           →    CLAUDISH_ACTIVE_MODEL_NAME (model ID)
CLAUDISH_PORT            →    ANTHROPIC_API_KEY (placeholder)
ANTHROPIC_API_KEY        →    (inherited to Claude Code)
```

### Missing Variables (Not Yet Implemented)

```
ANTHROPIC_MODEL              ← Would fallback model selection
ANTHROPIC_SMALL_FAST_MODEL   ← Would specify fast model
```

### File Organization

```
src/
├── index.ts          ← Entry point, orchestration
├── cli.ts            ← Parse arguments & env vars
├── config.ts         ← Define ENV constants
├── types.ts          ← TypeScript interfaces
├── claude-runner.ts  ← Set up Claude Code environment
├── proxy-server.ts   ← Transform requests to OpenRouter
├── transform.ts      ← API format conversion
├── logger.ts         ← Debug logging
├── simple-selector.ts← Interactive prompts
├── port-manager.ts   ← Port availability
└── adapters/         ← Model-specific adapters
```

### Data Flow

```
CLI Input (--model x-ai/grok-code-fast-1)
    ↓
parseArgs() in cli.ts
    ↓
config.model = "x-ai/grok-code-fast-1"
    ↓
createProxyServer(port, apiKey, config.model)
    ↓
runClaudeWithProxy(config, proxyUrl)
    ↓
env.CLAUDISH_ACTIVE_MODEL_NAME = "x-ai/grok-code-fast-1"
    ↓
spawn("claude", args, { env })
    ↓
Claude Code displays model in status line
    ↓
Status line script reads token file for context %
```

### Key Code Locations (Line Numbers)

| Component | File | Lines | What It Does |
|-----------|------|-------|--------------|
| ENV constants | config.ts | 56-61 | Define all environment variables |
| Env var reading | cli.ts | 22-34 | Parse CLAUDISH_MODEL, CLAUDISH_PORT |
| Model passing | index.ts | 81-87 | Pass model to proxy creation |
| Env assignment | claude-runner.ts | 120-127 | Set CLAUDISH_ACTIVE_MODEL_NAME |
| Status line | claude-runner.ts | 60 | Bash script using model env var |
| Model contexts | claude-runner.ts | 32-39 | Context window definitions |
| Token writing | proxy-server.ts | 805-816 | Write token counts to file |

### Current Environment Variable Usage

**OPENROUTER_API_KEY**
- Set by: User (required)
- Read by: cli.ts, proxy-server.ts
- Used for: OpenRouter API authentication

**CLAUDISH_MODEL**
- Set by: User (optional)
- Read by: cli.ts (line 23)
- Default: Prompts user if not provided
- Used for: Default model selection

**CLAUDISH_PORT**
- Set by: User (optional)
- Read by: cli.ts (line 28)
- Default: Random port 3000-9000
- Used for: Proxy server port selection

**CLAUDISH_ACTIVE_MODEL_NAME**
- Set by: claude-runner.ts (line 126)
- Read by: Status line bash script
- Value: The OpenRouter model ID
- Used for: Display in Claude Code status line

**ANTHROPIC_BASE_URL**
- Set by: claude-runner.ts (line 124)
- Read by: Claude Code
- Value: http://127.0.0.1:{port}
- Used for: Redirect API calls to proxy

**ANTHROPIC_API_KEY**
- Set by: claude-runner.ts (line 138 or deleted in monitor mode)
- Read by: Claude Code
- Value: Placeholder or empty
- Used for: Prevent auth dialog (proxy handles real auth)

### Token Tracking System

```
Request to OpenRouter
    ↓ (proxy-server.ts accumulates tokens)
Response from OpenRouter
    ↓
writeTokenFile() at line 816
    ↓
/tmp/claudish-tokens-{PORT}.json
{
  "input_tokens": 1234,
  "output_tokens": 567,
  "total_tokens": 1801,
  "updated_at": 1731619200000
}
    ↓
Status line bash script reads file
    ↓
Calculates: (maxTokens - usedTokens) * 100 / maxTokens
    ↓
Displays as context percentage in status line
```

### Model Context Windows (in tokens)

```
x-ai/grok-code-fast-1:                  256,000
openai/gpt-5-codex:                     400,000
minimax/minimax-m2:                     204,800
z-ai/glm-4.6:                          200,000
qwen/qwen3-vl-235b-a22b-instruct:      256,000
anthropic/claude-sonnet-4.5:           200,000
Custom/Unknown:                        100,000 (fallback)
```

### How to Add ANTHROPIC_MODEL Support

**3 Changes Needed:**

1. **config.ts** (1 line)
   ```typescript
   ANTHROPIC_MODEL: "ANTHROPIC_MODEL",  // Add to ENV object
   ```

2. **cli.ts** (3 lines after line 26)
   ```typescript
   const anthropicModel = process.env[ENV.ANTHROPIC_MODEL];
   if (!envModel && anthropicModel) {
     config.model = anthropicModel;
   }
   ```

3. **claude-runner.ts** (optional, 1 line after line 126)
   ```typescript
   env[ENV.ANTHROPIC_MODEL] = modelId;
   ```

### Testing Environment Variable Support

```bash
# Build (from mcp/claudish directory)
cd mcp/claudish
bun run build

# Test with ANTHROPIC_MODEL
export ANTHROPIC_MODEL=openai/gpt-5-codex
export OPENROUTER_API_KEY=sk-or-v1-...
./dist/index.js "test"

# Verify: Status line should show openai/gpt-5-codex
```

### Important Implementation Patterns

**1. Centralized ENV Constant**
```typescript
// Define in one place
export const ENV = { CLAUDISH_ACTIVE_MODEL_NAME: "..." };

// Use everywhere
process.env[ENV.CLAUDISH_ACTIVE_MODEL_NAME]
```

**2. Unique File Paths**
```typescript
// Prevents conflicts between parallel Claudish instances
const tokenFilePath = `/tmp/claudish-tokens-${port}.json`;
const tempPath = join(tmpdir(), `claudish-settings-${timestamp}.json`);
```

**3. Safe Environment Inheritance**
```typescript
const env: Record<string, string> = {
  ...process.env,              // Keep existing
  ANTHROPIC_BASE_URL: proxyUrl, // Add/override specific
};
```

**4. Model ID is String-Based**
```typescript
// Not enum-restricted - any OpenRouter model ID works
config.model: string = "x-ai/grok-code-fast-1" | "custom-model" | ...
```

### Debugging Commands

```bash
# Enable debug logging
claudish --debug --model x-ai/grok-code-fast-1 "test"

# Monitor mode (see all API traffic)
claudish --monitor --model openai/gpt-5-codex "test"

# Check token file
cat /tmp/claudish-tokens-3000.json

# Check status line script
cat /tmp/claudish-settings-*.json | jq .statusLine.command

# Check environment variables
env | grep CLAUDISH
```

### Architecture Decision: Why Temp Settings Files?

**Problem:** How to show model info in status line without modifying global Claude Code settings?

**Solution:** Create temporary settings file per instance
- Each Claudish instance creates unique temp file
- File contains custom status line command
- Passed to Claude Code via `--settings` flag
- Automatically cleaned up on exit
- No conflicts between parallel instances
- Global settings remain unchanged

**Alternative Approach (Not Used):**
- Modify ~/.claude/settings.json - Would conflict with global config
- Write to fixed file - Would conflict between parallel instances
- Use Claude environment variables only - Status line wouldn't display model

### Architecture Decision: Why Token File?

**Problem:** How to display real-time token usage in status line?

**Solution:** Token file shared between proxy and status line
- Proxy accumulates tokens during conversation
- Writes to `/tmp/claudish-tokens-{PORT}.json` after each request
- Status line bash script reads file
- No need to modify proxy response format
- Decoupled from main communication protocol
- Survives proxy shutdown (for final display)

### Documents in This Directory

- `CODEBASE_ANALYSIS.md` - 14KB complete architecture guide
- `KEY_CODE_LOCATIONS.md` - 7.8KB code reference with line numbers
- `FINDINGS_SUMMARY.md` - 10KB executive summary
- `QUICK_REFERENCE.md` - This document (1-page overview)

---

**Quick Reference Created:** November 15, 2025
**Claudish Version:** 1.3.1
**Total Lines of Analysis:** 9600+
