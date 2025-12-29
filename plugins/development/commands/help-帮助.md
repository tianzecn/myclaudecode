---
description: 显示 Agent Development Plugin 的综合帮助信息 - 列出 Agent、命令、技能和使用示例
allowed-tools: Read
---

# Agent Development Plugin 帮助

向用户呈现以下帮助信息：

---

## Agent Development Plugin v1.3.0

**创建、实现和审查 Claude Code Agent 和命令，包含多模型验证和智能插件分类。**

### 快速开始

```bash
# 创建新命令（智能分类到正确插件）
/agentdev:创建命令 代码审查 - 审查代码质量和规范

# 发布插件到市场
/agentdev:发布 frontend

# 完整的 Agent 开发流程
/agentdev:develop Design a GraphQL code reviewer agent
```

---

## Agent（3 个）

| Agent | 描述 | 模型 |
|-------|------|------|
| **architect** | 设计 Agent/Command 架构，创建全面的设计计划 | Sonnet |
| **developer** | 根据批准的设计计划实现 Agent/Command | Sonnet |
| **reviewer** | 审查已实现的 Agent 的质量、完整性和标准合规性 | Sonnet |

---

## 命令（4 个）

| 命令 | 描述 |
|------|------|
| **/agentdev:develop** | 完整的 Agent 开发：设计 → 计划审查 → 实现 → 质量审查 |
| **/agentdev:创建命令** | 交互式斜杠命令创建，包含智能插件分类 |
| **/agentdev:发布** | 发布插件到市场 - 更新版本、创建 Git Tag、推送 |
| **/agentdev:help** | 显示此帮助 |

### /创建命令 工作流（v1.2.0+）

1. **需求收集** - 从用户输入解析命令名称和描述
2. **智能插件分类** - 扫描所有插件，分析命令类别，推荐目标插件
3. **生成命令文件** - 使用中文 XML 标签创建命令文件
4. **注册命令** - 将命令添加到 plugin.json
5. **可选发布** - 选择立即发布到市场

### /发布 工作流（v1.3.0+）

1. **确定发布目标** - 选择插件和版本类型（major/minor/patch）
2. **检查发布条件** - 验证 git 状态和插件结构
3. **更新版本号** - 更新 plugin.json 和 marketplace.json
4. **提交和标签** - 创建提交和 Git Tag
5. **推送发布** - 推送到 GitHub 并带上标签

### /develop 工作流

1. **设计阶段** - Architect 创建全面的设计计划
2. **计划审查** - 架构的多模型验证（Grok、Gemini 等）
3. **实现** - Developer 根据批准的计划构建 Agent
4. **质量审查** - Reviewer 根据标准验证

### 示例

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

## 技能（3 个）

| 技能 | 描述 |
|------|------|
| **xml-standards** | 遵循 Anthropic 最佳实践的 XML 标签结构模式 |
| **patterns** | 常见 Agent 模式：代理模式、TodoWrite 集成、质量检查 |
| **schemas** | Agent/Command 文件的 YAML frontmatter Schema |

---

## Agent 文件结构

```yaml
---
name: my-agent
description: 何时使用此 Agent 及示例
model: sonnet  # 或 opus、haiku
color: blue
tools: TodoWrite, Read, Write, Edit, Bash
---

# Agent 指令

[系统提示和指令在此处]
```

---

## 关键模式

### 代理模式
允许 Agent 委派给外部 AI 模型：
```
PROXY_MODE: x-ai/grok-code-fast-1
[实际任务在此处]
```

### TodoWrite 集成
Agent 应该跟踪进度：
```markdown
1. 开始时创建待办事项列表
2. 开始时标记任务为 in_progress
3. 完成后立即标记为 completed
```

### 质量检查
- YAML frontmatter 验证
- XML 结构合规性
- 包含示例的描述
- 工具权限

---

## LLM 性能跟踪

将外部模型性能跟踪到 `ai-docs/llm-performance.json`：
- 计划审查执行时间
- 质量审查得分
- 模型可靠性指标

---

## 依赖关系

需要 orchestration 插件：
```json
{
  "dependencies": {
    "orchestration@tianzecn-plugins": "^0.2.0"
  }
}
```

---

## 安装

```bash
# 添加市场（一次性）
/plugin marketplace add tianzecn/myclaudecode

# 安装插件
/plugin install agentdev@tianzecn-plugins
```

**注意**：自动安装 orchestration 插件作为依赖项。

---

## 更多信息

- **仓库**：https://github.com/tianzecn/myclaudecode
- **作者**：tianzecn @ tianzecn
