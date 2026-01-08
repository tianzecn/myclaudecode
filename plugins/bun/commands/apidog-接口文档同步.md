---
name: apidog-接口文档同步
description: 将 API 规范同步到 Apidog。分析现有 schema，创建 OpenAPI 规范，并导入到你的 Apidog 项目中。
---

你必须使用 Task 工具启动 **apidog** 代理来处理此请求。

apidog 代理将会：
1. 验证是否设置了 APIDOG_PROJECT_ID 环境变量
2. 从 Apidog 获取当前的 API 规范
3. 分析现有 schema 并识别可复用的部分
4. 创建带有正确 schema 引用的新 OpenAPI 规范
5. 将规范保存到临时目录
6. 将规范导入到 Apidog
7. 提供验证 URL 和摘要

**重要提示**：此命令需要以下环境变量：
- `APIDOG_PROJECT_ID`：你的 Apidog 项目 ID
- `APIDOG_API_TOKEN`：你的 Apidog API 令牌

如果未设置这些变量，代理将指导你如何配置它们。

现在使用用户的请求启动 apidog 代理。
