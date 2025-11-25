# Cost Tracking

**Know what you're spending. No surprises.**

OpenRouter charges per token. Claudish can help you track costs across sessions.

> **Note:** Cost tracking is experimental. Estimates are approximations based on model pricing data.

---

## Enable Cost Tracking

```bash
claudish --cost-tracker "do some work"
```

This:
1. Enables monitor mode automatically
2. Tracks token usage for each request
3. Calculates cost based on model pricing
4. Saves data for later analysis

---

## View Cost Report

After some sessions:

```bash
claudish --audit-costs
```

Output:
```
Cost Tracking Report
====================

Total sessions: 12
Total tokens: 245,891
  - Input tokens: 198,234
  - Output tokens: 47,657

Estimated cost: $2.34

By model:
  x-ai/grok-code-fast-1     $1.12 (48%)
  google/gemini-3-pro-preview $0.89 (38%)
  minimax/minimax-m2        $0.33 (14%)
```

---

## Reset Tracking

Start fresh:

```bash
claudish --reset-costs
```

This clears all accumulated cost data.

---

## How It Works

Claudish tracks:
- **Input tokens** - What you send (prompts, context, files)
- **Output tokens** - What the model generates
- **Model used** - For accurate per-model pricing

Costs are calculated using OpenRouter's published pricing.

---

## Accuracy Notes

**Why "estimated"?**

1. **Pricing changes** - OpenRouter adjusts prices periodically
2. **Token counting** - Different tokenizers give slightly different counts
3. **Caching** - Some requests may be cached (cheaper or free)
4. **Special pricing** - Free tiers, promotions, etc.

For accurate billing, check your [OpenRouter dashboard](https://openrouter.ai/activity).

---

## Cost Optimization Tips

**Use the right model for the task:**

| Task | Recommended | Cost |
|------|-------------|------|
| Quick fixes | MiniMax M2 | $0.60/1M |
| General coding | Grok Code Fast | $0.85/1M |
| Complex work | Gemini 3 Pro | $7.00/1M |

**Avoid unnecessary context:**
Don't dump entire codebases when you only need one file.

**Use single-shot for simple tasks:**
Interactive sessions accumulate context. Single-shot starts fresh each time.

**Set up model mapping:**
Route cheap tasks to cheap models automatically. See [Model Mapping](../models/model-mapping.md).

---

## Real Cost Examples

**50K token session (typical):**
- MiniMax M2: ~$0.03
- Grok Code Fast: ~$0.04
- Gemini 3 Pro: ~$0.35

**Heavy 500K token session:**
- MiniMax M2: ~$0.30
- Grok Code Fast: ~$0.43
- Gemini 3 Pro: ~$3.50

**Monthly estimate (heavy user, 10 sessions/day):**
- Budget setup: ~$10-15/month
- Premium setup: ~$50-100/month

---

## Compare with Native Claude

For context, native Claude Code costs (via Anthropic):
- Claude 3.5 Sonnet: ~$18/1M input, ~$90/1M output
- Claude 3 Opus: ~$75/1M input, ~$375/1M output

OpenRouter models are often 10-100x cheaper for comparable tasks.

---

## OpenRouter Free Tier

OpenRouter offers $5 free credits for new accounts.

That's enough for:
- ~8M tokens with MiniMax M2
- ~6M tokens with Grok Code Fast
- ~700K tokens with Gemini 3 Pro

Plenty to evaluate if Claudish works for you.

---

## Next

- **[Choosing Models](../models/choosing-models.md)** - Cost vs capability trade-offs
- **[Environment Variables](environment.md)** - Configure model defaults
