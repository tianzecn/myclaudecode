---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [schema-approach] | --schema-first | --code-first | --federation
description: 实现 GraphQL API，包含全面的架构、解析器和实时订阅
---

# 实现 GraphQL API

使用现代最佳实践实现全面的 GraphQL API：**$ARGUMENTS**

## 当前应用上下文

- 框架：@package.json 或 @requirements.txt（检测 Apollo、GraphQL Yoga 等）
- 现有 API：!`find . -name "*.graphql" -o -name "*schema*" -o -name "*resolver*" | wc -l`
- 数据库集成：@prisma/schema.prisma 或数据库连接配置
- 认证：!`grep -r "auth\|jwt\|context" src/ 2>/dev/null | wc -l`

## 任务

构建生产就绪的 GraphQL API，具有全面的功能和性能优化：

**架构方法**：使用 $ARGUMENTS 指定 schema-first、code-first 或 federation 架构

**GraphQL 实现**：
1. **Schema 设计** - 类型定义、查询、变更、订阅、自定义标量
2. **解析器架构** - 数据获取、认证、授权、错误处理
3. **DataLoader 集成** - 防止 N+1 查询、批量加载、缓存策略
4. **实时功能** - WebSocket 订阅、实时数据更新、连接管理
5. **安全与性能** - 查询复杂度分析、深度限制、速率限制
6. **开发工具** - GraphQL Playground、内省、Schema 拼接

**高级功能**：文件上传、联邦 Schema、Apollo Federation、Schema 指令和监控。

**生产就绪**：实现全面的错误处理、日志记录、指标和部署策略。

**输出**：完整的 GraphQL API，包含优化的解析器、实时能力、安全控制和开发者文档。
