# Claude Code Hooks 完整使用指南

> 本指南详细介绍了 Claude Code 中所有可用的 Hooks（钩子），包括用途说明、配置方法和使用示例。
> 共计 **39 个 Hooks**，分为 **10 个类别**

---

## 目录

1. [Hooks 概述](#hooks-概述)
2. [Hooks 分类总览](#hooks-分类总览)
3. [自动化类 (automation)](#自动化类-automation)
4. [开发工具类 (development-tools)](#开发工具类-development-tools)
5. [Git 版本控制类 (git)](#git-版本控制类-git)
6. [Git 工作流类 (git-workflow)](#git-工作流类-git-workflow)
7. [性能监控类 (performance)](#性能监控类-performance)
8. [工具后操作类 (post-tool)](#工具后操作类-post-tool)
9. [工具前操作类 (pre-tool)](#工具前操作类-pre-tool)
10. [安全类 (security)](#安全类-security)
11. [测试类 (testing)](#测试类-testing)
12. [如何启用 Hooks](#如何启用-hooks)
13. [快速查找表](#快速查找表)

---

## Hooks 概述

### 什么是 Hooks？

Hooks 是 Claude Code 的事件钩子系统，允许在特定事件发生时自动执行自定义命令。它们可以：

- **PreToolUse** - 在工具执行前运行（可阻止执行）
- **PostToolUse** - 在工具执行后运行
- **Stop** - 在 Claude Code 停止时运行
- **SubagentStop** - 在子代理完成时运行

### Hooks 的用途

1. **自动化** - 通知、部署、构建触发
2. **质量保证** - 代码格式化、lint 检查
3. **安全防护** - 文件保护、安全扫描
4. **工作流优化** - Git 操作自动化、备份

### Hooks 目录结构

```
~/.claude/hooks/
├── HOOKS-GUIDE.md           # 本指南
├── HOOK_PATTERNS_COMPRESSED.json
├── automation/              # 自动化通知
├── development-tools/       # 开发工具
├── git/                     # Git 版本控制
├── git-workflow/            # Git 工作流
├── performance/             # 性能监控
├── post-tool/               # 工具后操作
├── pre-tool/                # 工具前操作
├── security/                # 安全防护
└── testing/                 # 测试运行
```

---

## Hooks 分类总览

| 分类 | Hooks 数量 | 主要用途 |
|------|-----------|----------|
| automation | 16 | 通知、部署、自动化 |
| development-tools | 6 | 格式化、日志、备份 |
| git | 3 | 提交规范、分支保护 |
| git-workflow | 2 | Git 操作自动化 |
| performance | 2 | 性能监控 |
| post-tool | 4 | 工具执行后操作 |
| pre-tool | 3 | 工具执行前操作 |
| security | 2 | 安全扫描、文件保护 |
| testing | 1 | 自动测试运行 |
| **总计** | **39** | |

---

## 自动化类 (automation)

### agents-md-loader
**用途**：会话启动时自动加载 AGENTS.md 配置文件内容

**说明**：确保 Claude Code 遵循项目特定的 AI 助手行为配置。

---

### build-on-change
**用途**：检测源文件变化时自动触发构建流程

**说明**：支持常见的构建工具（npm、yarn、make 等）。

---

### dependency-checker
**用途**：高级依赖分析和安全检查

**功能**：
- 检测过期的包
- 安全漏洞扫描
- 许可证兼容性检查

---

### deployment-health-monitor
**用途**：监控部署状态、错误率和性能指标

**功能**：
- Vercel 部署健康监控
- 构建成功/失败率跟踪
- 部署失败或性能下降时发送通知

---

### discord-notifications
**用途**：Claude Code 完成工作时发送 Discord 通知

**配置要求**：
- 设置环境变量 `DISCORD_WEBHOOK_URL`
- 从 Discord 服务器设置 → 集成 → Webhooks 获取 URL

---

### discord-detailed-notifications
**用途**：发送详细的 Discord 通知

**通知内容**：
- 会话信息
- 工作目录
- 会话时长
- 系统信息

---

### discord-error-notifications
**用途**：Claude Code 遭遇长时间运行或工具耗时时发送 Discord 通知

**说明**：帮助监控生产力和捕捉问题。

---

### slack-notifications
**用途**：Claude Code 完成工作时发送 Slack 通知

**配置要求**：
- 设置环境变量 `SLACK_WEBHOOK_URL`
- 从 Slack App 设置 → Incoming Webhooks 获取 URL

---

### slack-detailed-notifications
**用途**：发送详细的 Slack 通知

**通知内容**：
- 会话信息
- 工作目录
- 会话时长
- 系统信息

---

### slack-error-notifications
**用途**：Claude Code 遭遇长时间运行或工具耗时时发送 Slack 通知

---

### telegram-notifications
**用途**：Claude Code 完成工作时发送 Telegram 通知

**配置要求**：
- 设置环境变量 `TELEGRAM_BOT_TOKEN`
- 设置环境变量 `TELEGRAM_CHAT_ID`

---

### telegram-detailed-notifications
**用途**：发送详细的 Telegram 通知

---

### telegram-error-notifications
**用途**：Claude Code 遭遇长时间运行或工具耗时时发送 Telegram 通知

---

### simple-notifications
**用途**：操作完成时发送简单的桌面通知

**支持系统**：macOS、Linux

---

### vercel-auto-deploy
**用途**：代码变更提交时自动触发 Vercel 部署

**功能**：
- 环境特定的部署策略
- 失败时自动回滚

---

### vercel-environment-sync
**用途**：同步本地开发和 Vercel 部署之间的环境变量

**说明**：确保所有环境的一致性。

---

## 开发工具类 (development-tools)

### change-tracker
**用途**：在简单日志中跟踪文件变更

**记录内容**：
- 哪些文件被修改
- 修改时间

---

### command-logger
**用途**：将所有 Claude Code 命令记录到文件中

**说明**：用于审计和调试。

---

### file-backup
**用途**：编辑文件前自动备份

**说明**：在 `.backups` 目录中创建带时间戳的备份。

---

### lint-on-save
**用途**：文件修改后自动运行 linting 工具

**支持工具**：
- ESLint（JavaScript/TypeScript）
- Pylint（Python）
- RuboCop（Ruby）

---

### nextjs-code-quality-enforcer
**用途**：强制 Next.js 最佳实践

**检查内容**：
- 正确的文件结构
- 组件模式
- TypeScript 使用
- 自动代码审查和建议

---

### smart-formatting
**用途**：基于文件类型的智能代码格式化

**支持工具**：
- Prettier（JS/TS/CSS/HTML）
- Black（Python）
- gofmt（Go）
- rustfmt（Rust）

---

## Git 版本控制类 (git)

### conventional-commits
**用途**：对所有 git 提交强制使用 Conventional Commit 消息格式

**验证格式**：`type(scope): description`

**支持的类型**：
- `feat` - 新功能
- `fix` - Bug 修复
- `docs` - 文档
- `style` - 代码风格
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试
- `chore` - 杂项
- `ci` - CI/CD
- `build` - 构建
- `revert` - 回滚

**依赖文件**：`conventional-commits.py`

---

### prevent-direct-push
**用途**：防止直接推送到受保护分支

**保护分支**：`main`、`develop`

**说明**：强制 Git Flow 工作流。

**依赖文件**：`prevent-direct-push.py`

---

### validate-branch-name
**用途**：检出前验证 Git Flow 分支命名约定

**允许的分支格式**：
- `feature/*` - 功能分支
- `release/v*.*.*` - 发布分支
- `hotfix/*` - 热修复分支

**依赖文件**：`validate-branch-name.py`

---

## Git 工作流类 (git-workflow)

### auto-git-add
**用途**：编辑后自动使用 `git add` 暂存文件

**说明**：维护清洁的 git 工作流。

---

### smart-commit
**用途**：智能 git 提交创建

**功能**：
- 自动生成提交信息
- 进行验证
- 基于文件变更创建有意义的提交

---

## 性能监控类 (performance)

### performance-budget-guard
**用途**：监控 bundle 大小和 Core Web Vitals 指标

**功能**：
- 阻止超过性能预算的部署
- 提供详细报告

---

### performance-monitor
**用途**：监控 Claude Code 操作期间的系统性能

**监控指标**：
- CPU 使用率
- 内存使用率
- 执行时间

---

## 工具后操作类 (post-tool)

### format-javascript-files
**用途**：在任何 Edit 操作后使用 Prettier 自动格式化 JavaScript/TypeScript 文件

**触发条件**：Edit 工具执行后

---

### format-python-files
**用途**：在任何 Edit 操作后使用 Black 格式化程序自动格式化 Python 文件

**触发条件**：Edit 工具执行后

---

### git-add-changes
**用途**：文件修改后自动暂存 git 变更

**说明**：简化提交工作流。

---

### run-tests-after-changes
**用途**：代码修改后自动运行快速测试

**说明**：确保没有破坏任何内容。

---

## 工具前操作类 (pre-tool)

### backup-before-edit
**用途**：任何 Edit 操作前创建自动备份文件

**备份格式**：`filename.backup.timestamp`

**说明**：提供恢复以前版本的安全网，只备份已存在的文件。

---

### notify-before-bash
**用途**：任何 Bash 命令执行前显示通知

**说明**：提供对系统命令执行的可视性。

---

### update-search-year
**用途**：自动为 WebSearch 查询添加当前年份

**说明**：确保搜索结果是最新和相关的。

---

## 安全类 (security)

### file-protection
**用途**：防止意外修改关键文件

**保护范围**：
- 重要系统文件
- 配置文件
- 生产代码

---

### security-scanner
**用途**：修改后扫描代码中的安全漏洞和 secrets

**说明**：使用多个安全工具检测潜在问题。

---

## 测试类 (testing)

### test-runner
**用途**：代码变更后自动运行相关测试

**功能**：
- 检测测试文件
- 根据文件扩展名和项目结构运行适当的测试命令

---

## 如何启用 Hooks

### 方法一：修改 settings.json

在 `~/.claude/settings.json` 中添加 hooks 配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ -f \"$CLAUDE_TOOL_FILE_PATH\" ]]; then cp \"$CLAUDE_TOOL_FILE_PATH\" \"$CLAUDE_TOOL_FILE_PATH.backup.$(date +%s)\" 2>/dev/null || true; fi"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "prettier --write \"$CLAUDE_TOOL_FILE_PATH\" 2>/dev/null || true"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Claude Code session ended'"
          }
        ]
      }
    ]
  }
}
```

### 方法二：项目级配置

在项目根目录的 `.claude/settings.json` 中配置项目特定的 hooks。

### Hook 配置结构

```json
{
  "hooks": {
    "<事件类型>": [
      {
        "matcher": "<工具名称>",  // 可选，用于过滤特定工具
        "hooks": [
          {
            "type": "command",
            "command": "<要执行的命令>"
          }
        ]
      }
    ]
  }
}
```

### 可用的事件类型

| 事件 | 触发时机 | 常用场景 |
|------|----------|----------|
| `PreToolUse` | 工具执行前 | 备份、验证、阻止 |
| `PostToolUse` | 工具执行后 | 格式化、测试、通知 |
| `Stop` | 会话结束时 | 通知、清理、统计 |
| `SubagentStop` | 子代理完成时 | 通知、日志 |

### 可用的环境变量

| 变量 | 说明 |
|------|------|
| `$CLAUDE_TOOL_FILE_PATH` | 当前操作的文件路径 |
| `$CLAUDE_PROJECT_DIR` | 项目根目录 |

### 示例：启用多个 Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "cp \"$CLAUDE_TOOL_FILE_PATH\" \"$CLAUDE_TOOL_FILE_PATH.backup.$(date +%s)\" 2>/dev/null || true"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "case \"$CLAUDE_TOOL_FILE_PATH\" in *.js|*.ts|*.jsx|*.tsx) prettier --write \"$CLAUDE_TOOL_FILE_PATH\" 2>/dev/null;; *.py) black \"$CLAUDE_TOOL_FILE_PATH\" 2>/dev/null;; esac"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "if [[ -n \"$SLACK_WEBHOOK_URL\" ]]; then curl -s -X POST \"$SLACK_WEBHOOK_URL\" -H 'Content-type: application/json' -d '{\"text\":\"Claude Code 会话已结束\"}'; fi"
          }
        ]
      }
    ]
  }
}
```

---

## 快速查找表

### 按需求查找

| 我想要... | 使用 Hook |
|-----------|-----------|
| 编辑前自动备份 | backup-before-edit, file-backup |
| 编辑后自动格式化 JS | format-javascript-files |
| 编辑后自动格式化 Python | format-python-files |
| 规范 Git 提交消息 | conventional-commits |
| 保护重要分支 | prevent-direct-push |
| 验证分支命名 | validate-branch-name |
| 自动暂存文件 | auto-git-add, git-add-changes |
| 完成后发 Slack 通知 | slack-notifications |
| 完成后发 Discord 通知 | discord-notifications |
| 完成后发 Telegram 通知 | telegram-notifications |
| 监控系统性能 | performance-monitor |
| 检查依赖安全 | dependency-checker |
| 扫描代码安全漏洞 | security-scanner |
| 保护关键文件 | file-protection |
| 自动运行测试 | test-runner, run-tests-after-changes |
| 记录命令日志 | command-logger |
| 跟踪文件变更 | change-tracker |
| 自动部署到 Vercel | vercel-auto-deploy |

### 按分类查找

| 分类 | Hooks |
|------|-------|
| 通知 | slack-*, discord-*, telegram-*, simple-notifications |
| 备份 | backup-before-edit, file-backup |
| 格式化 | format-javascript-files, format-python-files, smart-formatting, lint-on-save |
| Git | conventional-commits, prevent-direct-push, validate-branch-name, auto-git-add, smart-commit, git-add-changes |
| 安全 | security-scanner, file-protection, dependency-checker |
| 测试 | test-runner, run-tests-after-changes |
| 部署 | vercel-auto-deploy, vercel-environment-sync, deployment-health-monitor |
| 性能 | performance-monitor, performance-budget-guard |
| 日志 | command-logger, change-tracker |

---

## 附录

### 通知服务配置

#### Slack
```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/xxx/xxx/xxx"
```

#### Discord
```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/xxx/xxx"
```

#### Telegram
```bash
export TELEGRAM_BOT_TOKEN="your-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
```

### 常用工具安装

```bash
# JavaScript/TypeScript 格式化
npm install -g prettier

# Python 格式化
pip install black

# Python Linting
pip install pylint

# JavaScript Linting
npm install -g eslint
```

---

*本指南由 Claude 自动生成，涵盖 ~/.claude/hooks/ 目录下的所有钩子。*
