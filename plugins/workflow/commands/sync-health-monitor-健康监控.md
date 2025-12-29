---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [scope] | --github | --linear | --webhooks | --performance | --report
description: 监控并诊断 GitHub-Linear 同步健康状况，支持性能分析和自动化故障排除
---

# Sync Health Monitor - 健康监控器

监控 GitHub-Linear 同步健康和性能: **$ARGUMENTS**

## 当前同步环境

- GitHub API 状态: !`gh api rate_limit -q '.rate | "GitHub: \(.remaining)/\(.limit) 请求"' 2>/dev/null || echo "需要检查 GitHub API"`
- Linear 连接性: Linear MCP 服务器状态和认证验证
- Webhook 状态: 活跃的 webhook 配置和事件处理健康度
- 同步性能: 当前吞吐量、延迟指标和错误率

## 任务

实现具有自动诊断和性能优化的全面同步健康监控:

**监控范围**: 使用 $ARGUMENTS 指定 GitHub 健康、Linear 连接性、webhook 诊断、性能分析或完整健康报告

**健康监控框架**:
1. **API 健康评估** - 监控 GitHub/Linear API 状态、速率限制、认证、连接问题
2. **同步性能分析** - 跟踪吞吐量指标、延迟模式、处理时间、队列深度
3. **错误模式检测** - 识别重复失败、分类错误类型、分析失败趋势
4. **Webhook 诊断** - 验证 webhook 配置、测试事件交付、监控处理延迟
5. **数据完整性验证** - 验证同步一致性、检测孤立记录、验证交叉引用
6. **自动故障排除** - 运行诊断测试、建议修复、实现自动恢复程序

**高级功能**: 实时健康仪表板、预测性故障检测、自动恢复工作流、全面性能分析。

**诊断能力**: 深度错误分析、瓶颈识别、配置验证、自动化测试套件。

**输出**: 完整的健康评估,包含性能指标、错误分析、推荐优化和自动诊断报告。
