# Claude Code 插件市场开发者指南和接入流程

## 目录
1. [概述](#概述)
2. [快速入门](#快速入门)
3. [插件结构](#插件结构)
4. [插件组件详解](#插件组件详解)
5. [插件市场创建与分发](#插件市场创建与分发)
6. [安装和管理](#安装和管理)
7. [开发工作流](#开发工作流)
8. [常见问题和故障排除](#常见问题和故障排除)

---

## 概述

Claude Code 插件系统为开发者提供了一个强大的框架，用以通过自定义功能扩展 Claude Code 的核心能力。开发者可以创建、共享和分发插件，从而将个性化的工作流、自定义工具以及与外部服务的集成无缝地融入到 Claude Code 环境中。插件可以包含以下核心组件：

- **自定义命令（Commands）**：斜杠命令（/command）
- **代理（Agents）**：专门的子代理
- **技能（Skills）**：模型调用的能力扩展
- **钩子（Hooks）**：事件处理程序
- **MCP 服务器**：外部工具和服务集成
- **LSP 服务器**：语言服务器协议支持

插件可以在项目和团队中共享，通过插件市场进行集中管理和分发 [1]。

---

## 快速入门

### 前置条件

- 在机器上安装了 Claude Code [1]
- 对命令行工具的基本熟悉

### 创建您的第一个插件

本节将通过一个在5分钟内创建简单“问候”插件的示例，引导您完成从创建到测试的全过程，帮助您快速掌握插件开发的核心概念。

#### 1. 创建市场结构

```bash
mkdir test-marketplace
cd test-marketplace
```

#### 2. 创建插件目录

```bash
mkdir my-first-plugin
cd my-first-plugin
```

#### 3. 创建插件清单

创建 `.claude-plugin/plugin.json`：

```bash
mkdir .claude-plugin
cat > .claude-plugin/plugin.json << 'EOF'
{
  "name": "my-first-plugin",
  "description": "A simple greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
EOF
```

#### 4. 添加自定义命令

创建 `commands/hello.md`：

```bash
mkdir commands
cat > commands/hello.md << 'EOF'
---
description: Greet the user with a personalized message
---

# Hello Command

Greet the user warmly and ask how you can help them today. Make the greeting personal and encouraging.
EOF
```

#### 5. 创建市场清单

返回上级目录，创建 `marketplace.json`：

```bash
cd ..
mkdir .claude-plugin
cat > .claude-plugin/marketplace.json << 'EOF'
{
  "name": "test-marketplace",
  "owner": {
    "name": "Test User"
  },
  "plugins": [
    {
      "name": "my-first-plugin",
      "source": "./my-first-plugin",
      "description": "My first test plugin"
    }
  ]
}
EOF
```

#### 6. 安装并测试

```bash
cd ..
claude
/plugin marketplace add ./test-marketplace
/plugin install my-first-plugin@test-marketplace
```

选择"立即安装"，然后重启 Claude Code。

#### 7. 尝试新命令

```bash
/hello
```

---

## 插件结构

### 标准插件目录结构

一个标准的 Claude Code 插件遵循以下目录结构。这种结构有助于保持代码的组织性和可维护性，同时也便于 Claude Code 系统的自动发现和加载 [2]。

```
my-first-plugin/
├── .claude-plugin/
│   └── plugin.json          # 插件元数据（必需）
├── commands/                 # 自定义斜杠命令（可选）
│   └── hello.md
├── agents/                   # 自定义代理（可选）
│   └── helper.md
├── skills/                   # 代理技能（可选）
│   └── my-skill/
│       └── SKILL.md
├── hooks/                    # 事件处理程序（可选）
│   └── hooks.json
├── .mcp.json                 # MCP 服务器配置（可选）
└── .lsp.json                 # LSP 服务器配置（可选）
```

### 插件清单（plugin.json）

**必需字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 插件标识符（kebab-case，无空格） |
| `description` | string | 插件描述 |
| `version` | string | 语义版本号（如 1.0.0） |

**可选字段：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `author` | object | 作者信息（name 必需，email 可选） |
| `homepage` | string | 插件主页或文档 URL |
| `repository` | string | 代码仓库 URL |
| `license` | string | 许可证类型 |

---

## 插件核心组件详解

插件的强大功能源于其模块化的组件设计。开发者可以通过组合不同的组件，构建出功能丰富的插件。本节将详细介绍每种核心组件的用途、配置方法和集成方式 [2]。

### 1. 自定义命令（Commands）

**位置：** `commands/` 目录

**文件格式：** Markdown 文件，包含 frontmatter

**示例：** `commands/analyze.md`

```markdown
---
description: Analyze code for potential improvements
---

# Analyze Command

Analyze the selected code or recent changes for:
- Code quality issues
- Performance bottlenecks
- Maintainability concerns
- Best practice violations

Provide specific, actionable recommendations.
```

**特点：**
- 命令自动注册为斜杠命令（`/analyze`）
- Claude 根据 frontmatter 和内容理解命令的作用
- 可以在命令中使用自然语言指令

### 2. 代理（Agents）

**位置：** `agents/` 目录

**文件格式：** Markdown 文件，描述代理能力

**示例：** `agents/code-reviewer.md`

```markdown
---
description: Specialized code review agent
capabilities: ["security-review", "performance-review", "style-check"]
---

# Code Reviewer Agent

This agent specializes in comprehensive code reviews.

## Capabilities
- Security vulnerability detection
- Performance optimization suggestions
- Code style and best practices

## When to use
Invoke this agent when you need thorough code review across multiple dimensions.
```

**特点：**
- Claude 可根据任务上下文自动调用代理
- 用户也可手动通过 `/agents` 菜单调用
- 代理与内置 Claude 代理并行工作

### 3. 技能（Skills）

**位置：** `skills/` 目录

**文件格式：** 包含 `SKILL.md` 的目录

**示例结构：**

```
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (可选)
│   └── scripts/ (可选)
└── code-reviewer/
    └── SKILL.md
```

**SKILL.md 示例：**

```markdown
---
name: PDF Processor
description: Process and extract information from PDF files
---

# PDF Processor Skill

This skill enables Claude to:
- Extract text from PDFs
- Analyze PDF structure
- Convert PDFs to other formats

## Usage
Claude autonomously invokes this skill when processing PDF files.
```

**特点：**
- 插件安装时自动发现
- Claude 根据任务上下文自主调用
- 可包含支持文件（脚本、参考文档等）

### 4. 钩子（Hooks）

**位置：** `hooks/hooks.json` 或 `plugin.json` 内联

**可用事件：**

| 事件 | 说明 |
|------|------|
| `PreToolUse` | Claude 使用任何工具前 |
| `PostToolUse` | Claude 成功使用工具后 |
| `PostToolUseFailure` | Claude 工具执行失败后 |
| `PermissionRequest` | 权限对话框显示时 |
| `UserPromptSubmit` | 用户提交提示时 |
| `Notification` | Claude Code 发送通知时 |
| `SessionStart` | 会话开始时 |
| `SessionEnd` | 会话结束时 |
| `SubagentStart` | 子代理启动时 |
| `SubagentStop` | 子代理停止时 |

**钩子类型：**

- **command**：执行 shell 命令或脚本
- **prompt**：使用 LLM 评估提示
- **agent**：运行代理验证器

**示例：** `hooks/hooks.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

### 5. MCP 服务器

**位置：** `.mcp.json` 或 `plugin.json` 内联

**用途：** 连接外部工具、数据库、API 等

**示例：** `.mcp.json`

```json
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

**特点：**
- 插件启用时自动启动
- 集成为标准 MCP 工具
- 可独立于用户 MCP 服务器配置

### 6. LSP 服务器

**位置：** `.lsp.json` 或 `plugin.json` 内联

**用途：** 提供语言服务器协议支持

**示例：** `.lsp.json`

```json
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

**优势：**
- 即时诊断：编辑后立即看到错误和警告
- 代码导航：跳转定义、查找引用、悬停信息
- 语言感知：类型信息和符号文档

---

## 插件市场创建与分发

### 插件市场：分发与共享的枢纽

插件市场是连接开发者与用户的桥梁，它提供了一个集中的平台，用于发布、发现、安装和管理插件。通过创建自己的市场，开发者可以与团队或社区共享工具，确保工作流的一致性，并实现自动化更新 [3]。

插件市场是一个目录，允许你分发插件给他人。市场提供：

- 集中发现
- 版本跟踪
- 自动更新
- 多源支持（Git 仓库、本地路径等）

### 创建市场文件

在仓库根目录创建 `.claude-plugin/marketplace.json`：

```json
{
  "name": "company-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "devtools@example.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": {
        "name": "DevTools Team"
      }
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deploy-plugin"
      },
      "description": "Deployment automation tools"
    }
  ]
}
```

### 市场清单架构

**必需字段：**

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `name` | string | 市场标识符（kebab-case） | `"acme-tools"` |
| `owner` | object | 维护者信息 | 见下表 |
| `plugins` | array | 可用插件列表 | 见下表 |

**所有者字段：**

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 维护者或团队名称 |
| `email` | string | 否 | 维护者联系邮箱 |

**可选元数据：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `metadata.description` | string | 市场简介 |
| `metadata.version` | string | 市场版本 |
| `metadata.pluginRoot` | string | 相对路径的基目录 |

**保留名称：** 以下名称被 Anthropic 保留，不能使用：
- claude-code-marketplace
- claude-code-plugins
- claude-plugins-official
- anthropic-marketplace
- anthropic-plugins
- agent-skills
- life-sciences

### 插件源类型

#### 相对路径

```json
{
  "name": "formatter",
  "source": "./plugins/formatter",
  "description": "Code formatter"
}
```

#### GitHub 仓库

```json
{
  "name": "deploy-tools",
  "source": {
    "source": "github",
    "repo": "company/deploy-plugin"
  },
  "description": "Deployment tools"
}
```

#### Git 仓库

```json
{
  "name": "custom-tools",
  "source": {
    "source": "git",
    "url": "https://git.company.com/tools/custom-plugin.git"
  },
  "description": "Custom tools"
}
```

### 市场托管和分发

#### 推荐：在 GitHub 上托管

1. **创建 GitHub 仓库**
   - 创建新仓库（如 `claude-plugins`）
   - 推送包含 `.claude-plugin/marketplace.json` 的代码

2. **用户添加市场**
   ```bash
   /plugin marketplace add your-org/claude-plugins
   ```

3. **更新市场**
   - 推送更改到仓库
   - 用户运行 `/plugin marketplace update` 刷新

#### 其他 Git 服务

支持 GitLab、Gitea 等任何 Git 服务：

```bash
/plugin marketplace add https://gitlab.com/your-org/claude-plugins
```

### 本地测试

开发时使用本地市场进行迭代测试：

```bash
mkdir dev-marketplace
cd dev-marketplace
mkdir .claude-plugin
cat > .claude-plugin/marketplace.json << 'EOF'
{
  "name": "dev-marketplace",
  "owner": {
    "name": "Developer"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./my-plugin",
      "description": "My plugin"
    }
  ]
}
EOF

# 从父目录启动 Claude Code
cd ..
claude

# 添加本地市场
/plugin marketplace add ./dev-marketplace

# 安装插件
/plugin install my-plugin@dev-marketplace
```

### 团队市场配置

在仓库级别配置插件以确保团队一致性。当团队成员信任仓库文件夹时，Claude Code 自动安装指定的市场和插件。

**配置文件：** `.claude/settings.json`

```json
{
  "plugins": {
    "marketplaces": [
      {
        "source": "your-org/claude-plugins"
      }
    ],
    "installed": [
      {
        "name": "code-formatter",
        "marketplace": "your-org/claude-plugins"
      }
    ]
  }
}
```

**工作流程：**
1. 管理员在仓库中配置市场和插件
2. 团队成员首次克隆时信任文件夹
3. Claude Code 自动安装指定的市场和插件
4. 所有团队成员保持同步

---

## 插件的安装与生命周期管理

本节将介绍如何发现、安装、更新和卸载插件，以及如何通过团队配置实现插件的自动化管理，从而确保开发环境的一致性和高效性 [1]。

### 添加市场

```bash
# 通过 GitHub 仓库
/plugin marketplace add your-org/claude-plugins

# 通过完整 URL
/plugin marketplace add https://github.com/your-org/claude-plugins

# 通过本地路径
/plugin marketplace add ./my-marketplace
```

### 浏览和安装插件

#### 交互式菜单（推荐用于发现）

```bash
/plugin
```

选择"浏览插件"查看可用选项、描述、功能和安装选项。

#### 直接命令（快速安装）

```bash
# 安装特定插件
/plugin install formatter@your-org

# 启用已禁用的插件
/plugin enable plugin-name@marketplace-name

# 禁用而不卸载
/plugin disable plugin-name@marketplace-name

# 完全删除插件
/plugin uninstall plugin-name@marketplace-name

# 更新插件
/plugin update plugin-name@marketplace-name
```

### 验证安装

安装插件后：

1. **检查可用命令**
   ```bash
   /help
   ```

2. **测试插件功能**
   - 尝试插件的命令和功能

3. **查看插件详情**
   ```bash
   /plugin → "管理插件"
   ```

### 更新市场

```bash
/plugin marketplace update
```

用户可以手动刷新本地市场副本以获取最新插件。

---

## 高效的插件开发工作流

一个高效的开发工作流是确保插件质量和迭代速度的关键。本节将介绍从本地测试、复杂插件的组织，到环境变量的使用等一系列最佳实践，帮助开发者构建稳定、可维护的插件 [2]。

### 本地开发和测试

#### 1. 设置开发结构

```bash
mkdir dev-marketplace
cd dev-marketplace
mkdir .claude-plugin
mkdir my-plugin
```

#### 2. 创建市场清单

```bash
cat > .claude-plugin/marketplace.json << 'EOF'
{
  "name": "dev-marketplace",
  "owner": {
    "name": "Developer"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./my-plugin",
      "description": "My plugin"
    }
  ]
}
EOF
```

#### 3. 开发插件

在 `my-plugin/` 目录中添加：
- `.claude-plugin/plugin.json`
- `commands/` 目录（可选）
- `agents/` 目录（可选）
- `skills/` 目录（可选）
- `hooks/hooks.json`（可选）
- `.mcp.json`（可选）
- `.lsp.json`（可选）

#### 4. 本地测试

```bash
cd ..
claude

# 添加本地市场
/plugin marketplace add ./dev-marketplace

# 安装插件
/plugin install my-plugin@dev-marketplace

# 重启 Claude Code
# 测试插件功能
```

#### 5. 迭代开发

修改插件后：
1. 重启 Claude Code
2. 运行 `/plugin update my-plugin@dev-marketplace`
3. 测试更改

### 复杂插件开发

#### 添加技能

在插件根目录创建 `skills/` 目录：

```
my-plugin/
├── .claude-plugin/plugin.json
├── commands/
├── agents/
└── skills/
    ├── text-analyzer/
    │   ├── SKILL.md
    │   ├── reference.md
    │   └── scripts/
    └── image-processor/
        └── SKILL.md
```

#### 组织复杂插件

按功能组织目录结构：

```
my-plugin/
├── .claude-plugin/plugin.json
├── commands/
│   ├── analyze.md
│   └── report.md
├── agents/
│   ├── analyzer.md
│   └── reporter.md
├── skills/
│   ├── text-analysis/
│   └── report-generation/
├── hooks/
│   └── hooks.json
├── scripts/
│   ├── format.sh
│   └── validate.sh
└── config/
    └── settings.json
```

### 环境变量

插件可以访问以下环境变量：

| 变量 | 说明 |
|------|------|
| `${CLAUDE_PLUGIN_ROOT}` | 插件根目录的绝对路径 |
| `${CLAUDE_CODE_VERSION}` | Claude Code 版本 |
| `${CLAUDE_CODE_HOME}` | Claude Code 主目录 |

**示例：** 在 MCP 配置中使用

```json
{
  "mcpServers": {
    "plugin-db": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    }
  }
}
```

---

## 常见问题与故障排查

在插件开发和市场管理过程中，可能会遇到各种问题。本节汇总了最常见的问题及其解决方案，涵盖市场加载、插件安装、文件解析和调试技巧，旨在帮助开发者快速定位并解决问题 [3]。

### 插件市场问题

#### 市场不加载

**症状：** 添加市场后无法看到插件

**解决方案：**
1. 验证市场 URL 或路径正确
2. 检查 `.claude-plugin/marketplace.json` 文件存在
3. 验证 JSON 语法正确
4. 运行 `/plugin marketplace update`

#### 市场验证错误

**症状：** 收到"无效市场"错误

**常见原因：**
- 缺少必需字段（name、owner、plugins）
- 使用了保留的市场名称
- 插件源路径不正确
- JSON 格式错误

**检查清单：**
```json
{
  "name": "kebab-case-name",  // 必需，kebab-case
  "owner": {
    "name": "Your Name"       // 必需
  },
  "plugins": [                // 必需，至少一个
    {
      "name": "plugin-name",  // 必需
      "source": "./path"      // 必需
    }
  ]
}
```

### 插件安装问题

#### 插件安装失败

**症状：** `/plugin install` 命令失败

**常见原因：**
- 市场未正确添加
- 插件名称或市场名称错误
- 源路径不存在
- 权限问题

**调试步骤：**
1. 确认市场已添加：`/plugin marketplace list`
2. 验证插件名称：`/plugin browse`
3. 检查本地路径权限
4. 查看 Claude Code 日志

#### 文件找不到

**症状：** 插件安装后文件不可用

**原因：** 插件缓存机制

插件安装时，Claude Code 将插件目录复制到缓存位置。插件不能使用相对路径引用目录外的文件（如 `../shared-utils`）。

**解决方案：**
1. 使用符号链接（复制时会跟随）
2. 重组市场结构，使共享目录在插件源路径内
3. 参考 [插件缓存和文件解析](#插件缓存和文件解析)

### 插件缓存和文件解析

#### 缓存工作原理

1. 用户安装插件时，Claude Code 从源复制插件目录
2. 复制到本地缓存位置
3. 插件从缓存位置运行
4. 更新时重新复制

#### 路径遍历限制

插件不能访问其目录外的文件：

```
❌ 不可行：
my-plugin/
└── scripts/
    └── main.sh  # 不能访问 ../../shared-utils/helper.sh

✅ 可行方案：
my-plugin/
├── scripts/
│   └── main.sh
└── utils/
    └── helper.sh  # 在插件目录内
```

#### 处理外部依赖

**方案 1：使用符号链接**

```bash
ln -s ../../shared-utils my-plugin/utils
```

复制时会跟随符号链接。

**方案 2：重组市场结构**

```
marketplace/
├── .claude-plugin/marketplace.json
├── shared/
│   └── utils.sh
└── plugins/
    ├── plugin-a/
    │   ├── .claude-plugin/plugin.json
    │   └── scripts/
    └── plugin-b/
        ├── .claude-plugin/plugin.json
        └── scripts/
```

在 marketplace.json 中：
```json
{
  "metadata": {
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "plugin-a",
      "source": "plugin-a"
    }
  ]
}
```

### 调试插件

#### 启用调试日志

```bash
# 启用详细日志
CLAUDE_DEBUG=1 claude

# 查看特定组件日志
CLAUDE_DEBUG_PLUGINS=1 claude
```

#### 常见错误消息

| 错误 | 原因 | 解决方案 |
|------|------|--------|
| `Plugin not found` | 插件未安装或名称错误 | 检查 `/plugin list` |
| `Invalid manifest` | plugin.json 格式错误 | 验证 JSON 语法 |
| `Command not found` | 命令未正确注册 | 重启 Claude Code |
| `Permission denied` | 脚本权限不足 | 运行 `chmod +x` |

#### 钩子故障排除

**钩子未触发：**
1. 验证事件名称正确
2. 检查匹配器正则表达式
3. 查看钩子日志
4. 确保钩子命令可执行

**MCP 服务器故障排除：**
1. 验证命令在 PATH 中
2. 检查服务器启动日志
3. 测试服务器独立运行
4. 验证环境变量设置

**目录结构错误：**

常见错误：
- 插件清单不在 `.claude-plugin/plugin.json`
- 命令不在 `commands/` 目录
- 技能不在 `skills/` 目录
- 钩子配置文件名错误

---

## 最佳实践

### 插件开发

1. **命名规范**
   - 使用 kebab-case（如 `code-formatter`）
   - 避免空格和特殊字符
   - 名称应该描述功能

2. **版本管理**
   - 使用语义版本（MAJOR.MINOR.PATCH）
   - 记录更改日志
   - 向后兼容性

3. **文档**
   - 提供清晰的插件描述
   - 包含使用示例
   - 记录所有命令和功能

4. **测试**
   - 本地测试所有功能
   - 测试错误处理
   - 验证权限和访问

### 市场管理

1. **组织**
   - 按功能分类插件
   - 使用一致的命名
   - 维护清晰的结构

2. **维护**
   - 定期更新插件
   - 修复报告的问题
   - 保持文档最新

3. **安全**
   - 验证插件来源
   - 检查权限和访问
   - 避免敏感信息泄露

4. **分发**
   - 使用 GitHub 托管
   - 提供清晰的安装说明
   - 支持多个版本

---

## 参考资源

- [Claude Code 官方文档](https://code.claude.com/docs)
- [插件参考](https://code.claude.com/docs/en/plugins-reference)
- [插件市场文档](https://code.claude.com/docs/en/plugin-marketplaces)
- [Agent Skills 指南](https://code.claude.com/docs/en/agent-skills)
- [MCP 文档](https://code.claude.com/docs/en/model-context-protocol)

---

## 总结

Claude Code 插件系统提供了强大的扩展机制，允许开发者：

1. **创建自定义功能**：命令、代理、技能、钩子等
2. **集成外部工具**：通过 MCP 和 LSP 服务器
3. **共享和分发**：通过插件市场
4. **团队协作**：通过团队市场配置

通过遵循本指南中的最佳实践和工作流，开发者可以快速创建、测试、发布和维护高质量的 Claude Code 插件，从而极大地提升个人和团队的开发效率。


---

## 参考文献

[1] [Claude Code - 插件](https://code.claude.com/docs/zh-CN/plugins)
[2] [Claude Code - 插件参考](https://code.claude.com/docs/en/plugins-reference)
[3] [Claude Code - 创建和分发插件市场](https://code.claude.com/docs/en/plugin-marketplaces)
