---
name: debugger-detective
description: Bug investigation-focused codebase analysis using INDEXED MEMORY (claudemem). GREP/FIND ARE FORBIDDEN. Traces error origins, finds root causes, identifies failure paths, and analyzes state mutations. Use when debugging issues, investigating errors, or performing root cause analysis.
allowed-tools: Bash, Task, Read, AskUserQuestion
---

# ⛔⛔⛔ CRITICAL: INDEXED MEMORY ONLY ⛔⛔⛔

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   🧠 THIS SKILL USES INDEXED MEMORY (claudemem) EXCLUSIVELY                  ║
║                                                                              ║
║   ❌ GREP IS FORBIDDEN                                                       ║
║   ❌ FIND IS FORBIDDEN                                                       ║
║   ❌ GLOB IS FORBIDDEN                                                       ║
║   ❌ Grep tool IS FORBIDDEN                                                  ║
║   ❌ Glob tool IS FORBIDDEN                                                  ║
║                                                                              ║
║   ✅ claudemem search "query" IS THE ONLY WAY                               ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

# Debugger Detective Skill

**Version:** 1.1.0
**Role:** Debugger / Incident Responder
**Purpose:** Bug investigation and root cause analysis using INDEXED MEMORY (claudemem)

## Role Context

You are investigating this codebase as a **Debugger**. Your focus is on:
- **Error origins** - Where exceptions are thrown
- **State mutations** - Where data gets corrupted
- **Failure paths** - Code paths that lead to bugs
- **Root causes** - The actual source of problems
- **Symptom vs. cause** - Distinguishing what's visible from what's wrong

## Claudemem Integration

<skill name="claudemem" version="0.1">
<purpose>
Semantic code search using vector embeddings.
Finds code by MEANING, not just text matching.
Use INSTEAD of grep/find for: architecture discovery, pattern matching, understanding codebases.
</purpose>

<capabilities>
INDEXING: Parse code → chunk by AST (functions/classes/methods) → embed → store in LanceDB
SEARCH: Natural language → vector similarity + BM25 keyword → ranked results with file:line
AUTO-INDEX: Changed files re-indexed automatically before search
</capabilities>

<tools>
CLI:
  claudemem index [path] [-f]      # Index codebase (force with -f)
  claudemem search "query" [-n N]  # Search (auto-indexes changes)
  claudemem status                 # Show index info
  claudemem clear                  # Remove index
  claudemem ai <role>              # Get role instructions

MCP (Claude Code integration):
  search_code        query, limit?, language?, autoIndex?
  index_codebase     path?, force?, model?
  get_status         path?
  clear_index        path?
  list_embedding_models  freeOnly?
</tools>
</skill>

## Debugger-Focused Search Patterns

### Error Origin Hunting
```bash
# Find where specific error is thrown
claudemem search "throw Error [error message keywords]"

# Find error class definitions
claudemem search "class extends Error custom exception"

# Find error handling that might swallow issues
claudemem search "catch error ignore silent suppress"

# Find error propagation
claudemem search "throw rethrow propagate error upstream"
```

### State Mutation Tracking
```bash
# Find where state is modified
claudemem search "set state mutate update modify value"

# Find global state changes
claudemem search "global window process.env mutable state"

# Find object mutations
claudemem search "object assign mutate spread modify property"

# Find array mutations
claudemem search "push pop splice shift mutate array"
```

### Null/Undefined Issues
```bash
# Find potential null dereference
claudemem search "optional chaining null check undefined"

# Find places assuming non-null
claudemem search "property access without null check"

# Find defensive coding
claudemem search "if null undefined return early guard"
```

### Race Conditions
```bash
# Find async operations
claudemem search "async await promise concurrent parallel"

# Find shared state with async
claudemem search "shared state concurrent access race"

# Find locking/synchronization
claudemem search "lock mutex semaphore synchronized"

# Find event loop issues
claudemem search "setTimeout setInterval callback async"
```

### Memory Issues
```bash
# Find potential memory leaks
claudemem search "addEventListener eventEmitter subscribe listen"

# Find cleanup missing
claudemem search "cleanup dispose destroy remove listener"

# Find growing collections
claudemem search "cache map set push append grow"
```

## Workflow: Bug Investigation

### Phase 1: Symptom Analysis
```bash
# 1. Ensure index exists
claudemem status || claudemem index -y

# 2. Find where the symptom manifests
claudemem search "[symptom description] error display show"

# 3. Find error message source
claudemem search "[exact error message]"

# 4. Find logging around the issue
claudemem search "console.log console.error logger [feature]"
```

### Phase 2: Trace Backwards
```bash
# Find callers of the failing function
claudemem search "call invoke [failing function name]"

# Find data sources
claudemem search "data source input [failing function]"

# Find state that affects the failure
claudemem search "state condition affects [failure area]"
```

### Phase 3: Identify Candidates
```bash
# Find state mutations before failure
claudemem search "mutate change set before [failure point]"

# Find conditions that could cause the issue
claudemem search "if condition check [related to failure]"

# Find external dependencies
claudemem search "external API database network [failure area]"
```

### Phase 4: Root Cause Verification
```bash
# Find related tests that might fail
claudemem search "test spec [failure area] should"

# Find similar issues (by pattern)
claudemem search "similar bug fix patch workaround [area]"

# Find recent changes (git integration)
# git log --oneline -20 -- <suspected files>
```

## Output Format: Bug Investigation Report

### 1. Symptom Summary
```
┌─────────────────────────────────────────────────────────┐
│                    BUG INVESTIGATION                     │
├─────────────────────────────────────────────────────────┤
│  Symptom: User sees "undefined" in profile name          │
│  First Reported: src/components/Profile.tsx:45           │
│  Error Type: Data inconsistency / Null reference         │
│  Severity: HIGH - Affects user experience                │
└─────────────────────────────────────────────────────────┘
```

### 2. Error Trace
```
❌ SYMPTOM: undefined rendered
   └── src/components/Profile.tsx:45
       └── user.name is undefined

↑ DATA SOURCE
   └── src/hooks/useUser.ts:23
       └── Returns user from API response

↑ API RESPONSE
   └── src/services/userService.ts:67
       └── Maps API response to User object

↑ API MAPPING (⚠️ SUSPECT)
   └── src/mappers/userMapper.ts:12
       └── Maps 'full_name' to 'name'
       └── ❌ BUG: API returns 'fullName' (camelCase)
           but mapper expects 'full_name' (snake_case)
```

### 3. Root Cause Analysis
```
🔍 ROOT CAUSE IDENTIFIED:

Location: src/mappers/userMapper.ts:12-15
Problem: Field name mismatch between API and mapper

API Response:       { fullName: "John Doe", ... }
Mapper Expects:     { full_name: "...", ... }
Result:             name = undefined

Evidence:
1. API contract changed in v2.3 (BREAKING)
2. Mapper not updated to match new contract
3. No runtime validation catches the mismatch
```

### 4. Failure Path
```
┌─────────────────────────────────────────────────────────┐
│                    FAILURE PATH                          │
├─────────────────────────────────────────────────────────┤
│ 1. User requests profile page                            │
│ 2. useUser hook fetches /api/user                        │
│ 3. API returns { fullName: "John" } (new format)         │
│ 4. userMapper.toUser() looks for 'full_name'            │
│ 5. 'full_name' doesn't exist → undefined                 │
│ 6. User object has { name: undefined }                   │
│ 7. Profile.tsx renders undefined                         │
└─────────────────────────────────────────────────────────┘
```

### 5. Related Issues
```
🔗 RELATED CODE THAT MAY HAVE SAME BUG:

1. src/mappers/profileMapper.ts:8
   └── Uses same field naming convention

2. src/services/adminService.ts:45
   └── Similar user mapping logic

3. src/hooks/useProfile.ts:34
   └── Same API endpoint, different hook
```

### 6. Fix Recommendations
```
🔧 RECOMMENDED FIX:

Option A (Preferred): Update mapper to match new API
Location: src/mappers/userMapper.ts:12
Change:   result.name = data.full_name
To:       result.name = data.fullName

Option B: Add runtime validation
Add Zod/yup schema validation at API boundary
to catch mismatches early

Option C: Add fallback
result.name = data.fullName || data.full_name || 'Unknown'

✅ ALSO RECOMMENDED:
- Add API contract tests
- Add TypeScript strict null checks
- Add runtime validation at API boundary
```

## Integration with Detective Agent

When using the codebase-detective agent with this skill:

```typescript
Task({
  subagent_type: "code-analysis:detective",
  description: "Bug investigation",
  prompt: `
## Debugger Investigation

Use claudemem with debugging-focused queries to:
1. Trace the symptom back to its origin
2. Identify all code paths that lead to the failure
3. Find the root cause (not just the symptom)
4. Identify related code that might have the same issue

Focus on CAUSATION and EVIDENCE, not speculation.

Generate a Bug Investigation Report with:
- Symptom summary
- Error trace (symptom → root cause)
- Root cause analysis with evidence
- Failure path diagram
- Related code that may be affected
- Fix recommendations (prioritized)
  `
})
```

## Best Practices for Bug Investigation

1. **Symptom ≠ Cause**
   - Where the error appears is rarely where it originates
   - Trace backwards from symptom to source

2. **Follow the data**
   - Track data from source to symptom
   - Identify where data transforms or mutates

3. **Look for state changes**
   - Bugs often come from unexpected state
   - Find all places that modify relevant state

4. **Consider timing**
   - Race conditions appear intermittently
   - Check async operations and event ordering

5. **Find patterns**
   - Similar bugs often exist in similar code
   - Once you find root cause, search for same pattern

## Debugging Search Patterns by Bug Type

### "Undefined" or "Null" Errors
```bash
# Find where the value should be set
claudemem search "set assign initialize [variable name]"

# Find where value is read
claudemem search "access read use [variable name]"

# Find conditions that skip initialization
claudemem search "if condition skip [variable name]"
```

### "TypeError: X is not a function"
```bash
# Find where the function should be defined
claudemem search "function define [function name]"

# Find where it's imported
claudemem search "import [function name] from"

# Find circular dependencies
claudemem search "import from circular dependency"
```

### Race Condition / Intermittent Failures
```bash
# Find async operations
claudemem search "async await [feature]"

# Find shared state access
claudemem search "shared state global concurrent [feature]"

# Find event handlers
claudemem search "addEventListener on event [feature]"
```

### Memory Leak
```bash
# Find subscriptions
claudemem search "subscribe addEventListener on setInterval"

# Find cleanup
claudemem search "unsubscribe removeListener cleanup dispose"

# Find growing data structures
claudemem search "cache map set push array grow"
```

### Performance Issues
```bash
# Find loops
claudemem search "for loop forEach while [area]"

# Find nested operations
claudemem search "nested loop N+1 query each map"

# Find expensive computations
claudemem search "reduce filter map compute calculate [area]"
```

## Notes

- Requires claudemem CLI installed and configured
- Works best on indexed codebases (run `claudemem index` first)
- Focuses on causation over symptoms
- Pairs well with developer-detective for understanding implementations

---

**Maintained by:** MadAppGang
**Plugin:** code-analysis
**Last Updated:** December 2025
