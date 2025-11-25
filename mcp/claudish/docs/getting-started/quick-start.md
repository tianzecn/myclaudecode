# Quick Start Guide

**From zero to running in 3 minutes. No fluff.**

---

## Prerequisites

You need two things:

1. **Claude Code installed** - The official CLI from Anthropic
2. **Node.js 18+** or **Bun 1.0+** - Pick your poison

Don't have Claude Code? Get it at [claude.ai/claude-code](https://claude.ai/claude-code).

---

## Step 1: Get Your API Key

Head to [openrouter.ai/keys](https://openrouter.ai/keys).

Sign up (it's free), create a key. Copy it somewhere safe.

The key looks like: `sk-or-v1-abc123...`

---

## Step 2: Set the Key

**Option A: Export it (session only)**
```bash
export OPENROUTER_API_KEY='sk-or-v1-your-key-here'
```

**Option B: Add to .env (persistent)**
```bash
echo "OPENROUTER_API_KEY=sk-or-v1-your-key-here" >> ~/.env
```

**Option C: Let Claudish prompt you**
Just run `claudish` - it'll ask for the key interactively.

---

## Step 3: Run It

**Interactive mode (default):**
```bash
npx claudish@latest
```

This shows the model selector. Pick one, start your session.

**Single-shot mode:**
```bash
npx claudish@latest --model x-ai/grok-code-fast-1 "add error handling to api.ts"
```

One task, result printed, exit. Perfect for scripts.

---

## Step 4: Install the Skill (Optional but Recommended)

This teaches Claude Code how to use Claudish automatically:

```bash
# Navigate to your project
cd /path/to/your/project

# Install the skill
claudish --init

# Restart Claude Code to load it
```

Now when you say "use Grok to review this code", Claude knows exactly what to do.

---

## Install Globally (Optional)

Tired of `npx`? Install it:

```bash
# With npm
npm install -g claudish

# With Bun (faster)
bun install -g claudish
```

Now just run `claudish` directly.

---

## Verify It Works

Quick test:
```bash
claudish --model minimax/minimax-m2 "print hello world in python"
```

You should see MiniMax M2 write a Python hello world through Claude Code's interface.

---

## What Just Happened?

Behind the scenes:

1. Claudish started a local proxy server
2. It configured Claude Code to talk to this proxy
3. Your prompt went to OpenRouter, which routed to MiniMax
4. The response came back through the proxy
5. Claude Code displayed it like normal

You didn't notice any of this. That's the point.

---

## Next Steps

- **[Interactive Mode](../usage/interactive-mode.md)** - Explore the full experience
- **[Choosing Models](../models/choosing-models.md)** - Pick the right model for your task
- **[Environment Variables](../advanced/environment.md)** - Configure everything

---

## Stuck?

**"Command not found"**
Make sure Node.js 18+ is installed: `node --version`

**"Invalid API key"**
Check your key at [openrouter.ai/keys](https://openrouter.ai/keys). Make sure it starts with `sk-or-v1-`.

**"Model not found"**
Use `claudish --models` to see all available models.

**"Claude Code not installed"**
Install it first: [claude.ai/claude-code](https://claude.ai/claude-code)

More issues? Check [Troubleshooting](../troubleshooting.md).
