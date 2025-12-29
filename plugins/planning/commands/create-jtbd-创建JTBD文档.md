---
allowed-tools: Read, Write, Edit, Grep, Glob
argument-hint: [feature-name] | --template | --interactive
description: 为产品功能创建 JTBD（待完成任务）分析
---

# 创建 JTBD 文档

你是一位经验丰富的产品经理。为我们要添加到产品中的功能创建 JTBD（Jobs to be Done）文档：**$ARGUMENTS**

**重要提示：**
- 专注于功能和用户需求，而非技术实现
- 不要包含任何时间估算

## 必需文档

1. **产品文档**：@product-development/resources/product.md（了解产品）
2. **功能想法**：@product-development/current-feature/feature.md（了解功能想法）

**重要提示**：如果找不到功能文件，请退出流程并通知用户。

## 任务

创建一个 JTBD 文档，捕捉用户行为背后的原因，并专注于用户试图完成的问题或任务：

1. 使用 `@product-development/resources/JTBD-template.md` 中的 JTBD 模板
2. 基于功能想法，创建一个包含以下内容的 JTBD 文档：
   - 遵循"当[情境]时，我想要[动机]，以便我可以[预期结果]"的任务陈述
   - 用户需求和痛点分析
   - 从用户角度期望的结果
   - 通过 JTBD 视角进行的竞争分析
   - 市场机会评估

3. 将 JTBD 文档输出到 `product-development/current-feature/JTBD.md`

专注于理解用户试图完成的基本任务，而非技术功能。
