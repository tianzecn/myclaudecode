---
name: skill-creation
description: 使用 Skill Seekers MCP 工具生成 Claude AI 技能的完整工作流指南
---

# Skill Creation Workflow

本技能提供使用 Skill Seekers MCP 工具创建 Claude AI 技能的最佳实践和工作流指南。

## 工作流概述

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILL CREATION WORKFLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 选择数据源                                                   │
│     ├── 文档网站 → scrape_docs                                  │
│     ├── GitHub 仓库 → scrape_github                             │
│     └── PDF 文件 → scrape_pdf                                   │
│                                                                  │
│  2. 配置 (可选)                                                  │
│     ├── 使用预设 → list_configs                                 │
│     ├── 生成配置 → generate_config                              │
│     └── 验证配置 → validate_config                              │
│                                                                  │
│  3. 爬取内容                                                     │
│     └── estimate_pages → scrape_* → 本地技能文件                │
│                                                                  │
│  4. 打包和安装                                                   │
│     ├── package_skill → .zip 文件                               │
│     ├── upload_skill → Claude 平台                              │
│     └── install_skill → 一键完成                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 场景一：从文档网站创建技能

### 步骤 1: 检查预设配置

```
使用 list_configs 工具列出所有可用的预设配置
```

如果目标框架有预设配置（如 React、Vue、Django），直接使用。

### 步骤 2: 估计页面数量

```
使用 estimate_pages 工具估计 https://react.dev/ 的页面数
```

这有助于了解爬取工作量和预计时间。

### 步骤 3: 执行爬取

**使用预设配置：**
```
使用 scrape_docs 工具和 react 预设配置爬取 React 文档
```

**使用自定义 URL：**
```
使用 scrape_docs 工具爬取 https://docs.example.com/
```

### 步骤 4: 打包技能

```
使用 package_skill 工具将生成的技能打包为 zip 文件
```

### 步骤 5: 安装技能

```
使用 install_skill 工具安装打包的技能到 Claude
```

## 场景二：从 GitHub 仓库创建技能

### 适用场景

- 需要理解库/框架的内部实现
- 文档不完整或过时
- 需要代码级别的上下文

### 工作流

```
1. 使用 scrape_github 工具分析 owner/repo 仓库
2. 查看生成的 AST 分析结果
3. 使用 package_skill 打包
4. 使用 install_skill 安装
```

### 支持的语言

| 语言 | AST 解析 |
|------|---------|
| TypeScript/JavaScript | ✅ |
| Python | ✅ |
| Go | ✅ |
| Rust | ✅ |
| Java | ✅ |
| C# | ✅ |

## 场景三：从 PDF 创建技能

### 适用场景

- 技术手册和规范文档
- 研究论文和白皮书
- 内部文档和培训材料

### 工作流

```
1. 使用 scrape_pdf 工具提取 path/to/document.pdf 的内容
2. 查看提取结果（文本、表格、图像描述）
3. 使用 package_skill 打包
4. 使用 install_skill 安装
```

### PDF 处理能力

- **文本提取** - 标准 PDF 文本
- **OCR** - 扫描版 PDF 和图像中的文字
- **表格识别** - 结构化表格数据

## 场景四：多源统一技能

### 适用场景

- 需要同时使用文档和代码作为知识源
- 需要检测文档与实现之间的差异

### 工作流

```
1. 使用 scrape_docs 爬取官方文档
2. 使用 scrape_github 分析源码仓库
3. 系统会自动进行冲突检测
4. 统一打包为单一技能
```

## 高级：配置管理

### 创建自定义配置

```
使用 generate_config 工具为 https://docs.example.com/ 生成配置
```

### 配置文件结构

```json
{
  "name": "example-skill",
  "description": "技能描述",
  "base_url": "https://docs.example.com/",
  "start_urls": ["https://docs.example.com/getting-started"],
  "selectors": {
    "main_content": "article",
    "title": "h1",
    "code_blocks": "pre code"
  },
  "url_patterns": {
    "include": ["/docs", "/api"],
    "exclude": ["/blog", "/changelog"]
  },
  "rate_limit": 0.5,
  "max_pages": 200
}
```

### 验证配置

```
使用 validate_config 工具验证 my-config.json 的结构
```

## 高级：配置源管理

### 添加私有配置仓库

```
使用 add_config_source 添加 GitHub 仓库作为配置源：
https://github.com/myorg/skill-configs
```

### 从源获取配置

```
使用 fetch_config 从配置源获取 my-framework 配置
```

### 提交配置

```
使用 submit_config 将本地配置提交到配置源
```

## 最佳实践

### 1. 先估计再爬取

始终先使用 `estimate_pages` 了解工作量，避免爬取过多无关内容。

### 2. 使用预设配置

25 个预设配置经过优化，优先使用它们而非从头创建。

### 3. 分割大型技能

超过 500 页的文档应使用 `split_config` 分割，然后用 `generate_router` 创建路由技能。

### 4. 定期更新

框架和库会更新，定期重新爬取以保持技能的时效性。

### 5. 验证配置

提交或分享配置前，始终使用 `validate_config` 验证。

## 故障排除

### 爬取失败

1. 检查网站是否有反爬机制
2. 调整 `rate_limit` 降低请求频率
3. 使用更精确的 `url_patterns` 排除无关页面

### PDF 提取问题

1. 确保 PDF 不是纯图像格式（如需要启用 OCR）
2. 检查 PDF 是否有密码保护
3. 对于复杂表格，可能需要手动调整

### GitHub 分析问题

1. 确保仓库是公开的或提供了正确的访问令牌
2. 大型仓库可能需要更长时间
3. 某些语言可能不支持 AST 解析

## 相关资源

- [Skill Seekers GitHub](https://github.com/yusufkaraaslan/Skill_Seekers)
- [预设配置列表](https://github.com/yusufkaraaslan/Skill_Seekers/tree/main/configs)
- [完整文档](https://github.com/yusufkaraaslan/Skill_Seekers#readme)
