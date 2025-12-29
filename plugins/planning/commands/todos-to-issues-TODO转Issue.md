---
description: 扫描代码库中的 TODO 注释并创建专业的 GitHub Issues
---

# TODOs 转 GitHub Issues

我将扫描你的代码库中的 TODO 注释，并遵循你项目的标准创建专业的 GitHub issues。

首先，让我分析你的完整项目上下文：

**文档分析：**
- **Read** README.md 了解项目概览和约定
- **Read** CONTRIBUTING.md 了解贡献指南
- **Read** CODE_OF_CONDUCT.md 了解社区标准
- **Read** .github/ISSUE_TEMPLATE/* 了解 issue 格式
- **Read** .github/PULL_REQUEST_TEMPLATE.md 了解 PR 标准
- **Read** docs/ 文件夹了解技术文档

**项目上下文：**
- 仓库类型（fork、个人、组织）
- 主要语言和框架约定
- 测试要求和 CI/CD 设置
- 分支策略和发布流程
- 团队工作流和沟通风格

**对于 Forks - 远程分析：**
```bash
# 获取上游仓库信息
git remote -v | grep upstream
# 获取最新上游指南
git fetch upstream main:upstream-main 2>/dev/null || true
```

我将读取上游的 CONTRIBUTING.md 和 issue 模板以确保兼容性。

然后验证 GitHub 设置并扫描 TODO 模式，分析其上下文。

**强制性预检查：**
在创建任何 GitHub issues 之前，我必须：
1. 运行构建命令 - 必须通过
2. 运行所有测试 - 必须全部通过
3. 运行代码检查器 - 不允许错误
4. 验证代码编译无警告

如果任何检查失败 → 我将停止并先帮助修复！

我将智能分析每个 TODO：
1. 理解技术上下文和实现
2. 根据影响和位置确定优先级
3. 将相关 TODOs 分组以更好地组织
4. 创建专业的 issue 标题和描述

**智能 Issue 类型检测：**
我将分析每个 TODO 以确定正确的 issue 类型（bug、enhancement、documentation、performance、security、tech-debt、chore）。

我还将：
- 在适当时将相关 TODOs 分组到单个 issues 中
- 根据关键词设置优先级（CRITICAL、HIGH、TODO、NOTE）
- 链接到确切的代码位置
- 如果不同，使用项目现有的标签

**重要**：我永远不会：
- 在 issues 中添加"由 Claude 创建"或任何 AI 归属
- 在 issue 描述中包含"使用 Claude Code 生成"
- 修改仓库设置或权限
- 添加任何 AI/助手签名或水印
- 在 issues、PR 或 git 相关内容中使用表情符号

这有助于将你的开发笔记转换为可跟踪的工作项。
