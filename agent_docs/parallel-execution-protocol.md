# Parallel Multi-Model Execution Protocol

> This protocol ensures true parallel execution when running multiple AI models simultaneously.

## When to Use This Protocol

Use this protocol when user requests:
- "Run reviewers in parallel" or "Validate with multiple models"
- "Run internal and external reviewers"
- Any request involving multiple AI models executing simultaneously
- Multi-model code review (`/review` command)

---

## The 4-Message Pattern (MANDATORY)

**❌ NEVER mix Bash and Task in the same message for parallel execution**

**✅ ALWAYS follow this strict sequence:**

### Message 1: Preparation (Bash Only)

- Create workspace directories
- Validate inputs
- **NO Task calls**
- **NO TodoWrite**

```typescript
// CORRECT
await Bash({ command: "mkdir -p /tmp/multi-review-123" });
```

### Message 2: Parallel Execution (ONLY Task Calls)

- Launch ALL reviewers/agents in **SINGLE message**
- **ONLY Task tool calls** - no Bash, no TodoWrite, no other tools
- Each Task is independent (no dependencies between them)
- All Tasks execute in parallel

```typescript
// CORRECT - Single message with 5 Task calls
await Task({ subagent_type: "senior-code-reviewer", prompt: "..." });
await Task({ subagent_type: "codex-code-reviewer", model: "openai/gpt-5.1-codex" });
await Task({ subagent_type: "codex-code-reviewer", model: "x-ai/grok-code-fast-1" });
await Task({ subagent_type: "codex-code-reviewer", model: "google/gemini-2.5-flash" });
await Task({ subagent_type: "codex-code-reviewer", model: "minimax/minimax-m2" });
```

### Message 3: Automatic Consolidation (Task Only)

- **DO NOT wait for user to request consolidation**
- Automatically launch consolidation agent
- Pass all review file paths to consolidator

```typescript
// CORRECT - Automatic upon receiving N summaries
if (receivedSummaries.length >= 2) {
  await Task({
    subagent_type: "senior-code-reviewer",
    description: "Consolidate multi-model reviews",
    prompt: `Consolidate these ${receivedSummaries.length} reviews...`
  });
}
```

### Message 4: Present Results

- Show consolidated review to user
- Include summary and link to detailed file

---

## Anti-Patterns

### ❌ Anti-Pattern 1: Mixed Tools

```typescript
// WRONG - Will execute sequentially, NOT in parallel
await TodoWrite({...});           // Tool 1
await Task({...});                // Tool 2 - waits for TodoWrite
await Bash({...});                // Tool 3 - waits for Task
await Task({...});                // Tool 4 - waits for Bash
```

**Why it fails**: Claude Code sees different tool types and assumes dependencies

### ✅ Correct Pattern: Single Tool Type

```typescript
// CORRECT - All Tasks run in parallel
await Task({...});                // Task 1
await Task({...});                // Task 2
await Task({...});                // Task 3
// All execute simultaneously
```

---

## Proxy Mode: Blocking Execution Required

**When using external models (Claudish) in agents:**

❌ **WRONG** (returns immediately, doesn't wait):
```bash
# Background execution - agent returns before model completes
claudish --model x-ai/grok-code-fast-1 ... &
```

✅ **CORRECT** (blocks until completion):
```bash
# Synchronous execution - agent waits for full response
RESULT=$(claudish --model x-ai/grok-code-fast-1 ...)
echo "$RESULT" > review.md
echo "Review complete - see review.md"  # Brief summary
```

**Agent Requirements:**
1. Execute claudish **synchronously** (blocking)
2. Capture full output
3. Write detailed results to file
4. Return **brief summary** (2-5 sentences) to orchestrator
5. **NEVER** return full output to orchestrator

---

## Auto-Consolidation Logic

**Automatic trigger**: After receiving N review summaries where N ≥ 2

```typescript
// In orchestrator code
const reviewSummaries = await Promise.allSettled(allReviewTasks);

// Auto-trigger consolidation
if (reviewSummaries.filter(r => r.status === 'fulfilled').length >= 2) {
  // DON'T wait for user prompt - do it automatically
  const consolidated = await Task({
    subagent_type: "senior-code-reviewer",
    description: "Auto-consolidate reviews",
    prompt: `Consolidate ${reviewSummaries.length} reviews into consensus analysis`
  });

  return formatConsolidatedResults(consolidated);
}
```

---

## Why This Protocol Exists

**Problem**: User requests "run 5 reviewers in parallel" but gets sequential execution

**Root Causes**:
1. Mixing Bash + Task in same message → Claude assumes dependencies
2. No auto-consolidation → Waited for user to request it
3. Proxy mode not blocking → Agents returned before external models completed
4. No clear workflow protocol → Agents didn't know the pattern

**Solution**: This explicit 4-message protocol ensures:
- ✅ True parallel execution (5-10x faster)
- ✅ Automatic consolidation (no user prompt needed)
- ✅ Blocking proxy execution (waits for external models)
- ✅ Predictable workflow (clear state machine)

---

## Complete Workflow Example

**User**: "Run internal and 4 external reviewers to validate implementation"

```typescript
// Message 1: Prep
await Bash({ command: "mkdir -p /tmp/review-123" });

// Message 2: Parallel reviews (SINGLE message, 5 Task calls)
const tasks = [
  Task({ subagent_type: "senior-code-reviewer", prompt: "Internal review" }),
  Task({ subagent_type: "codex-code-reviewer", model: "openai/gpt-5.1-codex" }),
  Task({ subagent_type: "codex-code-reviewer", model: "x-ai/grok-code-fast-1" }),
  Task({ subagent_type: "codex-code-reviewer", model: "google/gemini-2.5-flash" }),
  Task({ subagent_type: "codex-code-reviewer", model: "minimax/minimax-m2" })
];
const results = await Promise.allSettled(tasks);

// Message 3: Auto-consolidation (triggered automatically)
const consolidated = await Task({
  subagent_type: "senior-code-reviewer",
  description: "Consolidate reviews",
  prompt: `${results.length} reviews completed. Analyze consensus and divergence.`
});

// Message 4: Present results
return formatReviewResults(consolidated);
```

**Total**: 1 user request → 4 assistant messages → Complete results
