# Model Mapping

**Different models for different roles. Advanced optimization.**

Claude Code uses different model "tiers" internally:
- **Opus** - Complex planning, architecture decisions
- **Sonnet** - Default coding tasks (most work happens here)
- **Haiku** - Fast, simple tasks, background operations
- **Subagent** - When Claude spawns child agents

With model mapping, you can route each tier to a different model.

---

## Why Bother?

**Cost optimization.** Use a cheap model for simple Haiku tasks, premium for Opus planning.

**Capability matching.** Some models are better at planning vs execution.

**Hybrid approach.** Keep real Anthropic Claude for Opus, use OpenRouter for everything else.

---

## Basic Mapping

```bash
claudish \
  --model-opus google/gemini-3-pro-preview \
  --model-sonnet x-ai/grok-code-fast-1 \
  --model-haiku minimax/minimax-m2
```

This routes:
- Architecture/planning (Opus) → Gemini 3 Pro
- Normal coding (Sonnet) → Grok Code Fast
- Quick tasks (Haiku) → MiniMax M2

---

## Environment Variables

Set defaults so you don't type flags every time:

```bash
# Claudish-specific (takes priority)
export CLAUDISH_MODEL_OPUS='google/gemini-3-pro-preview'
export CLAUDISH_MODEL_SONNET='x-ai/grok-code-fast-1'
export CLAUDISH_MODEL_HAIKU='minimax/minimax-m2'
export CLAUDISH_MODEL_SUBAGENT='minimax/minimax-m2'

# Or use Claude Code standard format (fallback)
export ANTHROPIC_DEFAULT_OPUS_MODEL='google/gemini-3-pro-preview'
export ANTHROPIC_DEFAULT_SONNET_MODEL='x-ai/grok-code-fast-1'
export ANTHROPIC_DEFAULT_HAIKU_MODEL='minimax/minimax-m2'
export CLAUDE_CODE_SUBAGENT_MODEL='minimax/minimax-m2'
```

Now just run:
```bash
claudish "do something"
```

Each tier uses its mapped model automatically.

---

## Hybrid Mode: Real Claude + OpenRouter

Here's a powerful setup: Use actual Claude for complex tasks, OpenRouter for everything else.

```bash
claudish \
  --model-opus claude-3-opus-20240229 \
  --model-sonnet x-ai/grok-code-fast-1 \
  --model-haiku minimax/minimax-m2
```

Wait, `claude-3-opus-20240229` without the provider prefix?

Yep. Claudish detects this is an Anthropic model ID and routes directly to Anthropic's API (using your native Claude Code auth).

**Result:** Premium Claude intelligence for planning, cheap OpenRouter models for execution.

---

## Subagent Mapping

When Claude Code spawns sub-agents (via the Task tool), they use the subagent model:

```bash
export CLAUDISH_MODEL_SUBAGENT='minimax/minimax-m2'
```

This is especially useful for parallel multi-agent workflows. Cheap models for workers, premium for the orchestrator.

---

## Priority Order

When multiple sources set the same model:

1. **CLI flags** (highest priority)
   - `--model-opus`, `--model-sonnet`, etc.
2. **CLAUDISH_MODEL_*** environment variables
3. **ANTHROPIC_DEFAULT_*** environment variables (lowest)

Example:
```bash
export CLAUDISH_MODEL_SONNET='minimax/minimax-m2'

claudish --model-sonnet x-ai/grok-code-fast-1 "prompt"
# Uses Grok (CLI flag wins)
```

---

## My Recommended Setup

For cost-optimized development:

```bash
# .env or shell profile
export CLAUDISH_MODEL_OPUS='google/gemini-3-pro-preview'    # $7.00/1M - for complex planning
export CLAUDISH_MODEL_SONNET='x-ai/grok-code-fast-1'        # $0.85/1M - daily driver
export CLAUDISH_MODEL_HAIKU='minimax/minimax-m2'            # $0.60/1M - quick tasks
export CLAUDISH_MODEL_SUBAGENT='minimax/minimax-m2'         # $0.60/1M - parallel workers
```

For maximum capability:

```bash
export CLAUDISH_MODEL_OPUS='google/gemini-3-pro-preview'    # 1M context
export CLAUDISH_MODEL_SONNET='openai/gpt-5.1-codex'         # Code specialist
export CLAUDISH_MODEL_HAIKU='x-ai/grok-code-fast-1'         # Fast and capable
export CLAUDISH_MODEL_SUBAGENT='x-ai/grok-code-fast-1'
```

---

## Checking Your Configuration

See what's configured:

```bash
# Current environment
env | grep -E "(CLAUDISH|ANTHROPIC)" | grep MODEL
```

---

## Common Patterns

**Budget maximizer:**
All tasks → MiniMax M2. Cheapest option that works.

```bash
claudish --model minimax/minimax-m2 "prompt"
```

**Quality maximizer:**
All tasks → Gemini 3 Pro. Best context and reasoning.

```bash
claudish --model google/gemini-3-pro-preview "prompt"
```

**Balanced approach:**
Map by complexity (shown above).

**Real Claude for critical paths:**
Hybrid with native Anthropic for Opus tier.

---

## Debugging Model Selection

Not sure which model is being used? Enable verbose mode:

```bash
claudish --verbose --model x-ai/grok-code-fast-1 "prompt"
```

You'll see logs showing which model handles each request.

---

## Next

- **[Environment Variables](../advanced/environment.md)** - Full configuration reference
- **[Choosing Models](choosing-models.md)** - Which model for which task
