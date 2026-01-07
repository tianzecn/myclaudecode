<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# AGENTS.md - Coding Agent Guidelines

> Guidelines for AI coding agents working in the MAG Claude Plugins repository.

## Project Overview

**Repository:** MAG Claude Plugins - A Claude Code plugin marketplace  
**Type:** TypeScript monorepo with multiple packages  
**Runtime:** Node.js 18+, ESM modules

## Build/Test/Lint Commands

### Root-Level Commands

No root-level commands. Navigate to specific packages.

### Package: tools/claudeup (TUI tool)

```bash
cd tools/claudeup

# Build
npm run build          # TypeScript compilation
npm run dev            # Watch mode

# Test (TAP runner)
npm test               # Run all tests
npm test -- test/specific.js  # Single test file

# Lint & Format
npm run lint           # ESLint check
npm run lintfix        # ESLint with auto-fix
npm run format         # Biome formatting
```

### Package: plugins/episodic-memory (Semantic search)

```bash
cd plugins/episodic-memory

# Build
npm run build          # TypeScript + esbuild bundle

# Test (Vitest)
npm test               # Run all tests
npm test -- test/parser.test.ts      # Single test file
npm test -- -t "test name pattern"   # Run by test name
npm run test:watch     # Watch mode
```

### Package: plugins/superpowers-chrome/mcp (Browser MCP)

```bash
cd plugins/superpowers-chrome/mcp

# Build
npm run build          # TypeScript + esbuild
npm run dev            # tsx watch mode
npm run clean          # Remove dist/
```

### Package: plugins/workflow/mcp-servers/sugar-mcp

```bash
cd plugins/workflow/mcp-servers/sugar-mcp

# Test (Node.js built-in test runner)
npm test               # Run all tests
npm test -- test/specific.test.js    # Single test
```

## Code Style Guidelines

### Import Ordering

```typescript
// 1. Node.js built-ins
import fs from 'fs';
import path from 'path';
import os from 'os';

// 2. Third-party packages
import Database from 'better-sqlite3';
import { z } from 'zod';

// 3. Local modules (use .js extension for ESM)
import { initDatabase } from './db.js';
import { ConversationExchange } from './types.js';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables/Functions | camelCase | `userMessage`, `parseConversation()` |
| Constants | UPPER_SNAKE_CASE | `SUMMARIZER_CONTEXT_MARKER` |
| Types/Interfaces | PascalCase | `SearchResult`, `ConversationExchange` |
| Files | kebab-case | `mcp-server.ts`, `search-cli.ts` |
| Database columns | snake_case | `user_message`, `archive_path` |

### TypeScript Patterns

**Explicit return types on all functions:**
```typescript
export async function searchConversations(
  query: string,
  options: SearchOptions
): Promise<SearchResult[]> {
  // ...
}
```

**Optional fields with `?`:**
```typescript
interface ConversationExchange {
  id: string;           // Required
  project: string;      // Required
  parentUuid?: string;  // Optional
  sessionId?: string;   // Optional
}
```

**Zod for runtime validation:**
```typescript
const SearchParams = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(50).default(10),
  mode: z.enum(['vector', 'text', 'both']).default('both'),
});
```

### Error Handling

**Validation with clear messages:**
```typescript
function validateISODate(dateStr: string, paramName: string): void {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) {
    throw new Error(`Invalid ${paramName}: "${dateStr}". Expected YYYY-MM-DD`);
  }
}
```

**Async error recovery in batch operations:**
```typescript
await processBatch(items, async (item) => {
  try {
    const result = await processItem(item);
    console.log(`  ✓ ${item.name}: success`);
    return result;
  } catch (error) {
    console.log(`  ✗ ${item.name}: ${error}`);
    return null;  // Continue processing, don't abort batch
  }
}, concurrency);
```

### Module Exports

**Named exports preferred (no default exports):**
```typescript
// ✓ Good
export function initDatabase(): Database.Database { }
export interface SearchOptions { }
export const MARKER = '...';

// ✗ Avoid
export default function initDatabase() { }
```

**ESM module configuration:**
```json
{
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

### Console Output

```typescript
// Progress indicators
console.log('Initializing database...');
console.log(`Processing: ${project} (${count} items)`);

// Success/failure markers
console.log(`✓ ${file}: completed`);
console.log(`✗ ${file}: ${error.message}`);

// Warnings
console.log('⚠️  Running in degraded mode');
```

## TypeScript Configuration

All packages use strict TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Project Structure

```
myclaudecode/
├── plugins/
│   ├── frontend/           # Frontend development plugin
│   ├── code-analysis/      # Code investigation plugin
│   ├── bun/                # Backend plugin
│   ├── orchestration/      # Multi-agent coordination
│   ├── episodic-memory/    # Semantic search (has tests)
│   └── superpowers-chrome/ # Browser automation
├── tools/
│   └── claudeup/           # TUI management tool (has tests)
├── agent_docs/             # Detailed agent documentation
├── ai-docs/                # Technical documentation
├── docs/                   # User documentation
├── skills/                 # Project-level skills
└── .claude-plugin/         # Marketplace configuration
```

## Key Constraints

1. **No hardcoded paths** - Use relative paths or environment variables
2. **ESM modules** - Use `.js` extensions in imports
3. **Strict TypeScript** - No `any`, explicit return types
4. **Named exports** - Avoid default exports
5. **Node 18+** - Use modern JavaScript features

## Environment Variables

**Required for some plugins:**
```bash
APIDOG_API_TOKEN=...
FIGMA_ACCESS_TOKEN=...
```

**Optional:**
```bash
GITHUB_PERSONAL_ACCESS_TOKEN=...
CHROME_EXECUTABLE_PATH=...
TEST_PROJECTS_DIR=...  # Override for testing
```

## Plugin Development

**Plugin manifest location:** `plugins/*/plugin.json`

**Plugin structure:**
```
plugins/{name}/
├── plugin.json        # Manifest (required)
├── agents/            # Agent definitions
├── commands/          # Slash commands
├── skills/            # Skills
└── mcp-servers/       # MCP server configs
```

**Use plugin-relative paths:**
```json
{
  "command": "node",
  "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/dist/index.js"]
}
```

## Release Process

When releasing a plugin, update all three:

1. `plugins/{name}/plugin.json` - version field
2. `.claude-plugin/marketplace.json` - plugin entry version
3. Git tag: `git tag -a plugins/{name}/vX.Y.Z -m "message"`
