---
name: setup
description: 向项目 CLAUDE.md 添加 4-消息模式强制规则并验证 claudish 设置
allowed-tools: Read, Write, Edit, Bash, AskUserQuestion
---

# 设置多模型验证强制

此命令为该项目设置多模型验证强制。

## 步骤

### 1. 检查 claudish 安装

```bash
which claudish && claudish --version
```

如果未安装，引导用户：
```bash
npm install -g claudish
export OPENROUTER_API_KEY=your-key  # 在 openrouter.ai/keys 获取
```

### 2. 检查 OpenRouter API key

```bash
[ -n "$OPENROUTER_API_KEY" ] && echo "API key configured" || echo "API key missing"
```

如果缺失：
```bash
export OPENROUTER_API_KEY=your-key
```

### 3. 测试模型可用性

```bash
claudish --top-models
```

显示用于多模型验证的顶级推荐模型。

### 4. 检查 CLAUDE.md 中的现有规则

读取项目的 CLAUDE.md 并查找标记：
`## Multi-Model Validation: 4-MESSAGE PATTERN ENFORCED`

### 5. 如果规则不存在，询问用户

```typescript
AskUserQuestion({
  questions: [{
    question: "向 CLAUDE.md 添加 4-消息模式强制规则？",
    header: "设置",
    multiSelect: false,
    options: [
      { label: "是，添加规则（推荐）", description: "添加关于并行执行模式的文档" },
      { label: "否，跳过", description: "钩子仍然有效，只是 CLAUDE.md 中没有文档" }
    ]
  }]
})
```

### 6. 如果用户同意则注入规则

从 `${CLAUDE_PLUGIN_ROOT}/templates/claude-md-rules.md` 读取模板并追加到项目 CLAUDE.md。

### 7. 确认设置

报告状态：
- claudish 已安装: 是/否
- OpenRouter API key: 已配置/缺失
- 可用模型: 列出前 5 个
- CLAUDE.md 规则: 已添加/已存在/已跳过
- 钩子激活: 是（通过 plugin.json）

## 成功消息

```
多模型验证设置完成！

- 4-消息模式已在 CLAUDE.md 中记录
- Claudish 已准备好进行外部模型验证
- 会话启动将检查 claudish 状态

可用技能：
- orchestration:multi-model-validation
- orchestration:multi-agent-coordination
- orchestration:quality-gates
- orchestration:todowrite-orchestration
- orchestration:error-recovery

测试：使用 /review 命令与多个模型或在你的代理中引用技能。
```
