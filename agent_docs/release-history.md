# Release History

> For complete version history, see [CHANGELOG.md](../CHANGELOG.md) and [RELEASES.md](../RELEASES.md).

## Current Versions

| Plugin | Version | Date |
|--------|---------|------|
| Orchestration | v0.5.0 | 2025-12-14 |
| Frontend | v3.13.0 | 2025-12-14 |
| Code Analysis | v2.5.0 | 2025-12-14 |
| Bun Backend | v1.5.2 | 2025-11-26 |
| Agent Development | v1.1.0 | 2025-12-09 |

**Claudish CLI**: See https://github.com/tianzecn/claudish (separate repository)

---

## Git Tags

```
plugins/orchestration/v0.5.0
plugins/frontend/v3.13.0
plugins/bun/v1.5.2
plugins/code-analysis/v2.5.0
plugins/agentdev/v1.1.0
```

Format: `plugins/{plugin-name}/vX.Y.Z`

---

## Recent Highlights

### Code Analysis v2.5.0 - Claudemem v0.3.0 AST Structural Analysis
- Full AST structural analysis with PageRank ranking
- New AST Commands: map, symbol, callers, callees, context
- PageRank Symbol Importance: High PageRank (>0.05) = architectural pillars
- Detective Skills v3.0.0: All 5 detective skills updated for AST commands
- 80% Token Efficiency: Targeted AST navigation vs bulk file reads

### Orchestration v0.5.0 - Statistics Enforcement
- SubagentStop Hook: Warns if multi-model review statistics weren't collected
- MANDATORY Statistics Checklist: 6-step checklist prevents incomplete reviews
- Timing Instrumentation Examples: Pre-flight checklist, per-model timing

### Frontend v3.13.0
- LLM Performance Tracking
- Multi-model code review with `/review` command
- Opus 4.5 upgrades for critical agents

### Bun v1.5.2
- Opus 4.5 Architecture for API Architect
- Production-ready TypeScript backend patterns

---

## Release Checklist

When releasing a plugin, you **MUST** update ALL THREE:

1. **Plugin version** - `plugins/{name}/plugin.json` → `"version": "X.Y.Z"`
2. **Marketplace version** - `.claude-plugin/marketplace.json` → plugin entry `"version": "X.Y.Z"`
3. **Git tag** - `git tag -a plugins/{name}/vX.Y.Z -m "Release message"` → push with `--tags`

Missing any of these will cause claudeup to not see the update!
