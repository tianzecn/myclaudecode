---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [sync-scope] | --state | --label | --assignee | --milestone
description: 将 GitHub 问题同步到 Linear 工作空间，支持全面的字段映射和速率限制管理
---

# Sync Issues to Linear - 同步 Issues 到 Linear

将 GitHub issues 同步到 Linear 工作空间,智能字段映射: **$ARGUMENTS**

## 当前仓库上下文

- 仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- Issue 数量: !`gh issue list --state all --limit 1 --json number | jq length 2>/dev/null || echo "手动检查"`
- Linear 团队: 可用的 Linear 团队和项目分配
- 速率限制: !`gh api rate_limit -q '.rate | "GitHub: \(.remaining)/\(.limit)"' 2>/dev/null`

## 任务

执行 GitHub issues 到 Linear 工作空间的全面同步:

**同步范围**: 使用 $ARGUMENTS 按 issue 状态、标签、负责人、里程碑或特定 issue 集过滤

**同步框架**:
1. **Issue 发现** - 获取带有全面元数据的 GitHub issues,应用过滤器,验证需求
2. **字段映射** - 将 GitHub 字段转换为 Linear 格式,映射优先级,转换标签,处理负责人
3. **数据验证** - 检查必需字段,验证用户映射,确保数据完整性,防止重复
4. **Linear 集成** - 以正确格式创建任务,应用团队分配,设置项目,管理关系
5. **速率限制管理** - 实现指数退避,批处理操作,监控 API 限制,优化请求
6. **进度跟踪** - 提供实时更新,优雅处理错误,维护同步状态,生成报告

**高级功能**: 智能优先级推断、智能用户映射、增量同步能力、全面错误恢复。

**数据完整性**: 保留格式、维护元数据、创建双向引用、确保审计跟踪。

**输出**: 完整的同步结果,包含成功指标、错误报告、映射摘要和全面的同步分析。
