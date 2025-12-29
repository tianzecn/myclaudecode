---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [pr-number] | --task | --auto-detect | --enable-auto | --update-state
description: 将 GitHub 拉取请求链接到 Linear 任务，自动同步状态和集成工作流
---

# Sync PR to Task - PR 同步到任务

将 GitHub pull requests 链接到 Linear 任务,全面工作流集成: **$ARGUMENTS**

## 当前 PR 上下文

- 仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- PR 详情: 基于 $ARGUMENTS PR 编号或自动检测条件
- Linear 引用: 检测 PR 内容和分支名中的任务 ID
- Webhook 状态: PR-任务同步的当前自动化配置

## 任务

实现具有自动化工作流集成的全面 pull request 到 Linear 任务链接:

**PR 目标**: 使用 $ARGUMENTS 指定 PR 编号、任务分配、自动检测模式或自动化配置

**集成框架**:
1. **引用检测** - 从 PR 标题、主体、分支名、提交消息中提取 Linear 任务 ID
2. **PR 分析** - 获取完整 PR 数据,分析状态,审查状态,变更指标,时间线
3. **状态同步** - 将 PR 状态映射到 Linear 等价状态,处理审查周期,合并事件
4. **任务更新** - 更新 Linear 任务状态,添加 PR 引用,创建评论,同步元数据
5. **GitHub 增强** - 向 PR 添加 Linear 上下文,创建标签,发布任务摘要,维护链接
6. **工作流自动化** - 配置 webhooks,启用实时同步,实现事件处理器,维护一致性

**高级功能**: 智能分支检测、自动状态映射、审查集成、提交分析、全面验证。

**工作流集成**: 实时更新、双向同步、事件驱动自动化、全面监控。

**输出**: 完整的 PR-任务集成,包含自动同步、工作流增强、状态管理和全面的关系跟踪。
