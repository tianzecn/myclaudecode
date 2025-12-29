---
allowed-tools: Bash(find:*)
description: 为端点生成 API 文档
---

## 上下文

- API 路由: !`find . -path "*/routes/*" -name "*.js" -o -path "*/api/*" -name "*.js" | head -20`
- 当前 API 文件: @$ARGUMENTS

## 你的任务

生成全面的 API 文档，包括:

1. **端点概述**: 方法、URL、用途
2. **参数**: 查询参数、路径参数、请求体
3. **请求示例**: 包含 curl 的示例请求
4. **响应示例**: 成功和错误响应
5. **状态码**: 所有可能的 HTTP 状态码
6. **认证**: 如适用，需要的认证

格式化为清晰、易读的文档，可供其他开发者使用。
