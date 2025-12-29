---
description: 此命令提供 Claude Code 创建 MCP 的桌面扩展或 .dxt 文件所需的上下文
author: Anand Tyagi
author-url: https://github.com/ananddtyagi
version: 1.0.0
---

我想将此构建为桌面扩展（缩写为 "DXT"）。请按照以下步骤操作：

1. **彻底阅读规范:**
   - https://github.com/anthropics/dxt/blob/main/README.md - DXT 架构概述、功能和集成模式
   - https://github.com/anthropics/dxt/blob/main/MANIFEST.md - 完整的扩展清单结构和字段定义
   - https://github.com/anthropics/dxt/tree/main/examples - 参考实现，包括 "Hello World" 示例

2. **创建正确的扩展结构:**
   - 按照 MANIFEST.md 规范生成有效的 manifest.json
   - 使用 @modelcontextprotocol/sdk 实现 MCP 服务器，包含正确的工具定义
   - 包含适当的错误处理和超时管理

3. **遵循最佳开发实践:**
   - 通过 stdio 传输实现正确的 MCP 协议通信
   - 使用清晰的模式、验证和一致的 JSON 响应来构建工具
   - 利用此扩展将在本地运行这一事实
   - 添加适当的日志记录和调试功能
   - 包含正确的文档和设置说明

4. **测试注意事项:**
   - 验证所有工具调用都返回正确结构化的响应
   - 验证清单正确加载且主机集成正常工作

生成完整的、可立即测试的生产就绪代码。专注于防御性编程、清晰的错误消息，并遵循精确的 DXT 规范以确保与生态系统的兼容性。
