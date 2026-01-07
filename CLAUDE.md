<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Project Context for Claude Code

## Project Overview (WHAT)

**Repository:** MAG Claude Plugins
**Purpose:** Professional plugin marketplace for Claude Code
**Owner:** tianzecn @ tianzecn
**License:** MIT

## What This Repository Contains (WHY)

A Claude Code plugin marketplace with 5 production-ready plugins:

| Plugin                         | Purpose                            | Key Features                                         |
| ------------------------------ | ---------------------------------- | ---------------------------------------------------- |
| **Frontend** (v3.13.0)         | Full-featured frontend development | 11 agents, 7 commands, 11 skills, multi-model review |
| **Code Analysis** (v2.5.0)     | Deep codebase investigation        | claudemem v0.3.0 AST analysis, semantic search       |
| **Bun Backend** (v1.5.2)       | TypeScript backend with Bun        | Clean architecture, Apidog integration               |
| **Orchestration** (v0.5.0)     | Multi-agent coordination patterns  | 5 skills for parallel execution, quality gates       |
| **Agent Development** (v1.1.0) | Create Claude Code agents          | Full-cycle agent development                         |

**Claudish CLI:** Run Claude Code with OpenRouter models. See https://github.com/tianzecn/claudish

## Directory Structure

```
claude-code/
├── plugins/
│   ├── frontend/          # Frontend development plugin
│   ├── code-analysis/     # Code investigation plugin
│   ├── bun/               # Backend plugin
│   ├── orchestration/     # Shared coordination patterns
│   └── agentdev/          # Agent development plugin
├── agent_docs/            # Detailed documentation for Claude
├── ai-docs/               # Technical documentation (collected)
├── docs/                  # User documentation
├── skills/                # Project-level skills
└── .claude-plugin/        # Marketplace configuration
```

## How to Work with This Project (HOW)

### Quick Setup

```bash
# Add marketplace (one-time)
/plugin marketplace add tianzecn/myclaudecode

# Enable plugins in .claude/settings.json
{
  "enabledPlugins": {
    "frontend@tianzecn-plugins": true,
    "code-analysis@tianzecn-plugins": true
  }
}
```

### Environment Variables

**Required:**

```bash
APIDOG_API_TOKEN=your-personal-token
FIGMA_ACCESS_TOKEN=your-personal-token
```

**Optional:**

```bash
GITHUB_PERSONAL_ACCESS_TOKEN=your-token
CHROME_EXECUTABLE_PATH=/path/to/chrome
CODEX_API_KEY=your-codex-key
```

### Dependencies

- Node.js v18+ (with npm/npx)
- Chrome browser
- Git

---

## Key Architecture Decisions

### 1. Team-First Configuration

- **Shareable** (git): Project IDs, URLs, `.claude/settings.json`
- **Private** (env): API tokens, credentials, `.env` file

### 2. Plugin System Format

- Plugin manifest: `.claude-plugin/plugin.json`
- Settings: `enabledPlugins` object with boolean values
- Directories: `agents/`, `commands/`, `skills/`, `mcp-servers/`
- Variables: Use `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths

### 3. Design Principles

1. Shareable Config, Private Secrets
2. Validation First - Check before ask
3. Team Ready - Auto-install, consistent setup
4. Security First - No secrets in git
5. Developer Experience - Smart defaults, clear errors

---

## Important Files

| Role             | Files                                                   |
| ---------------- | ------------------------------------------------------- |
| **Users**        | `README.md`, `.env.example`                             |
| **Maintainers**  | `.claude-plugin/marketplace.json`, `RELEASE_PROCESS.md` |
| **Contributors** | `plugins/*/plugin.json`, `CHANGELOG.md`                 |

---

## Detailed Documentation (Progressive Disclosure)

For task-specific details, see:

| Topic              | Documentation                                                                          |
| ------------------ | -------------------------------------------------------------------------------------- |
| Commands & Agents  | [agent_docs/commands-and-agents.md](agent_docs/commands-and-agents.md)                 |
| Claudemem Guide    | [agent_docs/claudemem-guide.md](agent_docs/claudemem-guide.md)                         |
| Parallel Execution | [agent_docs/parallel-execution-protocol.md](agent_docs/parallel-execution-protocol.md) |
| Release History    | [agent_docs/release-history.md](agent_docs/release-history.md)                         |
| Team Config        | [ai-docs/TEAM_CONFIG_ARCHITECTURE.md](ai-docs/TEAM_CONFIG_ARCHITECTURE.md)             |
| MCP Guide          | [ai-docs/DYNAMIC_MCP_GUIDE.md](ai-docs/DYNAMIC_MCP_GUIDE.md)                           |

---

## Release Checklist

When releasing a plugin, update ALL THREE:

1. `plugins/{name}/plugin.json` → `"version": "X.Y.Z"`
2. `.claude-plugin/marketplace.json` → plugin entry version
3. Git tag: `git tag -a plugins/{name}/vX.Y.Z -m "message"` → push with `--tags`

---

## Status

✅ **Production Ready** - 5 plugins, 15+ agents, 10+ commands, 20+ skills

---

**Maintained by:** tianzecn @ tianzecn
**Last Updated:** December 2025

## Project Rules

- Do not use hardcoded paths in code, docs, or comments
- Use relative paths for portability
- Keep CLAUDE.md focused on WHAT/WHY/HOW
- Detailed task-specific docs go in `agent_docs/`
-
