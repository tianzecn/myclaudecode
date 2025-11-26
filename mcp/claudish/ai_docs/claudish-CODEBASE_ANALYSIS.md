# Claudish Codebase Analysis

## Overview

**Claudish** is a CLI tool that runs Claude Code with OpenRouter models via a local Anthropic API-compatible proxy server. It's located at `mcp/claudish/` in the repository root and consists of a TypeScript/Bun project.

**Current Version:** v1.3.1

## Directory Structure

```
mcp/claudish/
├── src/
│   ├── index.ts                  # Main entry point
│   ├── cli.ts                    # CLI argument parser
│   ├── config.ts                 # Configuration constants
│   ├── types.ts                  # TypeScript interfaces
│   ├── claude-runner.ts          # Claude Code execution & temp settings
│   ├── proxy-server.ts           # Hono-based proxy server (58KB file!)
│   ├── transform.ts              # OpenAI ↔ Anthropic API transformation
│   ├── logger.ts                 # Debug logging
│   ├── simple-selector.ts        # Interactive model/API key prompts
│   ├── port-manager.ts           # Port availability checking
│   └── adapters/                 # Model-specific adapters
│       ├── adapter-manager.ts
│       ├── base-adapter.ts
│       ├── grok-adapter.ts
│       └── index.ts
├── package.json                  # npm dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── biome.json                    # Code formatting config
└── dist/                          # Compiled JavaScript
```

## Key Components

### 1. Main Entry Point (`src/index.ts`)

**Purpose:** CLI orchestration and setup

**Key Flow:**
1. Parses CLI arguments via `parseArgs()`
2. Initializes logger if debug mode is enabled
3. Checks if Claude Code is installed
4. Prompts for OpenRouter API key if needed (interactive mode only)
5. Prompts for model selection if not provided (interactive mode only)
6. Reads stdin if `--stdin` flag is set
7. Finds available port
8. Creates proxy server
9. Spawns Claude Code with proxy environment variables
10. Cleans up proxy on exit

### 2. Configuration (`src/config.ts`)

**Key Constants:**
```typescript
export const ENV = {
  OPENROUTER_API_KEY: "OPENROUTER_API_KEY",
  CLAUDISH_MODEL: "CLAUDISH_MODEL",
  CLAUDISH_PORT: "CLAUDISH_PORT",
  CLAUDISH_ACTIVE_MODEL_NAME: "CLAUDISH_ACTIVE_MODEL_NAME", // Set by claudish
} as const;

export const MODEL_INFO: Record<OpenRouterModel, {
  name: string;
  description: string;
  priority: number;
  provider: string;
}> = {
  "x-ai/grok-code-fast-1": { name: "Grok Code Fast", ... },
  "openai/gpt-5-codex": { name: "GPT-5 Codex", ... },
  "minimax/minimax-m2": { name: "MiniMax M2", ... },
  // ... etc
}
```

**Available Models (Priority Order):**
1. `x-ai/grok-code-fast-1` (Grok Code Fast)
2. `openai/gpt-5-codex` (GPT-5 Codex)
3. `minimax/minimax-m2` (MiniMax M2)
4. `z-ai/glm-4.6` (GLM-4.6)
5. `qwen/qwen3-vl-235b-a22b-instruct` (Qwen3 VL)
6. `anthropic/claude-sonnet-4.5` (Claude Sonnet)
7. Custom (any OpenRouter model)

### 3. CLI Parser (`src/cli.ts`)

**Responsibility:** Parse command-line arguments and environment variables

**Environment Variables Supported:**
- `OPENROUTER_API_KEY` - OpenRouter authentication (required for non-interactive mode)
- `CLAUDISH_MODEL` - Default model (optional)
- `CLAUDISH_PORT` - Default proxy port (optional)
- `ANTHROPIC_API_KEY` - Placeholder to prevent Claude Code dialog (handled in claude-runner.ts)

**Arguments:**
- `-i, --interactive` - Interactive mode
- `-m, --model <model>` - Specify model
- `-p, --port <port>` - Specify port
- `--json` - JSON output
- `--debug, -d` - Debug logging
- `--monitor` - Monitor mode (passthrough to real Anthropic API)
- `--stdin` - Read prompt from stdin
- And many others...

**Default Behavior:**
- If no prompt provided and not `--stdin`, defaults to interactive mode
- In interactive mode, prompts for missing API key and model
- In single-shot mode, requires `--model` flag or `CLAUDISH_MODEL` env var

### 4. Claude Runner (`src/claude-runner.ts`)

**Purpose:** Execute Claude Code with proxy and manage temp settings

**Key Responsibilities:**

1. **Create Temporary Settings File:**
   - Location: `/tmp/claudish-settings-{timestamp}.json`
   - Contains: Custom status line command
   - Purpose: Show model info in Claude Code status line without modifying global settings

2. **Environment Variables Passed to Claude Code:**
   ```typescript
   env: {
     ...process.env,
     ANTHROPIC_BASE_URL: proxyUrl,           // Point to local proxy
     CLAUDISH_ACTIVE_MODEL_NAME: modelId,    // Used in status line
     ANTHROPIC_API_KEY: placeholder          // Prevent dialog (OpenRouter mode)
   }
   ```

3. **Status Line Format:**
   - Shows: `[directory] • [model] • $[cost] • [context%]`
   - Uses ANSI colors for visual enhancement
   - Reads token data from file written by proxy server
   - Model name comes from `$CLAUDISH_ACTIVE_MODEL_NAME` environment variable

4. **Context Window Tracking:**
   - Model context sizes hardcoded in `MODEL_CONTEXT` object
   - Reads cumulative token counts from `/tmp/claudish-tokens-{PORT}.json`
   - Calculates context percentage remaining
   - Defaults to 100k tokens for unknown models

5. **Signal Handling:**
   - Cleans up temp settings file on SIGINT/SIGTERM/SIGHUP
   - Ensures no zombie processes

### 5. Proxy Server (`src/proxy-server.ts`)

**Size:** 58,460 bytes (large file!)

**Architecture:**
- Built with Hono.js + @hono/node-server
- Implements Anthropic API-compatible endpoints
- Transforms requests between Anthropic and OpenRouter formats

**Key Endpoints:**
- `GET /` - Health check
- `GET /health` - Alternative health check
- `POST /v1/messages/count_tokens` - Token counting
- `POST /v1/messages` - Main chat completion endpoint (streaming and non-streaming)

**Modes:**
1. **OpenRouter Mode** (default)
   - Routes requests to OpenRouter API
   - Uses provided OpenRouter API key
   - Filters Claude identity claims from system prompts

2. **Monitor Mode** (--monitor flag)
   - Passes through to real Anthropic API
   - Logs all traffic for debugging
   - Extracts API key from Claude Code requests

**Key Features:**
- CORS headers enabled
- Streaming response support
- Token counting and tracking
- System prompt filtering (removes Claude identity claims)
- Error handling with detailed messages

**Token File Writing:**
```typescript
const tokenFilePath = `/tmp/claudish-tokens-${port}.json`;

writeFileSync(tokenFilePath, JSON.stringify({
  input_tokens: cumulativeInputTokens,
  output_tokens: cumulativeOutputTokens,
  total_tokens: cumulativeInputTokens + cumulativeOutputTokens,
  updated_at: Date.now()
}), "utf-8");
```

### 6. Type Definitions (`src/types.ts`)

**Main Interfaces:**
- `ClaudishConfig` - CLI configuration object
- `OpenRouterModel` - Union type of available models
- `AnthropicMessage`, `AnthropicRequest`, `AnthropicResponse` - Anthropic API types
- `OpenRouterMessage`, `OpenRouterRequest`, `OpenRouterResponse` - OpenRouter API types
- `ProxyServer` - Proxy server interface with `shutdown()` method

## How Model Information is Communicated

### Current Mechanism (v1.3.1)

1. **CLI receives model:** From `--model` flag, `CLAUDISH_MODEL` env var, or interactive selection

2. **Model is passed to proxy creation:**
   ```typescript
   const proxy = await createProxyServer(
     port,
     config.openrouterApiKey,
     config.model,           // <-- Model ID passed here
     config.monitor,
     config.anthropicApiKey
   );
   ```

3. **Model is set as environment variable:**
   ```typescript
   env: {
     CLAUDISH_ACTIVE_MODEL_NAME: modelId, // Set in claude-runner.ts
   }
   ```

4. **Status line reads from environment:**
   In the temporary settings file, the status line command uses:
   ```bash
   printf "... ${YELLOW}%s${RESET} ..." "$CLAUDISH_ACTIVE_MODEL_NAME"
   ```

### How Token Information Flows

1. **Proxy server tracks tokens:**
   - Accumulates input/output tokens during conversation
   - Writes to `/tmp/claudish-tokens-{PORT}.json` after each request

2. **Status line reads token file:**
   - Claude runner creates status line command that reads the token file
   - Calculates remaining context percentage
   - Displays as part of status line

3. **Environment Variables Used in Status Line:**
   ```bash
   CLAUDISH_ACTIVE_MODEL_NAME - The OpenRouter model ID
   ```

## Environment Variable Handling Details

### Variables Currently Supported

| Variable | Set By | Read By | Purpose |
|----------|--------|---------|---------|
| `OPENROUTER_API_KEY` | User (.env or prompt) | cli.ts, proxy-server.ts | OpenRouter authentication |
| `CLAUDISH_MODEL` | User (.env) | cli.ts | Default model selection |
| `CLAUDISH_PORT` | User (.env) | cli.ts | Default proxy port |
| `CLAUDISH_ACTIVE_MODEL_NAME` | claude-runner.ts | Status line script | Display model in status line |
| `ANTHROPIC_BASE_URL` | claude-runner.ts | Claude Code | Point to local proxy |
| `ANTHROPIC_API_KEY` | claude-runner.ts | Claude Code | Prevent authentication dialog |

### Variable Flow Chart

```
User Input (.env, CLI flags)
    ↓
parseArgs() in cli.ts
    ↓
ClaudishConfig object
    ↓
createProxyServer() + runClaudeWithProxy()
    ↓
Environment variables passed to Claude Code:
  - ANTHROPIC_BASE_URL → proxy URL
  - CLAUDISH_ACTIVE_MODEL_NAME → model ID
  - ANTHROPIC_API_KEY → placeholder
    ↓
Claude Code spawned with:
  - Temporary settings file (for status line)
  - Environment variables
  - CLI arguments
```

## Missing Environment Variable Support

### Not Yet Implemented

1. **ANTHROPIC_MODEL** - Not used anywhere in Claudish
   - Could be used to override model for status line display
   - Could help Claude Code identify which model is active

2. **ANTHROPIC_SMALL_FAST_MODEL** - Not used anywhere
   - Could be used for smaller tasks within Claude Code
   - Not applicable since Claudish uses OpenRouter models

3. **Model Display Name Customization** - No way to provide a friendly display name
   - Currently always shows the OpenRouter model ID (e.g., "x-ai/grok-code-fast-1")
   - Could benefit from showing provider + model name (e.g., "xAI Grok Fast")

## Interesting Implementation Details

### 1. Token File Path Convention
```typescript
// Uses port number to ensure each Claudish instance has its own token file
const tokenFilePath = `/tmp/claudish-tokens-${port}.json`;
```

### 2. Temporary Settings File Pattern
```typescript
// Each instance gets unique temp file to avoid conflicts
const tempPath = join(tmpdir(), `claudish-settings-${timestamp}.json`);
```

### 3. Model Context Hardcoding
```typescript
const MODEL_CONTEXT: Record<string, number> = {
  "x-ai/grok-code-fast-1": 256000,
  "openai/gpt-5-codex": 400000,
  // ... etc with fallback to 100k
};
```

### 4. Status Line Script Generation
- Creates a complex bash script that:
  - Reads token data from temp file
  - Calculates context percentage
  - Formats output with ANSI colors
  - All embedded in JSON settings file!

### 5. API Key Handling Strategy
- OpenRouter mode: Sets placeholder `ANTHROPIC_API_KEY` to prevent Claude dialog
- Monitor mode: Deletes `ANTHROPIC_API_KEY` to allow Claude to use native auth
- Both: Actually uses the key specified in the proxy or from Claude's request

## Integration Points

### With Claude Code
1. **Temporary Settings File** - Passed via `--settings` flag
2. **Environment Variables** - `ANTHROPIC_BASE_URL`, `CLAUDISH_ACTIVE_MODEL_NAME`, `ANTHROPIC_API_KEY`
3. **Proxy Server** - Running on localhost, acts as Anthropic API
4. **Token File** - Status line reads from `/tmp/claudish-tokens-{PORT}.json`

### With OpenRouter
1. **API Requests** - Proxy transforms Anthropic → OpenRouter format
2. **Authentication** - Uses `OPENROUTER_API_KEY` environment variable
3. **Model Selection** - Any OpenRouter model ID is supported

## Recommendations for Environment Variable Support

Based on this analysis, here are recommendations for adding proper environment variable support:

### 1. Add Model Display Name Support
```typescript
// In config.ts
export const ENV = {
  // ... existing
  ANTHROPIC_MODEL: "ANTHROPIC_MODEL",              // Display name override
  CLAUDISH_MODEL_DISPLAY_NAME: "CLAUDISH_MODEL_DISPLAY_NAME",  // Custom display name
};
```

### 2. Modify claude-runner.ts
```typescript
// Extract display name from config
const displayName = config.modelDisplayName || config.model;

// Pass to status line command via environment variable
env[ENV.CLAUDISH_MODEL_DISPLAY_NAME] = displayName;
```

### 3. Update Status Line Script
```bash
# Instead of:
printf "... ${YELLOW}%s${RESET} ..." "$CLAUDISH_ACTIVE_MODEL_NAME"

# Could support:
DISPLAY_NAME=${CLAUDISH_MODEL_DISPLAY_NAME:-$CLAUDISH_ACTIVE_MODEL_NAME}
printf "... ${YELLOW}%s${RESET} ..." "$DISPLAY_NAME"
```

### 4. Support ANTHROPIC_MODEL Variable
```typescript
// In cli.ts, after parsing CLAUDISH_MODEL
const envModel = process.env[ENV.CLAUDISH_MODEL];
const anthropicModel = process.env[ENV.ANTHROPIC_MODEL];
if (!config.model) {
  config.model = anthropicModel || envModel;
}
```

## Summary

Claudish is a well-structured CLI tool that:
- ✅ Manages model selection through multiple channels (flags, env vars, interactive prompts)
- ✅ Communicates active model to Claude Code via `CLAUDISH_ACTIVE_MODEL_NAME` environment variable
- ✅ Tracks tokens in a file for status line consumption
- ✅ Uses temporary settings files to avoid modifying global configuration
- ✅ Has clear separation of concerns between CLI, proxy, and runner components

**Current environment variable handling is functional but could be enhanced with:**
- Support for `ANTHROPIC_MODEL` for consistency with Claude Code
- Custom display names for models
- More flexible model identification system

The token file mechanism at `/tmp/claudish-tokens-{PORT}.json` is clever and allows the status line to display real-time token usage without modifying the proxy or Claude Code itself.
