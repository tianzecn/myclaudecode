---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [sync-scope] | --team | --project | --priority | --states
description: 将 Linear 任务同步到 GitHub 问题，支持状态映射和附件处理
---

# Sync Linear to Issues - Linear 同步到 Issues

将 Linear 任务同步到 GitHub issues,全面状态和字段映射: **$ARGUMENTS**

## 当前 Linear 上下文

- Linear 团队: 可用的团队和项目分配
- 任务数量: Linear 任务查询以确定范围
- 目标仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- 用户映射: Linear 邮箱到 GitHub 用户名对应关系

## 任务

执行 Linear 任务到 GitHub issues 的全面同步:

**同步范围**: 使用 $ARGUMENTS 按 Linear 团队、项目、优先级或任务状态过滤

**同步框架**:
1. **任务发现** - 使用过滤器查询 Linear 任务,提取元数据,验证需求,优先同步
2. **状态映射** - 将 Linear 状态转换为 GitHub 等价状态,处理优先级转换,映射项目分配
3. **内容转换** - 构建 GitHub issue 主体,保留格式,处理附件,维护结构
4. **GitHub 集成** - 以正确标签创建 issues,分配用户,设置里程碑,管理关系
5. **附件迁移** - 下载 Linear 附件,上传到 GitHub,更新引用,维护可访问性
6. **评论同步** - 转移带归属的评论,保留上下文,处理提及,维护线程

**高级功能**: 智能状态映射、附件处理、评论线程、用户提及翻译、全面验证。

**数据保真度**: 保留 Linear 格式、维护任务关系、保持时间戳、确保引用完整性。

**输出**: 完整的同步结果,包含创建的 issues、附件迁移、评论转移和全面的同步报告。
