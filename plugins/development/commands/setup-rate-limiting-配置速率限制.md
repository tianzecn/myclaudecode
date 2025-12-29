---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [rate-limit-type] | --api | --authentication | --file-upload | --database
description: 实现全面的 API 速率限制，支持高级算法和用户特定策略
---

# 配置速率限制

实现全面的 API 速率限制，具有高级控制机制：**$ARGUMENTS**

## 当前 API 状态

- 框架检测：@package.json 或 @requirements.txt（Express、FastAPI、Spring Boot 等）
- 现有速率限制：!`grep -r "rate.limit\|throttle\|rateLimit" src/ 2>/dev/null | wc -l`
- Redis 可用性：!`redis-cli ping 2>/dev/null || echo "Redis 不可用"`
- API 端点：!`grep -r "route\|endpoint\|@app\\.route" src/ 2>/dev/null | wc -l`

## 任务

实现生产就绪的速率限制系统，具有复杂的算法和用户策略：

**速率限制类型**：使用 $ARGUMENTS 专注于 API 速率限制、认证限制、文件上传控制或数据库访问限制

**速率限制架构**：
1. **算法实现** - 令牌桶、滑动窗口、固定窗口、漏桶算法
2. **用户策略** - 基于层级的限制、认证 vs 匿名、用户特定配额、基于 IP 的控制
3. **存储后端** - Redis 集成、分布式速率限制、持久化策略、故障转移机制
4. **端点配置** - 每路由限制、特定方法规则、动态配置、A/B 测试
5. **监控与分析** - 使用跟踪、滥用检测、性能指标、告警系统
6. **旁路机制** - 白名单管理、内部请求处理、紧急覆盖

**高级功能**：自适应速率限制、基于地理位置的控制、API 密钥管理、配额系统、滥用预防。

**生产就绪**：高可用性、性能优化、安全控制、全面监控。

**输出**：完整的速率限制系统，具有智能策略、全面监控和高级滥用预防能力。
