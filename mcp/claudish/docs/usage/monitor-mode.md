# Monitor Mode

**See exactly what Claude Code is doing under the hood.**

Monitor mode is different. Instead of routing to OpenRouter, it proxies to the real Anthropic API and logs everything.

Why would you want this? Learning. Debugging. Curiosity.

---

## What It Does

```bash
claudish --monitor --debug "analyze the project structure"
```

This:
1. Starts a proxy to the **real** Anthropic API (not OpenRouter)
2. Logs all requests and responses to a file
3. Runs Claude Code normally
4. You see everything that was sent and received

---

## Requirements

Monitor mode uses your actual Anthropic credentials.

You need to be logged in:
```bash
claude auth login
```

Claudish extracts the token from Claude Code's requests. No extra config needed.

---

## Debug Logs

Enable debug mode to save logs:
```bash
claudish --monitor --debug "your prompt"
```

Logs are saved to `logs/claudish_*.log`.

**What you'll see:**
- Full request bodies (prompts, system messages, tools)
- Response content (streaming chunks)
- Token counts
- Timing information

---

## Use Cases

**Learning Claude Code's protocol:**
Ever wondered how Claude Code structures its requests? Tool definitions? System prompts? Monitor mode shows you.

**Debugging weird behavior:**
Something broken? See exactly what's being sent and what's coming back.

**Building integrations:**
Understanding the protocol helps if you're building tools that work with Claude Code.

**Comparing models:**
Run the same task in monitor mode (Claude) and regular mode (OpenRouter model). Compare the outputs.

---

## Example Session

```bash
$ claudish --monitor --debug "list files in the current directory"

[claudish] Monitor mode enabled - proxying to real Anthropic API
[claudish] API key will be extracted from Claude Code's requests
[claudish] Debug logs: logs/claudish_2024-01-15_103042.log

# ... Claude Code runs normally ...

[claudish] Session complete. Check logs for full request/response data.
```

Then check the log file:
```bash
cat logs/claudish_2024-01-15_103042.log
```

---

## Log Levels

Control how much gets logged:

```bash
# Full detail (default with --debug)
claudish --monitor --log-level debug "prompt"

# Truncated content (easier to read)
claudish --monitor --log-level info "prompt"

# Just labels, no content
claudish --monitor --log-level minimal "prompt"
```

---

## Privacy Note

Monitor mode logs can contain sensitive data:
- Your prompts
- Your code
- File contents Claude Code reads

Don't commit log files. They're gitignored by default.

---

## Cost Tracking (Experimental)

Want to see how much your sessions cost?

```bash
claudish --monitor --cost-tracker "do some work"
```

This tracks token usage and estimates costs.

**View the report:**
```bash
claudish --audit-costs
```

**Reset tracking:**
```bash
claudish --reset-costs
```

Note: Cost tracking is experimental. Estimates may not be exact.

---

## When NOT to Use Monitor Mode

- **For production work** - Use regular mode or interactive mode
- **For OpenRouter models** - Monitor mode only works with Anthropic's API
- **For private/sensitive projects** - Logs persist on disk

---

## Next

- **[Cost Tracking](../advanced/cost-tracking.md)** - Detailed cost monitoring
- **[Interactive Mode](interactive-mode.md)** - Normal usage
