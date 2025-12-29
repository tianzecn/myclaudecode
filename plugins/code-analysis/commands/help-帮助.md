---
description: 显示代码分析插件的综合帮助 - 列出 agents、commands、skills 和使用示例
allowed-tools: Read
---

# 代码分析插件帮助

向用户展示以下帮助信息：

---

## 代码分析插件 v2.0.0

**使用索引内存（claudemem）进行深度代码调查。禁止使用 GREP/FIND。**

### 快速开始

```bash
/analyze 这个应用中身份验证是如何实现的？
```

---

## Agents (1)

| Agent | 描述 | 模型 |
|-------|------|------|
| **codebase-detective** | 调查代码库以理解模式、追踪流程、查找实现、分析架构、追踪 bugs | Sonnet |

### 何时使用

- 理解功能如何工作
- 查找特定逻辑的实现位置
- 追踪数据在应用中的流动
- 调查 bugs 及其根本原因
- 分析代码关系和依赖

---

## Commands (2)

| 命令 | 描述 |
|------|------|
| **/analyze** | 启动针对特定问题的深度代码库调查 |
| **/help** | 显示此帮助 |

### 示例

```bash
/analyze 支付处理如何工作？
/analyze API 端点在哪里定义？
/analyze 身份验证流程是什么？
/analyze 查找 UserService 类的所有用法
```

---

## Skills (9)

| Skill | 描述 |
|-------|------|
| **deep-analysis** | 自动代码调查模式 - 主动分析代码 |
| **claudemem-search** | 关于 claudemem CLI 本地语义代码搜索的专家指导 |
| **claudish-usage** | 通过子 agents 使用 Claudish CLI 的指南 |
| **architect-detective** | 架构导向调查（模式、边界、层） |
| **developer-detective** | 实现导向调查（数据流、副作用） |
| **tester-detective** | 测试导向调查（覆盖率、边缘情况） |
| **debugger-detective** | Bug 调查（根本原因、错误追踪） |
| **ultrathink-detective** | 使用 Opus 模型的综合深度分析 |
| **cross-plugin-detective** | 任意插件的 agent 到 skill 映射 |

### 使用 claudemem 进行语义代码搜索

对于大型代码库，使用 claudemem CLI：

**安装：**
```bash
npm install -g claude-codemem
claudemem init     # 配置 OpenRouter API 密钥
claudemem --models # 查看可用的嵌入模型
```

**使用：**
```bash
claudemem index              # 索引代码库（一次）
claudemem search "auth flow" # 语义搜索
claudemem status             # 检查索引
```

**嵌入模型：**
- `voyage/voyage-code-3` - 最佳质量（默认） - $0.180/1M
- `qwen/qwen3-embedding-8b` - 最佳平衡 - $0.010/1M
- `qwen/qwen3-embedding-0.6b` - 最佳性价比 - $0.002/1M

**优势：**
- Tree-sitter AST 解析（保留代码结构）
- 本地 LanceDB 存储（无云依赖）
- 按功能而非关键词查找代码

---

## 使用场景

| 场景 | 如何帮助 |
|------|---------|
| **新代码库** | 理解架构和模式 |
| **Bug 调查** | 追踪问题到根本原因 |
| **功能规划** | 查找集成点 |
| **代码审查** | 理解变更的上下文 |
| **文档编写** | 提取事物如何工作 |

---

## 与 Frontend 插件集成

推荐将 code-analysis 插件与 frontend 插件一起使用。
`/implement` 命令会建议使用它以更好地理解代码库。

---

## 安装

```bash
# 添加市场（一次性）
/plugin marketplace add tianzecn/myclaudecode

# 安装插件
/plugin install code-analysis@tianzecn-plugins
```

**可选**：对于语义代码搜索，安装 claudemem：`npm install -g claude-codemem`

---

## 更多信息

- **仓库**：https://github.com/tianzecn/myclaudecode
- **作者**：tianzecn @ tianzecn
