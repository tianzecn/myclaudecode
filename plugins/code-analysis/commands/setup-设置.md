---
name: setup
description: 将 claudemem 强制规则添加到项目 CLAUDE.md 并验证设置
allowed-tools: Read, Write, Edit, Bash, AskUserQuestion
---

# 设置 Claudemem 强制执行

此命令为该项目设置 claudemem 语义搜索强制执行。

## 步骤

### 1. 检查 claudemem 安装

```bash
which claudemem && claudemem --version
```

如果未安装，引导用户：
```bash
npm install -g claude-codemem
claudemem init
```

### 2. 检查索引状态

```bash
claudemem status
```

如果未索引：
```bash
claudemem index
```

### 3. 检查 CLAUDE.md 中的现有规则

读取项目的 CLAUDE.md 并查找标记：
`## Code Search: CLAUDEMEM ENFORCED`

### 4. 如果规则不存在，询问用户

```typescript
AskUserQuestion({
  questions: [{
    question: "将 claudemem 强制规则添加到 CLAUDE.md？",
    header: "设置",
    multiSelect: false,
    options: [
      { label: "是，添加规则（推荐）", description: "添加关于 Grep/Glob 拦截的文档" },
      { label: "否，跳过", description: "钩子仍将工作，只是 CLAUDE.md 中没有文档" }
    ]
  }]
})
```

### 5. 如果用户同意则注入规则

将以下内容追加到 CLAUDE.md：

```markdown

## 代码搜索：CLAUDEMEM 强制执行

> 由 `code-analysis` 插件 v2.3.0 添加

### 自动拦截

code-analysis 插件自动拦截搜索工具：

| 工具 | 行为 |
|------|------|
| **Grep** | 阻止 → 替换为 `claudemem search` |
| **Bash grep/rg/find** | 阻止 → 替换为 `claudemem search` |
| **Glob（广泛模式）** | 警告 → 建议使用 `claudemem search` |
| **Read（批量 3+ 文件）** | 警告 → 建议使用 `claudemem search` |

### 为什么

- **语义搜索** - 按含义而非文本模式查找代码
- **预索引** - 从向量数据库获得即时结果
- **结果排序** - 最相关的代码块优先
- **无噪音** - 排除生成的类型、fixtures、node_modules

### 手动命令

```bash
claudemem search "authentication flow"  # 语义搜索
claudemem status                         # 检查索引
claudemem index                          # 重新索引项目
```

### 工作原理

1. 你调用 `Grep({ pattern: "auth" })`
2. PreToolUse 钩子拦截调用
3. 钩子运行 `claudemem search "auth"` 代替
4. 结果作为上下文返回给 Claude
5. 原始 Grep 被阻止

这是透明的 - 你无需改变工作流程即可获得语义结果。
```

### 6. 确认设置

报告状态：
- claudemem 已安装：是/否
- claudemem 已索引：是/否（X 个块）
- CLAUDE.md 规则：已添加/已存在/已跳过
- 钩子激活：是（通过 plugin.json）

## 成功消息

```
✅ Claudemem 强制设置完成！

- Grep/rg/find 将自动替换为语义搜索
- 广泛的 Glob 模式将显示建议
- 批量文件读取将显示警告

通过运行任何 Grep 命令测试它 - 它应该被拦截。
```
