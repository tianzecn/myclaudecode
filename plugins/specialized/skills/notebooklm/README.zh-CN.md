# NotebookLM Skill 中文使用指南

> 让 Claude Code 直接与 Google NotebookLM 对话，获取基于文档的精准答案

---

## 目录

- [插件概述](#插件概述)
- [核心优势](#核心优势)
- [安装与配置](#安装与配置)
- [使用指南](#使用指南)
- [实战案例](#实战案例)
- [常见问题](#常见问题)
- [高级用法](#高级用法)

---

## 插件概述

### 这是什么？

NotebookLM Skill 是一个 Claude Code 技能插件，让你能够直接在 Claude Code 中查询 Google NotebookLM 笔记本。NotebookLM 是 Google 提供的**源引用知识库**，由 Gemini 2.5 驱动，能够基于你上传的文档提供精准答案。

### 解决什么问题？

| 传统方式 | 使用此插件 |
|---------|-----------|
| 📋 在 NotebookLM 浏览器和编辑器间复制粘贴 | 🚀 Claude 直接查询并获取答案 |
| 🔍 Claude 搜索本地文档消耗大量 Token | 💡 查询 NotebookLM，Token 消耗极少 |
| 🤔 Claude 可能编造不存在的 API | 📚 答案只来自你上传的文档 |
| ⏰ 手动来回切换浪费时间 | ⚡ 自动化查询，一键完成 |

### 工作流程

```
你的任务 → Claude 询问 NotebookLM → Gemini 基于文档生成答案 → Claude 使用答案完成任务
```

---

## 核心优势

### 1. 源引用答案（大幅减少幻觉）

NotebookLM 的回答**只来自你上传的文档**。如果信息不存在，它会明确告诉你，而不是编造答案。

### 2. 直接集成

无需复制粘贴。Claude 通过脚本自动打开浏览器、输入问题、获取答案。

### 3. 智能库管理

保存多个 NotebookLM 链接，按主题分类。Claude 会根据你的问题自动选择正确的笔记本。

### 4. 持久认证

一次 Google 登录，认证信息自动保存。后续使用无需重复登录。

### 5. 自包含

所有依赖都安装在插件目录的 `.venv` 中，不会污染你的系统环境。

---

## 安装与配置

### 步骤 1：安装插件

```bash
# 如果你已添加 tianzecn-plugins marketplace
/plugin install notebooklm-skill@tianzecn-plugins
```

### 步骤 2：设置 Google 认证（首次使用）

在 Claude Code 中说：

```
"设置 NotebookLM 认证"
```

或者直接运行：

```bash
python scripts/run.py auth_manager.py setup
```

**重要提示：**
- 会打开一个 Chrome 浏览器窗口
- 你需要**手动登录** Google 账号
- 登录成功后，认证信息会自动保存
- 建议使用**专用 Google 账号**进行自动化操作

### 步骤 3：创建 NotebookLM 笔记本

1. 访问 [notebooklm.google.com](https://notebooklm.google.com)
2. 点击 **"新建笔记本"**
3. 上传你的文档：
   - 📄 PDF、Google Docs、Markdown 文件
   - 🔗 网站、GitHub 仓库
   - 🎥 YouTube 视频
   - 📚 每个笔记本最多 50 个来源
4. 设置分享：**⚙️ 分享 → 有链接的人都可以查看 → 复制链接**

### 步骤 4：添加笔记本到库

**方法 A：智能发现（推荐）**

```
"查询这个笔记本的内容并添加到我的库：[你的链接]"
```

Claude 会先查询笔记本内容，然后用发现的信息自动填充名称和主题。

**方法 B：手动添加**

```
"添加这个 NotebookLM 到我的库：[你的链接]"
```

Claude 会询问你名称和主题，然后保存。

### 配置文件（可选）

在插件目录创建 `.env` 文件进行自定义配置：

```env
# 浏览器设置
HEADLESS=false           # 是否隐藏浏览器（认证时必须 false）
SHOW_BROWSER=false       # 默认显示浏览器

# 人类行为模拟
STEALTH_ENABLED=true     # 启用人类行为模拟
TYPING_WPM_MIN=160       # 最小打字速度（字/分钟）
TYPING_WPM_MAX=240       # 最大打字速度

# 默认笔记本
DEFAULT_NOTEBOOK_ID=     # 默认使用的笔记本 ID
```

---

## 使用指南

### 基本命令

| 你说的话 | 发生什么 |
|---------|---------|
| *"设置 NotebookLM 认证"* | 打开 Chrome 进行 Google 登录 |
| *"添加 [链接] 到我的 NotebookLM 库"* | 保存笔记本到本地库 |
| *"显示我的 NotebookLM 笔记本"* | 列出所有保存的笔记本 |
| *"询问我的 API 文档关于 [主题]"* | 查询相关笔记本 |
| *"使用 React 笔记本"* | 激活指定笔记本 |
| *"清理 NotebookLM 数据"* | 重置（保留库） |

### 脚本命令参考

**所有命令必须使用 `run.py` 包装器：**

```bash
# ✅ 正确用法 - 始终使用 run.py
python scripts/run.py auth_manager.py status
python scripts/run.py ask_question.py --question "..."

# ❌ 错误用法 - 直接调用会失败
python scripts/auth_manager.py status  # 找不到依赖！
```

#### 认证管理

```bash
# 检查认证状态
python scripts/run.py auth_manager.py status

# 设置认证（浏览器可见）
python scripts/run.py auth_manager.py setup

# 重新认证
python scripts/run.py auth_manager.py reauth

# 清除认证
python scripts/run.py auth_manager.py clear
```

#### 笔记本管理

```bash
# 列出所有笔记本
python scripts/run.py notebook_manager.py list

# 添加笔记本
python scripts/run.py notebook_manager.py add \
  --url "https://notebooklm.google.com/notebook/..." \
  --name "我的 API 文档" \
  --description "项目 API 的完整文档" \
  --topics "api,rest,backend"

# 搜索笔记本
python scripts/run.py notebook_manager.py search --query "api"

# 激活笔记本
python scripts/run.py notebook_manager.py activate --id notebook-id

# 删除笔记本
python scripts/run.py notebook_manager.py remove --id notebook-id

# 显示统计
python scripts/run.py notebook_manager.py stats
```

#### 提问

```bash
# 基本查询（使用激活的笔记本）
python scripts/run.py ask_question.py --question "如何使用用户认证 API？"

# 指定笔记本 ID
python scripts/run.py ask_question.py --question "..." --notebook-id notebook-id

# 直接使用 URL
python scripts/run.py ask_question.py --question "..." --notebook-url "https://..."

# 显示浏览器（调试用）
python scripts/run.py ask_question.py --question "..." --show-browser
```

#### 清理

```bash
# 预览清理
python scripts/run.py cleanup_manager.py

# 执行清理
python scripts/run.py cleanup_manager.py --confirm

# 保留笔记本库
python scripts/run.py cleanup_manager.py --confirm --preserve-library
```

---

## 实战案例

### 案例 1：查询车间手册

**场景：** 你有一本铃木 GSR 600 摩托车的维修手册 PDF，想快速查询特定规格。

**设置：**
1. 在 NotebookLM 创建笔记本，上传维修手册 PDF
2. 分享笔记本获取链接

**使用：**

```
你：帮我查一下 GSR 600 的刹车油类型、机油规格和后轴扭矩

Claude：让我查询你的维修手册笔记本...

（Claude 自动执行）
python scripts/run.py ask_question.py \
  --question "GSR 600 的刹车油类型是什么？发动机机油规格是什么？后轴螺母的扭矩是多少？" \
  --notebook-id suzuki-manual

结果：
- 刹车油：DOT 4
- 机油：SAE 10W-40
- 后轴扭矩：100 N·m
```

### 案例 2：开发 n8n 工作流

**场景：** 你需要用 n8n 创建一个 Gmail 垃圾邮件过滤工作流。

**设置：**
1. 在 NotebookLM 创建笔记本
2. 添加 n8n 官方文档网站作为来源
3. 添加 Gmail 集成文档

**使用：**

```
你：帮我创建一个 n8n 工作流，过滤 Gmail 垃圾邮件

Claude：让我先查询 n8n 文档...

（Claude 执行多次查询）
1. "n8n 中如何使用 Gmail 节点？需要什么认证？"
2. "n8n 如何实现邮件过滤逻辑？有什么内置函数？"
3. "n8n 工作流的最佳实践是什么？"

（收到"Is that ALL you need to know?"后继续追问）
4. "有没有完整的邮件过滤工作流示例？"

结果：Claude 基于文档生成的准确答案创建工作流，而不是猜测
```

### 案例 3：API 开发参考

**场景：** 你在开发一个使用 Stripe API 的电商后端。

**设置：**
1. 在 NotebookLM 创建笔记本
2. 添加 Stripe API 文档网址
3. 添加项目的 API 设计文档

**使用：**

```
你：我需要实现 Stripe 支付 webhook，怎么验证签名？

Claude：让我查询 Stripe 文档...

python scripts/run.py ask_question.py \
  --question "Stripe webhook 签名验证的完整流程是什么？需要哪些参数？有什么安全注意事项？" \
  --notebook-id stripe-docs

结果：
1. 获取 webhook secret 从 Stripe Dashboard
2. 使用 stripe.webhooks.constructEvent() 验证
3. 检查 timestamp 防止重放攻击
4. 返回 200 确认接收
（附带代码示例）
```

### 案例 4：多笔记本研究

**场景：** 你需要比较 React 和 Vue 的状态管理方案。

**设置：**
1. 创建 "React Docs" 笔记本，添加 React 文档
2. 创建 "Vue Docs" 笔记本，添加 Vue 文档

**使用：**

```
你：比较 React 和 Vue 的状态管理最佳实践

Claude：让我分别查询两个文档...

# 查询 React
python scripts/run.py notebook_manager.py activate --id react-docs
python scripts/run.py ask_question.py --question "React 状态管理的最佳实践？Context vs Redux vs Zustand？"

# 查询 Vue
python scripts/run.py notebook_manager.py activate --id vue-docs
python scripts/run.py ask_question.py --question "Vue 状态管理的最佳实践？Pinia vs Vuex？"

# 综合答案
React：
- 小项目：useState + useContext
- 中型：Zustand
- 大型：Redux Toolkit

Vue：
- Vue 3：Pinia（官方推荐）
- Vue 2：Vuex
```

### 案例 5：代码审查参考

**场景：** 团队有一份代码规范文档，需要在审查代码时参考。

**设置：**
1. 在 NotebookLM 创建 "团队规范" 笔记本
2. 上传团队的代码规范 PDF/Markdown
3. 添加 ESLint 配置说明

**使用：**

```
你：检查这段代码是否符合我们的团队规范
[粘贴代码]

Claude：让我查询团队规范...

python scripts/run.py ask_question.py \
  --question "团队对于错误处理、命名规范和函数长度的要求是什么？" \
  --notebook-id team-standards

结果：根据你们的规范，我发现以下问题：
1. 函数 `processData` 超过 30 行（规范要求最多 25 行）
2. 错误处理应该使用自定义 Error 类
3. 变量名 `d` 不符合描述性命名要求
```

---

## 常见问题

### 问题排查表

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `ModuleNotFoundError` | 没有使用 run.py | 使用 `python scripts/run.py [脚本]` |
| 认证失败 | 浏览器未可见 | 使用 `--show-browser` 或设置 `HEADLESS=false` |
| 速率限制 (50/天) | 免费账号限制 | 等待或切换 Google 账号 |
| 浏览器崩溃 | 状态损坏 | 运行 `cleanup_manager.py --preserve-library` |
| 笔记本找不到 | ID 错误 | 使用 `notebook_manager.py list` 检查 |
| 答案不完整 | 缺少追问 | 看到"Is that ALL..."时继续追问 |

### Q: 为什么只能在本地 Claude Code 使用？

A: Web UI 在沙盒中运行技能，没有网络访问权限。浏览器自动化需要网络访问才能连接到 NotebookLM。

### Q: 这与 MCP 服务器版本有什么区别？

A:
| 特性 | 此 Skill | MCP 服务器 |
|-----|----------|-----------|
| 协议 | Claude Skills | Model Context Protocol |
| 安装 | 克隆到 `~/.claude/skills` | `claude mcp add` |
| 会话 | 每个问题新开浏览器 | 持久聊天会话 |
| 兼容性 | 仅 Claude Code | Claude Code、Cursor、Codex 等 |
| 语言 | Python | TypeScript |

### Q: 我的 Google 账号安全吗？

A: 是的。Chrome 在你的本地机器运行，凭据永不离开你的电脑。为了更安全，建议使用专用 Google 账号。

### Q: 速率限制是多少？

A: 免费 Google 账号每天约 50 次查询。解决方案：
1. 等待每日重置（太平洋时间午夜）
2. 使用 `reauth` 切换账号
3. 使用多个 Google 账号

---

## 高级用法

### 批量查询脚本

```bash
#!/bin/bash
NOTEBOOK_ID="my-docs"
QUESTIONS=(
    "API 认证流程是什么？"
    "错误处理的最佳实践？"
    "性能优化建议？"
)

for question in "${QUESTIONS[@]}"; do
    echo "询问: $question"
    python scripts/run.py ask_question.py \
        --question "$question" \
        --notebook-id "$NOTEBOOK_ID"
    sleep 2  # 避免速率限制
done
```

### Python 集成

```python
import subprocess

def query_notebook(question, notebook_id):
    result = subprocess.run([
        "python", "scripts/run.py", "ask_question.py",
        "--question", question,
        "--notebook-id", notebook_id
    ], capture_output=True, text=True)
    return result.stdout

# 使用
answer = query_notebook("如何实现用户认证？", "api-docs")
print(answer)
```

### 组织笔记本的最佳实践

```
推荐的笔记本结构：

后端文档/
├── api-docs          # API 参考文档
├── database-docs     # 数据库设计文档
└── architecture      # 架构设计文档

前端文档/
├── react-docs        # React 框架文档
├── component-lib     # 组件库文档
└── styling-guide     # 样式指南

第三方/
├── stripe-docs       # Stripe 支付文档
├── aws-docs          # AWS 服务文档
└── auth0-docs        # Auth0 认证文档
```

### 追问机制（重要！）

每个 NotebookLM 回答都会以 **"Is that ALL you need to know?"** 结尾。

**Claude 的正确行为：**
1. **停止** - 不要立即回复用户
2. **分析** - 答案是否完整？
3. **追问** - 如果有缺失，继续提问
4. **重复** - 直到信息完整
5. **综合** - 合并所有答案后再回复用户

---

## 数据存储

所有数据存储在本地：

```
~/.claude/skills/notebooklm/data/
├── library.json       # 笔记本元数据
├── auth_info.json     # 认证状态信息
└── browser_state/     # 浏览器 Cookie 和会话
```

**安全提醒：**
- `data/` 目录包含敏感认证数据
- 已通过 `.gitignore` 排除
- **永远不要**手动提交或分享 `data/` 目录内容

---

## 总结

**使用前（传统方式）：**
```
NotebookLM 浏览器 → 复制答案 → 粘贴到 Claude → 复制下一个问题 → 回到浏览器...
```

**使用后（此插件）：**
```
Claude 直接研究 → 即时获取答案 → 编写正确代码
```

停止复制粘贴的舞蹈，开始在 Claude Code 中直接获取准确、有源引用的答案！

---

## 致谢

- **插件作者：** [PleasePrompto](https://github.com/PleasePrompto)
- **原项目：** [notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill)
- **基于：** [NotebookLM MCP Server](https://github.com/PleasePrompto/notebooklm-mcp)

---

*文档翻译与整理：tianzecn*
*最后更新：2025年12月*
