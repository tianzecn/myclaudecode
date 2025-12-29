---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [output-format] | --swagger-ui | --redoc | --postman | --insomnia | --multi-format
description: 自动生成 API 参考文档，支持多种输出格式和自动化部署
---

# 自动化 API 文档生成器

自动生成 API 参考文档：$ARGUMENTS

## 当前 API 基础设施

- 代码注释：!`grep -r "@api\|@swagger\|@doc" src/ 2>/dev/null | wc -l` 个注释已找到
- API 框架：@package.json 或从导入检测
- 现有规范：!`find . -name "*spec*.yaml" -o -name "*spec*.json" | head -3`
- 文档工具：!`grep -E "swagger|redoc|postman" package.json 2>/dev/null || echo "未检测到"`
- CI/CD 管道：@.github/workflows/（如果存在）

## 任务

使用现代工具设置自动化 API 文档生成：

1. **API 文档策略分析**
   - 分析当前 API 结构和端点
   - 识别文档要求（REST、GraphQL、gRPC 等）
   - 评估现有代码注释和文档
   - 确定文档输出格式和托管要求
   - 规划文档自动化和维护策略

2. **文档工具选择**
   - 选择适当的 API 文档工具：
     - **OpenAPI/Swagger**：使用 Swagger UI 的 REST API 文档
     - **Redoc**：现代 OpenAPI 文档渲染器
     - **GraphQL**：GraphiQL、Apollo Studio、GraphQL Playground
     - **Postman**：带集合的 API 文档
     - **Insomnia**：API 文档和测试
     - **API Blueprint**：基于 Markdown 的 API 文档
     - **JSDoc/TSDoc**：代码优先的文档生成
   - 考虑因素：API 类型、团队工作流、托管、交互性

3. **代码注释和 Schema 定义**
   - 为 API 端点添加全面的代码注释
   - 定义请求/响应 schema 和数据模型
   - 添加参数描述和验证规则
   - 记录身份验证和授权要求
   - 添加示例请求和响应

4. **API 规范生成**
   - 设置从代码自动生成 API 规范
   - 配置 OpenAPI/Swagger 规范生成
   - 设置 schema 验证和一致性检查
   - 配置 API 版本控制和变更日志生成
   - 设置规范文件管理和版本控制

5. **交互式文档设置**
   - 配置带试用功能的交互式 API 文档
   - 设置 API 测试和示例执行
   - 配置文档中的身份验证处理
   - 设置请求/响应验证和示例
   - 配置 API 端点分类和组织

6. **文档内容增强**
   - 添加全面的 API 指南和教程
   - 创建身份验证和授权文档
   - 添加错误处理和状态码文档
   - 创建 SDK 和客户端库文档
   - 添加速率限制和使用指南

7. **文档托管和部署**
   - 设置文档托管和部署
   - 配置文档网站生成和样式
   - 设置自定义域名和 SSL 配置
   - 配置文档搜索和导航
   - 设置文档分析和使用跟踪

8. **自动化和 CI/CD 集成**
   - 在 CI/CD 管道中配置自动化文档生成
   - 设置文档部署自动化
   - 配置文档验证和质量检查
   - 设置文档变更检测和通知
   - 配置文档测试和链接验证

9. **多格式文档生成**
   - 生成多种格式的文档（HTML、PDF、Markdown）
   - 设置可下载的文档包
   - 配置离线文档访问
   - 设置文档 API 以供程序化访问
   - 配置文档联合和分发

10. **维护和质量保证**
    - 设置文档质量监控和验证
    - 配置文档反馈和改进工作流
    - 设置文档分析和使用指标
    - 创建文档维护程序和指南
    - 培训团队文档最佳实践和工具
    - 设置文档审查和批准流程
