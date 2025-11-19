# Shared Resources

This directory contains resources shared across all Claude Code plugins.

## Purpose

Centralized management of common resources to ensure consistency and reduce duplication.

## Architecture

```
shared/                                    ← SOURCE OF TRUTH (edit here)
├── recommended-models.md                  ← Model recommendations
├── QUICK_REFERENCE_SPEC.md                ← Quick reference spec
├── README.md                              ← This file
└── skills/                                ← Shared skills
    └── claudish-usage/                    ← Claudish usage skill
        └── SKILL.md                       ← AUTO-DISTRIBUTED

scripts/
└── sync-shared.ts                         ← Distribution script (recursive)

plugins/
├── frontend/
│   ├── recommended-models.md              ← AUTO-COPIED
│   ├── QUICK_REFERENCE_SPEC.md            ← AUTO-COPIED
│   ├── README.md                          ← AUTO-COPIED
│   └── skills/                            ← AUTO-CREATED
│       └── claudish-usage/                ← AUTO-CREATED
│           └── SKILL.md                   ← AUTO-COPIED
├── bun/
│   ├── recommended-models.md              ← AUTO-COPIED
│   ├── QUICK_REFERENCE_SPEC.md            ← AUTO-COPIED
│   ├── README.md                          ← AUTO-COPIED
│   └── skills/                            ← AUTO-CREATED
│       └── claudish-usage/                ← AUTO-CREATED
│           └── SKILL.md                   ← AUTO-COPIED
└── code-analysis/
    ├── recommended-models.md              ← AUTO-COPIED
    ├── QUICK_REFERENCE_SPEC.md            ← AUTO-COPIED
    ├── README.md                          ← AUTO-COPIED
    └── skills/                            ← AUTO-CREATED
        └── claudish-usage/                ← AUTO-CREATED
            └── SKILL.md                   ← AUTO-COPIED
```

## How It Works

### 1. Edit Source Files

All shared resources are stored in `shared/` directory. This is the **ONLY** place you should edit these files.

**Example:**
```bash
# Edit the source
vim shared/recommended-models.md
```

### 2. Sync to Plugins

Run the sync script to copy resources to all plugins:

```bash
# Sync all shared resources
bun run sync-shared

# Or use the short alias
bun run sync
```

### 3. Automatic Distribution

The sync script copies each file from `shared/` to all plugin directories:

- `shared/recommended-models.md` → `plugins/frontend/recommended-models.md`
- `shared/recommended-models.md` → `plugins/bun/recommended-models.md`
- `shared/recommended-models.md` → `plugins/code-analysis/recommended-models.md`

### 4. Plugin Usage

Commands and agents read the synced files using plugin-relative paths:

**For flat files:**
```markdown
Read file: ${CLAUDE_PLUGIN_ROOT}/recommended-models.md
```

**For skills:**
```markdown
Read file: ${CLAUDE_PLUGIN_ROOT}/skills/claudish-usage/SKILL.md
```

This ensures each plugin always has access to the latest recommendations and shared skills.

## Shared Skills

### What are Shared Skills?

Shared skills are reusable knowledge modules that are distributed across all plugins. They provide:
- ✅ Consistent guidance across plugins
- ✅ Centralized knowledge management
- ✅ Automatic updates when skills are improved
- ✅ Reduced duplication

### Current Shared Skills

1. **claudish-usage** (`skills/claudish-usage/SKILL.md`)
   - How to use Claudish CLI with OpenRouter models
   - File-based sub-agent patterns
   - Model selection and cost tracking
   - Best practices for AI agents

### Adding New Shared Skills

1. Create skill directory: `shared/skills/skill-name/`
2. Add `SKILL.md` file with YAML frontmatter:
   ```yaml
   ---
   name: skill-name
   description: Clear description of what the skill does and when to use it
   ---
   ```
3. Write skill content (instructions, examples, best practices)
4. Run `bun run sync-shared`
5. Skill is automatically distributed to all plugins and discovered by Claude

### Using Shared Skills in Commands/Agents

**Skills are automatically discovered** - Claude loads them based on the task at hand.

Skills must have YAML frontmatter with `name` and `description`:
```yaml
---
name: claudish-usage
description: Guide for using Claudish CLI to run Claude Code with OpenRouter models. Use when working with external AI models, multi-model workflows, or cost optimization.
---
```

**How it works:**
1. **Startup**: Skill metadata (name + description) loaded into system prompt (~100 tokens/skill)
2. **Task matching**: When user request matches description, Claude automatically reads SKILL.md via bash
3. **Progressive loading**: Claude only loads relevant skills, avoiding context pollution

**You do NOT need to:**
- ❌ Manually read skill files with `Read` tool
- ❌ Reference skills in agent/command prompts
- ❌ Load skills into context explicitly

**Claude automatically uses skills when:**
- ✅ Task matches the skill's description
- ✅ User mentions keywords from description (e.g., "Claudish", "OpenRouter", "Grok")
- ✅ Workflow requires skill's capabilities

**Example**: User asks "use Grok to implement feature X"
1. Claude recognizes "Grok" matches `claudish-usage` skill description
2. Automatically reads `skills/claudish-usage/SKILL.md` via bash
3. Uses skill guidance to complete the task

**Only reference skills explicitly if:**
- You need to pass skill content to a sub-agent that doesn't have skill access
- You're building a tool that needs to extract skill metadata
- You're debugging or testing skill content

## Maintaining Shared Resources

### Adding New Shared Files

1. Create the file in `shared/` directory (or subdirectory)
2. Run `bun run sync-shared`
3. File is automatically copied to all plugins (preserving directory structure)
4. Update plugin commands/agents to use the new file

### Updating Existing Files

1. Edit the file in `shared/` directory (NOT in plugin directories)
2. Run `bun run sync-shared`
3. Updates are automatically distributed to all plugins

### Adding New Plugins

1. Add plugin name to `PLUGIN_NAMES` array in `scripts/sync-shared.ts`
2. Run `bun run sync-shared`
3. All shared resources are copied to the new plugin

## File Format Standards

### Markdown Files

Shared markdown files should be:
- AI-native (no JSON parsing required)
- Human-readable
- Well-structured with clear headings
- Include rich context and explanations
- Use consistent formatting

**Example: Model Recommendations**
```markdown
### Model Name (⭐ RECOMMENDED)
- **Provider:** provider-name
- **OpenRouter ID:** `provider/model-id`
- **Best For:** use cases
- **Trade-offs:** considerations
```

## Best Practices

### DO:
✅ Edit files in `shared/` directory only
✅ Run sync script after every change
✅ Use descriptive file names
✅ Include version and last-updated metadata in files
✅ Add comments explaining the purpose of each file

### DON'T:
❌ Edit files in plugin directories directly (changes will be overwritten)
❌ Commit plugin copies to git (they're auto-generated)
❌ Skip running sync script after changes
❌ Use complex file formats that require parsing

## Future Extensibility

This pattern can be extended to other shared resources:

**Current Shared Resources:**
- ✅ **Skills** - Reusable knowledge modules (skills/claudish-usage/)
- ✅ **Model Recommendations** - OpenRouter model data (recommended-models.md)
- ✅ **Quick Reference** - Spec templates (QUICK_REFERENCE_SPEC.md)

**Future Shared Resources:**
- **API Schema Templates** - Standard OpenAPI schemas (schemas/)
- **Best Practices Snippets** - Common code patterns (snippets/)
- **Configuration Templates** - Standard configs (templates/)
- **Testing Patterns** - Standard test structures (patterns/)
- **Documentation Templates** - Standard doc formats (docs/)

To add a new shared resource:
1. Create file/directory in `shared/`
2. Run `bun run sync-shared` (handles subdirectories automatically)
3. Update plugin files to reference it using `${CLAUDE_PLUGIN_ROOT}/path/to/file`
4. Document in this README

## Troubleshooting

### Sync Script Fails

**Problem:** `❌ Shared directory not found`
**Solution:** Ensure you're running from repository root

**Problem:** `✗ Failed to copy to plugin`
**Solution:** Check plugin directory exists and is writable

### Plugin Files Out of Sync

**Problem:** Plugin has old version of shared file
**Solution:** Run `bun run sync-shared` to update

### Changes Not Appearing

**Problem:** Edited plugin file directly
**Solution:** Edit `shared/` file instead, then run sync

## Questions?

See main documentation:
- [CLAUDE.md](../CLAUDE.md) - Project overview
- [README.md](../README.md) - User documentation
- [RELEASE_PROCESS.md](../RELEASE_PROCESS.md) - Release workflow

Contact: Jack Rudenko (i@madappgang.com)
