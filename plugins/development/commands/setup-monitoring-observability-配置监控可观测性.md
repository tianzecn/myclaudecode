---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [monitoring-type] | --metrics | --logging | --tracing | --full-stack
description: 配置全面的监控和可观测性，包含指标、日志、追踪和告警
---

# 配置监控与可观测性

配置全面的监控和可观测性基础设施：**$ARGUMENTS**

## 当前应用状态

- 应用类型：@package.json 或 @requirements.txt（检测框架和服务）
- 现有监控：!`find . -name "*prometheus*" -o -name "*grafana*" -o -name "*jaeger*" | wc -l`
- 基础设施：@docker-compose.yml 或 @kubernetes/ 或云平台检测
- 日志设置：!`grep -r "winston\|logging\|console.log" src/ 2>/dev/null | wc -l`

## 任务

实现生产就绪的监控和可观测性，具有全面的洞察力：

**监控类型**：使用 $ARGUMENTS 专注于指标、日志、分布式追踪或完整的可观测性堆栈

**可观测性堆栈**：
1. **指标收集** - 应用指标、基础设施监控、业务 KPI、自定义仪表板
2. **日志基础设施** - 集中式日志、结构化日志、日志聚合、搜索能力
3. **分布式追踪** - 请求追踪、性能分析、瓶颈识别、服务依赖
4. **告警系统** - 智能告警、升级策略、通知渠道、事件管理
5. **性能监控** - APM 集成、真实用户监控、合成监控、SLA 跟踪
6. **分析与报告** - 使用分析、性能趋势、容量规划、业务洞察

**平台集成**：Prometheus、Grafana、ELK Stack、Jaeger、DataDog、New Relic、云原生解决方案。

**生产特性**：高可用性、数据保留策略、安全控制、成本优化。

**输出**：完整的可观测性平台，具有实时监控、智能告警和全面的分析仪表板。
