# claudeup Enhancement Design

> **Status**: Draft
> **Author**: Brainstorming Session
> **Date**: 2025-12-26
> **Target Version**: v0.7.0+

## Overview

This document outlines the design for enhancing claudeup with three major feature areas:

1. **Search & Filter** - Find plugins quickly with search and category filtering
2. **Rich Information Display** - View README, changelogs, and detailed plugin info
3. **Utility Tools** - Health check, backup/restore, and batch operations

### Design Principles

- **Incremental Delivery** - Each feature ships independently
- **Backward Compatible** - Existing workflows unchanged
- **Keyboard-First** - All features accessible via shortcuts
- **Performance** - Lazy loading, caching, no UI blocking

---

## Phase 1: Search & Filter

### 1.1 Search Functionality

**Trigger**: Press `/` to activate search mode

**Behavior**:
- Search box appears at top of plugin list
- Real-time filtering (filters as you type)
- Press `Escape` to exit and restore full list
- Search matches: plugin name, description, marketplace name

**UI Mockup**:
```
┌─ [PROJECT] Marketplaces & Plugins ──────────────┐
│ 🔍 frontend_                                    │  ← Search box
│ ─────────────────────────────────────────────── │
│ ▼ ✓ MadAppGang Plugins (5)                      │
│      ● frontend v3.13.0                    ← hit│
│      ○ frontend-design v1.0.0              ← hit│
│ ▼ ✓ Anthropic Official (13)                     │
│      (no matches)                               │
└─────────────────────────────────────────────────┘
```

**Implementation**:
- File: `src/ui/screens/plugins.ts`
- Add `searchQuery` state variable
- Filter `listItems` based on search query
- Handle `/` key to toggle search mode

### 1.2 Category & Tag System

**Data Schema Extension**:
```json
{
  "plugins": [
    {
      "name": "frontend",
      "version": "3.13.0",
      "category": "development",
      "tags": ["react", "typescript", "ui"]
    }
  ]
}
```

**Predefined Categories** (6):
| Category | Description | Icon |
|----------|-------------|------|
| `development` | Dev tools | 🔧 |
| `productivity` | Efficiency | ⚡ |
| `analysis` | Code analysis | 🔍 |
| `integration` | Integrations | 🔗 |
| `ui` | UI/Design | 🎨 |
| `other` | Miscellaneous | 📦 |

**Filter Panel UI**:
```
┌─ Filter ───────────────────────────────────────┐
│ Category: [All ▼]  Tags: [react] [typescript] ×│
└────────────────────────────────────────────────┘
```

**Keyboard Shortcuts**:
- `f` - Open filter panel
- `↑↓` - Navigate categories
- `Space` - Toggle tag selection
- `c` - Clear all filters
- `Enter` - Apply and close

**Implementation**:
- New file: `src/types/plugin.ts` - Category/Tag types
- Modify: `src/data/marketplaces.ts` - Parse category info
- Modify: `src/ui/screens/plugins.ts` - Filter UI component

---

## Phase 2: Rich Information Display

### 2.1 Tabbed Detail Panel

**Replace** static detail panel with tabbed interface.

**Tabs**:
| Tab | Key | Content |
|-----|-----|---------|
| Info | `1` | Basic info, status, actions |
| Docs | `2` | Plugin README |
| Changes | `3` | Version changelog |

**Navigation**:
- `Tab` or `←` `→` to switch tabs
- `1` `2` `3` for quick jump

**UI Mockup**:
```
┌─ Details ──────────────────────────────────────┐
│ ┌─────┬───────┬─────────┐                      │
│ │ Info│ Docs ●│ Changes │                      │
│ └─────┴───────┴─────────┘                      │
│                                                │
│ # Frontend Development Plugin                  │
│                                                │
│ Full-featured React/TypeScript development     │
│ with 11 specialized agents.                    │
│                                                │
│ ## Features                                    │
│ • Multi-agent orchestration                    │
│ • TanStack Router & Query integration          │
│                                                │
│ ──────────────────────────────────────────     │
│ ↑↓ Scroll │ Enter Full View │ Tab Switch       │
└────────────────────────────────────────────────┘
```

### 2.2 Docs Tab - README Display

**Data Fetching Priority**:
1. Local cache: `~/.claude/marketplaces/{name}/plugins/{plugin}/README.md`
2. GitHub Raw: `https://raw.githubusercontent.com/{repo}/main/plugins/{plugin}/README.md`
3. Fallback: "No documentation available"

**Markdown Rendering**:
- Use `marked-terminal` for terminal Markdown rendering
- Support: headings, lists, code blocks, links (as URLs)
- Truncate long content with "Press Enter to view full..."

**Scrolling**:
- `j` / `k` or `↑` / `↓` - Scroll content
- `g` - Jump to top
- `G` - Jump to bottom
- `Enter` - Full-screen preview mode

### 2.3 Changes Tab - Changelog Display

**Data Sources** (priority order):
1. Local `CHANGELOG.md` file
2. GitHub Releases API
3. Simple version comparison info

**Display Format**:
```
v3.13.0 (2025-12-14) ← Currently installed
├─ ✨ LLM Performance Tracking
├─ 🐛 Fixed CSS validation edge cases
└─ 📝 Updated TanStack Query skill

v3.12.0 (2025-12-10)
├─ ✨ Multi-model code review
└─ ⚡ Parallel execution 3-5x speedup
```

**Implementation**:
- New file: `src/services/plugin-docs.ts` - README/Changelog fetching
- New file: `src/utils/markdown-renderer.ts` - Terminal Markdown rendering

---

## Phase 3: Utility Tools

### 3.1 Health Check Screen

**New Tab**: `[6] Health`

**Check Items**:
| Check | Description | Status |
|-------|-------------|--------|
| Claude Code | Installation & version | ✅ ⚠️ ❌ |
| Settings Files | `.claude/settings.json` valid | ✅ ⚠️ ❌ |
| Marketplaces | All accessible, no 404 | ✅ ⚠️ ❌ |
| Plugin Integrity | Enabled plugin files intact | ✅ ⚠️ ❌ |
| MCP Servers | Configured servers reachable | ✅ ⚠️ ❌ |
| Dependencies | Plugin dependencies satisfied | ✅ ⚠️ ❌ |
| Orphaned Plugins | Plugins from deleted marketplaces | ✅ ⚠️ ❌ |

**UI Mockup**:
```
┌─────────────────────────────────────────────────┐
│ ◆ claudeup v0.7.0  [1] Plugins ... [6] Health ● │
├─────────────────────────────────────────────────┤
│                                                 │
│  🏥 Health Check                                │
│  ─────────────────────────────────────────────  │
│                                                 │
│  ✅ Claude Code v2.1.0 installed                │
│  ✅ Settings files valid                        │
│  ⚠️  Marketplace "tianzecn-plugins" slow (3.2s) │
│  ✅ All 8 enabled plugins intact                │
│  ❌ MCP server "postgres" unreachable           │
│  ✅ All dependencies satisfied                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│  Overall: ⚠️ 1 warning, 1 error                 │
│                                                 │
│  [r] Re-run  [f] Fix issues  [e] Export report  │
└─────────────────────────────────────────────────┘
```

**Auto-Fix** (`f` key):
- Remove orphaned plugin references
- Rebuild corrupted caches
- Show manual fix steps (e.g., MCP configuration)

**Implementation**:
- New file: `src/ui/screens/health.ts`
- New file: `src/services/health-checker.ts`

### 3.2 Backup & Restore

**Trigger**:
- Press `b` in Health screen
- CLI: `claudeup backup` / `claudeup restore`

**Backup Schema**:
```yaml
claudeup-backup-2025-12-26.json:
  version: "1.0"
  timestamp: "2025-12-26T15:30:00Z"
  scope: "project"  # or "global"

  settings:
    enabledPlugins: { ... }
    installedPluginVersions: { ... }

  marketplaces:
    - name: "tianzecn-plugins"
      repo: "tianzecn/myclaudecode"

  mcpServers:
    - name: "chrome-devtools"
      config: { ... }

  statusLine:
    preset: "developer"
```

**Storage Location**:
```
~/.claude/backups/
├── claudeup-backup-2025-12-26-global.json
├── claudeup-backup-2025-12-25-project-myapp.json
└── ...
```

**UI Mockup**:
```
┌─ Backup & Restore ─────────────────────────────┐
│                                                │
│  📦 Backup                                     │
│  ────────────────────────────────────          │
│  Scope: ○ Project  ● Global                    │
│  Include: ☑ Plugins ☑ MCP ☑ StatusLine        │
│                                                │
│  [b] Create Backup                             │
│                                                │
│  📥 Restore                                    │
│  ────────────────────────────────────          │
│  Recent backups:                               │
│  > 2025-12-26 15:30 (Global, 12 plugins)      │
│    2025-12-25 10:00 (Project, 8 plugins)      │
│    2025-12-20 09:15 (Global, 10 plugins)      │
│                                                │
│  [r] Restore Selected  [d] Delete  [i] Import  │
└────────────────────────────────────────────────┘
```

**Keyboard Shortcuts**:
- `b` - Create backup
- `r` - Restore selected
- `d` - Delete backup
- `e` - Export to custom path
- `i` - Import from file

### 3.3 Batch Operations

**Multi-Select Mode**:
- `v` - Enter/exit batch select mode
- `Space` - Toggle selection on current item
- `a` - Select all visible
- `A` - Deselect all

**UI Changes**:
```
┌─ [PROJECT] Marketplaces & Plugins ─────────────┐
│ 🔍 Search...              [3 selected]         │
│ ─────────────────────────────────────────────  │
│ ▼ ✓ MadAppGang Plugins (5)                     │
│   ☑  ● frontend v3.13.0           ← selected   │
│   ☐  ● code-analysis v2.6.0                    │
│   ☑  ○ bun v1.5.2                 ← selected   │
│   ☑  ○ orchestration v0.6.0       ← selected   │
│   ☐  ○ agentdev v1.1.0                         │
└────────────────────────────────────────────────┘

┌─ Batch Actions ────────────────────────────────┐
│ 3 plugins selected                             │
│                                                │
│ [e] Enable All   [d] Disable All               │
│ [u] Update All   [x] Uninstall All             │
│ [Esc] Cancel                                   │
└────────────────────────────────────────────────┘
```

**Batch Operations**:
| Key | Action | Confirmation |
|-----|--------|--------------|
| `e` | Enable all | No |
| `d` | Disable all | No |
| `u` | Update all | No |
| `x` | Uninstall all | **Yes** |

**Implementation**:
- Modify: `src/ui/screens/plugins.ts` - Multi-select state
- New file: `src/ui/components/batch-actions.ts`

---

## Implementation Roadmap

### Priority Matrix

| Feature | Priority | Effort | Dependencies |
|---------|----------|--------|--------------|
| 1.1 Search | ⭐⭐⭐ High | Small | None |
| 1.2 Categories | ⭐⭐ Medium | Medium | marketplace.json schema |
| 2.1 Tabbed Panel | ⭐⭐⭐ High | Medium | None |
| 2.2 README Display | ⭐⭐ Medium | Medium | marked-terminal |
| 2.3 Changelog | ⭐⭐ Medium | Medium | GitHub API |
| 3.1 Health Check | ⭐⭐⭐ High | Large | None |
| 3.2 Backup/Restore | ⭐⭐ Medium | Medium | None |
| 3.3 Batch Operations | ⭐⭐ Medium | Medium | None |

### Suggested Order

```
Sprint 1 (Week 1-2):
├── 1.1 Search functionality
└── 2.1 Tabbed detail panel

Sprint 2 (Week 3-4):
├── 3.1 Health check screen
└── 3.3 Batch operations

Sprint 3 (Week 5-6):
├── 1.2 Category & tag filtering
├── 2.2 README display
└── 2.3 Changelog display

Sprint 4 (Week 7-8):
└── 3.2 Backup & restore
```

---

## File Structure Changes

```
src/
├── ui/
│   ├── screens/
│   │   ├── plugins.ts        # Modified: search, filter, batch
│   │   └── health.ts         # NEW: health check screen
│   └── components/
│       ├── search-box.ts     # NEW: reusable search component
│       ├── filter-panel.ts   # NEW: category/tag filter
│       ├── tabbed-panel.ts   # NEW: tabbed detail panel
│       ├── batch-actions.ts  # NEW: batch operation panel
│       └── backup-panel.ts   # NEW: backup/restore UI
├── services/
│   ├── plugin-docs.ts        # NEW: README/changelog fetching
│   ├── health-checker.ts     # NEW: health check logic
│   └── backup-manager.ts     # NEW: backup/restore logic
├── utils/
│   └── markdown-renderer.ts  # NEW: terminal markdown
└── types/
    └── plugin.ts             # NEW: category/tag types
```

---

## Dependencies

**New npm packages**:
- `marked-terminal` - Markdown rendering in terminal
- None others required (neo-blessed sufficient)

**External APIs**:
- GitHub Raw (for README fetching)
- GitHub Releases API (for changelogs)

---

## Open Questions

1. **Category ownership**: Should categories be defined per-marketplace or globally standardized?
2. **Backup encryption**: Should backups support optional encryption for sensitive MCP configs?
3. **Health check frequency**: Auto-run on startup or manual only?

---

## Appendix: Keyboard Shortcut Summary

| Context | Key | Action |
|---------|-----|--------|
| Global | `1-6` | Switch tabs |
| Global | `?` | Show help |
| Global | `q` / `Esc` | Back / Quit |
| Plugins | `/` | Search |
| Plugins | `f` | Filter panel |
| Plugins | `c` | Clear filters |
| Plugins | `v` | Batch select mode |
| Plugins | `Space` | Toggle selection |
| Detail | `Tab` | Switch detail tab |
| Detail | `1` `2` `3` | Quick tab jump |
| Detail | `j` / `k` | Scroll content |
| Health | `r` | Re-run checks |
| Health | `f` | Auto-fix |
| Health | `b` | Backup panel |
| Backup | `b` | Create backup |
| Backup | `r` | Restore |
| Backup | `e` | Export |
| Backup | `i` | Import |
