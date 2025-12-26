# Skill Seekers Plugin

> 自动将文档网站、GitHub 仓库、PDF 文件转换为 Claude AI 技能

[ ![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yusufkaraaslan/Skill_Seekers)
[ ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[ ![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)

## 概述

Skill Seekers 是一个强大的 MCP 服务器，提供 17 个专业工具用于自动生成 Claude AI 技能。它可以从文档网站、GitHub 仓库和 PDF 文件中提取知识，并将其转换为可安装的 Claude 技能。

**原始项目**: [yusufkaraaslan/Skill_Seekers](https://github.com/yusufkaraaslan/Skill_Seekers)

## 前置要求

⚠️ **安装插件后，你需要手动安装 Python 包：**

```bash
# 推荐：使用 uv (自动管理虚拟环境)
uv tool install skill-seekers

# 或使用 pipx
pipx install skill-seekers

# 或使用 pip (需要虚拟环境或 --user)
pip install --user skill-seekers
```

**系统要求：**

* Python 3.10+
* uv (推荐) 或 pipx 或 pip

## 安装


1. 启用插件：

   ```bash
   /plugin install skill-seekers@tianzecn-plugins
   ```
2. 安装 Python 依赖：

   ```bash
   pip install skill-seekers
   ```
3. 重启 Claude Code 会话

## 可用工具 (17 个)

### 配置工具

| 工具 | 功能 |
|----|----|
| `generate_config` | 为文档网站生成配置文件 |
| `list_configs` | 列出所有 25 个预设配置 |
| `validate_config` | 验证配置文件结构 |

### 爬取工具

| 工具 | 功能 |
|----|----|
| `estimate_pages` | 爬取前估计页面数量 |
| `scrape_docs` | 爬取文档网站并构建技能 |
| `scrape_github` | 分析 GitHub 仓库（AST 解析 6 种语言） |
| `scrape_pdf` | 提取 PDF 内容（支持 OCR 和表格） |

### 打包工具

| 工具 | 功能 |
|----|----|
| `package_skill` | 将技能打包为 .zip 文件 |
| `upload_skill` | 上传技能到 Claude |
| `install_skill` | 完整的一键工作流 |

### 分割工具

| 工具 | 功能 |
|----|----|
| `split_config` | 分割大型文档配置 |
| `generate_router` | 生成路由/中枢技能 |

### 源管理工具

| 工具 | 功能 |
|----|----|
| `fetch_config` | 从源获取配置 |
| `submit_config` | 提交配置到源 |
| `add_config_source` | 添加配置源 |
| `list_config_sources` | 列出所有配置源 |
| `remove_config_source` | 删除配置源 |

## 25 个预设配置

开箱即用的配置文件：

| 框架/工具 | 配置文件 |
|----|----|
| React | `react.json` |
| Vue | `vue.json` |
| Django | `django.json` |
| FastAPI | `fastapi.json` |
| Godot | `godot.json` |
| Kubernetes | `kubernetes.json` |
| Laravel | `laravel.json` |
| Tailwind CSS | `tailwind.json` |
| Ansible | `ansible-core.json` |
| Astro | `astro.json` |
| Claude Code | `claude-code.json` |
| Hono | `hono.json` |
| ... | 等等 (共 25 个) |

## 使用示例

## 如何正确提问

笨蛋，你可以这样对本小姐说：

### 简单方式（一句话）

```javascript
"帮我把 https://shipany.ai/zh/docs/ 做成 Claude 技能包"
```

### 带参数的方式

```javascript
"把 https://react.dev/ 爬取成技能包，限制 200 页，命名为 react-docs"
```

### 高级方式

```javascript
"分析 vercel/next.js GitHub 仓库，提取代码结构作为技能"
```

### 从文档网站创建技能

```
使用 scrape_docs 工具从 https://react.dev/ 创建 React 技能
```

### 分析 GitHub 仓库

```
使用 scrape_github 工具分析 facebook/react 仓库
```

### 提取 PDF 内容

```
使用 scrape_pdf 工具从 docs/manual.pdf 创建技能
```

### 列出可用配置

```
使用 list_configs 工具查看所有预设配置
```

## 关键特性

* **llms.txt 支持** - 自动检测 LLM 就绪的文档文件
* **通用爬虫** - 适用于任何文档网站
* **GitHub 分析** - AST 解析 TypeScript、Python、Go、Rust、Java、C#
* **PDF 支持** - 文本提取、OCR、表格识别
* **多源统一爬虫** - 组合文档 + GitHub + PDF
* **冲突检测** - 比较文档和代码实现差异
* **私有配置仓库** - 支持 GitHub、GitLab、Bitbucket
* **异步模式** - 爬虫速度快 2-3 倍

## 相关链接

* **GitHub**: https://github.com/yusufkaraaslan/Skill_Seekers
* **PyPI**: https://pypi.org/project/skill-seekers/
* **作者**: yusufkaraaslan

## 许可证

MIT License - 详见原始仓库