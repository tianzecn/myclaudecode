# Claudish: Key Code Locations & Implementation Details

## Critical File Locations

### 1. Configuration Constants
**File:** `src/config.ts`

**Key Content:**
- `ENV` object defining all environment variable names
- `MODEL_INFO` object with model metadata (name, description, priority, provider)
- `DEFAULT_MODEL` constant
- OpenRouter API configuration

**Line Reference:**
```typescript
// Lines 56-61: Environment variable names
export const ENV = {
  OPENROUTER_API_KEY: "OPENROUTER_API_KEY",
  CLAUDISH_MODEL: "CLAUDISH_MODEL",
  CLAUDISH_PORT: "CLAUDISH_PORT",
  CLAUDISH_ACTIVE_MODEL_NAME: "CLAUDISH_ACTIVE_MODEL_NAME",
} as const;
```

### 2. CLI Argument Parsing
**File:** `src/cli.ts`

**Key Content:**
- `parseArgs()` function that handles:
  - Environment variable reading (lines 22-34)
  - Argument parsing (lines 36-115)
  - API key handling (lines 124-165)
  - Mode determination (lines 117-122)

**Critical Lines:**
- Line 23: Reading `CLAUDISH_MODEL` from env
- Line 28: Reading `CLAUDISH_PORT` from env
- Line 48: Accepting any model ID (not just predefined list)
- Line 143: Checking for `OPENROUTER_API_KEY`

### 3. Model Communication to Claude Code
**File:** `src/claude-runner.ts`

**Key Content:**
- `createTempSettingsFile()` function (lines 14-67)
- `runClaudeWithProxy()` function (lines 72-179)
- Environment variable assignment (lines 120-139)
- Status line command generation (line 60)

**Critical Lines:**
- Line 85: `createTempSettingsFile(modelId, port)` - creates settings with model
- Line 126: `[ENV.CLAUDISH_ACTIVE_MODEL_NAME]: modelId` - sets model env var
- Line 60: Status line command using `$CLAUDISH_ACTIVE_MODEL_NAME`
- Lines 32-41: Model context window definitions

**How Status Line Gets Model Info:**
```bash
# Embedded in status line command (line 60):
printf "... ${YELLOW}%s${RESET} ..." "$CLAUDISH_ACTIVE_MODEL_NAME"
# This reads the environment variable that was set
```

### 4. Proxy Server Token Tracking
**File:** `src/proxy-server.ts`

**Key Content:**
- Token file path definition (line 805)
- Token file writing function (lines 807-823)
- Token accumulation logic (throughout message handling)

**Critical Lines:**
- Line 805: `const tokenFilePath = `/tmp/claudish-tokens-${port}.json`;`
- Lines 810-815: Token data structure written to file
- Line 816: `writeFileSync(tokenFilePath, JSON.stringify(tokenData), "utf-8");`

## Environment Variable Flow

### 1. User Sets Environment Variables
```bash
export OPENROUTER_API_KEY=sk-or-v1-...
export CLAUDISH_MODEL=x-ai/grok-code-fast-1
export CLAUDISH_PORT=3000
```

### 2. CLI Reads Variables
**File:** `src/cli.ts` lines 22-34
```typescript
const envModel = process.env[ENV.CLAUDISH_MODEL];  // Line 23
const envPort = process.env[ENV.CLAUDISH_PORT];    // Line 28
```

### 3. Model Passed to Proxy
**File:** `src/index.ts` lines 81-87
```typescript
const proxy = await createProxyServer(
  port,
  config.openrouterApiKey,
  config.model,              // <-- Model ID here
  config.monitor,
  config.anthropicApiKey
);
```

### 4. Model Set as Environment Variable
**File:** `src/claude-runner.ts` lines 120-127
```typescript
const env: Record<string, string> = {
  ...process.env,
  ANTHROPIC_BASE_URL: proxyUrl,
  [ENV.CLAUDISH_ACTIVE_MODEL_NAME]: modelId,  // <-- Set here
};
```

### 5. Claude Code Uses the Variable
**File:** `src/claude-runner.ts` line 60 (in status line script)
```bash
printf "... ${YELLOW}%s${RESET} ..." "$CLAUDISH_ACTIVE_MODEL_NAME"
```

## Type Definitions Reference

**File:** `src/types.ts`

```typescript
// Lines 2-9: Available models
export const OPENROUTER_MODELS = [
  "x-ai/grok-code-fast-1",
  "openai/gpt-5-codex",
  "minimax/minimax-m2",
  // ... etc
];

// Lines 15-30: Configuration interface
export interface ClaudishConfig {
  model?: OpenRouterModel | string;
  port?: number;
  autoApprove: boolean;
  // ... etc
}
```

## Token Information Flow

### 1. Proxy Writes Tokens
**File:** `src/proxy-server.ts` lines 805-823

```typescript
const tokenFilePath = `/tmp/claudish-tokens-${port}.json`;

const writeTokenFile = () => {
  const tokenData = {
    input_tokens: cumulativeInputTokens,
    output_tokens: cumulativeOutputTokens,
    total_tokens: cumulativeInputTokens + cumulativeOutputTokens,
    updated_at: Date.now()
  };
  writeFileSync(tokenFilePath, JSON.stringify(tokenData), "utf-8");
};
```

### 2. Status Line Reads Tokens
**File:** `src/claude-runner.ts` lines 54-60

The temporary settings file contains a bash script that:
- Reads `/tmp/claudish-tokens-${port}.json`
- Extracts input/output token counts
- Calculates context percentage remaining
- Displays in status line

## Important Variables & Their Scope

| Variable | Scope | Location | Usage |
|----------|-------|----------|-------|
| `ENV.CLAUDISH_ACTIVE_MODEL_NAME` | Global (env var) | config.ts:60, claude-runner.ts:126 | Passed to Claude Code |
| `tokenFilePath` | Local (function) | proxy-server.ts:805, claude-runner.ts:55 | File path for token data |
| `modelId` | Local (function) | claude-runner.ts:78 | Extracted from config.model |
| `tempSettingsPath` | Local (function) | claude-runner.ts:85 | Temp settings file path |
| `MODEL_CONTEXT` | Module (const) | claude-runner.ts:32-39 | Context window lookup |

## How to Add Support for ANTHROPIC_MODEL

Based on the codebase structure, here's where to add it:

### Step 1: Add to config.ts
```typescript
// Line ~60, add to ENV object:
ANTHROPIC_MODEL: "ANTHROPIC_MODEL",
```

### Step 2: Add to cli.ts
```typescript
// After line 26 (CLAUDISH_MODEL check), add:
const anthropicModel = process.env[ENV.ANTHROPIC_MODEL];
if (anthropicModel && !envModel) {
  config.model = anthropicModel;
}
```

### Step 3: Update status line (optional)
```typescript
// In claude-runner.ts, could add support for:
env[ENV.ANTHROPIC_MODEL] = modelId;
```

This would allow Claude Code or other tools to read the active model from `ANTHROPIC_MODEL`.

## Testing Locations

**File:** `tests/`

- `comprehensive-model-test.ts` - Main test file
- Run with: `bun test ./tests/comprehensive-model-test.ts`

## Build & Distribution

**Build Output:** `dist/`

**Package Info:** `package.json`
- Name: `claudish`
- Version: 1.3.1
- Main entry: `dist/index.js`
- Bin: `claudish` → `dist/index.js`

## Key Implementation Patterns

### 1. Unique File Paths Using Port/Timestamp
```typescript
// Uses port for token file uniqueness
const tokenFilePath = `/tmp/claudish-tokens-${port}.json`;

// Uses timestamp for settings file uniqueness
const tempPath = join(tmpdir(), `claudish-settings-${timestamp}.json`);
```

### 2. Environment Variable Configuration
```typescript
// Define once in config.ts
export const ENV = { ... };

// Use throughout with ENV constant
process.env[ENV.CLAUDISH_ACTIVE_MODEL_NAME]
```

### 3. Safe Environment Inheritance
```typescript
// Inherit all existing env vars
const env: Record<string, string> = {
  ...process.env,  // Keep existing
  ANTHROPIC_BASE_URL: proxyUrl,  // Override/add specific ones
};
```

## Debugging Tips

### 1. Enable Debug Logging
```bash
claudish --debug --model x-ai/grok-code-fast-1 "test"
# Logs to: logs/claudish_*.log
```

### 2. Monitor Mode for API Traffic
```bash
claudish --monitor --model openai/gpt-5-codex "test"
# Logs all API requests/responses to debug
```

### 3. Check Token File
```bash
# After running Claudish on port 3000:
cat /tmp/claudish-tokens-3000.json
```

### 4. Check Status Line Script
```bash
# Check the generated settings file:
cat /tmp/claudish-settings-*.json | jq .statusLine.command
```

---

**Last Updated:** November 15, 2025
**Version Reference:** Claudish v1.3.1
