---
allowed-tools: Read, Write, Edit, WebSearch, Grep, Glob
argument-hint: [feature-description] | --research | --template | --validate
description: 创建全面的产品需求提示（PRP），包含研究和验证
---

# 创建产品需求提示

遵循结构化研究流程创建全面的产品需求提示（PRP）：**$ARGUMENTS**

## PRP 基础

- 基础模板：@concept_library/cc_PRP_flow/PRPs/base_template_v1
- PRP 概念：@concept_library/cc_PRP_flow/README.md
- 现有 PRPs：!`find concept_library/cc_PRP_flow/PRPs/ -name "*.md" | head -5`
- 文档：@ai_docs/ 目录分析

## 任务

通过系统化研究和结构化文档开发全面的 PRP：

**研究流程**：
1. **文档审查** - 分析现有的 ai_docs/ 和项目文档
2. **网络研究** - 收集实现示例、库文档和最佳实践
3. **模板分析** - 研究 base_template_v1 结构和现有 PRPs
4. **代码库探索** - 识别模式、依赖和集成点
5. **上下文综合** - 编译全面的实现上下文

**PRP 开发**：
- 严格遵循 base_template_v1 结构
- 包含具体的文件引用和网络资源
- 提供精心策划的代码库智能
- 定义清晰的验证标准和成功指标
- 创建生产就绪的实现指南

**记住**：PRP = PRD + 精心策划的代码库智能 + agent/runbook——AI 第一次就能交付生产就绪代码所需的最小可行包。
