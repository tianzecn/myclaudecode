# Automation

**Claudish in scripts, pipelines, and CI/CD.**

Single-shot mode makes Claudish perfect for automation. Here's how to use it effectively.

---

## Basic Script Usage

```bash
#!/bin/bash
set -e

# Ensure model is set
export CLAUDISH_MODEL='minimax/minimax-m2'

# Run task
claudish "add error handling to src/api.ts"
```

---

## Passing Dynamic Prompts

```bash
#!/bin/bash
FILE=$1
claudish --model x-ai/grok-code-fast-1 "add JSDoc comments to $FILE"
```

Usage:
```bash
./add-docs.sh src/utils.ts
```

---

## Processing Multiple Files

```bash
#!/bin/bash
for file in src/*.ts; do
  echo "Processing $file..."
  claudish --model minimax/minimax-m2 "add type annotations to $file"
done
```

---

## Piping Input

**Code review a diff:**
```bash
git diff HEAD~1 | claudish --stdin --model openai/gpt-5.1-codex "review these changes"
```

**Explain a file:**
```bash
cat src/complex.ts | claudish --stdin --model x-ai/grok-code-fast-1 "explain this code"
```

**Convert code:**
```bash
cat legacy.js | claudish --stdin --model minimax/minimax-m2 "convert to TypeScript" > modern.ts
```

---

## JSON Output

For structured data:

```bash
claudish --json --model minimax/minimax-m2 "list 5 TypeScript utility functions" | jq '.content'
```

---

## Exit Codes

Claudish returns standard exit codes:

- `0` - Success
- `1` - Error

Use in conditionals:

```bash
if claudish --model minimax/minimax-m2 "run tests"; then
  echo "Tests passed"
  git push
else
  echo "Tests failed"
  exit 1
fi
```

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Review PR
        env:
          OPENROUTER_API_KEY: ${{ secrets.OPENROUTER_API_KEY }}
        run: |
          npx claudish@latest --model openai/gpt-5.1-codex \
            "Review the code changes in this PR. Focus on bugs, security issues, and performance."
```

### GitLab CI

```yaml
code_review:
  image: node:20
  script:
    - npx claudish@latest --model x-ai/grok-code-fast-1 "analyze code quality"
  variables:
    OPENROUTER_API_KEY: $OPENROUTER_API_KEY
```

---

## Batch Processing

Process many files efficiently:

```bash
#!/bin/bash

# Process all TypeScript files in parallel (4 at a time)
find src -name "*.ts" | xargs -P 4 -I {} bash -c '
  claudish --model minimax/minimax-m2 "add missing types to {}" || echo "Failed: {}"
'
```

---

## Commit Message Generator

```bash
#!/bin/bash

# Generate commit message from staged changes
git diff --staged | claudish --stdin --model x-ai/grok-code-fast-1 \
  "Write a concise commit message for these changes. Follow conventional commits format."
```

---

## Pre-commit Hook

`.git/hooks/pre-commit`:

```bash
#!/bin/bash

# Quick code review before commit
STAGED=$(git diff --staged --name-only | grep -E '\.(ts|js|tsx|jsx)$')

if [ -n "$STAGED" ]; then
  echo "Running AI review on staged files..."
  git diff --staged | claudish --stdin --model minimax/minimax-m2 \
    "Review for obvious bugs or issues. Be brief. Say 'LGTM' if no issues." \
    || echo "Review failed, continuing anyway"
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Error Handling

```bash
#!/bin/bash
set -e

# Retry logic
MAX_ATTEMPTS=3
ATTEMPT=1

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
  if claudish --model x-ai/grok-code-fast-1 "your task"; then
    echo "Success"
    exit 0
  fi

  echo "Attempt $ATTEMPT failed, retrying..."
  ATTEMPT=$((ATTEMPT + 1))
  sleep 2
done

echo "All attempts failed"
exit 1
```

---

## Logging Output

Capture everything:

```bash
claudish --model x-ai/grok-code-fast-1 "task" 2>&1 | tee output.log
```

Just the model output:

```bash
claudish --quiet --model minimax/minimax-m2 "task" > output.txt
```

---

## Performance Tips

**Use appropriate models:**
- Quick tasks → MiniMax M2 (cheapest)
- Important tasks → Grok or Codex

**Parallelize when possible:**
Multiple Claudish instances can run simultaneously. Each gets its own proxy port.

**Cache where sensible:**
If running the same prompt repeatedly, consider caching results.

**Set defaults:**
```bash
export CLAUDISH_MODEL='minimax/minimax-m2'
```
Avoid specifying `--model` every time.

---

## Security in Automation

**Never hardcode API keys:**
```bash
# Bad
claudish --model x-ai/grok "task"  # Key must be in env

# Good
export OPENROUTER_API_KEY=$(vault read secret/openrouter)
claudish --model x-ai/grok "task"
```

**Use secrets management:**
- GitHub: Repository secrets
- GitLab: CI/CD variables
- Local: `.env` files (gitignored)

---

## Next

- **[Single-Shot Mode](../usage/single-shot-mode.md)** - Detailed reference
- **[Environment Variables](environment.md)** - Configuration options
