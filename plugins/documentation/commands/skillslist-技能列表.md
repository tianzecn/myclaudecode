---
description: 列出所有可用的插件、代理、命令和技能信息。当用户问"你都有什么技能"、"有哪些命令"、"有什么功能"时触发此命令。
allowed-tools: Read, Glob
---

# 技能列表命令

<任务目标>
读取 PLUGINS_REFERENCE.md 文档，解析并以结构化格式向用户展示所有可用的插件信息。
</任务目标>

<执行流程>

## 第一步：读取插件参考文档

读取文件：`${CLAUDE_PLUGIN_ROOT}/../ai-docs/PLUGINS_REFERENCE.md`

如果无法读取，尝试备用路径：
- `ai-docs/PLUGINS_REFERENCE.md`（项目根目录）
- `~/.claude/plugins/marketplaces/tianzecn-plugins/ai-docs/PLUGINS_REFERENCE.md`

## 第二步：解析插件信息

从文档中提取以下信息：
- 插件名称和版本
- 插件描述
- 包含的 Agents（代理）
- 包含的 Commands（命令）
- 包含的 Skills（技能）
- 触发场景和示例

## 第三步：格式化输出

按以下格式向用户展示：

```
## 📦 插件总览

共 [X] 个插件 | [Y] 个代理 | [Z] 个命令 | [W] 个技能

---

### 🎯 核心开发插件

#### [插件名] v[版本]
**描述**: [插件描述]

| 类型 | 数量 | 说明 |
|------|------|------|
| Agents | X | [主要代理名称] |
| Commands | Y | [主要命令名称] |
| Skills | Z | [主要技能名称] |

**触发场景**: [何时使用此插件]

---

[继续列出其他插件...]
```

</执行流程>

<输出要求>
- 使用 emoji 增强可读性
- 按插件类别分组（核心开发、文档、DevOps、测试等）
- 突出显示常用命令和代理
- 提供快速使用示例
</输出要求>

<示例输出>

## 📦 本小姐的超能力清单

哼，既然你问了，那本小姐就大方地告诉你吧！(￣▽￣)ゞ

共 **60 个插件** | **280+ 代理** | **330+ 命令** | **100+ 技能**

---

### 🎯 核心开发插件

#### Frontend v3.13.0
**描述**: 全功能前端开发插件，支持 React/Vue/Svelte 等框架

| 类型 | 数量 | 代表功能 |
|------|------|----------|
| Agents | 11 | code-reviewer, performance-optimizer |
| Commands | 7 | implement-ui, review, import-figma |
| Skills | 11 | code-review, frontend-patterns |

**常用命令**: `/frontend:implement-ui` `/frontend:review`

---

#### Bun Backend v1.5.2
**描述**: TypeScript 后端开发，基于 Bun 运行时

| 类型 | 数量 | 代表功能 |
|------|------|----------|
| Agents | 4 | backend-developer, api-architect |
| Commands | 4 | implement-api, setup-project |
| Skills | 3 | clean-architecture, testing |

**常用命令**: `/bun:implement-api` `/bun:setup-project`

---

[更多插件...]

---

## 🔧 快速使用

```bash
# 前端开发
/frontend:implement-ui 创建一个登录页面

# 后端开发
/bun:implement-api 用户认证接口

# 代码审查
/development:code-review

# 文档生成
/documentation:generate-api-docs
```

哼，这些都是本小姐精心准备的能力！好好利用吧，笨蛋！(￣ω￣)ノ

</示例输出>
