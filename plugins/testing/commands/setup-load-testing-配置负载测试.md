---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [testing-type] | --capacity | --stress | --spike | --endurance | --volume
description: 配置全面的负载测试,包含性能指标和瓶颈识别
---

# 配置负载测试

配置全面负载测试,包含性能分析和瓶颈识别:**$ARGUMENTS**

## 当前性能上下文

- 应用类型: !`find . -name "server.js" -o -name "app.py" -o -name "main.go" | head -1 && echo "服务器应用" || echo "检测应用类型"`
- API端点: !`grep -r "app\\.get\\|app\\.post\\|@RequestMapping" . 2>/dev/null | wc -l` 个检测到的端点

## 任务

实现全面负载测试,包含性能优化和瓶颈分析:

**测试类型**: 使用 $ARGUMENTS 聚焦于容量规划、压力测试、峰值测试、耐久性测试或容量测试

**负载测试框架**:
1. **策略和需求** - 分析应用架构、定义测试目标、确定场景
2. **工具选择和设置** - 选择适当工具(k6、Artillery、JMeter、Gatling)
3. **测试场景设计** - 创建现实用户场景、实现API测试脚本
4. **性能指标** - 配置响应时间监控、吞吐量测量
5. **基础设施设置** - 配置测试环境、设置监控仪表板
6. **分析和优化** - 识别性能瓶颈、分析资源约束

**输出**: 完整的负载测试设置,包含配置的场景、性能监控、瓶颈分析和优化建议。
