---
description: Show comprehensive help for the Coding Plugin - displays commands, features, and usage examples
allowed-tools: Read
---

# Coding Plugin Help

Present the following help information to the user:

---

## Coding Plugin v1.0.0

**AI-powered requirement analysis and GitHub Issue creation.**

Automatically analyzes your project codebase, documentation, and configuration to generate structured, actionable GitHub Issues with technical recommendations and acceptance criteria.

---

## Commands (2)

| Command | Description |
|---------|-------------|
| **/coding:requirement** | Analyze project and create structured GitHub Issue from requirement description |
| **/coding:help** | Show this help |

---

## /requirement Workflow

### Phase 1: Project Context Analysis

1. **Read Documentation** - README, CHANGELOG, docs/, CONTRIBUTING
2. **Analyze Configuration** - package.json, tsconfig, docker, database configs
3. **Analyze Core Code** - Routes, models, services, components, state management

### Phase 2: Generate GitHub Issue

1. **Structure Content**:
   - Title (concise, max 50 chars)
   - Problem Description / Background
   - Expected Goal
   - Technical Solution Proposal
   - Acceptance Criteria
   - Related Resources

2. **Add Labels**: enhancement, bug, feature, priority, area

3. **Create Issue**: Using `gh` CLI

### Phase 3: Return Results

- Issue link (clickable URL)
- Issue number (#123)

---

## Usage Examples

### Feature Request

```bash
/coding:requirement Add user authentication with OAuth2 support
```

**Result**: Creates Issue #42 with:
- Technical analysis of existing auth patterns
- Database migration for OAuth tokens
- API endpoints specification
- Acceptance criteria with test cases

### Bug Report

```bash
/coding:requirement Users report login fails after 30 minutes
```

**Result**: Creates Issue #43 with:
- Root cause analysis
- Session timeout investigation
- Proposed fix with code references
- Timing-based acceptance criteria

### Feature Enhancement

```bash
/coding:requirement Implement dark mode for the dashboard
```

**Result**: Creates Issue with:
- UI component analysis
- CSS/theme architecture
- State management approach
- Visual acceptance criteria

---

## Prerequisites

1. **GitHub CLI (gh)**: Must be installed and authenticated

```bash
# Install
brew install gh

# Authenticate
gh auth login
```

2. **Git Repository**: Must be run inside a git repository with GitHub remote

---

## Issue Structure

```markdown
# [Type] Brief Description

## Problem Description / Requirement Background
[Why this is needed]

## Expected Goal
[Definition of done]

## Technical Solution Proposal

### Backend
[API, database, business logic]

### Frontend
[Components, state, UI]

### Tech Stack
[Detected technologies]

### Data Model
[Tables, fields, relationships]

## Acceptance Criteria
- [ ] Measurable criterion 1
- [ ] Measurable criterion 2

## Related Resources
[Documentation, code paths, links]
```

---

## Labels Applied

| Category | Labels |
|----------|--------|
| Type | `enhancement`, `bug`, `feature`, `documentation`, `refactor` |
| Priority | `priority: critical`, `priority: high`, `priority: medium`, `priority: low` |
| Area | `frontend`, `backend`, `database`, `infra`, `api` |

---

## Error Handling

| Scenario | Resolution |
|----------|------------|
| gh CLI not installed | Guide to install with `brew install gh` |
| Not authenticated | Guide to run `gh auth login` |
| Not in git repo | Inform user to run in git repository |
| No GitHub remote | Ask user to specify repository |
| Unclear requirements | Ask clarifying questions |

---

## Installation

```bash
# Add marketplace (one-time)
/plugin marketplace add tianzecn/myclaudecode

# Enable in project .claude/settings.json
{
  "enabledPlugins": {
    "coding@tianzecn-plugins": true
  }
}
```

---

## More Info

- **Repo**: https://github.com/tianzecn/myclaudecode
- **Author**: tianzecn
