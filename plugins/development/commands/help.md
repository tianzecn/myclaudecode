---
description: Show comprehensive help for the Agent Development Plugin - lists agents, commands, skills, and usage examples
allowed-tools: Read
---

# Agent Development Plugin Help

Present the following help information to the user:

---

## Agent Development Plugin v1.3.0

**Create, implement, and review Claude Code agents and commands with multi-model validation and intelligent plugin classification.**

### Quick Start

```bash
# 创建新命令（智能分类到正确插件）
/agentdev:创建命令 代码审查 - 审查代码质量和规范

# 发布插件到市场
/agentdev:发布 frontend

# 完整的 Agent 开发流程
/agentdev:develop Design a GraphQL code reviewer agent
```

---

## Agents (3)

| Agent | Description | Model |
|-------|-------------|-------|
| **architect** | Designs agent/command architecture, creates comprehensive design plans | Sonnet |
| **developer** | Implements agents/commands from approved design plans | Sonnet |
| **reviewer** | Reviews implemented agents for quality, completeness, standards compliance | Sonnet |

---

## Commands (4)

| Command | Description |
|---------|-------------|
| **/agentdev:develop** | Full-cycle agent development: design → plan review → implement → quality review |
| **/agentdev:创建命令** | Interactive slash command creation with intelligent plugin classification |
| **/agentdev:发布** | Publish plugin to marketplace - updates versions, creates Git Tag, pushes |
| **/agentdev:help** | Show this help |

### /创建命令 Workflow (v1.2.0+)

1. **需求收集** - Parse command name and description from user input
2. **智能插件分类** - Scan all plugins, analyze command category, recommend target plugin
3. **生成命令文件** - Create command file with Chinese XML tags
4. **注册命令** - Add command to plugin.json
5. **可选发布** - Option to immediately publish to marketplace

### /发布 Workflow (v1.3.0+)

1. **确定发布目标** - Select plugin and version type (major/minor/patch)
2. **检查发布条件** - Verify git status and plugin structure
3. **更新版本号** - Update plugin.json and marketplace.json
4. **提交和标签** - Create commit and Git Tag
5. **推送发布** - Push to GitHub with tags

### /develop Workflow

1. **Design Phase** - Architect creates comprehensive design plan
2. **Plan Review** - Multi-model validation of architecture (Grok, Gemini, etc.)
3. **Implementation** - Developer builds the agent from approved plan
4. **Quality Review** - Reviewer validates against standards

### Examples

```bash
# 创建命令并自动分类到正确插件
/agentdev:创建命令 组件文档 - 自动生成 React 组件的使用文档

# 发布插件（默认 minor 版本）
/agentdev:发布 frontend

# 发布补丁版本
/agentdev:发布 bun patch

# 完整 Agent 开发
/agentdev:develop Create a database migration reviewer agent
```

---

## Skills (3)

| Skill | Description |
|-------|-------------|
| **xml-standards** | XML tag structure patterns following Anthropic best practices |
| **patterns** | Common agent patterns: proxy mode, TodoWrite integration, quality checks |
| **schemas** | YAML frontmatter schemas for agent/command files |

---

## Agent File Structure

```yaml
---
name: my-agent
description: When to use this agent with examples
model: sonnet  # or opus, haiku
color: blue
tools: TodoWrite, Read, Write, Edit, Bash
---

# Agent Instructions

[System prompt and instructions here]
```

---

## Key Patterns

### Proxy Mode
Allows agents to delegate to external AI models:
```
PROXY_MODE: x-ai/grok-code-fast-1
[actual task here]
```

### TodoWrite Integration
Agents should track progress:
```markdown
1. Create todo list at start
2. Mark tasks in_progress when starting
3. Mark completed immediately when done
```

### Quality Checks
- YAML frontmatter validation
- XML structure compliance
- Description with examples
- Tool permissions

---

## LLM Performance Tracking

Tracks external model performance to `ai-docs/llm-performance.json`:
- Plan review execution times
- Quality review scores
- Model reliability metrics

---

## Dependencies

Requires orchestration plugin:
```json
{
  "dependencies": {
    "orchestration@tianzecn-plugins": "^0.2.0"
  }
}
```

---

## Installation

```bash
# Add marketplace (one-time)
/plugin marketplace add tianzecn/myclaudecode

# Install plugin
/plugin install agentdev@tianzecn-plugins
```

**Note**: Automatically installs orchestration plugin as dependency.

---

## More Info

- **Repo**: https://github.com/tianzecn/myclaudecode
- **Author**: tianzecn @ tianzecn
