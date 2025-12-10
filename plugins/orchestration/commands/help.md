---
description: Show comprehensive help for the Orchestration Plugin - lists all skills, patterns, and usage examples
allowed-tools: Read
---

# Orchestration Plugin Help

Present the following help information to the user:

---

## Orchestration Plugin v0.2.0

**Shared multi-agent coordination patterns for complex Claude Code workflows.**

This is a **skills-only plugin** - provides knowledge patterns for other plugins.

---

## Skills (5)

| Skill | Description |
|-------|-------------|
| **multi-agent-coordination** | Parallel vs sequential execution, agent selection, task decomposition |
| **multi-model-validation** | 4-Message Pattern for parallel AI models via Claudish (3-5x speedup) |
| **quality-gates** | User approval, iteration loops, TDD pattern, severity classification |
| **todowrite-orchestration** | Phase tracking, real-time progress, workflow state management |
| **error-recovery** | Timeout handling, API failures, retry strategies, graceful degradation |

---

## Skill Bundles

| Bundle | Skills | Use Case |
|--------|--------|----------|
| **core** | multi-agent-coordination, quality-gates | Basic orchestration |
| **advanced** | multi-model-validation, error-recovery | External models |
| **testing** | quality-gates, error-recovery, todowrite-orchestration | TDD workflows |
| **complete** | All 5 skills | Full capabilities |

---

## Key Patterns

### 4-Message Pattern (Parallel AI Models)
```
Message 1: Preparation (Bash only)
Message 2: Parallel Execution (Task only - ALL in one message)
Message 3: Auto-Consolidation (triggered when N≥2 results)
Message 4: Present Results
```

### LLM Performance Tracking (v0.2.0)
Tracks to `ai-docs/llm-performance.json`:
- Execution time per model
- Quality scores
- Success rates
- Slow/unreliable model detection

---

## Usage

Other plugins declare dependency:
```json
{ "dependencies": { "orchestration@mag-claude-plugins": "^0.2.0" } }
```

Commands reference skills:
```yaml
skills: orchestration:multi-model-validation
```

---

## Installation

```bash
# Add marketplace (one-time)
/plugin marketplace add MadAppGang/claude-code

# Install plugin
/plugin install orchestration@mag-claude-plugins
```

**Note**: Usually auto-installed as dependency of frontend/agentdev plugins.

---

## More Info

- **Repo**: https://github.com/MadAppGang/claude-code
- **Author**: Jack Rudenko @ MadAppGang
