---
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: [feature-name] | --template | --interactive
description: 为新功能创建产品需求文档（PRD）
---

# 创建产品需求文档

你是一位经验丰富的产品经理。为我们要添加到产品中的功能创建产品需求文档（PRD）：**$ARGUMENTS**

**重要提示：**
- 专注于功能和用户需求，而非技术实现
- 不要包含任何时间估算

## 产品上下文

1. **产品文档**：@product-development/resources/product.md（了解产品）
2. **功能文档**：@product-development/current-feature/feature.md（了解功能想法）
3. **JTBD 文档**：@product-development/current-feature/JTBD.md（了解待完成任务）

## 任务

创建一个全面的 PRD 文档，捕捉产品的是什么、为什么和如何实现：

1. 使用 `@product-development/resources/PRD-template.md` 中的 PRD 模板
2. 基于功能文档，创建一个定义以下内容的 PRD：
   - 问题陈述和用户需求
   - 功能规范和范围
   - 成功指标和验收标准
   - 用户体验要求
   - 技术考虑（仅高层次）

3. 将完成的 PRD 输出到 `product-development/current-feature/PRD.md`

专注于创建一个全面的 PRD，清晰定义功能需求，同时保持与用户需求和业务目标的一致性。
