---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [sync-mode] | --full | --incremental | --dry-run | --conflict-strategy
description: 启用全面的 GitHub-Linear 双向同步，支持冲突解决
---

# Bidirectional Sync - 双向同步

启用全面的 GitHub-Linear 双向同步: **$ARGUMENTS**

## 当前同步环境

- GitHub 状态: !`gh api user 2>/dev/null && echo "✓ 已认证" || echo "⚠ 未认证"`
- Linear MCP: 检查 Linear MCP 服务器是否可用并已配置
- 同步状态: @.sync-state.json 或 @sync/ (如果存在)
- Webhooks: !`gh api repos/{owner}/{repo}/hooks 2>/dev/null | grep -c linear || echo "0"`

## 任务

实现 GitHub Issues 和 Linear 任务之间的强大双向同步:

**同步模式**: 使用 $ARGUMENTS 指定完全同步、增量同步、预演模式或冲突解决策略

**同步框架**:
1. **同步状态管理** - 初始化同步数据库,跟踪实体关系,维护同步历史
2. **冲突检测** - 识别同时更改,字段级冲突,时序问题
3. **解决策略** - NEWER_WINS、GITHUB_WINS、LINEAR_WINS 或智能字段级合并
4. **事务管理** - 原子操作,回滚能力,分布式锁定
5. **Webhook 集成** - 实时事件处理,同步循环防止,自动触发
6. **数据完整性** - 双向验证,交叉引用维护,审计跟踪

**高级功能**: 字段级合并规则,同步循环防止,webhook 自动化,性能优化,全面监控。

**生产就绪**: 事务安全,冲突解决,错误恢复,性能监控,全面日志记录。

**输出**: 完整的双向同步系统,包含冲突解决、webhook 集成、性能指标和全面的同步报告。
