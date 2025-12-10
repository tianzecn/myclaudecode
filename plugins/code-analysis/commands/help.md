---
description: Show comprehensive help for the Code Analysis Plugin - lists agents, commands, skills, and usage examples
allowed-tools: Read
---

# Code Analysis Plugin Help

Present the following help information to the user:

---

## Code Analysis Plugin v1.3.3

**Deep code investigation and analysis toolkit for understanding complex codebases.**

### Quick Start

```bash
/analyze How is authentication implemented in this app?
```

---

## Agents (1)

| Agent | Description | Model |
|-------|-------------|-------|
| **codebase-detective** | Investigates codebases to understand patterns, trace flows, find implementations, analyze architecture, track bugs | Sonnet |

### When to Use

- Understanding how a feature works
- Finding where specific logic is implemented
- Tracing data flow through the application
- Investigating bugs and their root causes
- Analyzing code relationships and dependencies

---

## Commands (2)

| Command | Description |
|---------|-------------|
| **/analyze** | Launch deep codebase investigation for a specific question |
| **/help** | Show this help |

### Examples

```bash
/analyze How does the payment processing work?
/analyze Where are API endpoints defined?
/analyze What's the authentication flow?
/analyze Find all usages of the UserService class
```

---

## Skills (2)

| Skill | Description |
|-------|-------------|
| **deep-analysis** | Automatic code investigation patterns - proactively analyzes code |
| **semantic-code-search** | Expert guidance on claude-context MCP for vector-based code search |

### Semantic Code Search

For large codebases, use claude-context MCP:
- 40% token reduction vs grep
- Find code by functionality, not just keywords
- Semantic understanding of code relationships

---

## Use Cases

| Scenario | How It Helps |
|----------|--------------|
| **New to codebase** | Understand architecture and patterns |
| **Bug investigation** | Trace issues to root cause |
| **Feature planning** | Find integration points |
| **Code review** | Understand context of changes |
| **Documentation** | Extract how things work |

---

## Integration with Frontend Plugin

The code-analysis plugin is recommended alongside frontend.
The `/implement` command will suggest it for better codebase understanding.

---

## Installation

```bash
# Add marketplace (one-time)
/plugin marketplace add MadAppGang/claude-code

# Install plugin
/plugin install code-analysis@mag-claude-plugins
```

**Optional**: For semantic code search, install claude-context MCP.

---

## More Info

- **Repo**: https://github.com/MadAppGang/claude-code
- **Author**: Jack Rudenko @ MadAppGang
