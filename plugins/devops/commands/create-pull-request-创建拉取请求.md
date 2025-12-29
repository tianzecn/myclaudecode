---
description: 使用 GitHub CLI 提供全面的 PR 创建指导，强制执行标题约定，遵循模板结构，并提供具体的命令示例和最佳实践。
author: liam-hq
author-url: https://github.com/liam-hq
version: 1.0.0
---

# GitHub CLI 拉取请求创建指南

本指南提供使用 GitHub CLI 创建拉取请求的全面说明。

## 前置条件
- 安装 GitHub CLI
- 使用 GitHub 进行身份验证

## 主要特性
- 创建拉取请求的详细说明
- PR 标题和描述的最佳实践
- PR 管理的示例命令
- 使用模板的技巧
- 额外的 GitHub CLI PR 命令

## PR 创建命令示例
```bash
gh pr create --title "✨(scope): Your descriptive title" --body-file <(echo -e "## Issue\n\n- resolve:\n\n## Why is this change needed?\nYour description here.") --base main --draft
```

## 最佳实践
- 使用一致的模板结构
- 遵循符合规范的提交格式
- 维护清晰、结构化的拉取请求描述
- 包含适当的范围和描述性标题