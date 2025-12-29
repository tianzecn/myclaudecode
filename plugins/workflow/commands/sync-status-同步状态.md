---
allowed-tools: Read, Bash
argument-hint: [--detailed] | [--health-check] | [--diagnostics]
description: 监控 GitHub-Linear 同步健康状态，提供性能指标和诊断
---

# Sync Status Monitor - 同步状态监控器

监控 GitHub-Linear 同步健康: $ARGUMENTS

## 当前同步状态

- 同步配置: @.sync-config.json 或 @sync/ (如果存在)
- 最近同步日志: !`find . -name "*sync*.log" | head -3`
- GitHub 状态: !`gh api rate_limit` (如果 GitHub CLI 可用)
- 进程状态: !`ps aux | grep -i sync | head -3`

## 任务

分析 GitHub 和 Linear 之间的同步状态。检查同步状态时:

1. **同步状态概览** - 显示最后同步时间、同步项总数、待同步项、失败项
2. **健康指标** - 平均同步时间、最大同步时间、同步成功率
3. **数据质量指标** - 冲突率、重复率、数据完整性分数
4. **API 状态** - GitHub/Linear API 限制、剩余配额、响应时间
5. **Webhook 状态** - 活跃 webhooks、最后触发时间、处理延迟
6. **诊断报告** - 识别问题、建议改进、提供故障排除步骤

**输出格式**: 结构化状态报告,包含指标、健康分数、警告和优化建议。
