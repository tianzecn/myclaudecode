---
name: code-search-selector
description: "⚡ MANDATORY PRE-CHECK before any code search. Decision tree for selecting the RIGHT tool: claudemem vs Grep vs Detective agent. INVOKE THIS SKILL FIRST when user asks about code architecture, implementations, patterns, or 'how does X work'. Prevents grep misuse when semantic search is available."
allowed-tools: Bash, Read
---

# ⚠️ CODE SEARCH TOOL SELECTOR ⚠️

**INVOKE THIS SKILL BEFORE ANY CODE INVESTIGATION**

This skill ensures you use the RIGHT tool for code search tasks. Using Grep when claudemem is indexed is a critical mistake that produces inferior results.

## The Problem This Solves

```
❌ WRONG: User asks "How does authentication work?"
   → You use: grep -r "auth" src/
   → Result: 500 lines of noise, no understanding

✅ RIGHT: User asks "How does authentication work?"
   → You check: claudemem status
   → You use: claudemem search "authentication login flow JWT"
   → Result: Top 10 semantically relevant code chunks
```

## MANDATORY Decision Tree

### Step 1: Classify the Task

```
┌─────────────────────────────────────────────────────────────────┐
│                    WHAT IS THE USER ASKING?                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  "Find all X"              → SEMANTIC (go to Step 2)            │
│  "How does X work"         → SEMANTIC (go to Step 2)            │
│  "Audit X integration"     → SEMANTIC (go to Step 2)            │
│  "Map the data flow"       → SEMANTIC (go to Step 2)            │
│  "Understand architecture" → SEMANTIC (go to Step 2)            │
│  "Trace X through code"    → SEMANTIC (go to Step 2)            │
│  "Find implementations"    → SEMANTIC (go to Step 2)            │
│  "What patterns are used"  → SEMANTIC (go to Step 2)            │
│                                                                  │
│  "Find exact string 'foo'" → EXACT MATCH (use Grep, skip tree)  │
│  "Count occurrences of X"  → EXACT MATCH (use Grep, skip tree)  │
│  "Find symbol UserService" → EXACT MATCH (use Grep, skip tree)  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Check claudemem Status (MANDATORY for Semantic)

```bash
# ALWAYS run this before semantic search
claudemem status
```

**Interpret the output:**

| Status | What It Means | Next Action |
|--------|---------------|-------------|
| Shows chunk count (e.g., "938 chunks") | ✅ Indexed | **USE CLAUDEMEM** (Step 3) |
| "No index found" | ❌ Not indexed | Offer to index (Step 2b) |
| "command not found" | ❌ Not installed | Fall back to Detective agent |

### Step 2b: If Not Indexed, Offer to Index

```typescript
AskUserQuestion({
  questions: [{
    question: "Claudemem is not indexed. Index now for better semantic search results?",
    header: "Index?",
    multiSelect: false,
    options: [
      { label: "Yes, index now (Recommended)", description: "Takes 1-2 minutes, enables semantic search" },
      { label: "No, use grep instead", description: "Faster but less accurate for semantic queries" }
    ]
  }]
})
```

If user says yes:
```bash
claudemem index -y
```

### Step 3: Execute the Search

**IF CLAUDEMEM IS INDEXED (from Step 2):**

```bash
# Get role-specific guidance first
claudemem ai developer  # or architect, tester, debugger

# Then search semantically
claudemem search "authentication login JWT token validation" -n 15
```

**IF CLAUDEMEM IS NOT AVAILABLE:**

Use the detective agent:
```typescript
Task({
  subagent_type: "code-analysis:detective",
  description: "Investigate [topic]",
  prompt: "Use semantic search to find..."
})
```

### Step 4: NEVER Do This

```
╔══════════════════════════════════════════════════════════════════╗
║  ❌ FORBIDDEN when claudemem is indexed:                         ║
║                                                                  ║
║  grep -r "pattern" src/          # Use claudemem search instead  ║
║  Grep tool for semantic queries  # Use claudemem search instead  ║
║  Glob to find implementations    # Use claudemem search instead  ║
║  find . -name "*.ts" | xargs...  # Use claudemem search instead  ║
║                                                                  ║
║  These tools are for EXACT MATCHES only, not semantic search.    ║
╚══════════════════════════════════════════════════════════════════╝
```

## Task-to-Tool Mapping Reference

| User Request | ❌ DON'T Use | ✅ DO Use |
|--------------|-------------|----------|
| "Audit all API endpoints" | `grep -r "router\|endpoint"` | `claudemem search "API endpoint route handler"` |
| "How does auth work?" | `grep -r "auth\|login"` | `claudemem search "authentication login flow"` |
| "Find all database queries" | `grep -r "prisma\|query"` | `claudemem search "database query SQL prisma"` |
| "Map the data flow" | `grep -r "transform\|map"` | `claudemem search "data transformation pipeline"` |
| "What's the architecture?" | `ls -la src/` | `claudemem search "architecture layer service"` |
| "Find error handling" | `grep -r "catch\|error"` | `claudemem search "error handling exception"` |
| "Trace user creation" | `grep -r "createUser"` | `claudemem search "user creation registration"` |

## When Grep IS Appropriate

✅ **Use Grep for:**
- Finding exact string: `grep -r "DEPRECATED_FLAG" src/`
- Counting occurrences: `grep -c "import React" src/**/*.tsx`
- Finding specific symbol: `grep -r "class UserService" src/`
- Regex patterns: `grep -r "TODO:\|FIXME:" src/`

❌ **Never use Grep for:**
- Understanding how something works
- Finding implementations by concept
- Architecture analysis
- Tracing data flow
- Auditing integrations

## Integration with Detective Skills

After using this skill's decision tree, invoke the appropriate detective:

| Investigation Type | Detective Skill |
|-------------------|-----------------|
| Architecture patterns | `code-analysis:architect-detective` |
| Implementation details | `code-analysis:developer-detective` |
| Test coverage | `code-analysis:tester-detective` |
| Bug root cause | `code-analysis:debugger-detective` |
| Comprehensive audit | `code-analysis:ultrathink-detective` |

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────────┐
│                    CODE SEARCH QUICK REFERENCE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. ALWAYS check first:  claudemem status                       │
│                                                                  │
│  2. If indexed:          claudemem search "semantic query"       │
│                                                                  │
│  3. For exact matches:   Grep tool (only this case!)            │
│                                                                  │
│  4. For deep analysis:   Task(code-analysis:detective)          │
│                                                                  │
│  ⚠️ GREP IS FOR EXACT MATCHES, NOT SEMANTIC UNDERSTANDING       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Pre-Investigation Checklist

Before ANY code investigation task, verify:

- [ ] Ran `claudemem status` to check index
- [ ] Classified task as SEMANTIC or EXACT MATCH
- [ ] Selected appropriate tool based on classification
- [ ] NOT using grep for semantic queries when claudemem is indexed

---

**Maintained by:** MadAppGang
**Plugin:** code-analysis v2.1.0
**Purpose:** Prevent grep misuse, enforce semantic search when available
