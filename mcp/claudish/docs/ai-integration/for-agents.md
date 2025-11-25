# Claudish for AI Agents

**How Claude Code sub-agents should use Claudish. Technical reference.**

This guide is for AI developers building agents that integrate with Claudish, or for understanding how Claude Code's sub-agent system works with external models.

---

## The Problem

When you run Claude Code, it sometimes spawns sub-agents via the Task tool. These sub-agents are isolated processes that handle specific tasks.

If you're using Claudish, those sub-agents need to know how to use external models correctly.

**Common issues:**
- Sub-agent runs Claudish in the main context (pollutes token budget)
- Agent streams verbose output (wastes context)
- Instructions passed as CLI args (limited, hard to edit)

---

## The Solution: File-Based Instructions

**Never run Claudish directly in the main context.**

Instead:
1. Write instructions to a file
2. Spawn a sub-agent that reads the file
3. Sub-agent runs Claudish with file-based prompt
4. Results written to output file
5. Main agent reads results

---

## The Pattern

### Step 1: Write Instructions

```bash
# Main agent writes task to file
cat > /tmp/claudish-task-abc123.md << 'EOF'
## Task
Review the authentication module in src/auth/

## Focus Areas
- Security vulnerabilities
- Error handling
- Performance issues

## Output Format
Return a markdown report with findings.
EOF
```

### Step 2: Spawn Sub-Agent

```typescript
// Use the Task tool
Task({
  subagent_type: "codex-code-reviewer",  // Or your custom agent
  description: "External AI code review",
  prompt: `
    Read instructions from /tmp/claudish-task-abc123.md
    Run Claudish with those instructions
    Write results to /tmp/claudish-result-abc123.md
    Return a brief summary (not full results)
  `
})
```

### Step 3: Sub-Agent Executes

```bash
# Sub-agent runs this
claudish --model openai/gpt-5.1-codex --stdin < /tmp/claudish-task-abc123.md > /tmp/claudish-result-abc123.md
```

### Step 4: Read Results

```bash
# Main agent reads the result file
cat /tmp/claudish-result-abc123.md
```

---

## Why This Pattern?

**Context protection.** Claudish output can be verbose. If streamed to main context, it eats your token budget. File-based keeps it isolated.

**Editable instructions.** Complex prompts are easier to write/edit in files than CLI args.

**Debugging.** Files persist. You can inspect what was sent and received.

**Parallelism.** Multiple sub-agents can run simultaneously with separate files.

---

## Recommended Models by Task

| Task | Model | Why |
|------|-------|-----|
| Code review | `openai/gpt-5.1-codex` | Trained for code analysis |
| Architecture | `google/gemini-3-pro-preview` | Long context, good reasoning |
| Quick tasks | `x-ai/grok-code-fast-1` | Fast, cheap |
| Parallel workers | `minimax/minimax-m2` | Cheapest, good enough |

---

## Sub-Agent Configuration

Set environment variables for consistent behavior:

```bash
# In sub-agent environment
export CLAUDISH_MODEL_SUBAGENT='minimax/minimax-m2'
export OPENROUTER_API_KEY='...'
```

Or pass via CLI:
```bash
claudish --model minimax/minimax-m2 --stdin < task.md
```

---

## Error Handling

Sub-agents should handle Claudish failures gracefully:

```bash
#!/bin/bash
if ! claudish --model x-ai/grok-code-fast-1 --stdin < task.md > result.md 2>&1; then
  echo "ERROR: Claudish execution failed" > result.md
  echo "See stderr for details" >> result.md
  exit 1
fi
```

---

## File Naming Convention

Use unique identifiers to avoid collisions:

```
/tmp/claudish-{purpose}-{uuid}.md
/tmp/claudish-{purpose}-{uuid}-result.md
```

Examples:
```
/tmp/claudish-review-abc123.md
/tmp/claudish-review-abc123-result.md
/tmp/claudish-refactor-def456.md
/tmp/claudish-refactor-def456-result.md
```

---

## Cleanup

Don't leave temp files around:

```bash
# After reading results
rm /tmp/claudish-review-abc123.md
rm /tmp/claudish-review-abc123-result.md
```

Or use a cleanup script:
```bash
# Remove files older than 1 hour
find /tmp -name "claudish-*" -mmin +60 -delete
```

---

## Parallel Execution

For multi-model validation, run sub-agents in parallel:

```typescript
// Launch 3 reviewers simultaneously
const tasks = [
  Task({ subagent_type: "codex-reviewer", model: "openai/gpt-5.1-codex", ... }),
  Task({ subagent_type: "codex-reviewer", model: "x-ai/grok-code-fast-1", ... }),
  Task({ subagent_type: "codex-reviewer", model: "google/gemini-3-pro-preview", ... }),
];

// All execute in parallel
const results = await Promise.allSettled(tasks);
```

Each sub-agent writes to its own result file. Main agent consolidates.

---

## The Claudish Skill

Install the Claudish skill to auto-configure Claude Code:

```bash
claudish --init
```

This adds `.claude/skills/claudish-usage/SKILL.md` which teaches Claude:
- When to use sub-agents
- File-based instruction patterns
- Model selection guidelines

---

## Debugging

**Check if Claudish is available:**
```bash
which claudish || npx claudish@latest --version
```

**Verbose mode for debugging:**
```bash
claudish --verbose --debug --model x-ai/grok "test prompt"
```

**Check logs:**
```bash
ls -la logs/claudish_*.log
```

---

## Common Mistakes

**Running in main context:**
```typescript
// WRONG - pollutes main context
Bash({ command: "claudish --model grok 'do task'" })
```

**Passing long prompts as args:**
```bash
# WRONG - shell escaping issues, hard to edit
claudish --model grok "very long prompt with special chars..."
```

**Not handling errors:**
```bash
# WRONG - ignores failures
claudish --model grok < task.md > result.md
```

---

## Summary

1. **Write instructions to file**
2. **Spawn sub-agent**
3. **Sub-agent runs Claudish with `--stdin`**
4. **Results written to file**
5. **Main agent reads results**
6. **Clean up temp files**

This keeps your main context clean and your workflows debuggable.

---

## Related

- **[Automation](../advanced/automation.md)** - Scripting patterns
- **[Model Mapping](../models/model-mapping.md)** - Configure sub-agent models
