---
allowed-tools: Bash, WebFetch
argument-hint: [data-source] | --xatu | --custom-url | --validate
description: 从 llms.txt 文件或自定义来源加载并处理外部文档上下文
---

# 外部文档上下文加载器

加载外部文档上下文：$ARGUMENTS

## 当前上下文状态

- 网络访问：!`curl -s --connect-timeout 5 https://httpbin.org/status/200 >/dev/null && echo "✅ 可用" || echo "❌ 受限"`
- 现有上下文：检查本地 llms.txt 或文档缓存
- 项目类型：@package.json 或 @README.md（检测项目上下文需求）

## 任务

从指定来源加载并处理外部文档上下文。

### 默认操作（Xatu 数据）
从 Xatu 数据仓库加载 llms.txt 文件：
```bash
curl -s https://raw.githubusercontent.com/ethpandaops/xatu-data/refs/heads/master/llms.txt
```

### 自定义来源加载
对于自定义 URL 或替代文档来源：
- 验证 URL 可访问性
- 下载并缓存内容
- 处理和结构化信息
- 与项目上下文集成

### 处理选项
- **原始加载**：直接内容检索
- **验证**：检查内容格式和结构
- **集成**：与现有项目文档合并
- **缓存**：本地存储以供离线访问
