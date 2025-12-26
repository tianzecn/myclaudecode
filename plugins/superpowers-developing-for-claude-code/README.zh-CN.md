# Superpowers: Developing for Claude Code 中文指南

> Claude Code 插件开发完全指南 - 包含官方文档、开发工作流和实战案例

## 📦 插件概述

这个插件是 Claude Code 插件开发者的**终极武器**！它包含：

- **42 个官方文档文件** - 直接从 docs.claude.com 抓取的完整文档
- **插件开发工作流** - 从零到发布的完整流程
- **示例插件** - 可直接参考的工作代码
- **故障排查指南** - 常见问题的解决方案

---

## 🎯 两个核心技能

### 技能 1: `working-with-claude-code`

**用途：** 当你需要查阅 Claude Code 官方文档时使用

**适用场景：**
- 创建或配置 Claude Code 插件
- 设置 MCP 服务器
- 配置 Hooks（钩子）
- 编写 Skills（技能）
- 配置 Claude Code 设置
- 排查 Claude Code 问题
- 了解 CLI 命令
- 设置集成（VS Code、JetBrains 等）

**包含的文档（42个）：**

| 类别 | 文档 |
|------|------|
| **入门** | overview.md, quickstart.md, setup.md |
| **扩展开发** | plugins.md, plugins-reference.md, skills.md, slash-commands.md |
| **MCP/Hooks** | mcp.md, hooks.md, hooks-guide.md |
| **配置** | settings.md, model-config.md, terminal-config.md, network-config.md |
| **IDE 集成** | vs-code.md, jetbrains.md, devcontainer.md |
| **CI/CD** | github-actions.md, gitlab-ci-cd.md |
| **云平台** | amazon-bedrock.md, google-vertex-ai.md, llm-gateway.md |
| **运维** | costs.md, monitoring-usage.md, analytics.md |
| **安全** | security.md, iam.md, data-usage.md |
| **其他** | troubleshooting.md, migration-guide.md, memory.md 等 |

---

### 技能 2: `developing-claude-code-plugins`

**用途：** 当你需要创建、修改或发布 Claude Code 插件时使用

**适用场景：**
- 从零创建新插件
- 添加组件（skills, commands, hooks, MCP servers）
- 设置开发环境进行本地测试
- 排查插件结构问题
- 理解插件架构和模式
- 发布插件（版本管理、标签、marketplace 分发）

---

## 🚀 快速开始

### 场景 1：查询官方文档

```
你：我想知道如何配置 Claude Code 的 Hooks
Claude：让我查阅 hooks.md 和 hooks-guide.md...
```

Claude 会自动读取 `references/hooks.md` 和 `references/hooks-guide.md` 来回答你的问题。

### 场景 2：创建新插件

```
你：帮我创建一个 Claude Code 插件，功能是自动格式化代码
Claude：让我按照插件开发工作流来帮你...
```

Claude 会按照 `developing-claude-code-plugins` 技能中的工作流来指导你。

---

## 📁 插件目录结构

```
superpowers-developing-for-claude-code/
├── .claude-plugin/
│   ├── plugin.json              # 插件清单
│   └── marketplace.json         # 开发 marketplace
├── skills/
│   ├── working-with-claude-code/
│   │   ├── SKILL.md             # 文档访问技能
│   │   ├── scripts/
│   │   │   └── update_docs.js   # 文档更新脚本
│   │   └── references/          # 42 个官方文档文件
│   └── developing-claude-code-plugins/
│       ├── SKILL.md             # 插件开发技能
│       └── references/          # 开发参考文档
│           ├── plugin-structure.md
│           ├── common-patterns.md
│           ├── polyglot-hooks.md
│           └── troubleshooting.md
├── examples/
│   ├── simple-greeter-plugin/   # 简单示例插件
│   └── full-featured-plugin/    # 完整功能示例插件
└── README.md
```

---

## 📚 插件开发完整工作流

### 阶段 1：规划

1. **明确插件用途**
   - 解决什么问题？
   - 目标用户是谁？
   - 需要哪些组件？

2. **选择开发模式**
   - 简单插件（只有一个 skill）
   - MCP 集成插件
   - 命令集合插件
   - 全功能平台插件

### 阶段 2：创建结构

```bash
# 创建目录结构
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/skills
mkdir -p my-plugin/commands
mkdir -p my-plugin/hooks
```

**必需文件：`.claude-plugin/plugin.json`**

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "插件描述",
  "author": {
    "name": "你的名字",
    "email": "your@email.com"
  },
  "license": "MIT",
  "keywords": ["关键词1", "关键词2"]
}
```

### 阶段 3：添加组件

#### 添加 Skill（技能）

创建 `skills/my-skill/SKILL.md`：

```markdown
---
name: my-skill
description: 当用户需要 XXX 时使用 - 提供 YYY 功能
---

# 技能名称

## 概述

这个技能做什么（1-2句话）。

## 适用场景

- 场景 1
- 场景 2

## 工作流程

1. 第一步
2. 第二步
3. 第三步
```

#### 添加 Command（命令）

创建 `commands/my-command.md`：

```markdown
---
description: 命令的简短描述
---

# 命令说明

当用户运行 /my-command 时，Claude 应该：

1. 做这个
2. 做那个
3. 返回结果
```

#### 添加 Hook（钩子）

创建 `hooks/hooks.json`：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/format.sh\""
          }
        ]
      }
    ]
  }
}
```

**可用的 Hook 事件：**
- `PreToolUse` / `PostToolUse` - 工具使用前后
- `UserPromptSubmit` - 用户提交消息时
- `SessionStart` / `SessionEnd` - 会话开始/结束
- `Stop` / `SubagentStop` - 停止时
- `PreCompact` - 压缩前
- `Notification` - 通知

#### 添加 MCP Server

在 `plugin.json` 中添加：

```json
{
  "name": "my-plugin",
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/server/index.js"],
      "env": {
        "API_KEY": "${PLUGIN_ENV_API_KEY}"
      }
    }
  }
}
```

### 阶段 4：本地测试

```bash
# 添加开发 marketplace
/plugin marketplace add /path/to/my-plugin

# 安装插件
/plugin install my-plugin@my-plugin-dev

# 重启 Claude Code

# 测试功能...

# 卸载插件（修改后重新安装）
/plugin uninstall my-plugin@my-plugin-dev
```

### 阶段 5：发布

```bash
# 更新版本号
# 编辑 .claude-plugin/plugin.json 中的 version

# 提交和打标签
git add .
git commit -m "Release v1.0.0: 初始版本"
git tag v1.0.0
git push origin main
git push origin v1.0.0
```

---

## ⚠️ 重要规则

### 规则 1：`.claude-plugin/` 只放清单文件

```
❌ 错误：
.claude-plugin/
├── plugin.json
├── skills/          # 不要放这里！
└── commands/        # 不要放这里！

✅ 正确：
.claude-plugin/
├── plugin.json      # 只放清单
└── marketplace.json # 只放清单

skills/              # 放在插件根目录
commands/            # 放在插件根目录
```

### 规则 2：路径必须使用 `${CLAUDE_PLUGIN_ROOT}`

```json
❌ 错误：
{
  "command": "/Users/name/plugins/my-plugin/server.js"
}

✅ 正确：
{
  "command": "${CLAUDE_PLUGIN_ROOT}/server.js"
}
```

### 规则 3：脚本必须有执行权限

```bash
chmod +x scripts/helper.sh
chmod +x hooks/my-hook.sh
```

---

## 📝 实战案例

### 案例 1：创建代码格式化插件

**需求：** 每次保存文件后自动运行 Prettier 格式化

**步骤：**

1. 创建插件结构：
```bash
mkdir -p prettier-plugin/.claude-plugin
mkdir -p prettier-plugin/hooks
```

2. 创建 `plugin.json`：
```json
{
  "name": "auto-prettier",
  "version": "1.0.0",
  "description": "保存文件后自动运行 Prettier",
  "author": {"name": "你的名字"}
}
```

3. 创建 `hooks/hooks.json`：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATH\""
          }
        ]
      }
    ]
  }
}
```

---

### 案例 2：创建 API 文档查询技能

**需求：** 让 Claude 能够查询项目的 API 文档

**步骤：**

1. 创建插件结构：
```bash
mkdir -p api-docs-plugin/.claude-plugin
mkdir -p api-docs-plugin/skills/api-reference/references
```

2. 创建 `plugin.json`：
```json
{
  "name": "api-docs",
  "version": "1.0.0",
  "description": "项目 API 文档查询",
  "author": {"name": "你的名字"}
}
```

3. 创建 `skills/api-reference/SKILL.md`：
```markdown
---
name: api-reference
description: 当用户询问 API 用法、端点或参数时使用 - 提供项目 API 文档查询
---

# API 参考文档

## 概述

提供项目 API 的完整文档查询。

## 适用场景

- 用户询问某个 API 端点的用法
- 用户需要了解请求/响应格式
- 用户想知道某个功能对应的 API

## 使用方法

1. 查看 references/ 目录下的文档
2. 根据用户问题找到对应的 API 文档
3. 提供清晰的使用示例
```

4. 在 `references/` 中放入 API 文档文件。

---

### 案例 3：创建 Git 工作流命令

**需求：** 创建 `/git-sync` 命令，一键拉取、提交、推送

**步骤：**

1. 创建 `commands/git-sync.md`：
```markdown
---
description: 一键 Git 同步 - 拉取最新代码、提交更改、推送到远程
---

# Git 同步命令

当用户运行 /git-sync 时：

1. 检查当前是否有未提交的更改
2. 如果有更改：
   - 显示更改摘要
   - 询问用户是否继续
   - 提示用户输入提交信息
3. 执行以下 Git 操作：
   ```bash
   git pull origin main
   git add .
   git commit -m "用户提供的信息"
   git push origin main
   ```
4. 显示操作结果摘要
```

---

## 🔧 更新官方文档

这个插件包含自动更新脚本，可以从 docs.claude.com 获取最新文档：

```bash
node ~/.claude/plugins/plugin:superpowers-developing-for-claude-code@xxx/skills/working-with-claude-code/scripts/update_docs.js
```

或者直接问 Claude：
```
请更新 working-with-claude-code 技能中的 Claude Code 文档
```

---

## 🐛 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 插件没有加载 | 目录结构错误 | 检查 `.claude-plugin/plugin.json` 位置 |
| Skill 没有触发 | description 不匹配 | 优化技能的 description 字段 |
| Command 没有出现 | 文件位置错误 | 确保在 `commands/` 目录下 |
| Hook 没有执行 | 缺少执行权限 | `chmod +x` 给脚本添加权限 |
| MCP 服务器不启动 | 路径错误 | 使用 `${CLAUDE_PLUGIN_ROOT}` |
| 修改后没有生效 | 没有重启 | 重启 Claude Code |

---

## 📖 快速参考表

| 我想... | 读这个文档 |
|---------|-----------|
| 创建插件 | `plugins.md` → `plugins-reference.md` |
| 设置 MCP 服务器 | `mcp.md` |
| 配置 Hooks | `hooks.md` → `hooks-guide.md` |
| 编写 Skill | `skills.md` |
| 了解 CLI 命令 | `cli-reference.md` |
| 排查问题 | `troubleshooting.md` |
| 通用设置 | `settings.md` |

---

## 🎓 学习路径

1. **新手入门**
   - 阅读 `quickstart.md`
   - 查看 `examples/simple-greeter-plugin/`
   - 创建你的第一个简单插件

2. **进阶开发**
   - 阅读 `plugins.md` 和 `plugins-reference.md`
   - 学习 Hooks 和 MCP 集成
   - 查看 `examples/full-featured-plugin/`

3. **高级技巧**
   - 研究现有插件的实现
   - 阅读 `common-workflows.md`
   - 探索企业级功能（IAM、安全、网络配置）

---

## 📌 总结

**这个插件提供了 Claude Code 插件开发的一切所需：**

✅ 完整的官方文档（42个文件）
✅ 清晰的开发工作流
✅ 实用的示例代码
✅ 详细的故障排查指南

**记住核心原则：**
1. `.claude-plugin/` 只放清单文件
2. 路径使用 `${CLAUDE_PLUGIN_ROOT}`
3. 脚本要有执行权限
4. 修改后重启 Claude Code

---

*文档作者：tianzecn*
*原插件作者：Jesse Vincent*
*最后更新：2025年12月*
