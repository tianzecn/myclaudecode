# Claude Code 插件完整参考手册

> 本文档详细记录 plugins 目录下所有插件的 Agents、Commands、Skills，包含描述、触发词和使用示例。
> 生成日期：2025-12-27

---

## 📋 目录

- [插件总览](#插件总览)
- [1. agentdev - 代理开发插件](#1-agentdev---代理开发插件)
- [2. frontend - 前端开发插件](#2-frontend---前端开发插件)
- [3. bun - 后端开发插件](#3-bun---后端开发插件)
- [4. code-analysis - 代码分析插件](#4-code-analysis---代码分析插件)
- [5. coding - 编码工作流插件](#5-coding---编码工作流插件)
- [6. orchestration - 多代理编排插件](#6-orchestration---多代理编排插件)
- [7. superpowers - 核心技能库](#7-superpowers---核心技能库)
- [8. superpowers-chrome - Chrome 浏览器控制](#8-superpowers-chrome---chrome-浏览器控制)
- [9. episodic-memory - 对话记忆搜索](#9-episodic-memory---对话记忆搜索)
- [10. 其他插件](#10-其他插件)
- [11. claude-skills - Awesome 技能集合](#11-claude-skills---awesome-技能集合)

---

## 插件总览

| 插件 | 版本 | Agents | Commands | Skills | 主要用途 |
|------|------|--------|----------|--------|----------|
| agentdev | v1.3.0 | 3 | 4 | 3 | 代理/命令开发与多模型验证 |
| frontend | v3.13.0 | 11 | 8 | 14 | 全功能前端开发工具包 |
| bun | v1.5.2 | 3 | 4 | 2 | TypeScript 后端开发 |
| code-analysis | v2.7.0 | 1 | 4 | 12 | 深度代码分析与调查 |
| coding | v1.3.0 | 0 | 6 | 0 | 需求分析与 GitHub Issue 自动化 |
| orchestration | v0.6.0 | 0 | 2 | 6 | 多代理协调与工作流编排 |
| superpowers | v4.0.2 | 1 | 3 | 14 | 核心技能库（TDD、调试） |
| superpowers-chrome | v1.6.1 | 1 | 0 | 1 | Chrome DevTools 控制 |
| episodic-memory | v1.0.15 | 1 | 1 | 1 | 对话历史语义搜索 |
| claude-skills | v1.0.0 | 0 | 0 | 27 | Awesome 技能集合（开发/营销/创意/文档） |

---

## 1. agentdev - 代理开发插件

**版本**: v1.3.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 创建、实现和审查 Claude Code 代理与命令，支持多模型验证和 LLM 性能追踪。

### 1.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **architect** | opus | 专家级代理/命令设计师，规划新代理、改进现有代理或设计斜杠命令 | 需要设计新代理、规划代理改进、设计命令架构 | "设计一个 GraphQL 审查代理"<br>"规划 backend-developer 代理的改进"<br>"设计一个 /deploy-aws 命令" |
| **developer** | sonnet | 专家级代理/命令实现者，根据已批准的设计方案创建代理/命令文件 | 有设计方案后需要实现、创建命令文件、修复代理问题 | "根据 ai-docs/agent-design.md 实现代理"<br>"创建 /deploy 命令"<br>"修复 backend-developer 代理" |
| **reviewer** | opus | 专家级代理/命令质量审查员，验证已实现代理的质量和标准合规性 | 验证代理质量、检查标准合规性、审查命令设计 | "审查 .claude/agents/graphql-reviewer.md"<br>"检查 plugins/bun/agents/backend-developer.md"<br>"对 /deploy-aws 命令提供反馈" |

### 1.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/develop` | 完整周期代理/命令开发，编排 architect → developer → reviewer 工作流，追踪性能到 ai-docs/llm-performance.json | 开发新代理、需要多模型验证、完整开发流程 | `/develop "设计一个代码审查代理"`<br>`/develop "创建 /deploy 命令"` |
| `/创建命令` | 交互式创建 Claude Code 斜杠命令，自动生成规范命令文件并注册到插件 | 快速创建命令、需要规范格式、自动注册 | `/创建命令` |
| `/发布` | 发布插件到市场，自动更新版本号、marketplace.json、创建 Git Tag 并推送 | 准备发布插件、需要版本管理、市场发布 | `/发布` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能、查看可用命令 | `/help` |

### 1.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **xml-standards** | Claude Code 代理和命令的 XML 标签结构模式，遵循 Anthropic 最佳实践 | XML、标签结构、Anthropic 规范 | "代理的 XML 结构应该怎么写？"<br>"Anthropic XML 最佳实践是什么？" |
| **patterns** | Claude Code 常用代理模式和模板，包括代理模式、TodoWrite 集成、质量检查 | 代理模式、模板、TodoWrite | "有哪些常用的代理模式？"<br>"TodoWrite 如何集成到代理？" |
| **schemas** | Claude Code 代理和命令的 YAML frontmatter 架构验证 | YAML、frontmatter、架构 | "代理 frontmatter 的格式是什么？"<br>"如何验证命令的 YAML 架构？" |

---

## 2. frontend - 前端开发插件

**版本**: v3.13.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 全功能前端开发工具包，支持 TypeScript、React 19、Vite、TanStack Router & Query v5、shadcn/ui。

### 2.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **developer** | sonnet | TypeScript/React 实现代理，创建组件、添加功能、实现表单验证 | 创建组件、添加功能、实现验证、重构代码 | "创建一个用户资料卡组件，包含头像、姓名和简介"<br>"给登录页面添加表单验证"<br>"仪表板需要一个新的分析小部件" |
| **architect** | opus | 前端架构规划代理，创建 React 应用的综合开发路线图 | 创建新应用架构、规划技术栈迁移、设计复杂应用结构 | "我需要创建一个管理用户和租户的 SaaS 管理仪表板"<br>"需要将管理面板迁移到 Vite、TanStack Router 和 TanStack Query"<br>"如何用 TypeScript 和 Tailwind 构建多租户管理仪表板？" |
| **plan-reviewer** | opus | 多模型架构计划审查代理，在实现前提供外部 AI 视角 | 架构计划完成后需要多视角审查、获取外部模型意见 | "架构计划完成了，需要外部模型审查潜在问题"<br>"能让 GPT-5 Codex 审查一下这个架构吗？"<br>"我想让 Grok 和 Codex 都审查这个计划" |
| **tester** | sonnet | UI 手动测试代理，使用 Chrome DevTools MCP 进行界面交互测试 | 测试 UI 功能、验证表单、检查控制台错误 | "我刚更新了 localhost:3000 上的结账流程，能测试一下吗？"<br>"请验证 staging.example.com 上的登录表单验证是否工作"<br>"检查模态框点击 X 按钮是否正常关闭" |
| **test-architect** | opus | 测试策略代理，全面测试覆盖分析和实现 | 完成功能需要测试、测试失败需要分析、需要测试策略 | "我完成了 UserAuthService 类的登录、登出和令牌刷新方法，能创建必要的测试吗？"<br>"重构支付处理模块后有 5 个测试失败了，能帮忙分析吗？" |
| **api-analyst** | sonnet | API 文档分析代理，分析 OpenAPI 规范提供准确实现指导 | 实现 API 集成、调试 API 错误、验证数据类型 | "我需要从 /api/users 端点获取用户数据"<br>"创建租户时收到 400 错误"<br>"日期字段创建用户时应该是什么格式？" |
| **cleaner** | haiku | 项目清理代理，识别和移除开发过程中创建的临时文件 | 实现完成后清理、移除临时文件、项目整理 | "太好了！支付处理功能运行完美，现在需要清理所有东西"<br>"代码重构完成所有测试通过，能清理项目吗？" |
| **reviewer** | opus | 高级代码审查代理，检查简洁性原则、安全标准和生产就绪性 | 完成功能后审查、提交前检查、准备 PR | "我刚完成了使用 JWT 令牌的用户认证模块"<br>"重构了支付处理服务使用新的网关 API"<br>"能审查我创建的数据库迁移脚本吗？" |
| **designer** | sonnet | 设计审查代理，通过 DOM 检查和 CSS 分析验证 UI 组件匹配设计参考 | 验证 UI 与设计匹配、检查颜色间距、设计保真度审查 | "我完成了 UserProfile 组件的实现，能对比 Figma 设计验证吗？"<br>"我觉得表单的颜色可能与设计不符，能检查吗？"<br>"这是 CreateDialog 组件的实现" |
| **css-developer** | sonnet | CSS 架构代理，提供 CSS 模式指导并确保样式更改不破坏现有样式 | 了解 CSS 架构、全局样式更改、Tailwind 模式 | "这个应用的表单输入使用什么 CSS 模式？"<br>"想全局更新按钮样式，应该怎么做？"<br>"这个项目常用什么 Tailwind 布局工具类？" |
| **ui-developer** | sonnet | 高级 UI 开发代理，基于设计参考实现或修复 UI 组件 | 修复设计差异、实现 Figma 设计、响应式改进 | "设计师发现 UserProfile 组件有几个颜色和间距问题"<br>"能按这个 Figma 设计实现 ProductCard 组件吗？"<br>"导航菜单在移动端表现不好" |

### 2.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/implement` | 完整周期功能实现，包含多代理编排和质量门控，支持智能工作流检测（API/UI/混合） | 实现新功能、需要完整开发流程、多代理协作 | `/implement "创建用户认证模块"`<br>`/implement "添加数据导出功能"` |
| `/implement-ui` | 从设计参考实现 UI 组件，支持智能验证和自适应代理切换 | 按设计实现组件、Figma 设计落地、UI 开发 | `/implement-ui "按照 Figma 设计实现 ProductCard 组件"` |
| `/import-figma` | 从 Figma Make 项目导入 UI 组件到 React 项目 | 导入 Figma 组件、设计到代码转换 | `/import-figma` |
| `/api-docs` | 分析 API 文档，获取端点、数据类型和请求/响应格式信息 | 查询 API 文档、了解端点规范、调试 API 问题 | `/api-docs "用户端点的请求格式是什么？"` |
| `/cleanup-artifacts` | 智能清理项目中的临时文件和开发文件 | 开发完成后清理、移除临时文件 | `/cleanup-artifacts` |
| `/validate-ui` | 多代理编排的 UI 设计验证，支持迭代修复和可选外部 AI 专家审查 | 验证 UI 设计、检查设计保真度 | `/validate-ui` |
| `/review` | 多模型代码审查编排器，支持并行执行和共识分析（3-5x 加速） | 代码审查、多模型验证、共识分析 | `/review`<br>`/review --files src/auth/` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能、查看可用命令 | `/help` |

### 2.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **core-principles** | React 19 SPA 开发的核心原则和项目结构 | 项目结构、核心原则、代理执行规则 | "这个项目的目录结构应该怎么组织？"<br>"React 19 项目有哪些核心原则？" |
| **tooling-setup** | 配置 Vite、TypeScript、Biome 和 Vitest | Vite、TypeScript、Biome、Vitest、配置 | "如何配置 Vite 构建工具？"<br>"Biome 的 lint 规则怎么设置？" |
| **react-patterns** | React 19 特定模式，包括 React Compiler、Server Actions、Forms 和新 Hooks | React 19、React Compiler、Server Actions | "React 19 的新 Hooks 有哪些？"<br>"如何使用 Server Actions？" |
| **tanstack-router** | TanStack Router 类型安全、基于文件的路由模式 | 路由、TanStack Router、类型安全、导航 | "如何设置类型安全的路由？"<br>"TanStack Router 的文件路由怎么配置？" |
| **tanstack-query** | TanStack Query v5 异步状态管理完整指南（900+ 行） | 数据获取、查询、缓存、mutations、乐观更新 | "如何实现乐观更新？"<br>"查询缓存失效策略是什么？" |
| **router-query-integration** | TanStack Router 与 TanStack Query 集成 | 路由加载器、预取、导航性能 | "路由加载器如何预取数据？"<br>"如何优化导航性能？" |
| **api-integration** | Apidog + OpenAPI 规范与 React 应用集成 | Apidog、OpenAPI、MCP、类型生成 | "如何从 OpenAPI 生成 TypeScript 类型？"<br>"Apidog MCP 怎么配置？" |
| **performance-security** | 性能优化、可访问性和安全最佳实践 | 性能、可访问性、安全、代码分割 | "如何实现代码分割？"<br>"有哪些安全最佳实践？" |
| **browser-debugger** | 使用 Chrome DevTools MCP 进行 UI 功能测试和调试 | UI 测试、设计验证、控制台错误 | "如何用 Chrome MCP 测试 UI？"<br>"怎么调查控制台错误？" |
| **api-spec-analyzer** | 分析 OpenAPI 规范以提供 TypeScript 接口和实现指导 | OpenAPI、API 文档、TypeScript 接口 | "这个 API 端点的请求格式是什么？"<br>"如何处理 400 错误？" |
| **ui-implementer** | 基于设计参考从头实现 UI 组件 | Figma、设计截图、像素完美 | "按照这个 Figma 设计实现组件"<br>"如何做到像素完美？" |
| **shadcn-ui** | shadcn/ui 组件库使用指南 | shadcn、组件、Radix UI、Tailwind | "如何使用 shadcn 的 Dialog 组件？"<br>"shadcn 组件怎么自定义样式？" |
| **dependency-check** | 检查命令所需依赖（Chrome DevTools MCP、OpenRouter API） | 依赖检查、Chrome MCP、OpenRouter | "检查 /implement 命令的依赖"<br>"OpenRouter API 配置好了吗？" |
| **claudish-usage** | 通过子代理使用 Claudish CLI 运行外部 AI 模型 | claudish、外部 AI、OpenRouter、Grok | "用 Grok 审查这段代码"<br>"如何使用 GPT-5 进行验证？" |

---

## 3. bun - 后端开发插件

**版本**: v1.5.2 | **作者**: tianzecn | **许可**: MIT

**描述**: 生产就绪的 TypeScript 后端开发，使用 Bun 运行时。

### 3.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **backend-developer** | sonnet | TypeScript 后端开发专家，实现 API 端点、服务和数据库集成 | 创建端点、添加仓库、实现中间件、添加缓存 | "创建用户注册端点，包含邮箱验证和密码哈希"<br>"添加管理帖子的 Prisma 仓库"<br>"实现 JWT 认证中间件"<br>"给用户资料端点添加缓存" |
| **api-architect** | opus | 后端 API 架构专家，创建全面的开发计划和架构蓝图 | 创建新 REST API、添加认证授权、微服务迁移 | "需要创建任务管理系统的 REST API，包含用户、项目和任务"<br>"需要为现有 API 添加 JWT 认证和基于角色的访问控制"<br>"应该如何构建单体 API 以准备微服务迁移？" |
| **apidog** | sonnet | API 文档同步专家，分析现有 schema 并将 OpenAPI 规范导入 Apidog | 添加端点到 Apidog、导入 OpenAPI 规范 | "需要将新的 POST /api/users 端点添加到 Apidog 项目"<br>"将这个 OpenAPI 规范导入到 Apidog 项目" |

### 3.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/implement-api` | 完整周期 API 实现，包含多代理编排、架构规划、实现、测试和质量门控 | 实现完整 API 功能、需要架构到测试的全流程 | `/implement-api "创建用户认证 API"` |
| `/setup-project` | 初始化新的 Bun + TypeScript 后端项目，包含最佳实践配置（Hono、Prisma、Biome、测试、Docker） | 创建新项目、需要标准化配置 | `/setup-project` |
| `/apidog` | 将 API 规范同步到 Apidog，分析现有 schema 并创建 OpenAPI 规范 | 同步 API 文档、更新 Apidog | `/apidog` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能 | `/help` |

### 3.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **best-practices** | Bun TypeScript 后端最佳实践（2025 版），包含 camelCase 命名规范、清洁架构模式、安全最佳实践 | Bun、后端、最佳实践、架构、Prisma | "Bun 项目的目录结构怎么组织？"<br>"Prisma ORM 的最佳实践是什么？" |
| **claudish-usage** | 通过子代理使用 Claudish CLI 运行外部 AI 模型 | claudish、外部 AI、OpenRouter | "用外部 AI 模型验证这个实现"<br>"如何配置 Claudish？" |

---

## 4. code-analysis - 代码分析插件

**版本**: v2.7.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 深度代码调查，强制使用 claudemem v0.4.0 AST 结构分析，支持 PageRank 符号重要性排名。

### 4.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **codebase-detective** | sonnet | 代码库侦探，使用 claudemem AST 分析执行全面的代码调查和导航 | 理解代码实现、查找 API 调用、调试问题、分析架构 | "这个应用的认证是如何处理的？"<br>"/api/users 端点在哪里被调用？"<br>"支付处理似乎坏了，能调查一下可能的问题吗？" |

### 4.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/analyze` | 启动代码库侦探代理，执行深度代码调查，理解架构、追踪功能、查找实现、分析代码模式 | 需要理解代码工作原理、查找实现、追踪功能流程 | `/analyze "认证系统是如何工作的？"`<br>`/analyze "查找所有数据库查询"` |
| `/setup` | 添加 claudemem 强制规则到项目 CLAUDE.md 并验证设置 | 设置 claudemem 强制规则、验证配置 | `/setup` |
| `/深度思考` | 深度分析和问题解决，采用多维度思考 | 需要深度分析复杂问题、做技术决策 | `/深度思考 "应该选择 Redux 还是 Zustand？"` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能 | `/help` |

### 4.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **deep-analysis** | 深度代码分析主技能，启动带有 claudemem 索引记忆的代码库侦探 | how does X work、investigate、analyze | "这个认证系统是如何工作的？"<br>"调查一下支付模块的实现" |
| **claudemem-search** | 语义代码搜索和 AST 结构分析专家指南 | semantic search、AST、callers、callees | "查找所有调用 AuthService 的地方"<br>"这个函数的调用链是什么？" |
| **claudemem-orchestration** | 多代理代码分析编排，在并行代理间共享 claudemem 输出 | multi-agent、parallel、consensus | "用多个代理分析这个模块"<br>"并行审计代码质量" |
| **code-search-selector** | 代码搜索工具选择决策树，防止工具熟悉度偏见 | audit、investigate、find all、where is | "所有 API 端点在哪里？"<br>"查找所有数据库查询" |
| **search-interceptor** | 搜索拦截器，在读取 3+ 文件或广泛模式 Glob 之前自动调用 | Read 3+ files、Glob broad patterns | "读取整个 src 目录"<br>"查找所有 .ts 文件" |
| **architect-detective** | 架构侦探，用于系统设计、层组织、设计模式发现 | architecture、system design、layers | "这个项目的架构是什么？"<br>"使用了哪些设计模式？" |
| **developer-detective** | 开发者侦探，用于实现追踪、数据流分析和集成审计 | how does X work、trace data flow | "用户登录流程是怎样的？"<br>"数据是如何从前端流向数据库的？" |
| **tester-detective** | 测试侦探，用于测试覆盖分析、测试质量审计 | test coverage、missing tests | "这个模块的测试覆盖率如何？"<br>"哪些功能缺少测试？" |
| **debugger-detective** | 调试侦探，用于 bug 源定位、根因分析和错误追踪 | find bug、root cause、debug | "为什么登录功能坏了？"<br>"追踪这个 500 错误的根因" |
| **ultrathink-detective** | 超级思考侦探（Opus），结合所有侦探视角进行综合审计 | comprehensive audit、deep analysis | "对整个支付系统做全面审计"<br>"深度分析这个遗留代码库" |
| **cross-plugin-detective** | 跨插件侦探集成指南，将代理角色映射到适当的侦探技能 | cross-plugin、agent mapping | "如何与前端插件协作分析？"<br>"映射代理到侦探技能" |
| **claudish-usage** | 通过子代理使用 Claudish CLI 运行外部 AI 模型 | claudish、external AI、OpenRouter | "用 Grok 分析这段代码"<br>"让 GPT-5 审查实现" |

---

## 5. coding - 编码工作流插件

**版本**: v1.3.0 | **作者**: tianzecn | **许可**: MIT

**描述**: AI 驱动的需求分析与 GitHub Issue 自动创建。

### 5.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/需求分析` | AI 驱动的需求分析，深度分析代码库并自动创建结构化 GitHub Issue，包含技术建议和验收标准 | 有新需求需要分析、需要创建 Issue | `/需求分析 "添加用户导出功能，支持 CSV 和 Excel 格式"` |
| `/开发归档` | 基于 GitHub Issue 完成开发归档，生成开发总结、规范提交、推送代码、自动关闭 Issue | 完成 Issue 开发后归档 | `/开发归档 123` |
| `/开发总结` | 针对本次开发生成完整的开发记录归档，包括检查代码、生成总结、规范提交、推送代码、创建 GitHub Issue 记录 | 开发完成需要总结归档 | `/开发总结` |
| `/Issue修复` | 根据 GitHub Issue 编号进行系统性问题分析和修复，从问题复现到 PR 创建的完整工作流 | 修复 Issue、需要完整修复流程 | `/Issue修复 123` |
| `/提交推送` | 提交所有修改并推送到远程仓库，自动生成 conventional commit 格式的中文提交信息 | 快速提交推送代码 | `/提交推送` |
| `/帮助` | 显示插件完整帮助信息 | 了解插件功能 | `/帮助` |

---

## 6. orchestration - 多代理编排插件

**版本**: v0.6.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 共享的多代理协调和工作流编排模式，提供经过验证的并行执行、多模型验证、质量门控模式。

### 6.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/setup` | 添加 4-Message Pattern 强制规则到项目 CLAUDE.md 并验证 claudish 设置 | 设置多模型验证、配置 claudish | `/setup` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能 | `/help` |

### 6.2 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **multi-agent-coordination** | 多代理协调模式，包括并行/顺序执行、代理选择、子代理委托 | parallel agents、multi-agent、delegate | "如何并行运行多个代理？"<br>"代理之间如何协调工作？" |
| **multi-model-validation** | 多模型验证（v3.1.0），支持 3-5x 加速、强制性能统计追踪 | grok、gemini、gpt-5、claudish、multi-model | "用多个 AI 模型验证这个设计"<br>"如何实现并行模型审查？" |
| **quality-gates** | 质量门控模式，包括用户批准、迭代循环、TDD 模式 | approval、user validation、TDD、quality gate | "如何实现用户批准门控？"<br>"TDD 循环模式怎么用？" |
| **todowrite-orchestration** | TodoWrite 进度追踪，用于多阶段工作流管理 | phase tracking、progress、workflow | "如何追踪多阶段任务进度？"<br>"TodoWrite 怎么用于编排？" |
| **error-recovery** | 错误恢复模式，处理超时、API 失败、部分成功和优雅降级 | error、failure、timeout、retry、fallback | "API 调用失败怎么处理？"<br>"如何实现优雅降级？" |
| **model-tracking-protocol** | 强制性多模型追踪协议，在启动模型前创建结构化追踪表 | multi-model、tracking、statistics | "如何追踪多模型执行时间？"<br>"性能统计表格怎么创建？" |

---

## 7. superpowers - 核心技能库

**版本**: v4.0.2 | **作者**: Jesse Vincent | **许可**: MIT

**描述**: Claude Code 核心技能库，包含 TDD、调试、协作模式和经过验证的技术。

### 7.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **code-reviewer** | inherit | 高级代码审查员，在完成主要项目步骤后审查实现是否符合原计划和编码标准 | 完成主要项目步骤后审查 | "我已经完成了计划步骤 3 中的用户认证系统"<br>"任务管理系统的 API 端点现在完成了，覆盖了架构文档的步骤 2" |

### 7.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/brainstorm` | 在任何创意工作前必须使用，探索用户意图、需求和设计后再实现 | 创建功能、构建组件、添加功能、修改行为之前 | `/brainstorm "用户认证系统"` |
| `/execute-plan` | 分批执行计划，带有审查检查点 | 有书面计划需要执行 | `/execute-plan` |
| `/write-plan` | 创建详细的实现计划，包含细粒度任务 | 有规范或需求，需要创建计划 | `/write-plan` |

### 7.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **using-superpowers** | 开始任何对话时使用，建立如何查找和使用技能 | 对话开始、技能查找 | "有哪些可用的技能？"<br>"如何使用技能？" |
| **brainstorming** | 任何创意工作前必须使用，探索需求和设计后再实现 | 创建功能、构建组件、添加功能 | "帮我设计一个用户认证系统"<br>"我想创建一个新功能" |
| **writing-plans** | 有规范或需求时使用，在接触代码前创建实现计划 | 规范、需求、多步骤任务 | "根据这个需求创建实现计划"<br>"这个功能应该怎么拆分？" |
| **executing-plans** | 有书面实现计划时使用，在单独会话中分批执行 | 执行计划、审查检查点 | "执行这个实现计划"<br>"继续执行下一批任务" |
| **test-driven-development** | 实现任何功能或 bugfix 时使用，在写实现代码前使用 | TDD、测试驱动、功能实现 | "用 TDD 方式实现这个功能"<br>"先写测试再写实现" |
| **systematic-debugging** | 遇到任何 bug、测试失败或意外行为时使用 | bug、测试失败、意外行为、调试 | "这个测试为什么失败了？"<br>"帮我调试这个 bug" |
| **subagent-driven-development** | 在当前会话中执行有独立任务的实现计划时使用 | 独立任务、子代理、当前会话 | "用子代理并行执行这些任务"<br>"分配任务给子代理" |
| **dispatching-parallel-agents** | 面对 2+ 个无共享状态或顺序依赖的独立任务时使用 | 独立任务、并行、无依赖 | "并行执行这些独立任务"<br>"同时处理这些模块" |
| **verification-before-completion** | 声称工作完成、修复或通过前使用 | 完成、修复、通过、提交、PR | "检查一下是否真的完成了"<br>"验证所有测试通过" |
| **requesting-code-review** | 完成任务、实现主要功能或合并前使用 | 代码审查、完成任务、合并 | "请审查我的代码"<br>"准备提交 PR 前检查" |
| **receiving-code-review** | 收到代码审查反馈时使用 | 收到反馈、实现建议 | "审查反馈说要改这里"<br>"根据建议修改代码" |
| **using-git-worktrees** | 开始需要与当前工作区隔离的功能工作时使用 | 隔离、worktree、功能分支 | "创建隔离的工作目录"<br>"在 worktree 中开发新功能" |
| **finishing-a-development-branch** | 实现完成、所有测试通过、需要决定如何集成工作时使用 | 完成、合并、PR、清理 | "功能开发完成，准备合并"<br>"清理并提交 PR" |
| **writing-skills** | 创建新技能、编辑现有技能或验证技能时使用 | 创建技能、编辑技能、验证 | "创建一个新的技能"<br>"编辑现有技能的内容" |

---

## 8. superpowers-chrome - Chrome 浏览器控制

**版本**: v1.6.1 | **作者**: Jesse Vincent | **许可**: MIT | **状态**: BETA

**描述**: 通过 Chrome DevTools Protocol 直接访问 Chrome 浏览器。

### 8.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **browser-user** | sonnet | 浏览器分析代理，使用 Chrome DevTools Protocol 分析网页内容和浏览器行为。只读访问。 | 检查缓存内容、分析 DOM 结构、理解 Web 应用行为 | "分析这个页面的 DOM 结构"<br>"提取页面上的所有链接" |

### 8.2 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **browsing** | 需要直接浏览器控制时使用，教授 Chrome DevTools Protocol 控制 | 浏览器控制、多标签管理、表单自动化 | "打开浏览器并导航到这个 URL"<br>"自动填写这个表单" |

---

## 9. episodic-memory - 对话记忆搜索

**版本**: v1.0.15 | **作者**: Jesse Vincent | **许可**: MIT

**描述**: Claude Code 对话的语义搜索，记住过去的讨论、决策和模式。

### 9.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **search-conversations** | haiku | 对话搜索代理，使用语义或文本搜索搜索历史对话，恢复决策、解决方案和经验教训 | 开始任务前恢复上下文、查找过去的决策、避免重复工作 | "我们之前讨论过这个"<br>"查找关于认证的历史对话" |

### 9.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/search-conversations` | 使用语义或文本搜索搜索之前的 Claude Code 对话 | 查找历史对话、恢复上下文 | `/search-conversations "认证实现"` |

### 9.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **remembering-conversations** | 当用户问"我应该如何..."或"最佳方法是什么..."时使用 | how should I、best approach、past work | "我之前是怎么处理这个问题的？"<br>"上次我们讨论的最佳方案是什么？" |

---

## 10. 其他插件

### 10.1 double-shot-latte (v1.1.5)

**描述**: 使用 Claude 判断的决策机制自动评估 Claude 是否应该继续工作而不是过早停止。

**关键词**: hooks、automation、workflow、continuation

---

### 10.2 the-elements-of-style (v1.0.0)

**描述**: 基于 William Strunk Jr. 的《英文写作指南》（1918）的写作指导。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **writing-clearly-and-concisely** | 将 Strunk 的写作规则应用于文档、提交信息、错误消息、UI 文本 | "帮我优化这段文档的写法"<br>"这个提交信息怎么写更清晰？" |

---

### 10.3 skill-seekers (v1.0.0)

**描述**: 自动将文档网站、GitHub 仓库、PDF 文件转换为 Claude AI 技能。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **skill-creation** | 使用 Skill Seekers MCP 工具生成 Claude AI 技能的完整工作流指南 | "从这个文档网站生成技能"<br>"把这个 PDF 转换成技能" |

**MCP 工具**: 17 个专业 MCP 工具

---

### 10.4 notebooklm-skill (v1.0.0)

**描述**: 直接从 Claude Code 查询 Google NotebookLM 笔记本，获取基于来源、带引用的 Gemini 回答。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **notebooklm** | 查询 NotebookLM 获取基于文档的回答 | "从 NotebookLM 笔记本查询这个问题"<br>"用 Gemini 基于文档回答" |

---

### 10.5 docs (v1.0.0)

**描述**: 文档技能集合，包含 ShipAny 等产品的中文文档技能。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **shipany** | ShipAny 中文文档 - AI SaaS 快速构建平台 | "ShipAny 怎么配置？"<br>"如何用 ShipAny 构建 SaaS？" |

---

### 10.6 feiskyer (v1.0.0)

**描述**: feiskyer 的 Claude Code 技能集合，包含 6 个专业技能。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **codex-skill** | 利用 OpenAI Codex/GPT 模型进行自主代码实现 | "用 Codex 自动实现这个功能"<br>"让 GPT-5 写这段代码" |
| **autonomous-skill** | 执行需要多个会话完成的长时间运行任务 | "这是一个长时间运行的任务"<br>"自主执行这个多步骤任务" |
| **nanobanana-skill** | 使用 Google Gemini API 生成或编辑图像 | "生成一张图片"<br>"用 Gemini 编辑这张图" |
| **youtube-transcribe-skill** | 从 YouTube 视频提取字幕/转录文本 | "提取这个 YouTube 视频的字幕"<br>"获取视频的转录文本" |
| **kiro-skill** | 交互式功能开发工作流，从想法到实现 | "用 Kiro 工作流开发这个功能"<br>"创建功能规格文档" |
| **spec-kit-skill** | GitHub Spec-Kit 集成，基于章程的规范驱动开发 | "用 Spec-Kit 管理规范"<br>"基于章程驱动开发" |

---

### 10.7 superpowers-lab (v0.1.0)

**描述**: 实验性技能，正在开发中的新技术和工具。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **mcp-cli** | 通过 mcp CLI 工具按需使用 MCP 服务器 | "动态发现可用的 MCP 功能"<br>"用 mcp CLI 连接服务器" |
| **using-tmux-for-interactive-commands** | 运行交互式 CLI 工具（vim、git rebase -i 等） | "用 tmux 运行 vim"<br>"执行交互式 git rebase" |

---

### 10.8 superpowers-developing-for-claude-code (v0.3.1)

**描述**: 开发 Claude Code 插件、技能、MCP 服务器和扩展的技能和资源。

| 技能 | 描述 | 示例提问 |
|------|------|----------|
| **developing-claude-code-plugins** | 完整插件生命周期的工作流、模式和示例 | "如何创建一个 Claude Code 插件？"<br>"插件的目录结构是什么？" |
| **working-with-claude-code** | Claude Code 各方面的全面官方文档 | "Claude Code 有哪些功能？"<br>"如何配置 MCP 服务器？" |

---

### 10.9 go (知识库)

**描述**: Go 语言最佳实践知识库（无 plugin.json，仅知识文件）。

| 知识文件 | 描述 |
|---------|------|
| 100-go-mistakes.md | Go 常见错误集合 |
| go-proverbs.md | Go 谚语 |
| uber-go-style-guide.md | Uber Go 风格指南 |
| modern-backend-development.md | 现代后端开发 |

**参考文档**: CLI 架构、并发模式、配置管理、构造器模式、Context 使用、错误处理、HTTP API 模式、接口设计、包组织、性能优化、插件系统、测试模式

---

## 11. claude-skills - Awesome 技能集合

**版本**: v1.0.0 | **作者**: ComposioHQ | **许可**: Apache-2.0

**描述**: 来自 [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) 的精选技能集合，包含 27 个实用技能。

**仓库统计**: ⭐ 11.7k stars | 🍴 1.2k forks

### 11.1 开发工具类技能 (Development)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **artifacts-builder** | 使用 React、Tailwind CSS、shadcn/ui 构建多组件 HTML 工件 | HTML artifacts、React 组件、claude.ai | "创建一个交互式 HTML 工件"<br>"用 React 构建 claude.ai 组件" |
| **changelog-generator** | 从 git 提交自动生成用户友好的变更日志 | changelog、release notes、git commits | "根据提交记录生成变更日志"<br>"创建用户友好的发布说明" |
| **developer-growth-analysis** | 分析编码模式，识别开发差距和改进领域，发送 Slack 报告 | coding patterns、growth、skill gaps | "分析我的编码模式"<br>"识别技术提升方向" |
| **mcp-builder** | 指导创建高质量 MCP 服务器，支持 Python 和 TypeScript | MCP server、Model Context Protocol | "如何创建 MCP 服务器？"<br>"用 Python 实现 MCP 工具" |
| **skill-creator** | 创建有效 Claude 技能的指南和最佳实践 | create skill、skill template | "如何创建一个 Claude 技能？"<br>"技能的结构是什么？" |
| **webapp-testing** | 使用 Playwright 测试本地 Web 应用，验证前端功能 | Playwright、webapp testing、UI 测试 | "测试这个本地 Web 应用"<br>"验证前端功能是否正常" |
| **template-skill** | 技能模板示例，展示技能的标准结构和格式 | skill template、skill structure | "技能模板长什么样？"<br>"标准技能格式是什么？" |

### 11.2 商业营销类技能 (Business & Marketing)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **brand-guidelines** | 应用 Anthropic 官方品牌颜色和字体到工件 | brand colors、Anthropic 品牌、视觉风格 | "应用 Anthropic 品牌风格"<br>"使用官方配色方案" |
| **competitive-ads-extractor** | 提取和分析竞争对手广告，理解营销策略 | competitor ads、广告分析、营销策略 | "分析竞争对手的广告"<br>"提取广告创意信息" |
| **domain-name-brainstormer** | 生成创意域名并检查 .com/.io/.dev/.ai 可用性 | domain name、域名建议、可用性检查 | "为我的项目推荐域名"<br>"检查这些域名是否可用" |
| **internal-comms** | 撰写内部通讯文档、FAQ、状态报告和项目更新 | internal communication、3P updates、newsletter | "撰写项目状态报告"<br>"创建内部通讯文档" |
| **lead-research-assistant** | 识别和验证高质量潜在客户，提供外联策略 | lead generation、sales research、outreach | "研究潜在客户"<br>"制定外联策略" |

### 11.3 沟通写作类技能 (Communication & Writing)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **content-research-writer** | 协助撰写高质量内容，添加引用和反馈 | content writing、research、citations | "帮我写一篇高质量文章"<br>"为这段内容添加引用" |
| **meeting-insights-analyzer** | 分析会议记录，揭示行为模式和领导风格 | meeting transcript、behavioral patterns | "分析这个会议记录"<br>"揭示讨论中的行为模式" |

### 11.4 创意媒体类技能 (Creative & Media)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **canvas-design** | 创建 PNG 和 PDF 格式的精美视觉艺术 | visual art、poster design、canvas | "创建一个海报设计"<br>"生成精美的视觉艺术" |
| **image-enhancer** | 提升图像和截图质量，增强分辨率和清晰度 | image quality、enhance、sharpen | "提升这张图片的质量"<br>"增强截图的清晰度" |
| **slack-gif-creator** | 创建 Slack 优化的动画 GIF，包含验证器 | Slack GIF、animated、animation | "创建一个 Slack GIF"<br>"优化 GIF 大小" |
| **theme-factory** | 为工件应用专业字体和颜色主题（10种预设） | theme、fonts、colors、styling | "应用专业主题样式"<br>"更换颜色主题" |
| **video-downloader** | 从 YouTube 等平台下载视频，支持多种格式 | download video、YouTube、offline | "下载这个 YouTube 视频"<br>"保存为 MP4 格式" |

### 11.5 生产力工具类技能 (Productivity & Organization)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **file-organizer** | 智能组织文件和文件夹，查找重复文件 | organize files、find duplicates、folder structure | "整理这个文件夹"<br>"查找重复文件" |
| **invoice-organizer** | 自动整理发票和收据，便于税务准备 | invoices、receipts、tax preparation | "整理这些发票"<br>"准备税务文件" |
| **raffle-winner-picker** | 随机选择抽奖获奖者，使用加密安全随机数 | raffle、winner、random pick | "从这个列表抽取获奖者"<br>"进行公平抽奖" |
| **skill-share** | 技能分享工具 | share skill、skill export | "分享这个技能"<br>"导出技能配置" |

### 11.6 文档处理类技能 (Document Processing)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **docx** | 创建、编辑 Word 文档，支持跟踪更改和注释 | Word、docx、document editing | "创建一个 Word 文档"<br>"编辑这个 docx 文件" |
| **pdf** | 提取、合并、注释 PDF 文档 | PDF、merge、extract、annotate | "合并这些 PDF 文件"<br>"从 PDF 提取文本" |
| **pptx** | 读取、生成、调整幻灯片演示文稿 | PowerPoint、pptx、slides | "创建一个 PPT 演示"<br>"编辑幻灯片" |
| **xlsx** | 电子表格操作：公式、图表、数据转换 | Excel、xlsx、spreadsheet、formulas | "创建一个 Excel 表格"<br>"添加数据公式" |

---

## 📊 统计汇总

| 类别 | 数量 |
|------|------|
| **插件总数** | 19 |
| **Agents 总数** | 21 |
| **Commands 总数** | 33 |
| **Skills 总数** | 91 |

---

> 📝 **使用提示**:
> - 使用 `/help` 查看各插件的帮助信息
> - 使用 `Skill` 工具加载特定技能
> - 使用 `Task` 工具启动特定代理
>
> 💡 **触发词说明**: 表格中的触发关键词可帮助 AI 自动识别何时调用对应的代理或技能。

---

*文档由傲娇大小姐 AI 助手自动生成* (￣▽￣*)
