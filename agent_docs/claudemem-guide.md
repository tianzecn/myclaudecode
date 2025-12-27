# Claudemem AST Structural Analysis Guide (v0.3.0)

> The code-analysis plugin uses **claudemem v0.3.0** CLI with **AST structural analysis** and **PageRank-based symbol importance**.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   CLAUDEMEM v0.3.0 ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AST STRUCTURAL LAYER                                                       │
│  └── map: Architecture overview with PageRank                              │
│  └── symbol: Exact file:line location                                      │
│  └── callers: What calls this? (impact analysis)                           │
│  └── callees: What does this call? (dependencies)                          │
│  └── context: Full call chain (callers + callees)                          │
│                              ↓                                              │
│  SEMANTIC LAYER                                                             │
│  └── search: Vector + BM25 semantic search                                 │
│                              ↓                                              │
│  INDEX LAYER                                                                │
│  └── Tree-sitter AST → Symbol Graph → PageRank → LanceDB                   │
│                                                                             │
│  STRUCTURE FIRST, THEN SEMANTIC IF NEEDED                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Innovation**: Navigate code by STRUCTURE (call graphs, dependencies) before resorting to semantic search. PageRank identifies architectural pillars.

## AST Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `map` | Architecture overview with PageRank | Always FIRST - understand structure |
| `symbol` | Find exact file:line location | When you know the symbol name |
| `callers` | What calls this code? | BEFORE modifying any code |
| `callees` | What does this code call? | Trace data flow, dependencies |
| `context` | Full call chain (both) | Complex debugging, refactoring |
| `search` | Semantic vector search | Last resort for broad queries |

## PageRank Importance Guide

| PageRank | Meaning | Action |
|----------|---------|--------|
| > 0.05 | Core abstraction | Understand FIRST - everything depends on it |
| 0.01-0.05 | Important symbol | Key functionality, worth understanding |
| 0.001-0.01 | Standard symbol | Normal code, read as needed |
| < 0.001 | Utility/leaf | Helper functions, skip for architecture |

## Installation

```bash
# npm (recommended)
npm install -g claude-codemem

# Homebrew (macOS)
brew tap tianzecn/claude-mem && brew install --cask claudemem
```

## Configuration

```bash
# Initialize with OpenRouter API key
claudemem init

# Get API key at: https://openrouter.ai/keys

# Check version (must be 0.3.0+)
claudemem --version
```

## Usage Examples

```bash
# Index project (builds AST symbol graph)
claudemem index

# STEP 1: Map architecture (always first)
claudemem --nologo map --raw
claudemem --nologo map "authentication" --raw

# STEP 2: Find specific symbol
claudemem --nologo symbol AuthService --raw

# STEP 3: Check impact BEFORE modifying
claudemem --nologo callers AuthService --raw

# STEP 4: Trace dependencies
claudemem --nologo callees AuthService --raw

# STEP 5: Full context for complex work
claudemem --nologo context AuthService --raw

# Semantic search (only if structural commands insufficient)
claudemem --nologo search "error handling" --raw
```

## Key Features

- **AST Symbol Graph** - Navigate by structure, not text
- **PageRank Ranking** - Identify architectural pillars
- **Callers/Callees** - Trace dependencies and impact
- **Context Command** - Full call chain in one query
- **Tree-sitter parsing** - TypeScript, Go, Python, Rust support
- **Local storage** - LanceDB in `.claudemem/` directory
- **80% Token Efficiency** - Targeted navigation vs bulk reads

---

## Tool Selection Rules for Code Investigation

**CRITICAL**: Use claudemem AST commands, NOT grep/glob.

```
┌─────────────────────────────────────────────────────────────────────┐
│              CODE INVESTIGATION WORKFLOW (v0.3.0)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  MANDATORY WORKFLOW (in order):                                      │
│                                                                      │
│  1. claudemem --nologo map "topic" --raw                            │
│     → Get structure with PageRank                                    │
│                                                                      │
│  2. claudemem --nologo symbol <name> --raw                          │
│     → Find exact file:line                                          │
│                                                                      │
│  3. claudemem --nologo callers <name> --raw                         │
│     → ALWAYS before modifying code                                   │
│                                                                      │
│  4. claudemem --nologo callees <name> --raw                         │
│     → Trace dependencies                                             │
│                                                                      │
│  5. Read specific file:line (NOT whole files)                       │
│                                                                      │
│  ❌ NEVER: grep, find, Glob, Read whole files without mapping       │
│  ❌ NEVER: Search before mapping                                     │
│  ❌ NEVER: Modify without checking callers                          │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Quick Reference

| User Request | ❌ DON'T | ✅ DO |
|-------------|----------|-------|
| "How does auth work?" | `grep -r "auth"` | `claudemem --nologo map "auth" --raw` then `callers`/`callees` |
| "Find API endpoints" | `grep -r "router"` | `claudemem --nologo map "controller endpoint" --raw` |
| "What calls this?" | `grep -r "functionName"` | `claudemem --nologo callers functionName --raw` |
| "What are the deps?" | Read all files | `claudemem --nologo callees ServiceName --raw` |

## Why AST Analysis Matters

| grep/find (FORBIDDEN) | claudemem v0.3.0 (REQUIRED) |
|-----------------------|-----------------------------|
| Text matching only | AST structural relationships |
| No importance ranking | PageRank shows architecture |
| Miss synonyms/patterns | Callers/callees show real usage |
| Can't trace dependencies | Full call chain in one command |
| Read entire files | Precise file:line locations |
