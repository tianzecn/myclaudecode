---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [import-scope] | --state | --label | --milestone | --batch-size
description: 批量导入 GitHub 问题到 Linear，支持全面的进度追踪和错误处理
---

# Bulk Import Issues - 批量导入问题

批量导入 GitHub issues 到 Linear,具有高级处理能力: **$ARGUMENTS**

## 当前导入上下文

- 仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- Issue 数量: !`gh api repos/{owner}/{repo}/issues?state=all --paginate | jq length 2>/dev/null || echo "手动检查"`
- Linear 团队: 检查可用的 Linear 团队和项目以进行导入映射
- 速率限制: !`gh api rate_limit -q '.rate | "GitHub: \(.remaining)/\(.limit)"' 2>/dev/null || echo "检查 GitHub 速率限制"`

## 任务

执行 GitHub issues 到 Linear 的高效批量导入,全面管理:

**导入范围**: 使用 $ARGUMENTS 按状态、标签、里程碑过滤或配置批处理参数

**导入管道**:
1. **预导入分析** - Issue 发现,重复检测,导入估算,资源规划
2. **批次配置** - 动态批次大小,速率限制管理,进度跟踪,错误处理
3. **数据转换** - 字段映射,优先级推断,用户映射,内容增强
4. **导入执行** - 并行处理,重试逻辑,事务管理,进度报告
5. **错误恢复** - 失败项处理,重试机制,部分导入恢复,验证
6. **导入后操作** - 交叉引用创建,GitHub 更新,映射文件,通知

**高级功能**: 动态批次调整,智能速率限制,重复检测,全面错误恢复,进度可视化。

**质量保证**: 预导入验证,导入后验证,数据完整性检查,全面审计跟踪。

**输出**: 完整的导入结果,包含成功指标、失败项报告、映射文档和大规模 issue 迁移的性能分析。
