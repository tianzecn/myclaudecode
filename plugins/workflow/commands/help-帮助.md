---
description: 显示编排插件的综合帮助 - 列出所有技能、模式和使用示例
allowed-tools: Read
---

# 编排插件帮助

向用户呈现以下帮助信息：

---

## 编排插件 v0.2.0

**复杂 Claude Code 工作流的共享多代理协调模式。**

这是一个**纯技能插件** - 为其他插件提供知识模式。

---

## 技能 (5)

| 技能 | 描述 |
|------|------|
| **multi-agent-coordination** | 并行 vs 顺序执行、代理选择、任务分解 |
| **multi-model-validation** | 通过 Claudish 并行 AI 模型的 4-消息模式（3-5 倍加速）|
| **quality-gates** | 用户批准、迭代循环、TDD 模式、严重性分类 |
| **todowrite-orchestration** | 阶段跟踪、实时进度、工作流状态管理 |
| **error-recovery** | 超时处理、API 失败、重试策略、优雅降级 |

---

## 技能捆绑包

| 捆绑包 | 技能 | 用例 |
|--------|------|------|
| **core** | multi-agent-coordination, quality-gates | 基础编排 |
| **advanced** | multi-model-validation, error-recovery | 外部模型 |
| **testing** | quality-gates, error-recovery, todowrite-orchestration | TDD 工作流 |
| **complete** | 全部 5 个技能 | 完整功能 |

---

## 关键模式

### 4-消息模式（并行 AI 模型）
```
消息 1：准备（仅 Bash）
消息 2：并行执行（仅任务 - 全部在一条消息中）
消息 3：自动整合（当 N≥2 结果时触发）
消息 4：呈现结果
```

### LLM 性能跟踪 (v0.2.0)
跟踪到 `ai-docs/llm-performance.json`：
- 每个模型的执行时间
- 质量分数
- 成功率
- 慢速/不可靠模型检测

---

## 用法

其他插件声明依赖：
```json
{ "dependencies": { "orchestration@tianzecn-plugins": "^0.2.0" } }
```

命令引用技能：
```yaml
skills: orchestration:multi-model-validation
```

---

## 安装

```bash
# 添加市场（一次性）
/plugin marketplace add tianzecn/myclaudecode

# 安装插件
/plugin install orchestration@tianzecn-plugins
```

**注意**：通常作为 frontend/agentdev 插件的依赖自动安装。

---

## 更多信息

- **仓库**: https://github.com/tianzecn/myclaudecode
- **作者**: tianzecn @ tianzecn
