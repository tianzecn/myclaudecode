# Claudish Codebase Exploration - Complete Index

## Overview

This directory contains comprehensive analysis of the Claudish codebase, created November 15, 2025. These documents cover the architecture, implementation details, code locations, and recommendations for adding environment variable support.

**Total Analysis:** 39.4 KB across 4 documents  
**Claudish Version Analyzed:** 1.3.1  
**Codebase Size:** 10+ TypeScript source files

## Documents

### 1. QUICK_REFERENCE.md (8.1 KB) - START HERE

**Best for:** Getting oriented quickly

- One-page overview of Claudish architecture
- Current environment variables at a glance
- Missing variables not yet implemented
- Key code locations with line numbers
- Data flow diagram
- How to add ANTHROPIC_MODEL support (3 code changes)
- Debugging commands
- Architecture decision explanations

**Read this first if you want a quick understanding.**

---

### 2. FINDINGS_SUMMARY.md (9.5 KB) - EXECUTIVE SUMMARY

**Best for:** Understanding what was discovered

- High-level findings about model communication
- Current implementation layers (3 layers explained)
- Key files and their purposes
- Environment variable flow
- Model information flow (how it reaches Claude Code UI)
- Token information flow (how context % is calculated)
- Missing environment variable support
- Concrete implementation recommendations
- Testing & verification instructions

**Read this to understand the main findings and gaps.**

---

### 3. KEY_CODE_LOCATIONS.md (7.8 KB) - TECHNICAL REFERENCE

**Best for:** Finding exact code locations

- Critical file locations with line numbers
- Environment variable flow through code
- Type definitions reference
- Token information flow (proxy → file → status line)
- Variable scope and usage table
- Step-by-step guide to add ANTHROPIC_MODEL support
- Testing locations
- Build & distribution info
- Key implementation patterns
- Debugging tips with commands

**Read this when implementing changes or understanding code flow.**

---

### 4. CODEBASE_ANALYSIS.md (14 KB) - COMPREHENSIVE GUIDE

**Best for:** Deep understanding and architectural decisions

- Complete directory structure
- Detailed component descriptions:
  - Main entry point (index.ts)
  - Configuration system (config.ts)
  - CLI parser (cli.ts)
  - Claude runner (claude-runner.ts)
  - Proxy server (proxy-server.ts)
  - Type definitions (types.ts)
- How model information is communicated (current mechanism)
- How token information flows
- Environment variable handling details with flow charts
- Missing environment variable support
- Interesting implementation details
- Integration points with Claude Code and OpenRouter
- Recommendations for future enhancements

**Read this for complete architectural understanding.**

---

## Quick Navigation

### If you want to...

**Understand how Claudish works right now:**
→ Start with QUICK_REFERENCE.md or FINDINGS_SUMMARY.md

**Find specific code locations:**
→ Go to KEY_CODE_LOCATIONS.md, search for line numbers

**Add ANTHROPIC_MODEL support:**
→ QUICK_REFERENCE.md (3-step guide) or KEY_CODE_LOCATIONS.md (detailed implementation)

**Understand architectural decisions:**
→ CODEBASE_ANALYSIS.md (Integration Points section) or QUICK_REFERENCE.md (Why section)

**Debug an issue:**
→ KEY_CODE_LOCATIONS.md (Debugging Tips section)

**Set up development environment:**
→ QUICK_REFERENCE.md (Testing section) or KEY_CODE_LOCATIONS.md (Build & Distribution)

---

## Key Findings Summary

### Current State
- Claudish successfully communicates model info to Claude Code
- Uses `CLAUDISH_ACTIVE_MODEL_NAME` environment variable
- Token tracking works via `/tmp/claudish-tokens-{PORT}.json`
- Status line displays: `[dir] • [model] • $[cost] • [context%]`

### Missing Features
- No support for `ANTHROPIC_MODEL` environment variable
- No support for `ANTHROPIC_SMALL_FAST_MODEL`
- No custom display names for models

### Recommendations
1. Add `ANTHROPIC_MODEL` support (3-line change in 2 files)
2. Consider custom display names
3. Document all environment variables
4. Add integration tests

---

## File Locations

All analysis documents are in the `mcp/claudish/` directory.

```
mcp/claudish/
├── src/                    # Claudish source code
│   ├── index.ts
│   ├── cli.ts
│   ├── config.ts
│   ├── claude-runner.ts
│   ├── proxy-server.ts
│   └── ...
├── QUICK_REFERENCE.md      ← Start here (1-page overview)
├── FINDINGS_SUMMARY.md     ← What was discovered
├── KEY_CODE_LOCATIONS.md   ← Where to find code
├── CODEBASE_ANALYSIS.md    ← Deep technical guide
└── EXPLORATION_INDEX.md    ← This file
```

---

## Key Code Locations (Quick Reference)

| Purpose | File | Lines |
|---------|------|-------|
| Environment variable names | config.ts | 56-61 |
| Parse env vars from user | cli.ts | 22-34 |
| Set model env var | claude-runner.ts | 126 |
| Status line command | claude-runner.ts | 60 |
| Model context windows | claude-runner.ts | 32-39 |
| Write token file | proxy-server.ts | 805-816 |

---

## Implementation Checklist

To add `ANTHROPIC_MODEL` support:

- [ ] Add `ANTHROPIC_MODEL` to `ENV` in config.ts (1 line)
- [ ] Add parsing logic in cli.ts (3 lines)
- [ ] Optional: Pass through in claude-runner.ts (1 line)
- [ ] Build: `bun run build`
- [ ] Test: `export ANTHROPIC_MODEL=openai/gpt-5-codex && ./dist/index.js "test"`
- [ ] Verify status line shows correct model

**Estimated time:** 15 minutes (5 min implementation + 10 min testing)

---

## Document Statistics

| Document | Size | Lines | Focus |
|----------|------|-------|-------|
| QUICK_REFERENCE.md | 8.1 KB | 250+ | Overview & quick lookup |
| FINDINGS_SUMMARY.md | 9.5 KB | 290+ | Executive findings |
| KEY_CODE_LOCATIONS.md | 7.8 KB | 330+ | Code references |
| CODEBASE_ANALYSIS.md | 14 KB | 450+ | Deep technical |
| **Total** | **39.4 KB** | **1320+** | Complete coverage |

---

## Version Information

**Claudish Version:** 1.3.1  
**Analysis Date:** November 15, 2025  
**Exploration Thoroughness:** Medium (comprehensive)

---

## Quick Links Within Documents

**QUICK_REFERENCE.md:**
- Current Environment Variables (section 2)
- Key Code Locations Table (section 4)
- How to Add ANTHROPIC_MODEL Support (section 9)

**FINDINGS_SUMMARY.md:**
- Current Model Communication System (section 1)
- Missing Environment Variable Support (section 7)
- How to Add Support (section 8)

**KEY_CODE_LOCATIONS.md:**
- Environment Variable Flow (section 2)
- How to Add Support (step-by-step with code)
- Debugging Tips (section 7)

**CODEBASE_ANALYSIS.md:**
- How Model Information is Communicated (section 8)
- Missing Environment Variable Support (section 10)
- Integration Points (section 9)

---

## Next Steps

1. **Read QUICK_REFERENCE.md** to understand the system
2. **Review FINDINGS_SUMMARY.md** to see what's missing
3. **Check KEY_CODE_LOCATIONS.md** for implementation details
4. **Implement changes** if adding ANTHROPIC_MODEL support
5. **Reference CODEBASE_ANALYSIS.md** for any architectural questions

---

**Created:** November 15, 2025  
**Last Updated:** November 15, 2025  
**Status:** Complete
