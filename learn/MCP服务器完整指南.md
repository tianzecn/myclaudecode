# MCP 服务器完整指南

## 什么是 MCP

MCP (Model Context Protocol) 模型上下文协议是一种开放标准，允许 AI 助手连接各种数据源和工具。它就像一个通用适配器，让 AI 模型理解和交互文本以外的不同类型内容。

## MCP 服务器分类

### 一、文档查询类

#### 1. Context7 - 技术文档查询

**功能**: 查询最新的技术框架文档和代码示例

**支持技术栈**:
- React / Next.js / Vue
- Node.js / Python / Go
- 主流开发框架

**安装**:
```bash
# Claude Code 命令（推荐）
claude mcp add context7 -- npx -y @upstash/context7-mcp

# 或使用 HTTP 传输（需要 API Key）
claude mcp add --transport http context7 https://mcp.context7.com/mcp --header "CONTEXT7_API_KEY: YOUR_API_KEY"

# ZCF 一键安装
npx zcf
# 选择 "4. 配置 MCP" → 选择 Context7

# 手动配置 (settings.json)
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}

# Windows 用户配置
{
  "mcpServers": {
    "context7": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@upstash/context7-mcp"]
    }
  }
}

# 验证安装
claude mcp list
```

**使用示例**:
```bash
# 查询最新文档
请帮我查询 React 18 的新特性

# 查询代码示例
查询 Next.js 服务端组件的最佳实践
```

---

#### 2. DeepWiki - GitHub 仓库文档

**功能**: 查询 GitHub 开源项目的文档和代码示例

**安装**:
```bash
# Claude Code 命令（推荐）
claude mcp add-json "mcp-deepwiki" '{"command": "npx", "args": ["-y", "mcp-deepwiki@latest"]}'

# 或简化命令
claude mcp add deepwiki -- npx -y mcp-deepwiki@latest

# settings.json 配置
{
  "mcpServers": {
    "deepwiki": {
      "command": "npx",
      "args": ["-y", "mcp-deepwiki@latest"]
    }
  }
}

# 验证安装
claude mcp list
```

**使用示例**:
```bash
# 分析开源项目架构
分析 Next.js 项目的架构设计

# 查询特定功能实现
查询 React Router 的实现原理
```

---

### 二、浏览器自动化类

#### 3. Playwright - 浏览器控制

**功能**: 直接控制浏览器进行自动化操作、测试、截图

**安装**:
```bash
# Claude Code 命令（推荐）
claude mcp add playwright -- npx @playwright/mcp@latest

# 或使用 executeautomation 版本
claude mcp add playwright -- npx -y @executeautomation/playwright-mcp-server

# settings.json 配置
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}

# 验证安装
claude mcp list

# 查看可用工具
claude
/mcp
# 导航到 playwright
```

**使用提示**: 首次使用时明确说 "playwright mcp"，否则 Claude 可能尝试用 Bash 运行 Playwright。

**使用示例**:
```bash
# 自动化测试
帮我测试登录页面的功能

# 网页截图
请截取首页的截图并分析设计

# 表单填写
自动填写注册表单并提交
```

---

---

#### 4. Chrome DevTools - 浏览器开发工具

**功能**: 集成 Chrome 开发者工具，用于调试和分析网页

**安装**:
```bash
# 使用 claude 命令添加
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest

# 或使用已安装的全局包
claude mcp add chrome-devtools -- /usr/bin/chrome-devtools-mcp
```

**使用示例**:
```bash
# 调试网页性能
使用 Chrome DevTools 分析页面加载性能

# 检查网络请求
查看页面的所有网络请求
```

---

### 三、搜索引擎类

#### 5. Exa AI - 智能搜索

**功能**: 使用 Exa AI 进行智能网页搜索

**安装**:
```bash
# Claude Code 命令（推荐）
claude mcp add exa -e EXA_API_KEY=YOUR_API_KEY -- npx -y exa-mcp-server

# 使用插件方式（最简单）
/plugin marketplace add exa-labs/exa-mcp-server
/plugin install exa-mcp-server
export EXA_API_KEY="your-api-key-here"

# 使用 HTTP 传输
claude mcp add --transport http exa https://mcp.exa.ai/mcp

# settings.json 配置
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "1581bb97-9ee2-4e96-b975-d48a2fde3c49"
      }
    }
  }
}

# 验证安装
claude mcp list
```

**获取 API Key**: https://dashboard.exa.ai/api-keys

**使用示例**:
```bash
# 搜索最新技术
搜索 2025 年最新的 React 最佳实践

# 搜索行业资讯
搜索 AI 编程工具的最新趋势
```

---

#### 6. Open WebSearch - 免费搜索

**功能**: 多引擎网页搜索 (DuckDuckGo/Bing/Brave)，无需 API key

**特点**:
- ✅ 完全免费
- ✅ 无需 API key
- ✅ 隐私友好
- ✅ 多引擎支持

**安装**:
```bash
# ZCF v2.12.9+ 自动包含
npx zcf i
```

**使用**: AI 需要搜索时自动调用，无需手动操作

---

#### 7. Tavily - 搜索与研究

**功能**: 专业的搜索和研究 API，适合深度内容分析

**安装**:
```bash
# 需要 Tavily API Key
claude mcp add tavily --env TAVILY_API_KEY=your-api-key -- npx -y tavily-mcp

# 或使用已安装的全局包
claude mcp add tavily --env TAVILY_API_KEY=your-api-key -- /usr/bin/tavily-mcp
```

**Tavily API Key**: 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

**使用示例**:
```bash
# 深度研究某个主题
使用 Tavily 深度研究 AI 编程的最新发展

# 行业报告
搜索并分析 2025 年 Web3 行业报告
```

---

#### 8. Web Search Prime (智谱) - 国内搜索

**功能**: 智谱 AI 提供的网页搜索服务，适合国内使用

**安装**:
```bash
# 使用智谱 API
claude mcp add -s user -t http web-search-prime https://open.bigmodel.cn/api/mcp/web_search_prime/mcp --header "Authorization: Bearer 91d3be0ce9a8422e98892b521a2c5bee.tGLOZbR4VCzbZ0o5"
```

**API Key**: 91d3be0ce9a8422e98892b521a2c5bee.tGLOZbR4VCzbZ0o5

**特点**:
- ✅ 国内访问速度快
- ✅ 支持中文搜索优化
- ✅ 智谱 AI 集成

**使用示例**:
```bash
# 搜索国内技术资讯
搜索国内关于 AI 编程的最新文章

# 查询技术文档
查询 Vue 3 中文文档
```

---

### 四、前端开发类

#### 9. Shadcn UI MCP - 组件库

**GitHub**: https://github.com/Jpisnice/shadcn-ui-mcp-server

**功能**: 从 Shadcn UI 组件库查找并生成美观的组件代码

**安装**:
```bash
# Claude Code 命令 - 官方服务器（推荐）
claude mcp add --transport http shadcn https://www.shadcn.io/api/mcp

# 或使用 shadcn CLI 初始化
pnpm dlx shadcn@latest mcp init --client claude

# 社区版本（支持 React/Vue/Svelte）
claude mcp add-json "shadcn-ui-server" '{"command":"npx","args":["-y","shadcn-ui-mcp-server"]}'

# settings.json 配置
{
  "mcpServers": {
    "shadcn": {
      "type": "http",
      "url": "https://www.shadcn.io/api/mcp"
    }
  }
}

# 验证安装
claude mcp list
```

**使用示例**:
```bash
# 生成 UI 组件
请你帮我生成项目的骨架图以提升用户体验，使用 shadcn UI 的 Skeleton 组件来实现

# 创建表单组件
使用 shadcn UI 创建一个登录表单
```

---

#### 10. Figma MCP - 设计转代码

**官方文档**: https://www.builder.io/blog/claude-code-figma-mcp-server

**功能**: 将 Figma 设计转换为代码

**前置要求**:
- Figma Dev 或 Full seat 账号
- 至少一个设计文件

**安装**:

**步骤 1**: 在 Figma 中启用 MCP 服务器
- 打开 Figma Dev Mode
- 启用 MCP Server 选项

**步骤 2**: 连接 Claude Code
```bash
claude mcp add --transport sse figma-dev-mode-mcp-server http://127.0.0.1:3845/sse

# 验证连接
claude mcp list
```

**使用示例**:
```bash
# 基于选择的设计
Add a button to this card. Use my current selection in Figma to get the designs

# 基于 Figma 链接
Convert this sign-up card design to code: [figma-link]
```

**注意**: Figma MCP 有局限性，对于生产环境推荐使用 Fusion 工具。

---

### 五、支付集成类

#### 11. Stripe MCP - 支付功能

**功能**: 快速接入 Stripe 支付能力

**安装**:
```bash
# 添加 Stripe MCP
claude mcp add stripe --transport http https://mcp.stripe.com/

# 启动 Claude Code 并授权
claude
```

**配置**: 需要从 Stripe 控制台获取 API 密钥

**使用示例**:
```bash
# 添加支付页面
请你为当前的 next.js 项目添加一个支付页面，无需复杂的后台逻辑，只实现基础的支付功能。商品的信息请你使用 stripe mcp 从 stripe获取。
```

---

### 六、安全扫描类

#### 12. Semgrep MCP - 代码安全

**GitHub**: https://github.com/semgrep/semgrep/tree/develop/cli/src/semgrep/mcp

**功能**: 集成静态安全分析工具，内置 5000+ 条安全规则

**安装**:
```bash
claude mcp add semgrep --transport http https://mcp.semgrep.ai/mcp
```

**使用示例**:
```bash
# 安全扫描
请你对项目代码进行安全扫描，use semgrep mcp

# 指定规则扫描
使用 semgrep 检查 SQL 注入漏洞
```

---

### 七、工作流管理类

#### 13. Spec Workflow MCP - 需求管理

**GitHub**: https://github.com/Pimzino/spec-workflow-mcp

**功能**: 结构化需求到实现的完整工作流，带交互式仪表板

**安装**:
```bash
# Claude Code 命令（推荐）
claude mcp add spec-workflow -- npx @pimzino/spec-workflow-mcp@latest /path/to/your/project

# 注意：将 /path/to/your/project 替换为实际项目路径
# -- 分隔符确保路径传递给 spec-workflow，而不是 npx

# 全局安装方式
npm i -g @pimzino/spec-workflow-mcp

# 启动仪表板
npx -y @pimzino/spec-workflow-mcp@latest --dashboard

# 验证安装
claude /mcp list spec-workflow
```

**功能**:
- 需求分析和文档化
- 技术设计和架构规划
- 任务自动分解和进度追踪
- 审批和评审流程
- 交互式仪表板

**或安装 VS Code 扩展**，集成到编辑器中

---

### 八、社交媒体自动化类

#### 14. 小红书 MCP - 自动运营

**GitHub**: https://github.com/xpzouying/xiaohongshu-mcp

**功能**: 小红书账号全流程自动化运营

**核心功能**:
- ✅ 登录状态自动保存与实时检查
- ✅ 图文内容批量自动化发布
- ✅ 热门内容关键词搜索
- ✅ 推荐列表实时抓取
- ✅ 帖子详情查询
- ✅ 多账号批量评论发布

**安装**:

**方式 1: 预编译二进制（推荐）**
```bash
# 1. 从 GitHub Releases 下载对应系统版本
# - xiaohongshu-mcp-darwin-arm64 (macOS)
# - xiaohongshu-mcp-linux-amd64 (Linux)
# - xiaohongshu-mcp-windows-amd64.exe (Windows)

# 2. 运行登录工具获取 cookie
./xiaohongshu-login

# 3. 启动 MCP 服务
chmod +x xiaohongshu-mcp-darwin-arm64
./xiaohongshu-mcp-darwin-arm64

# 可视化模式（调试用）
./xiaohongshu-mcp-darwin-arm64 -headless=false

# 4. 验证服务
npx @modelcontextprotocol/inspector
# 浏览器打开 http://localhost:18060/mcp
```

**方式 2: 源码编译**
```bash
# 需要 Golang 环境
git clone https://github.com/xpzouying/xiaohongshu-mcp
cd xiaohongshu-mcp
go run .
```

**客户端配置**:

**Claude Code**:
```bash
claude mcp add --transport http xiaohongshu-mcp http://localhost:18060/mcp
claude mcp list
```

**Cursor**（项目配置 .cursor/mcp.json）:
```json
{
  "mcpServers": {
    "xiaohongshu-mcp": {
      "url": "http://localhost:18060/mcp",
      "description": "小红书内容发布服务"
    }
  }
}
```

**VSCode**（工作区配置）:
```json
{
  "servers": {
    "xiaohongshu-mcp": {
      "url": "http://localhost:18060/mcp",
      "type": "http"
    }
  }
}
```

**Gemini CLI**:
```json
{
  "mcpServers": {
    "xiaohongshu": {
      "httpUrl": "http://localhost:18060/mcp",
      "timeout": 30000
    }
  }
}
```

**使用示例**:
```bash
# 发布内容
帮我写一篇小红书帖子，配图用这个链接：xxx；图片内容是'xxx'，用 xiaohongshu-mcp 发布

# 搜索热门内容
搜索小红书上关于"AI 编程"的热门帖子

# 批量评论
对这些帖子发布评论
```

**运营注意事项**:
1. **标题长度**: 不超过 20 字
2. **发布量**: 单账号建议每日 50 篇左右
3. **登录管理**: 不要在多个网页端同时登录
4. **内容形式**: 图文内容流量优于纯文字

---

### 九、代码质量类

#### 15. Serena MCP - 代码检索

**GitHub**: https://github.com/oraios/serena

**功能**: 语义代码检索和符号级编辑（类似 IDE 功能）

**前置要求**: 需要安装 `uv` (Python 包管理器)
```bash
# macOS
brew install uv

# Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**安装**:
```bash
# Claude Code 命令（推荐）
claude mcp add-json "serena" '{"command":"uvx","args":["--from","git+https://github.com/oraios/serena","serena-mcp-server"]}'

# 或带项目上下文
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project "$(pwd)"

# Windows 用户使用 %cd% 替代 $(pwd)
claude mcp add serena -- uvx --from git+https://github.com/oraios/serena serena start-mcp-server --context ide-assistant --project "%cd%"

# settings.json 配置
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from",
        "git+https://github.com/oraios/serena",
        "serena-mcp-server"
      ]
    }
  }
}

# 验证安装
claude mcp list
```

**说明**: Serena 是免费的 Cursor 和 Windsurf 替代方案，提供语义代码理解和智能编辑能力。

---

### 十、数据库类

#### 16. PostgreSQL MCP

**功能**: 直接查询和操作 PostgreSQL 数据库

**安装**:
```bash
# Claude Code 命令（推荐） - 使用 Bytebase DBHub
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:password@localhost:5432/dbname"

# 替换为实际的数据库连接字符串
# 格式: postgresql://用户名:密码@主机:端口/数据库名

# 使用标准 PostgreSQL MCP Server
claude mcp add postgres -- npx -y @modelcontextprotocol/server-postgres postgresql://localhost/sampledb

# settings.json 配置
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/dbname"
      ]
    }
  }
}

# 或使用环境变量方式
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:password@localhost:5432/dbname"
      }
    }
  }
}

# 验证安装
claude mcp list
```

**连接字符串示例**:
- 本地数据库: `postgresql://postgres:password@localhost:5432/mydb`
- 只读用户: `postgresql://readonly:pass@localhost:5432/analytics`
- 带SSL: `postgresql://user:pass@host:5432/db?sslmode=require`

**使用示例**:
```bash
# 查询数据
查询用户表中最近注册的 10 个用户

# 分析数据
分析订单表的销售趋势
```

---

### 十一、视觉理解类

#### 17. Z.AI 视觉理解 MCP

**功能**: 提供视觉理解能力，分析图片内容

**安装**:
```bash
# 使用智谱 API
claude mcp add zai-mcp-server --env Z_AI_API_KEY=your-api-key -- npx -y @z_ai/mcp-server
```

**获取 API Key**: https://open.bigmodel.cn/

**使用示例**:
```bash
# 分析图片内容
分析这张图片的内容和主题

# 提取图片文字
识别图片中的文字内容
```

---

### 十二、AI 增强类

#### 18. Sequential Thinking - 思维链

**功能**: 增强 AI 的逐步推理能力，提供思维链分析

**安装**:
```bash
# 使用 claude 命令添加
claude mcp add sequential-thinking -- npx -y mcp-server-sequential-thinking

# 或使用已安装的全局包
claude mcp add sequential-thinking -- /usr/bin/mcp-server-sequential-thinking
```

**使用示例**:
```bash
# 复杂问题分析
请使用思维链方式分析这个算法的时间复杂度

# 架构设计
用逐步推理的方式设计这个系统的架构
```

---

#### 19. Magic - AI 增强工具

**功能**: 提供额外的 AI 增强能力和工具集成

**安装**:
```bash
# 使用 claude 命令添加
claude mcp add magic -- npx -y mcp-magic

# 或使用已安装的全局包
claude mcp add magic -- /usr/bin/mcp
```

**使用**: 根据具体场景自动调用

---

## MCP 配置方式

### 方式一: 使用 ZCF 一键配置（推荐）

```bash
# 完整初始化（包含 MCP）
npx zcf i

# 仅配置 MCP
npx zcf
# 选择 "4. 配置 MCP"
```

ZCF 会自动:
- ✅ 检测操作系统
- ✅ 配置正确的命令格式
- ✅ 修复 Windows 兼容性问题
- ✅ 提供交互式选择

---

### 方式二: 手动配置

**配置文件位置**: `~/.claude/settings.json`

**基本配置格式**:
```json
{
  "mcpServers": {
    "服务名称": {
      "command": "命令",
      "args": ["参数1", "参数2"],
      "env": {
        "环境变量": "值"
      }
    }
  }
}
```

**Windows 特殊配置**:
```json
{
  "mcpServers": {
    "context7": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "@context7/mcp-server"]
    }
  }
}
```

---

## 常用 MCP 组合推荐

### 前端开发组合
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "shadcn-ui": {
      "command": "pnpm",
      "args": ["dlx", "shadcn@latest", "mcp", "init", "--client", "claude"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

### 全栈开发组合
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    },
    "stripe": {
      "transport": "http",
      "url": "https://mcp.stripe.com/"
    }
  }
}
```

### 内容运营组合
```json
{
  "mcpServers": {
    "xiaohongshu-mcp": {
      "url": "http://localhost:18060/mcp",
      "type": "http"
    },
    "exa": {
      "command": "npx",
      "args": ["-y", "@exa-labs/mcp-server-exa"],
      "env": {
        "EXA_API_KEY": "your-key"
      }
    }
  }
}
```

### 安全开发组合
```json
{
  "mcpServers": {
    "semgrep": {
      "transport": "http",
      "url": "https://mcp.semgrep.ai/mcp"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

---

## MCP 使用技巧

### 1. 明确指定 MCP 工具

```bash
# 好的做法
请使用 semgrep mcp 对项目进行安全扫描

# 不好的做法
帮我扫描代码（AI 可能不知道用什么工具）
```

### 2. 组合使用多个 MCP

```bash
# 先搜索文档，再实现功能
1. 使用 Context7 查询 React 18 新特性
2. 使用 Shadcn UI 创建组件
3. 使用 Playwright 测试组件
```

### 3. 验证 MCP 连接

```bash
# Claude Code
claude mcp list

# 查看 MCP 状态
claude mcp status
```

---

## 常见问题

### 1. MCP 连接失败

**Windows 用户**:
```bash
# 使用 ZCF 自动修复
npx zcf
# 选择 "4. 配置 MCP"
```

**手动修复**: 在 command 前添加 `cmd /c`

### 2. MCP 服务未响应

**检查步骤**:
```bash
# 1. 验证服务运行
curl http://localhost:18060/mcp

# 2. 重启服务
# 根据不同 MCP 重启对应服务

# 3. 查看日志
# 检查 Claude Code 输出的错误信息
```

### 3. API Key 配置问题

**环境变量方式**:
```bash
export EXA_API_KEY="your-key"
export STRIPE_API_KEY="your-key"
```

**配置文件方式**: 在 settings.json 的 env 字段中配置

---

## 国内 API 配置

### 智谱 API (GLM) 配置

如果使用智谱 AI 的服务，可以配置以下环境变量:

```bash
# Claude Code 使用智谱 API
export ANTHROPIC_BASE_URL=https://open.bigmodel.cn/api/anthropic
export ANTHROPIC_AUTH_TOKEN=your-zhipu-api-key
```

**获取 API Key**: https://open.bigmodel.cn/

**支持的 MCP**:
- Web Search Prime (网页搜索)
- Z.AI (视觉理解)

---

## MCP 开发资源

### 官方资源
- **MCP 官方文档**: https://modelcontextprotocol.io/
- **MCP GitHub**: https://github.com/modelcontextprotocol

### 社区资源
- **Awesome MCP Servers**: https://github.com/appcypher/awesome-mcp-servers
- **MCP Server 模板**: https://github.com/modelcontextprotocol/create-mcp-server

### 工具与框架
- **MCP Inspector**: 验证 MCP 服务
  ```bash
  npx @modelcontextprotocol/inspector
  ```

---

## 总结

本指南涵盖了 **19 个实用 MCP 服务器**，分为 12 大类：

1. **文档查询**: Context7, DeepWiki
2. **浏览器自动化**: Playwright, Chrome DevTools
3. **搜索引擎**: Exa AI, Open WebSearch, Tavily, Web Search Prime
4. **前端开发**: Shadcn UI, Figma MCP
5. **支付集成**: Stripe MCP
6. **安全扫描**: Semgrep MCP
7. **工作流管理**: Spec Workflow MCP
8. **社交媒体**: 小红书 MCP
9. **代码质量**: Serena
10. **数据库**: PostgreSQL MCP
11. **视觉理解**: Z.AI MCP
12. **AI 增强**: Sequential Thinking, Magic

MCP 服务器极大扩展了 Claude Code 的能力边界，通过合理配置和组合使用，可以:

✅ **提升开发效率**: 自动查询文档、生成组件、测试代码
✅ **增强安全性**: 自动扫描代码漏洞
✅ **简化集成**: 快速接入支付、数据库等服务
✅ **自动化运营**: 社交媒体内容发布与管理
✅ **视觉理解**: 图片分析和文字识别
✅ **思维增强**: 逐步推理和问题分析
✅ **降低门槛**: 非技术人员也能使用 AI 完成复杂任务

**推荐使用 ZCF 一键安装和配置 MCP 服务，避免手动配置的复杂性。**

**国内用户推荐**: 使用智谱 API 配合 Web Search Prime 和 Z.AI 视觉理解 MCP，速度更快更稳定。

---

*最后更新: 2025-11-06*
*版本: v2.0 - 新增 Chrome DevTools、Tavily、Web Search Prime、Z.AI、Sequential Thinking、Magic*
