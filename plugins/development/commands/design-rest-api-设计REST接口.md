---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [api-version] | --v1 | --v2 | --graphql-hybrid | --openapi
description: 设计 RESTful API 架构，包含全面的端点、认证和文档
---

# 设计 REST API

设计全面的 RESTful API 架构：**$ARGUMENTS**

## 当前应用状态

- 框架检测：@package.json 或 @requirements.txt（Express、FastAPI、Spring Boot 等）
- 现有 API：!`grep -r "route\|endpoint\|@app\\.route" src/ 2>/dev/null | wc -l` 个路由
- 认证机制：!`grep -r "auth\|jwt\|session" src/ 2>/dev/null | wc -l` 个认证组件
- 文档：@swagger.yaml 或 @openapi.json（如果存在）

## 任务

设计完整的 RESTful API，遵循行业最佳实践和全面功能：

**API 版本**：使用 $ARGUMENTS 指定 API 版本、GraphQL 混合方案或 OpenAPI 规范

**API 架构**：
1. **资源设计** - RESTful 端点、HTTP 方法、URL 结构、资源关系
2. **请求/响应模型** - 数据验证、序列化、错误处理、状态码
3. **认证与授权** - JWT、OAuth、RBAC、API 密钥、速率限制
4. **API 文档** - OpenAPI/Swagger 规范、交互式文档、代码示例
5. **版本策略** - 基于 URL、请求头或内容类型的版本控制
6. **性能与安全** - 缓存、分页、CORS、输入验证、SQL 注入防护

**高级功能**：实时能力、文件上传、批量操作、Webhook 和监控集成。

**标准合规**：遵循 REST 原则、HTTP 规范和 API 设计最佳实践。

**输出**：完整的 API 规范，包含端点、认证、验证、文档和客户端 SDK。
