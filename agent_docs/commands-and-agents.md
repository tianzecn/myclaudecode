# Commands and Agents Reference

> This document provides detailed information about all available commands and agents in the plugin ecosystem.

## Frontend Plugin (Full-Featured - Sonnet)

### Agents

| Agent | Purpose | Model |
|-------|---------|-------|
| `typescript-frontend-dev` | TypeScript/React implementation | Sonnet |
| `frontend-architect` | Architecture planning | Sonnet |
| `plan-reviewer` | Multi-model architecture plan review | Proxy |
| `ui-manual-tester` | Browser UI testing | Haiku |
| `test-architect` | Testing strategy | Sonnet |
| `api-documentation-analyst` | API docs analysis | Sonnet |
| `project-cleaner` | Cleanup utilities | Haiku |
| `senior-code-reviewer` | Code review | Sonnet |
| `codex-code-reviewer` | AI code review via Codex | Proxy |
| `designer` | UI/UX design review specialist | Sonnet |
| `ui-developer` | Senior UI developer with Tailwind CSS 4 & React 19 | Sonnet |
| `ui-developer-codex` | Expert UI review proxy via Codex AI | Proxy |

### Commands

#### `/implement`
Full-cycle implementation with intelligent workflow detection (API/UI/Mixed) and adaptive execution (8 phases).

- **API-focused**: Skips design validation, runs 2 code reviewers, focuses on API testing
- **UI-focused**: Full design validation, runs 3 reviewers (code + codex + UI tester), UI testing
- **Mixed**: Both workflows combined with appropriate focus areas

#### `/implement-ui`
Implement UI from scratch with intelligent agent switching.

#### `/import-figma`
Import Figma components.

#### `/api-docs`
API documentation workflows.

#### `/cleanup-artifacts`
Clean temporary files.

#### `/validate-ui`
UI validation workflow with designer & ui-developer.

#### `/review`
Multi-model code review orchestrator with parallel execution (3-5x speedup).

- Review unstaged changes, specific files, or recent commits
- Choose up to 9 external models + 1 embedded
- Parallel execution: 15 min → 5 min with real-time progress
- Consensus analysis: Prioritize issues by cross-model agreement
- Cost transparency: Input/output token separation
- Graceful degradation: Works with embedded Claude Sonnet if external models unavailable

### Skills

- `browser-debugger` - UI testing & debugging
- `api-spec-analyzer` - OpenAPI/Swagger analysis
- `ui-implementer` - Proactive UI implementation from design references

---

## Code Analysis Plugin

### Agents

| Agent | Purpose | Model |
|-------|---------|-------|
| `codebase-detective` | Deep code investigation | Sonnet |

### Commands

- `/analyze` - Launch deep codebase investigation

### Skills

- `deep-analysis` - Automatic code investigation and analysis
- `claudemem-search` - Expert guidance on claudemem CLI for local semantic search

---

## Bun Backend Plugin

### Agents

| Agent | Purpose | Model |
|-------|---------|-------|
| `backend-developer` | TypeScript backend implementation with Bun | Sonnet |
| `api-architect` | Backend API architecture planning | Sonnet |
| `apidog` | API documentation synchronization specialist | Sonnet |

### Commands

- `/implement-api` - Full-cycle API implementation with multi-agent orchestration
- `/setup-project` - Initialize new Bun + TypeScript backend project
- `/apidog` - Synchronize API specifications with Apidog

### Skills

- `best-practices` - Comprehensive TypeScript backend best practices with Bun (2025)
  - camelCase naming conventions for API and database
  - Clean architecture patterns
  - Security best practices
  - Prisma ORM patterns
  - Testing strategies

---

## Orchestration Plugin (Skills-Only)

**Purpose:** Centralized multi-agent coordination and workflow orchestration patterns.

### Skills

| Skill | Purpose |
|-------|---------|
| `multi-agent-coordination` | Parallel vs sequential execution, agent selection patterns |
| `multi-model-validation` | 4-Message Pattern for parallel AI model execution via Claudish |
| `quality-gates` | Approval gates, iteration loops, TDD pattern, severity classification |
| `todowrite-orchestration` | Phase tracking in complex multi-step workflows |
| `error-recovery` | Production error handling (timeout, failures, cancellation, retries) |

### Skill Bundles

- `core` - multi-agent-coordination, quality-gates
- `advanced` - multi-model-validation, error-recovery
- `testing` - quality-gates, todowrite-orchestration
- `complete` - All 5 skills

### Usage

Plugins declare orchestration as a dependency:

```json
{
  "dependencies": {
    "orchestration@tianzecn-plugins": "^0.1.0"
  }
}
```

Commands/agents reference skills in frontmatter:

```yaml
---
skills: orchestration:multi-model-validation, orchestration:quality-gates
---
```

**Key Innovation:** Transforms hardcoded orchestration knowledge from command prompts into modular, context-efficient skills that load on-demand.
