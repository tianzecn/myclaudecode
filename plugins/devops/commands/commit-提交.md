---
description: 使用符合规范的提交格式和适当的 emoji 创建 Git 提交，遵循项目标准并创建描述性消息以解释变更目的。
author: evmts
author-url: https://github.com/evmts
version: 1.0.0
---

# 提交命令

这个斜杠命令是一个 Git 提交助手，具备以下功能：

1. 默认运行预提交检查（代码检查、构建、生成文档）
2. 如果没有暂存文件，则自动暂存文件
3. 分析代码变更以建议潜在的提交拆分
4. 使用符合规范的提交格式和描述性 emoji 创建提交

## 主要特性
- 支持 `--no-verify` 等选项以跳过预提交检查
- 鼓励进行专注、符合逻辑的"原子提交"
- 提供提交类型和对应 emoji 的完整列表
- 提供拆分复杂提交的指南

## 提交消息示例
- "✨ feat: add user authentication system"
- "🐛 fix: resolve memory leak in rendering process"
- "📝 docs: update API documentation with new endpoints"

该命令旨在通过提供结构化的提交指导来提高代码质量、提交清晰度和开发者工作流程。