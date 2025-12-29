# Claude Code 插件完整参考手册

> 本文档详细记录所有 Claude Code 插件的 Agents、Commands、Skills，包含描述、触发词和使用示例。
> 生成日期：2025-12-29

---

## 📋 目录

### 🔷 第一部分：本地插件 (plugins/)

- [插件总览](#插件总览)
- [1. frontend - 前端开发插件](#1-frontend---前端开发插件)
- [2. bun - 后端开发插件](#2-bun---后端开发插件)
- [3. code-analysis - 代码分析插件](#3-code-analysis---代码分析插件)
- [4. development - 开发核心插件](#4-development---开发核心插件)
- [5. devops - DevOps 插件](#5-devops---devops-插件)
- [6. workflow - 工作流插件](#6-workflow---工作流插件)
- [7. planning - 规划插件](#7-planning---规划插件)
- [8. testing - 测试插件](#8-testing---测试插件)
- [9. documentation - 文档插件](#9-documentation---文档插件)
- [10. languages - 编程语言插件](#10-languages---编程语言插件)
- [11. database - 数据库插件](#11-database---数据库插件)
- [12. specialized - 专业领域插件](#12-specialized---专业领域插件)
- [13. research - 研究插件](#13-research---研究插件)
- [14. svelte - Svelte 插件](#14-svelte---svelte-插件)
- [15. mobile - 移动开发插件](#15-mobile---移动开发插件)
- [16. game - 游戏开发插件](#16-game---游戏开发插件)
- [17. blockchain - 区块链插件](#17-blockchain---区块链插件)
- [18. design - 设计插件](#18-design---设计插件)
- [19. media - 媒体处理插件](#19-media---媒体处理插件)
- [20. mcp - MCP 开发插件](#20-mcp---mcp-开发插件)
- [21. obsidian - Obsidian 插件](#21-obsidian---obsidian-插件)
- [22. seo - SEO 插件](#22-seo---seo-插件)
- [23. business - 商业插件](#23-business---商业插件)
- [24. claude-skills - Awesome 技能集合](#24-claude-skills---awesome-技能集合)

### 🔷 第二部分：Anthropic 官方插件

- [25. agent-sdk-dev - Agent SDK 开发插件](#25-agent-sdk-dev---agent-sdk-开发插件)
- [26. code-review - 代码审查插件](#26-code-review---代码审查插件)
- [27. commit-commands - Git 提交命令插件](#27-commit-commands---git-提交命令插件)
- [28. feature-dev - 功能开发插件](#28-feature-dev---功能开发插件)
- [29. frontend-design - 前端设计插件](#29-frontend-design---前端设计插件)
- [30. hookify - Hook 创建插件](#30-hookify---hook-创建插件)
- [31. learning-output-style - 学习输出风格插件](#31-learning-output-style---学习输出风格插件)
- [32. explanatory-output-style - 解释性输出风格插件](#32-explanatory-output-style---解释性输出风格插件)
- [33. plugin-dev - 插件开发工具包](#33-plugin-dev---插件开发工具包)
- [34. pr-review-toolkit - PR 审查工具包](#34-pr-review-toolkit---pr-审查工具包)
- [35. ralph-wiggum - 迭代开发循环插件](#35-ralph-wiggum---迭代开发循环插件)
- [36. security-guidance - 安全指导插件](#36-security-guidance---安全指导插件)
- [37. claude-opus-4-5-migration - Opus 4.5 迁移插件](#37-claude-opus-4-5-migration---opus-45-迁移插件)

### 🔶 第三部分：第三方集成插件

- [38. asana - Asana 项目管理集成](#38-asana---asana-项目管理集成)
- [39. context7 - 文档查询集成](#39-context7---文档查询集成)
- [40. firebase - Google Firebase 集成](#40-firebase---google-firebase-集成)
- [41. github - GitHub 仓库管理集成](#41-github---github-仓库管理集成)
- [42. gitlab - GitLab DevOps 集成](#42-gitlab---gitlab-devops-集成)
- [43. greptile - AI 代码搜索集成](#43-greptile---ai-代码搜索集成)
- [44. laravel-boost - Laravel 开发集成](#44-laravel-boost---laravel-开发集成)
- [45. linear - Linear 任务跟踪集成](#45-linear---linear-任务跟踪集成)
- [46. playwright - 浏览器自动化集成](#46-playwright---浏览器自动化集成)
- [47. serena - 语义代码分析集成](#47-serena---语义代码分析集成)
- [48. slack - Slack 工作区集成](#48-slack---slack-工作区集成)
- [49. stripe - Stripe 支付集成](#49-stripe---stripe-支付集成)
- [50. supabase - Supabase 后端集成](#50-supabase---supabase-后端集成)

### 🔷 第四部分：LSP 语言服务器插件

- [LSP 插件列表](#lsp-插件列表)

---

## 插件总览

| 插件 | 版本 | Agents | Commands | Skills | 主要用途 |
|------|------|--------|----------|--------|----------|
| frontend | v3.14.0 | 11 | 19 | 13 | 全功能前端开发工具包 |
| bun | v1.6.0 | 3 | 4 | 2 | TypeScript 后端开发 |
| code-analysis | v2.9.0 | 1 | 5 | 12 | 深度代码分析与调查 |
| development | v1.2.0 | 22 | 30 | 8 | 开发核心：审查、调试、重构 |
| devops | v1.2.0 | 20 | 39 | 0 | Git Flow、CI/CD、部署 |
| workflow | v1.2.0 | 17 | 41 | 12 | Sugar 工作流、任务编排 |
| planning | v1.2.0 | 7 | 44 | 0 | 需求分析、项目管理 |
| testing | v1.2.0 | 26 | 35 | 0 | 测试、安全审计、性能 |
| documentation | v1.2.0 | 3 | 21 | 2 | API 文档、代码库分析 |
| languages | v1.0.0 | 14 | 0 | 0 | 14 种编程语言专家 |
| database | v1.2.0 | 9 | 10 | 2 | 数据库架构与优化 |
| specialized | v1.2.0 | 31 | 33 | 2 | AI/ML、数据科学、仿真 |
| research | v1.0.0 | 12 | 0 | 0 | 学术研究、竞争情报 |
| svelte | v1.2.0 | 0 | 16 | 0 | Svelte/SvelteKit 开发 |
| mobile | v1.0.0 | 6 | 0 | 0 | Flutter、React Native |
| game | v1.2.0 | 4 | 5 | 0 | Unity、Unreal 开发 |
| blockchain | v1.0.0 | 3 | 0 | 5 | Web3、智能合约 |
| design | v1.0.0 | 6 | 0 | 1 | UI/UX、无障碍设计 |
| media | v1.0.0 | 15 | 0 | 0 | 视频、音频、OCR |
| mcp | v1.0.0 | 7 | 0 | 0 | MCP 服务器开发 |
| obsidian | v1.0.0 | 7 | 0 | 0 | Obsidian Vault 运维 |
| seo | v1.0.0 | 10 | 0 | 0 | 搜索引擎优化 |
| business | v1.2.0 | 23 | 5 | 0 | 销售、营销、合规 |
| claude-skills | v1.0.0 | 0 | 0 | 27 | Awesome 技能集合 |

**总计**: 24 插件 | 257 Agents | 307 Commands | 84 Skills

---

## 1. frontend - 前端开发插件

**版本**: v3.14.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 全功能前端开发工具包，支持 TypeScript、React 19、Vite、TanStack Router & Query v5、shadcn/ui。

### 1.1 Agents

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
| **designer** | sonnet | 设计审查代理，通过 DOM 检查和 CSS 分析验证 UI 组件匹配设计参考 | 验证 UI 与设计匹配、检查颜色间距、设计保真度审查 | "我完成了 UserProfile 组件的实现，能对比 Figma 设计验证吗？"<br>"我觉得表单的颜色可能与设计不符，能检查吗？" |
| **css-developer** | sonnet | CSS 架构代理，提供 CSS 模式指导并确保样式更改不破坏现有样式 | 了解 CSS 架构、全局样式更改、Tailwind 模式 | "这个应用的表单输入使用什么 CSS 模式？"<br>"想全局更新按钮样式，应该怎么做？"<br>"这个项目常用什么 Tailwind 布局工具类？" |
| **ui-developer** | sonnet | 高级 UI 开发代理，基于设计参考实现或修复 UI 组件 | 修复设计差异、实现 Figma 设计、响应式改进 | "设计师发现 UserProfile 组件有几个颜色和间距问题"<br>"能按这个 Figma 设计实现 ProductCard 组件吗？"<br>"导航菜单在移动端表现不好" |

### 1.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/implement` | 完整周期功能实现，包含多代理编排和质量门控 | 实现新功能、需要完整开发流程 | `/implement "创建用户认证模块"` |
| `/implement-ui` | 从设计参考实现 UI 组件，支持智能验证 | 按设计实现组件、Figma 设计落地 | `/implement-ui "按照 Figma 设计实现 ProductCard"` |
| `/import-figma` | 从 Figma Make 项目导入 UI 组件到 React 项目 | 导入 Figma 组件、设计到代码转换 | `/import-figma` |
| `/api-docs` | 分析 API 文档，获取端点和数据类型信息 | 查询 API 文档、了解端点规范 | `/api-docs "用户端点的请求格式是什么？"` |
| `/cleanup-artifacts` | 智能清理项目中的临时文件和开发文件 | 开发完成后清理、移除临时文件 | `/cleanup-artifacts` |
| `/validate-ui` | 多代理编排的 UI 设计验证 | 验证 UI 设计、检查设计保真度 | `/validate-ui` |
| `/review` | 多模型代码审查编排器，3-5x 加速 | 代码审查、多模型验证 | `/review`<br>`/review --files src/auth/` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能 | `/help` |

### 1.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **core-principles** | React 19 SPA 开发核心原则和项目结构 | 项目结构、核心原则 | "这个项目的目录结构应该怎么组织？" |
| **tooling-setup** | 配置 Vite、TypeScript、Biome 和 Vitest | Vite、TypeScript、配置 | "如何配置 Vite 构建工具？" |
| **react-patterns** | React 19 特定模式，包括 React Compiler、Server Actions | React 19、React Compiler | "React 19 的新 Hooks 有哪些？" |
| **tanstack-router** | TanStack Router 类型安全、基于文件的路由 | 路由、TanStack Router | "如何设置类型安全的路由？" |
| **tanstack-query** | TanStack Query v5 异步状态管理（900+ 行） | 数据获取、查询、缓存 | "如何实现乐观更新？" |
| **router-query-integration** | TanStack Router 与 Query 集成 | 路由加载器、预取 | "路由加载器如何预取数据？" |
| **api-integration** | Apidog + OpenAPI 规范集成 | Apidog、OpenAPI | "如何从 OpenAPI 生成 TypeScript 类型？" |
| **performance-security** | 性能优化、可访问性和安全最佳实践 | 性能、可访问性、安全 | "如何实现代码分割？" |
| **browser-debugger** | Chrome DevTools MCP 进行 UI 测试 | UI 测试、设计验证 | "如何用 Chrome MCP 测试 UI？" |
| **shadcn-ui** | shadcn/ui 组件库使用指南 | shadcn、组件 | "如何使用 shadcn 的 Dialog 组件？" |
| **claudish-usage** | 通过子代理使用 Claudish CLI 运行外部 AI 模型 | claudish、外部 AI | "用 Grok 审查这段代码" |

---

## 2. bun - 后端开发插件

**版本**: v1.6.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 生产就绪的 TypeScript 后端开发，使用 Bun 运行时。

### 2.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **backend-developer** | sonnet | TypeScript 后端开发专家，实现 API 端点、服务和数据库集成 | 创建端点、添加仓库、实现中间件 | "创建用户注册端点，包含邮箱验证和密码哈希"<br>"添加管理帖子的 Prisma 仓库"<br>"实现 JWT 认证中间件" |
| **api-architect** | opus | 后端 API 架构专家，创建全面的开发计划和架构蓝图 | 创建新 REST API、添加认证授权 | "需要创建任务管理系统的 REST API"<br>"需要为现有 API 添加 JWT 认证和 RBAC" |
| **apidog** | sonnet | API 文档同步专家，分析现有 schema 并导入 Apidog | 添加端点到 Apidog、导入 OpenAPI 规范 | "需要将新的 POST /api/users 端点添加到 Apidog" |

### 2.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/implement-api` | 完整周期 API 实现，包含多代理编排 | 实现完整 API 功能 | `/implement-api "创建用户认证 API"` |
| `/setup-project` | 初始化新的 Bun + TypeScript 后端项目 | 创建新项目 | `/setup-project` |
| `/apidog` | 将 API 规范同步到 Apidog | 同步 API 文档 | `/apidog` |
| `/help` | 显示插件完整帮助信息 | 了解插件功能 | `/help` |

### 2.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **best-practices** | Bun TypeScript 后端最佳实践（2025 版） | Bun、后端、最佳实践 | "Bun 项目的目录结构怎么组织？" |
| **claudish-usage** | 通过子代理使用 Claudish CLI | claudish、外部 AI | "用外部 AI 模型验证这个实现" |

---

## 3. code-analysis - 代码分析插件

**版本**: v2.9.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 深度代码调查，强制使用 claudemem v0.4.0 AST 结构分析，支持 PageRank 符号重要性排名。

### 3.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **codebase-detective** | sonnet | 代码库侦探，使用 claudemem AST 分析执行全面代码调查 | 理解代码实现、查找 API 调用、调试问题 | "这个应用的认证是如何处理的？"<br>"/api/users 端点在哪里被调用？"<br>"支付处理似乎坏了，能调查一下吗？" |

### 3.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/analyze` | 启动代码库侦探代理，执行深度代码调查 | 需要理解代码工作原理 | `/analyze "认证系统是如何工作的？"` |
| `/setup` | 添加 claudemem 强制规则到项目 CLAUDE.md | 设置 claudemem 强制规则 | `/setup` |
| `/深度思考` | 深度分析和问题解决 | 需要深度分析复杂问题 | `/深度思考 "应该选择 Redux 还是 Zustand？"` |

### 3.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **deep-analysis** | 深度代码分析主技能 | how does X work、investigate | "这个认证系统是如何工作的？" |
| **claudemem-search** | 语义代码搜索和 AST 分析 | semantic search、AST、callers | "查找所有调用 AuthService 的地方" |
| **claudemem-orchestration** | 多代理代码分析编排 | multi-agent、parallel | "用多个代理分析这个模块" |
| **code-search-selector** | 代码搜索工具选择决策树 | audit、investigate | "所有 API 端点在哪里？" |
| **architect-detective** | 架构侦探，系统设计分析 | architecture、system design | "这个项目的架构是什么？" |
| **developer-detective** | 开发者侦探，实现追踪 | how does X work、trace data | "用户登录流程是怎样的？" |
| **tester-detective** | 测试侦探，测试覆盖分析 | test coverage、missing tests | "这个模块的测试覆盖率如何？" |
| **debugger-detective** | 调试侦探，bug 源定位 | find bug、root cause | "为什么登录功能坏了？" |
| **ultrathink-detective** | 超级思考侦探（Opus） | comprehensive audit | "对整个支付系统做全面审计" |

---

## 4. development - 开发核心插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 开发核心插件 - Bug 修复、代码审查、调试、开发环境设置、API 设计、Monorepo 配置等核心开发能力。

### 4.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **code-reviewer** | opus | 专家级代码审查，主动审查质量、安全和可维护性 | 写完代码后审查、PR 审查 | "审查一下我刚写的认证模块"<br>"检查这个 PR 的代码质量" |
| **debugger** | sonnet | 调试专家，处理错误、测试失败和意外行为 | 遇到错误、测试失败、系统问题 | "这个测试为什么失败了？"<br>"帮我调试这个 500 错误" |
| **api-integration-specialist** | sonnet | API 集成专家，处理第三方 API 对接 | 集成外部 API、处理 OAuth | "集成 Stripe 支付 API"<br>"对接微信登录" |
| **backend-architect** | opus | 后端架构师，设计系统架构 | 设计后端架构、微服务拆分 | "设计电商系统的后端架构"<br>"如何拆分这个单体应用？" |
| **code-architect** | opus | 代码架构师，设计代码结构 | 重构代码结构、设计模式选择 | "如何组织这个模块的代码？"<br>"应该用什么设计模式？" |
| **django-pro** | sonnet | Django 专家 | Django 项目、ORM、视图 | "创建 Django REST API"<br>"优化 Django ORM 查询" |
| **dx-optimizer** | sonnet | 开发者体验优化专家 | 改善开发工作流、减少摩擦 | "优化项目的开发体验"<br>"加快构建速度" |
| **fastapi-pro** | sonnet | FastAPI 专家 | FastAPI 项目、异步 API | "创建 FastAPI 服务"<br>"实现 WebSocket 端点" |
| **graphql-architect** | opus | GraphQL 架构师 | GraphQL Schema、Resolver 设计 | "设计 GraphQL Schema"<br>"实现 Federation" |
| **graphql-performance-optimizer** | sonnet | GraphQL 性能优化专家 | GraphQL 性能问题、N+1 问题 | "优化这个 GraphQL 查询"<br>"解决 N+1 问题" |
| **graphql-security-specialist** | sonnet | GraphQL 安全专家 | GraphQL 安全审计、授权 | "审计 GraphQL 安全性"<br>"实现字段级权限" |
| **nextjs-architecture-expert** | opus | Next.js 架构专家 | Next.js 项目、App Router | "迁移到 App Router"<br>"优化 Next.js 性能" |
| **react-performance-optimizer** | sonnet | React 性能优化专家 | React 性能问题、渲染优化 | "优化组件渲染"<br>"减少不必要的 re-render" |
| **unused-code-cleaner** | sonnet | 未使用代码清理专家 | 删除死代码、清理项目 | "查找并删除未使用的代码"<br>"清理无用的导入" |

### 4.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/Issue修复` | 根据 GitHub Issue 进行系统性问题分析和修复 | 修复 Issue | `/Issue修复 123` |
| `/bug-detective` | Bug 侦探模式，深度分析 Bug 原因 | 调查复杂 Bug | `/bug-detective "用户无法登录"` |
| `/bug-fix` | 快速修复 Bug | 简单 Bug 修复 | `/bug-fix "按钮点击无响应"` |
| `/code-review` | 代码审查 | 审查代码质量 | `/code-review src/auth/` |
| `/debug-session` | 启动调试会话 | 复杂调试场景 | `/debug-session` |
| `/design-rest-api` | 设计 REST API | 设计新 API | `/design-rest-api "用户管理"` |
| `/develop` | 完整周期代理开发 | 开发新代理 | `/develop "设计一个代码审查代理"` |
| `/pr-review` | PR 审查 | 审查 Pull Request | `/pr-review 789` |
| `/refractor` | 代码重构 | 重构代码 | `/refractor src/legacy/` |
| `/scaffold` | 脚手架生成 | 快速生成代码 | `/scaffold "CRUD 模块"` |
| `/setup-development-environment` | 配置开发环境 | 设置开发环境 | `/setup-development-environment` |
| `/setup-monorepo` | 配置 Monorepo | 设置 monorepo 结构 | `/setup-monorepo` |
| `/update-dependencies` | 更新依赖 | 升级项目依赖 | `/update-dependencies` |
| `/创建命令` | 创建 Claude Code 命令 | 创建新命令 | `/创建命令` |
| `/发布` | 发布插件到市场 | 发布插件 | `/发布` |

### 4.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **patterns** | Claude Code 常用代理模式和模板 | 代理模式、模板 | "有哪些常用的代理模式？" |
| **schemas** | 代理和命令的 YAML frontmatter 架构 | YAML、frontmatter | "代理 frontmatter 的格式是什么？" |
| **xml-standards** | Claude Code XML 标签结构模式 | XML、标签结构 | "代理的 XML 结构应该怎么写？" |
| **ddd-doc-steward** | 领域驱动设计文档管家 | DDD、领域模型 | "如何组织领域模型文档？" |
| **telegram-dev** | Telegram Bot 开发技能 | Telegram、Bot | "创建 Telegram Bot" |

---

## 5. devops - DevOps 插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: DevOps 插件 - Git Flow、CI/CD、部署、容器化、Kubernetes、监控可观测性等 DevOps 能力。

### 5.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **deployment-engineer** | sonnet | 部署工程师，配置 CI/CD 管道和云部署 | 设置 CI/CD、配置部署 | "设置 GitHub Actions 工作流"<br>"配置 Docker 部署" |
| **git-flow-manager** | sonnet | Git Flow 工作流管理 | 分支管理、发布流程 | "创建 feature 分支"<br>"准备发布版本" |
| **cloud-architect** | opus | 云架构师，设计 AWS/Azure/GCP 基础设施 | 云架构设计、成本优化 | "设计 AWS 基础设施"<br>"优化云成本" |
| **kubernetes-architect** | opus | Kubernetes 架构师，设计云原生基础设施 | K8s 部署、GitOps | "设计 Kubernetes 部署"<br>"实现 GitOps 工作流" |
| **terraform-specialist** | sonnet | Terraform 专家，IaC 最佳实践 | Terraform 模块、状态管理 | "创建 Terraform 模块"<br>"管理 Terraform 状态" |
| **devops-troubleshooter** | sonnet | DevOps 故障排除专家 | 生产问题、部署失败 | "排查生产环境问题"<br>"分析部署失败原因" |
| **monitoring-specialist** | sonnet | 监控专家，告警和日志 | 设置监控、配置告警 | "设置 Prometheus 监控"<br>"配置告警规则" |
| **observability-engineer** | sonnet | 可观测性工程师 | 日志、指标、追踪 | "实现分布式追踪"<br>"配置 ELK Stack" |
| **network-engineer** | sonnet | 网络工程师，网络和安全 | 网络配置、SSL/TLS | "配置负载均衡"<br>"设置 SSL 证书" |
| **security-engineer** | sonnet | 安全工程师 | 安全加固、合规 | "安全审计基础设施"<br>"实现安全最佳实践" |

### 5.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/commit` | 提交代码 | 提交更改 | `/commit` |
| `/create-pr` | 创建 Pull Request | 创建 PR | `/create-pr` |
| `/feat` | 开始新功能开发 | 新功能分支 | `/feat "用户认证"` |
| `/feature` | 创建功能分支 | 功能开发 | `/feature "payment"` |
| `/hotfix` | 创建热修复分支 | 紧急修复 | `/hotfix "登录bug"` |
| `/release` | 创建发布 | 版本发布 | `/release "v1.0.0"` |
| `/flow-status` | 查看 Git Flow 状态 | 检查分支状态 | `/flow-status` |
| `/ci-setup` | 配置 CI | 设置 CI 管道 | `/ci-setup` |
| `/containerize-application` | 容器化应用 | Docker 化 | `/containerize-application` |
| `/setup-kubernetes-deployment` | 配置 Kubernetes 部署 | K8s 部署 | `/setup-kubernetes-deployment` |
| `/git-worktree` | 管理 Git Worktree | 多分支开发 | `/git-worktree` |
| `/git-cleanBranches` | 清理分支 | 删除已合并分支 | `/git-cleanBranches` |
| `/git-rollback` | 回滚版本 | 版本回滚 | `/git-rollback` |

---

## 6. workflow - 工作流插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 工作流插件 - Sugar 工作流、任务编排、同步协调、多代理协调、质量门控、Codex 自主执行等综合工作流能力。

### 6.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **sugar-orchestrator** | opus | Sugar 工作流编排器，任务协调 | 复杂任务编排、多步骤工作流 | "编排这个复杂任务"<br>"协调多个开发阶段" |
| **task-planner** | sonnet | 任务规划专家 | 任务分解、优先级排序 | "分解这个大任务"<br>"规划项目任务" |
| **quality-guardian** | sonnet | 质量守护者，确保质量标准 | 质量检查、标准验证 | "检查代码质量"<br>"验证是否满足标准" |
| **n8n-workflow-builder** | sonnet | n8n 工作流构建器 | 自动化工作流、集成 | "创建 n8n 工作流"<br>"自动化这个流程" |
| **performance-engineer** | sonnet | 性能工程师 | 性能优化、负载测试 | "分析性能瓶颈"<br>"优化响应时间" |
| **workflow-optimizer** | sonnet | 工作流优化专家 | 流程优化、效率提升 | "优化这个工作流"<br>"减少流程步骤" |
| **get-current-datetime** | haiku | 获取当前日期时间 | 需要时间信息 | "现在是什么时间？" |

### 6.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/sugar-task` | 创建 Sugar 任务 | 创建任务 | `/sugar-task "实现登录功能"` |
| `/sugar-run` | 自主执行任务 | 自动执行 | `/sugar-run` |
| `/sugar-status` | 查看任务状态 | 检查进度 | `/sugar-status` |
| `/sugar-review` | 任务审查 | 审查完成的任务 | `/sugar-review` |
| `/ultrathink` | 超级思考模式 | 深度分析 | `/ultrathink "复杂架构决策"` |
| `/sync` | 同步任务状态 | 同步信息 | `/sync` |
| `/workflow` | 专业工作流模式 | 结构化开发 | `/workflow` |
| `/start` | 启动编排 | 开始工作流 | `/start` |
| `/status` | 查看状态 | 检查状态 | `/status` |
| `/帮助` | 显示帮助 | 了解功能 | `/帮助` |

### 6.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **multi-agent-coordination** | 多代理协调模式 | parallel agents、multi-agent | "如何并行运行多个代理？" |
| **multi-model-validation** | 多模型验证（v3.1.0） | grok、gemini、gpt-5 | "用多个 AI 模型验证这个设计" |
| **quality-gates** | 质量门控模式 | approval、TDD、quality gate | "如何实现用户批准门控？" |
| **todowrite-orchestration** | TodoWrite 进度追踪 | phase tracking、progress | "如何追踪多阶段任务进度？" |
| **error-recovery** | 错误恢复模式 | error、failure、timeout | "API 调用失败怎么处理？" |
| **model-tracking-protocol** | 多模型追踪协议 | multi-model、tracking | "如何追踪多模型执行时间？" |
| **codex-skill** | Codex 自主代码实现 | codex、autonomous | "用 Codex 自动实现这个功能" |
| **autonomous-skill** | 长时间运行任务执行 | autonomous、long-running | "自主执行这个多步骤任务" |

---

## 7. planning - 规划插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 规划插件 - 需求分析、项目管理、团队协作、Sprint 规划、PRD 编写等规划能力。

### 7.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **prd-specialist** | opus | PRD 编写专家 | 编写产品需求文档、功能规格 | "编写用户认证模块的 PRD"<br>"创建功能需求文档" |
| **planner** | sonnet | 任务分解和规划专家 | 复杂任务分解、项目规划 | "分解这个复杂功能"<br>"规划项目里程碑" |
| **sprint-prioritizer** | sonnet | Sprint 优先级专家 | Sprint 规划、任务排序 | "规划下个 Sprint"<br>"排列任务优先级" |
| **project-curator** | sonnet | 项目策展人 | 项目整理、文档维护 | "整理项目文档"<br>"更新项目状态" |
| **project-shipper** | sonnet | 项目交付专家 | 项目发布、交付检查 | "准备项目发布"<br>"检查交付清单" |
| **problem-solver-specialist** | opus | 问题解决专家 | 复杂问题分析、方案设计 | "分析这个技术问题"<br>"设计解决方案" |

### 7.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/需求分析` | AI 驱动的需求分析 | 分析需求 | `/需求分析 "添加用户导出功能"` |
| `/create-prd` | 创建 PRD | 编写需求文档 | `/create-prd "支付模块"` |
| `/create-feature` | 创建功能规格 | 功能设计 | `/create-feature "暗黑模式"` |
| `/plan` | 项目规划 | 规划项目 | `/plan` |
| `/sprint-planning` | Sprint 规划 | 冲刺规划 | `/sprint-planning` |
| `/todo` | 待办事项管理 | 任务管理 | `/todo` |
| `/todos-to-issues` | TODO 转 Issue | 创建 Issue | `/todos-to-issues` |
| `/project-health-check` | 项目健康检查 | 检查项目状态 | `/project-health-check` |
| `/standup-report` | 站会报告 | 生成站会报告 | `/standup-report` |
| `/team-velocity-tracker` | 团队速度追踪 | 追踪团队效率 | `/team-velocity-tracker` |

---

## 8. testing - 测试插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 测试插件 - 单元测试、E2E 测试、性能优化、安全审计、渗透测试等测试与安全能力。

### 8.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **test-engineer** | sonnet | 测试工程师，测试策略和自动化 | 设计测试策略、编写测试 | "设计测试策略"<br>"编写单元测试" |
| **tdd-orchestrator** | opus | TDD 编排器，红绿重构 | TDD 开发、测试驱动 | "用 TDD 方式开发这个功能"<br>"先写测试再实现" |
| **security-auditor** | sonnet | 安全审计员，OWASP 合规 | 安全审计、漏洞扫描 | "审计应用安全性"<br>"检查 OWASP Top 10" |
| **penetration-tester** | sonnet | 渗透测试专家 | 渗透测试、漏洞利用 | "进行渗透测试"<br>"评估安全态势" |
| **performance-profiler** | sonnet | 性能分析专家 | 性能分析、瓶颈定位 | "分析性能瓶颈"<br>"优化内存使用" |
| **load-testing-specialist** | sonnet | 负载测试专家 | 负载测试、压力测试 | "进行负载测试"<br>"评估系统容量" |
| **web-vitals-optimizer** | sonnet | Core Web Vitals 优化专家 | LCP/FID/CLS 优化 | "优化页面加载速度"<br>"改善 Core Web Vitals" |
| **incident-responder** | sonnet | 事件响应专家 | 生产事件、紧急响应 | "处理生产事件"<br>"分析故障原因" |
| **compliance-specialist** | sonnet | 合规专家 | 合规检查、审计准备 | "检查 GDPR 合规"<br>"准备安全审计" |
| **error-detective** | sonnet | 错误侦探，日志分析 | 错误分析、日志调查 | "分析这些错误日志"<br>"追踪错误根因" |

### 8.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/test` | 运行测试 | 执行测试 | `/test` |
| `/write-tests` | 编写测试 | 生成测试代码 | `/write-tests src/auth/` |
| `/test-coverage` | 测试覆盖率 | 分析覆盖率 | `/test-coverage` |
| `/e2e-setup` | 端到端测试配置 | 配置 E2E 测试 | `/e2e-setup` |
| `/security-audit` | 安全审计 | 安全检查 | `/security-audit` |
| `/security-scan` | 安全扫描 | 漏洞扫描 | `/security-scan` |
| `/penetration-test` | 渗透测试 | 渗透测试 | `/penetration-test` |
| `/performance-audit` | 性能审计 | 性能检查 | `/performance-audit` |
| `/optimize` | 性能优化 | 优化代码 | `/optimize` |
| `/setup-load-testing` | 配置负载测试 | 负载测试设置 | `/setup-load-testing` |
| `/double-check` | 双重检查 | 验证结果 | `/double-check` |

---

## 9. documentation - 文档插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 文档插件 - API 文档生成、架构文档、迁移指南、代码库分析、CLAUDE.md 优化等文档能力。

### 9.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **codebase-documenter** | sonnet | 代码库文档专家 | 生成代码文档、更新 README | "为这个项目生成文档"<br>"更新 README 文件" |
| **changelog-generator** | sonnet | 变更日志生成专家 | 生成 changelog、发布说明 | "生成变更日志"<br>"创建发布说明" |
| **context7-docs-fetcher** | sonnet | Context7 文档获取专家 | 获取最新库文档 | "获取 React 最新文档"<br>"查询 Next.js 文档" |

### 9.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/analyze-codebase` | 分析代码库 | 理解代码库 | `/analyze-codebase` |
| `/doc-api` | 生成 API 文档 | API 文档 | `/doc-api` |
| `/generate-api-docs` | 生成 API 参考文档 | API 参考 | `/generate-api-docs` |
| `/create-architecture-documentation` | 创建架构文档 | 架构文档 | `/create-architecture-documentation` |
| `/migration-guide` | 创建迁移指南 | 迁移文档 | `/migration-guide` |
| `/update-claudemd` | 更新 CLAUDE.md | 更新配置 | `/update-claudemd` |
| `/优化CLAUDE` | 优化 CLAUDE.md | 优化配置 | `/优化CLAUDE` |
| `/docs` | 文档管理 | 管理文档 | `/docs` |
| `/开发归档` | 开发归档 | 归档开发记录 | `/开发归档 123` |
| `/开发总结` | 开发总结 | 生成开发总结 | `/开发总结` |

### 9.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **claudemd-optimization** | CLAUDE.md 优化指南 | CLAUDE.md、优化 | "如何优化 CLAUDE.md？" |
| **writing-clearly-and-concisely** | Strunk 写作规则 | 写作、清晰、简洁 | "帮我优化这段文档的写法" |

---

## 10. languages - 编程语言插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 编程语言专家插件 - 14 种编程语言的专业开发能力。

### 10.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **python-pro** | sonnet | Python 专家，装饰器、生成器、async/await | Python 高级特性、性能优化 | "用装饰器实现缓存"<br>"优化 Python 异步代码" |
| **typescript-pro** | sonnet | TypeScript 专家，高级类型、泛型 | 复杂类型系统、类型推断 | "设计复杂泛型类型"<br>"优化类型推断" |
| **rust-pro** | sonnet | Rust 专家，所有权、生命周期 | Rust 内存安全、并发 | "处理 Rust 生命周期问题"<br>"实现零成本抽象" |
| **golang-pro** | sonnet | Go 专家，goroutines、channels | Go 并发、接口设计 | "设计 Go 并发模式"<br>"处理 goroutine 泄漏" |
| **java-pro** | sonnet | Java 专家，JVM 优化 | Java 企业级开发 | "优化 Spring Boot 应用"<br>"处理 JVM 内存问题" |
| **cpp-pro** | sonnet | C++ 专家，RAII、智能指针 | C++ 现代特性、性能 | "使用 C++20 特性"<br>"优化 C++ 性能" |
| **c-pro** | sonnet | C 专家，内存管理、系统调用 | C 底层开发、嵌入式 | "优化 C 内存使用"<br>"处理系统调用" |
| **csharp-pro** | sonnet | C# 专家，records、pattern matching | C# 现代特性、.NET | "使用 C# 12 新特性"<br>"优化 .NET 应用" |
| **javascript-pro** | sonnet | JavaScript 专家，ES6+、Node.js | JS 高级模式、异步 | "处理复杂异步流程"<br>"优化 Node.js 性能" |
| **ruby-pro** | sonnet | Ruby 专家，元编程、Rails | Ruby 元编程、Rails 开发 | "使用 Ruby 元编程"<br>"优化 Rails 应用" |
| **php-pro** | sonnet | PHP 专家，生成器、SPL | PHP 高性能开发 | "优化 PHP 性能"<br>"使用 PHP 8 特性" |
| **elixir-pro** | sonnet | Elixir 专家，OTP、Phoenix | Elixir 并发、容错 | "设计 OTP 监督树"<br>"使用 Phoenix LiveView" |
| **scala-pro** | sonnet | Scala 专家，函数式编程 | Scala 函数式、Akka | "使用 ZIO 处理效果"<br>"设计 Akka Actor" |
| **sql-pro** | sonnet | SQL 专家，CTEs、窗口函数 | 复杂查询、优化 | "优化这个复杂查询"<br>"设计规范化 Schema" |

---

## 11. database - 数据库插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 数据库专家插件 - PostgreSQL、MongoDB、Supabase、Neon 等数据库架构设计、迁移、优化和运维能力。

### 11.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **database-architect** | opus | 数据库架构师，设计和建模 | 数据库设计、架构决策 | "设计电商数据库架构"<br>"选择合适的数据库技术" |
| **database-optimizer** | sonnet | 数据库优化专家 | 查询优化、索引设计 | "优化这个慢查询"<br>"设计索引策略" |
| **database-admin** | sonnet | 数据库管理员 | 备份、复制、监控 | "设置数据库备份"<br>"配置主从复制" |
| **neon-expert** | sonnet | Neon Serverless Postgres 专家 | Neon 配置、优化 | "配置 Neon 数据库"<br>"优化 Neon 性能" |
| **neon-database-architect** | sonnet | Neon 架构专家，Drizzle ORM | Neon Schema、迁移 | "设计 Neon Schema"<br>"配置 Drizzle ORM" |
| **neon-auth-specialist** | sonnet | Neon Auth 专家，Stack Auth | 认证集成、用户管理 | "集成 Stack Auth"<br>"设置用户认证" |
| **supabase-schema-architect** | sonnet | Supabase Schema 设计专家 | Supabase Schema、RLS | "设计 Supabase Schema"<br>"配置行级安全" |
| **nosql-specialist** | sonnet | NoSQL 专家，MongoDB/Redis | NoSQL 设计、优化 | "设计 MongoDB Schema"<br>"配置 Redis 缓存" |
| **database-optimization** | sonnet | 数据库性能优化 | N+1 问题、缓存 | "解决 N+1 查询问题"<br>"实现查询缓存" |

### 11.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/design-database-schema` | 设计数据库架构 | 架构设计 | `/design-database-schema` |
| `/create-database-migrations` | 创建迁移 | 数据库迁移 | `/create-database-migrations` |
| `/supabase-schema-sync` | 同步 Supabase Schema | Schema 同步 | `/supabase-schema-sync` |
| `/supabase-performance-optimizer` | Supabase 性能优化 | 性能优化 | `/supabase-performance-optimizer` |
| `/supabase-security-audit` | Supabase 安全审计 | 安全检查 | `/supabase-security-audit` |

### 11.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **postgresql** | PostgreSQL 最佳实践 | PostgreSQL、PG | "PostgreSQL 索引策略" |
| **timescaledb** | TimescaleDB 时序数据库 | 时序数据、TimescaleDB | "如何使用 TimescaleDB？" |

---

## 12. specialized - 专业领域插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 专业领域插件 - AI 工程、数据科学、机器学习、模拟仿真、工具集等专业领域能力。

### 12.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **ai-engineer** | sonnet | AI 工程师，LLM 应用、RAG 系统 | LLM 集成、AI 功能 | "实现 RAG 系统"<br>"构建 LLM 应用" |
| **ml-engineer** | sonnet | ML 工程师，模型部署 | ML 管道、模型服务 | "部署 ML 模型"<br>"设计特征工程" |
| **mlops-engineer** | sonnet | MLOps 工程师，实验追踪 | MLflow、模型注册 | "设置 MLflow"<br>"自动化模型重训练" |
| **data-scientist** | sonnet | 数据科学家，SQL 查询 | 数据分析、BigQuery | "分析这个数据集"<br>"编写复杂 SQL 查询" |
| **data-engineer** | sonnet | 数据工程师，ETL 管道 | 数据管道、Spark | "设计 ETL 管道"<br>"优化 Spark 作业" |
| **nlp-engineer** | sonnet | NLP 工程师，文本处理 | 文本分析、情感识别 | "实现情感分析"<br>"处理文本分类" |
| **computer-vision-engineer** | sonnet | 计算机视觉工程师 | 图像处理、目标检测 | "实现目标检测"<br>"处理图像识别" |
| **prompt-engineer** | sonnet | 提示词工程师，LLM 优化 | 提示词优化、代理设计 | "优化这个提示词"<br>"设计代理系统提示" |
| **model-evaluator** | sonnet | 模型评估专家 | 模型选择、性能比较 | "评估这些模型"<br>"设计评估指标" |
| **quant-analyst** | sonnet | 量化分析师，金融模型 | 交易策略、回测 | "回测交易策略"<br>"构建金融模型" |
| **risk-manager** | sonnet | 风险管理专家 | 风险评估、对冲 | "评估投资组合风险"<br>"设计对冲策略" |
| **search-specialist** | sonnet | 搜索专家，深度研究 | 信息搜索、研究 | "研究这个技术"<br>"搜索最新趋势" |
| **task-decomposition-expert** | sonnet | 任务分解专家 | 复杂任务分解 | "分解这个复杂目标"<br>"设计任务工作流" |
| **llms-maintainer** | sonnet | LLMs.txt 维护专家 | AI 爬虫优化 | "生成 llms.txt"<br>"优化 AI 导航" |
| **hackathon-ai-strategist** | sonnet | AI 黑客马拉松策略师 | 黑客马拉松、创意 | "评估这个项目创意"<br>"规划黑客马拉松策略" |
| **ai-ethics-advisor** | sonnet | AI 伦理顾问 | AI 偏见、公平性 | "评估 AI 偏见"<br>"设计负责任的 AI" |

### 12.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/implement` | 智能实现 | 自动选择实现方式 | `/implement "用户认证"` |
| `/refactor` | 智能重构 | 代码重构 | `/refactor src/legacy/` |
| `/explain-code` | 解释代码 | 理解代码 | `/explain-code src/complex.ts` |
| `/check-file` | 文件分析 | 分析文件 | `/check-file src/main.ts` |
| `/context-prime` | 上下文准备 | 加载上下文 | `/context-prime` |
| `/monte-carlo-simulator` | 蒙特卡洛模拟 | 概率模拟 | `/monte-carlo-simulator` |
| `/digital-twin-creator` | 数字孪生创建 | 仿真建模 | `/digital-twin-creator` |
| `/all-tools` | 显示所有工具 | 查看工具 | `/all-tools` |

### 12.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **notebooklm** | Google NotebookLM 查询 | NotebookLM、Gemini | "从 NotebookLM 查询这个问题" |
| **youtube-transcribe-skill** | YouTube 字幕提取 | YouTube、字幕 | "提取这个视频的字幕" |

---

## 13. research - 研究插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 深度研究插件 - 学术研究、竞争情报、数据分析、事实核查、研究报告生成等研究能力。

### 13.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **research-orchestrator** | opus | 研究编排器，协调研究工作流 | 复杂研究项目、多阶段研究 | "研究量子计算对密码学的影响"<br>"协调这个多阶段研究项目" |
| **research-coordinator** | sonnet | 研究协调员，分配研究任务 | 分配研究任务、协调专家 | "分配这个研究任务给适当的专家"<br>"协调多领域研究" |
| **research-synthesizer** | sonnet | 研究综合专家，整合发现 | 综合多源研究、创建报告 | "综合这些研究发现"<br>"整合多个研究来源" |
| **academic-researcher** | sonnet | 学术研究员，论文分析 | 学术论文、文献综述 | "分析这些学术论文"<br>"进行文献综述" |
| **technical-researcher** | sonnet | 技术研究员，代码库分析 | 技术实现研究、库评估 | "研究不同限流实现"<br>"评估这些技术方案" |
| **data-analyst** | sonnet | 数据分析师，定量分析 | 数据分析、趋势识别 | "分析电动汽车销售趋势"<br>"比较云服务商性能" |
| **competitive-intelligence-analyst** | sonnet | 竞争情报分析师 | 竞争对手分析、市场研究 | "分析主要竞争对手"<br>"研究市场定位" |
| **fact-checker** | sonnet | 事实核查员 | 验证声明、评估来源 | "核实这个说法"<br>"评估信息来源可信度" |
| **report-generator** | sonnet | 报告生成专家 | 生成研究报告、创建文档 | "生成综合研究报告"<br>"创建执行摘要" |
| **query-clarifier** | sonnet | 查询澄清专家 | 澄清研究问题、明确需求 | "澄清这个研究问题"<br>"明确研究范围" |
| **research-brief-generator** | sonnet | 研究简报生成专家 | 创建研究计划、定义问题 | "创建研究简报"<br>"定义研究关键问题" |
| **nia-oracle** | sonnet | Nia 知识工具专家 | 深度技术研究、文档查询 | "用 Nia 研究这个技术"<br>"查询远程代码库" |

---

## 14. svelte - Svelte 插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: Svelte and SvelteKit development plugin with scaffolding, testing, Storybook integration, and optimization tools。

### 14.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/svelte-scaffold` | Svelte 项目脚手架 | 创建新项目 | `/svelte-scaffold` |
| `/svelte-component` | 创建 Svelte 组件 | 创建组件 | `/svelte-component "Button"` |
| `/svelte-test` | 创建测试 | 编写测试 | `/svelte-test` |
| `/svelte-test-setup` | 测试配置 | 配置测试环境 | `/svelte-test-setup` |
| `/svelte-test-coverage` | 覆盖率分析 | 分析测试覆盖 | `/svelte-test-coverage` |
| `/svelte-storybook` | Storybook 助手 | Storybook 开发 | `/svelte-storybook` |
| `/svelte-storybook-setup` | Storybook 配置 | 配置 Storybook | `/svelte-storybook-setup` |
| `/svelte-storybook-story` | 创建 Story | 创建组件故事 | `/svelte-storybook-story` |
| `/svelte-optimize` | 性能优化 | 优化 Svelte 应用 | `/svelte-optimize` |
| `/svelte-a11y` | 无障碍审计 | 检查可访问性 | `/svelte-a11y` |
| `/svelte-debug` | 调试助手 | 调试 Svelte 问题 | `/svelte-debug` |
| `/svelte-migrate` | 版本迁移 | 迁移 Svelte 版本 | `/svelte-migrate` |

---

## 15. mobile - 移动开发插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 移动开发插件 - Flutter、React Native、桌面应用、App Store 优化等移动开发能力。

### 15.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **flutter-mobile-app-dev** | sonnet | Flutter 移动应用开发专家 | Flutter 开发、跨平台应用 | "创建 Flutter 导航"<br>"实现 Flutter 状态管理" |
| **react-native-dev** | sonnet | React Native 开发专家 | RN 开发、原生集成 | "创建 RN 应用"<br>"集成原生模块" |
| **desktop-app-dev** | sonnet | 桌面应用开发专家 | Electron、Tauri | "创建 Electron 应用"<br>"构建 Tauri 桌面应用" |
| **mobile-app-builder** | sonnet | 移动应用构建专家 | 构建配置、发布 | "配置 iOS 构建"<br>"准备 Android 发布" |
| **mobile-ux-optimizer** | sonnet | 移动 UX 优化专家 | 移动体验优化 | "优化移动端体验"<br>"改善触摸交互" |
| **app-store-optimizer** | sonnet | App Store 优化专家 | ASO、应用商店 | "优化 App Store 列表"<br>"提升应用下载量" |

---

## 16. game - 游戏开发插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 游戏开发插件 - Unity、Unreal Engine、3D 美术、游戏设计、资产管线、性能分析等游戏开发能力。

### 16.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **unity-game-developer** | sonnet | Unity 游戏开发专家 | Unity 项目、C# 脚本 | "创建 Unity 游戏机制"<br>"优化 Unity 性能" |
| **unreal-engine-developer** | sonnet | Unreal Engine 开发专家 | UE 项目、C++/蓝图 | "创建 UE 游戏功能"<br>"设计蓝图系统" |
| **game-designer** | sonnet | 游戏设计师，机制和平衡 | 游戏设计、平衡调整 | "设计游戏机制"<br>"平衡游戏难度曲线" |
| **3d-artist** | sonnet | 3D 美术专家，资产创建 | 3D 建模、纹理、动画 | "优化 3D 资产"<br>"设置材质系统" |

### 16.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/unity-project-setup` | Unity 项目配置 | 配置 Unity 项目 | `/unity-project-setup` |
| `/game-asset-pipeline` | 游戏资源管线 | 设置资产管线 | `/game-asset-pipeline` |
| `/game-performance-profiler` | 游戏性能分析 | 分析游戏性能 | `/game-performance-profiler` |
| `/game-testing-framework` | 游戏测试框架 | 配置游戏测试 | `/game-testing-framework` |
| `/game-analytics-integration` | 游戏分析集成 | 集成分析 SDK | `/game-analytics-integration` |

---

## 17. blockchain - 区块链插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 区块链/Web3 插件 - 智能合约开发、安全审计、前端集成等 Web3 开发能力。

### 17.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **smart-contract-specialist** | sonnet | 智能合约开发专家，Solidity | 智能合约开发、DeFi 协议 | "创建 ERC-20 代币"<br>"实现 AMM DEX"<br>"优化合约 Gas 费用" |
| **smart-contract-auditor** | opus | 智能合约安全审计专家 | 安全审计、漏洞检测 | "审计这个 DeFi 合约"<br>"检查重入攻击漏洞"<br>"分析经济攻击向量" |
| **web3-integration-specialist** | sonnet | Web3 前端集成专家 | 钱包集成、dApp 开发 | "集成 MetaMask 钱包"<br>"实现 NFT 市场前端"<br>"处理交易签名" |

### 17.2 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **ccxt** | CCXT 加密货币交易库 | CCXT、交易 | "使用 CCXT 获取行情" |
| **coingecko** | CoinGecko API 集成 | CoinGecko、价格 | "获取代币价格数据" |
| **cryptofeed** | Cryptofeed 实时数据 | 实时数据、订阅 | "订阅实时市场数据" |
| **hummingbot** | Hummingbot 做市机器人 | 做市、机器人 | "配置做市策略" |
| **polymarket** | Polymarket 预测市场 | 预测市场、Polymarket | "集成 Polymarket API" |

---

## 18. design - 设计插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 设计插件 - UI/UX 设计、无障碍设计、视觉叙事、AI 图像生成等设计能力。

### 18.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **ui-ux-designer** | sonnet | UI/UX 设计专家 | UI 设计指导、用户体验 | "设计登录页面 UI"<br>"改进用户体验" |
| **ui-designer** | sonnet | UI 视觉设计专家 | 视觉设计、组件设计 | "设计按钮组件"<br>"创建配色方案" |
| **ux-researcher** | sonnet | UX 研究专家 | 用户研究、可用性测试 | "设计用户测试"<br>"分析用户反馈" |
| **accessibility-expert** | sonnet | 无障碍设计专家 | WCAG 合规、辅助技术 | "检查 WCAG 合规"<br>"优化屏幕阅读器支持" |
| **visual-storyteller** | sonnet | 视觉叙事专家 | 数据可视化、演示 | "设计数据可视化"<br>"创建演示故事板" |
| **vision-specialist** | sonnet | 视觉分析专家 | 图像分析、视觉 AI | "分析这个界面截图"<br>"提取视觉元素" |

### 18.2 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **nanobanana-skill** | Gemini AI 图像生成 | 图像生成、Gemini | "生成一张图片"<br>"用 Gemini 编辑图像" |

---

## 19. media - 媒体处理插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 媒体处理插件 - 视频剪辑、音频处理、播客制作、OCR 文档提取等多媒体处理能力。

### 19.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **video-editor** | opus | 视频编辑专家，FFmpeg | 视频剪辑、转场效果 | "剪辑这个视频"<br>"添加转场效果" |
| **audio-mixer** | sonnet | 音频混音专家 | 多轨混音、音频制作 | "混合多轨音频"<br>"设计音效" |
| **audio-quality-controller** | sonnet | 音频质量控制专家 | 音频增强、降噪 | "优化音频质量"<br>"标准化音量" |
| **podcast-transcriber** | sonnet | 播客转录专家 | 音频转文字、说话人识别 | "转录这个播客"<br>"识别说话人" |
| **podcast-content-analyzer** | sonnet | 播客内容分析专家 | 识别精彩片段、章节 | "识别病毒时刻"<br>"创建章节标记" |
| **podcast-metadata-specialist** | sonnet | 播客元数据专家 | SEO 标题、Show Notes | "优化播客标题"<br>"创建 Show Notes" |
| **timestamp-precision-specialist** | sonnet | 精准时间戳专家 | 剪辑点、静音分析 | "提取精确剪辑点"<br>"分析静音段落" |
| **social-media-clip-creator** | sonnet | 社交媒体短视频专家 | 平台优化、字幕 | "创建 TikTok 短视频"<br>"添加字幕" |
| **document-structure-analyzer** | sonnet | 文档结构分析专家 | 文档布局、层次 | "分析文档结构"<br>"识别内容层次" |
| **visual-analysis-ocr** | sonnet | 视觉分析 OCR 专家 | 图像文字提取 | "从图像提取文字"<br>"保留格式转换" |
| **ocr-preprocessing-optimizer** | sonnet | OCR 预处理优化专家 | 图像增强、校正 | "优化 OCR 图像"<br>"校正倾斜文档" |
| **ocr-grammar-fixer** | sonnet | OCR 文本校正专家 | OCR 错误修正 | "修正 OCR 错误"<br>"清理识别文本" |
| **ocr-quality-assurance** | sonnet | OCR 质量保证专家 | 校对验证 | "验证 OCR 准确性"<br>"最终质量检查" |
| **markdown-syntax-formatter** | sonnet | Markdown 格式化专家 | Markdown 转换 | "转换为 Markdown"<br>"格式化文档结构" |
| **text-comparison-validator** | sonnet | 文本比较验证专家 | 文本对比、差异 | "比较两个文本"<br>"检测差异" |

---

## 20. mcp - MCP 开发插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: MCP 开发插件 - Model Context Protocol 服务器开发、部署、测试、安全审计等 MCP 生态能力。

### 20.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **mcp-server-architect** | sonnet | MCP 服务器架构专家 | 设计 MCP 服务器、工具定义 | "设计 MCP 服务器架构"<br>"定义 MCP 工具" |
| **mcp-protocol-specialist** | sonnet | MCP 协议规范专家 | 协议设计、标准合规 | "理解 MCP 协议"<br>"实现协议合规" |
| **mcp-integration-engineer** | sonnet | MCP 集成工程师 | 客户端集成、多服务器编排 | "集成 MCP 服务器"<br>"编排多个 MCP 服务" |
| **mcp-deployment-orchestrator** | sonnet | MCP 部署编排专家 | 容器化、K8s 部署 | "部署 MCP 服务器"<br>"配置 K8s 自动扩缩" |
| **mcp-testing-engineer** | sonnet | MCP 测试工程师 | 协议测试、性能评估 | "测试 MCP 服务器"<br>"验证协议合规性" |
| **mcp-security-auditor** | sonnet | MCP 安全审计专家 | 安全审查、OAuth、RBAC | "审计 MCP 安全性"<br>"实现 OAuth 集成" |
| **mcp-registry-navigator** | sonnet | MCP 注册表导航专家 | 发现服务器、评估能力 | "搜索 MCP 服务器"<br>"评估服务器能力" |

---

## 21. obsidian - Obsidian 插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: Obsidian 运维插件 - 知识库管理、笔记连接、标签管理、元数据、内容策展等 Obsidian Vault 运维能力。

### 21.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **vault-optimizer** | sonnet | Vault 性能优化专家 | 性能分析、存储优化 | "分析 Vault 性能"<br>"优化文件大小" |
| **moc-agent** | sonnet | Map of Content 专家 | 生成 MOC、组织导航 | "生成缺失的 MOC"<br>"组织孤立笔记" |
| **tag-agent** | sonnet | 标签分类专家 | 标签规范化、层次组织 | "规范化标签"<br>"合并重复标签" |
| **metadata-agent** | sonnet | 元数据管理专家 | Frontmatter 标准化 | "标准化 Frontmatter"<br>"添加元数据" |
| **connection-agent** | sonnet | 笔记连接专家 | 建议链接、发现关系 | "建议笔记链接"<br>"发现相关内容" |
| **content-curator** | sonnet | 内容策展专家 | 识别过时内容、质量 | "识别过时笔记"<br>"合并相似内容" |
| **review-agent** | sonnet | 质量审查专家 | 交叉检查、一致性 | "检查增强一致性"<br>"验证链接完整性" |

---

## 22. seo - SEO 插件

**版本**: v1.0.0 | **作者**: tianzecn | **许可**: MIT

**描述**: SEO 专家插件 - 内容优化、关键词策略、E-E-A-T 信号、精选摘要等搜索引擎优化能力。

### 22.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **seo-content-writer** | sonnet | SEO 内容写作专家 | 写 SEO 优化内容 | "写一篇 SEO 优化文章"<br>"创建关键词丰富的内容" |
| **seo-content-planner** | sonnet | SEO 内容规划专家 | 内容策略、主题集群 | "规划内容日历"<br>"识别主题缺口" |
| **seo-content-auditor** | sonnet | SEO 内容审计专家 | 内容质量、E-E-A-T | "审计内容质量"<br>"评估 E-E-A-T 信号" |
| **seo-keyword-strategist** | sonnet | 关键词策略专家 | 关键词密度、语义 | "分析关键词使用"<br>"建议语义变体" |
| **seo-meta-optimizer** | sonnet | 元标签优化专家 | 标题、描述、URL | "优化页面标题"<br>"写吸引点击的描述" |
| **seo-structure-architect** | sonnet | SEO 结构架构专家 | 标题层次、Schema | "优化标题结构"<br>"添加 Schema 标记" |
| **seo-authority-builder** | sonnet | E-E-A-T 权威构建专家 | 权威信号、信任 | "增强 E-E-A-T 信号"<br>"建立内容权威" |
| **seo-snippet-hunter** | sonnet | 精选摘要专家 | Featured Snippets | "优化为精选摘要"<br>"格式化问答内容" |
| **seo-content-refresher** | sonnet | 内容更新专家 | 更新过时内容 | "识别需更新内容"<br>"刷新旧文章" |
| **seo-cannibalization-detector** | sonnet | 关键词蚕食检测专家 | 关键词重叠、竞争 | "检测关键词蚕食"<br>"建议内容差异化" |

---

## 23. business - 商业插件

**版本**: v1.2.0 | **作者**: tianzecn | **许可**: MIT

**描述**: 商业插件 - 销售、营销、内容发布、合规、客户成功、社交媒体等商业能力。

### 23.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **growth-hacker** | sonnet | 增长黑客专家 | 增长策略、用户获取 | "设计增长策略"<br>"优化转化漏斗" |
| **content-creator** | sonnet | 内容创作专家 | 创建营销内容 | "创建营销内容"<br>"写产品文案" |
| **product-sales-specialist** | sonnet | 产品销售专家 | 销售策略、演示 | "准备销售演示"<br>"设计销售策略" |
| **technical-sales-engineer** | sonnet | 技术销售工程师 | 技术演示、POC | "准备技术演示"<br>"设计 POC 方案" |
| **customer-success-manager** | sonnet | 客户成功经理 | 客户健康、留存 | "提升客户健康度"<br>"设计留存策略" |
| **legal-compliance-checker** | sonnet | 法律合规检查专家 | 合规检查、条款审查 | "检查法律合规"<br>"审查服务条款" |
| **brand-guardian** | sonnet | 品牌守护专家 | 品牌一致性、声誉 | "检查品牌一致性"<br>"监控品牌声誉" |
| **twitter-engager** | sonnet | Twitter 互动专家 | Twitter 策略、互动 | "设计 Twitter 策略"<br>"提升互动率" |
| **instagram-curator** | sonnet | Instagram 策展专家 | Instagram 内容、美学 | "规划 Instagram 内容"<br>"优化视觉美学" |
| **tiktok-strategist** | sonnet | TikTok 策略专家 | TikTok 内容、趋势 | "设计 TikTok 策略"<br>"抓住热门趋势" |
| **reddit-community-builder** | sonnet | Reddit 社区建设专家 | Reddit 策略、AMA | "建设 Reddit 社区"<br>"规划 AMA 活动" |
| **trend-researcher** | sonnet | 趋势研究专家 | 趋势分析、市场洞察 | "研究行业趋势"<br>"分析市场动向" |
| **finance-tracker** | sonnet | 财务追踪专家 | 财务追踪、预算 | "追踪财务指标"<br>"管理预算" |
| **support-responder** | sonnet | 客服响应专家 | 客户支持、工单 | "回复客户工单"<br>"处理支持请求" |
| **legal-advisor** | sonnet | 法律顾问 | 法律咨询、风险 | "评估法律风险"<br>"提供法律建议" |
| **enterprise-integrator-architect** | sonnet | 企业集成架构师 | 企业集成、SSO | "设计企业集成"<br>"配置 SSO" |
| **enterprise-onboarding-specialist** | sonnet | 企业入职专家 | 企业客户入职 | "设计入职流程"<br>"准备入职材料" |
| **enterprise-security-reviewer** | sonnet | 企业安全审查专家 | 安全评估、合规 | "进行安全评估"<br>"准备合规文档" |
| **pricing-packaging-specialist** | sonnet | 定价包装专家 | 定价策略、套餐 | "设计定价策略"<br>"优化产品包装" |
| **data-privacy-engineer** | sonnet | 数据隐私工程师 | GDPR、隐私 | "确保 GDPR 合规"<br>"实现数据隐私" |
| **compliance-automation-specialist** | sonnet | 合规自动化专家 | 自动化合规 | "自动化合规检查"<br>"设计合规流程" |
| **ai-ethics-governance-specialist** | sonnet | AI 伦理治理专家 | AI 治理、伦理 | "建立 AI 治理"<br>"评估 AI 伦理" |
| **b2b-project-shipper** | sonnet | B2B 项目交付专家 | 企业项目交付 | "交付企业项目"<br>"管理企业客户" |

### 23.2 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| `/publisher-all` | 全平台发布 | 多平台内容发布 | `/publisher-all` |
| `/publisher-medium` | 发布到 Medium | Medium 博客 | `/publisher-medium` |
| `/publisher-linkedin` | 发布到 LinkedIn | LinkedIn 动态 | `/publisher-linkedin` |
| `/publisher-x` | 发布到 Twitter/X | Twitter 发布 | `/publisher-x` |
| `/publisher-devto` | 发布到 Dev.to | 开发者社区 | `/publisher-devto` |

---

## 24. claude-skills - Awesome 技能集合

**版本**: v1.0.0 | **作者**: ComposioHQ | **许可**: Apache-2.0

**描述**: 来自 [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills) 的精选技能集合，包含 27 个实用技能。

**仓库统计**: ⭐ 11.7k stars | 🍴 1.2k forks

### 24.1 开发工具类技能 (Development)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **artifacts-builder** | React、Tailwind、shadcn/ui 构建 HTML 工件 | HTML artifacts、React | "创建一个交互式 HTML 工件" |
| **changelog-generator** | 从 git 提交生成变更日志 | changelog、release notes | "根据提交生成变更日志" |
| **developer-growth-analysis** | 分析编码模式，发送 Slack 报告 | coding patterns、growth | "分析我的编码模式" |
| **mcp-builder** | 创建高质量 MCP 服务器 | MCP server、protocol | "如何创建 MCP 服务器？" |
| **skill-creator** | 创建有效 Claude 技能的指南 | create skill、template | "如何创建 Claude 技能？" |
| **webapp-testing** | Playwright 测试 Web 应用 | Playwright、webapp testing | "测试这个 Web 应用" |

### 24.2 商业营销类技能 (Business & Marketing)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **brand-guidelines** | 应用 Anthropic 品牌颜色和字体 | brand colors、Anthropic | "应用 Anthropic 品牌风格" |
| **competitive-ads-extractor** | 提取分析竞争对手广告 | competitor ads、营销 | "分析竞争对手的广告" |
| **domain-name-brainstormer** | 生成域名并检查可用性 | domain name、域名 | "推荐域名并检查可用性" |
| **internal-comms** | 撰写内部通讯和状态报告 | internal communication | "撰写项目状态报告" |
| **lead-research-assistant** | 识别验证潜在客户 | lead generation、sales | "研究潜在客户" |

### 24.3 沟通写作类技能 (Communication & Writing)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **content-research-writer** | 撰写高质量内容带引用 | content writing、research | "帮我写一篇高质量文章" |
| **meeting-insights-analyzer** | 分析会议记录揭示模式 | meeting transcript | "分析这个会议记录" |

### 24.4 创意媒体类技能 (Creative & Media)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **canvas-design** | 创建 PNG/PDF 视觉艺术 | visual art、poster | "创建一个海报设计" |
| **image-enhancer** | 提升图像和截图质量 | image quality、enhance | "提升这张图片的质量" |
| **slack-gif-creator** | 创建 Slack 优化 GIF | Slack GIF、animated | "创建一个 Slack GIF" |
| **theme-factory** | 应用专业字体和颜色主题 | theme、fonts、colors | "应用专业主题样式" |
| **video-downloader** | 从 YouTube 下载视频 | download video、YouTube | "下载这个 YouTube 视频" |

### 24.5 生产力工具类技能 (Productivity & Organization)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **file-organizer** | 智能组织文件查找重复 | organize files、duplicates | "整理这个文件夹" |
| **invoice-organizer** | 自动整理发票和收据 | invoices、receipts | "整理这些发票" |
| **raffle-winner-picker** | 随机选择抽奖获奖者 | raffle、winner | "从列表抽取获奖者" |

### 24.6 文档处理类技能 (Document Processing)

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **docx** | 创建编辑 Word 文档 | Word、docx | "创建一个 Word 文档" |
| **pdf** | 提取合并注释 PDF | PDF、merge、extract | "合并这些 PDF 文件" |
| **pptx** | 读取生成调整幻灯片 | PowerPoint、pptx | "创建一个 PPT 演示" |
| **xlsx** | 电子表格操作：公式、图表 | Excel、xlsx | "创建一个 Excel 表格" |

---

# 🔷 第二部分：Anthropic 官方插件

> 以下插件来自 Anthropic 官方 GitHub 仓库 [claude-code-plugins](https://github.com/anthropics/claude-code-plugins)

---

## 25. agent-sdk-dev - Agent SDK 开发插件

**版本**: v1.0.0 | **作者**: Ashwin Bhat (Anthropic) | **许可**: MIT

**描述**: Claude Agent SDK 应用开发全生命周期工具，支持 Python 和 TypeScript 项目的创建与验证。

### 25.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/new-sdk-app** | 交互式创建 Agent SDK 应用，自动验证 | 创建新 SDK 项目、搭建 Agent 应用 | `/new-sdk-app my-agent` |

### 25.2 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **agent-sdk-verifier-py** | sonnet | 验证 Python SDK 应用是否符合最佳实践 | 创建 Python SDK 项目后、部署前验证 | "验证我的 Python Agent SDK 应用" |
| **agent-sdk-verifier-ts** | sonnet | 验证 TypeScript SDK 应用是否符合最佳实践 | 创建 TS SDK 项目后、部署前验证 | "检查我的 SDK 应用是否符合最佳实践" |

---

## 26. code-review - 代码审查插件

**版本**: v1.0.0 | **作者**: Boris Cherny (Anthropic) | **许可**: MIT

**描述**: 使用多个专业代理进行自动化 PR 代码审查，基于置信度评分过滤高信号问题。

### 26.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/code-review** | 对 PR 进行全面代码审查 | PR 审查、代码质量检查 | `/code-review 123` |

---

## 27. commit-commands - Git 提交命令插件

**版本**: v1.0.0 | **作者**: Anthropic | **许可**: MIT

**描述**: 简化 Git 工作流的命令集，包括提交、推送和创建 PR。

### 27.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/commit** | 智能提交代码变更 | 提交代码、生成提交信息 | `/commit` |
| **/push** | 推送到远程仓库 | 推送代码、同步远程 | `/push` |
| **/pr** | 创建 Pull Request | 创建 PR、代码合并 | `/pr` |

---

## 28. feature-dev - 功能开发插件

**版本**: v1.0.0 | **作者**: Sid Bidasaria (Anthropic) | **许可**: MIT

**描述**: 全面的功能开发工作流，包含代码库探索、架构设计和质量审查专业代理。

### 28.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/feature-dev** | 引导式功能开发，7 阶段流程 | 实现新功能、复杂开发任务 | `/feature-dev "用户认证模块"` |

### 28.2 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **code-explorer** | sonnet | 深度分析代码库特性，追踪执行路径 | 理解代码库、分析现有功能 | "分析登录功能是如何实现的" |
| **code-architect** | sonnet | 设计功能架构，提供完整实现蓝图 | 设计新功能、架构规划 | "为用户管理模块设计架构" |
| **code-reviewer** | sonnet | 代码审查，基于置信度过滤高优先级问题 | 代码审查、提交前检查 | "审查我最近的修改" |

---

## 29. frontend-design - 前端设计插件

**版本**: v1.0.0 | **作者**: Prithvi Rajasekaran, Alexander Bricken (Anthropic) | **许可**: MIT

**描述**: 高质量前端界面设计技能，生成独特、生产级的 UI 代码。

### 29.1 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **frontend-design** | 创建高设计质量的前端组件 | UI design、frontend、component | "设计一个现代风格的登录页面" |

---

## 30. hookify - Hook 创建插件

**版本**: v0.1.0 | **作者**: Daisy Hollman (Anthropic) | **许可**: MIT

**描述**: 通过分析对话模式轻松创建自定义 Hook，防止不期望的行为。

### 30.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/hookify** | 从指令或对话分析创建 Hook 规则 | 创建自定义 Hook、阻止危险操作 | `/hookify 警告使用 rm -rf 命令` |
| **/hookify:list** | 列出所有已创建的规则 | 查看现有规则 | `/hookify:list` |
| **/hookify:configure** | 交互式配置规则 | 启用/禁用规则 | `/hookify:configure` |

---

## 31. learning-output-style - 学习输出风格插件

**版本**: v1.0.0 | **作者**: Boris Cherny (Anthropic) | **许可**: MIT

**描述**: 交互式学习模式，在决策点请求有意义的代码贡献（模拟未发布的 Learning 输出风格）。

---

## 32. explanatory-output-style - 解释性输出风格插件

**版本**: v1.0.0 | **作者**: Dickson Tsai (Anthropic) | **许可**: MIT

**描述**: 添加关于实现选择和代码库模式的教育性见解（模拟已弃用的 Explanatory 输出风格）。

---

## 33. plugin-dev - 插件开发工具包

**版本**: v0.1.0 | **作者**: Daisy Hollman (Anthropic) | **许可**: MIT

**描述**: 全面的 Claude Code 插件开发工具包，包含 Hook、MCP、插件结构等 7 个专业技能。

### 33.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/plugin-dev:create-plugin** | 端到端插件创建工作流（8 阶段） | 创建新插件、插件开发 | `/plugin-dev:create-plugin 数据库迁移插件` |

### 33.2 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **agent-creator** | opus | AI 辅助创建代理 | 创建新代理、设计代理行为 | "创建一个数据库迁移代理" |
| **skill-reviewer** | sonnet | 审查技能质量 | 验证技能设计、优化触发词 | "审查这个技能的设计" |
| **plugin-validator** | sonnet | 验证插件结构和配置 | 插件验证、发布前检查 | "验证我的插件配置" |

### 33.3 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **hook-development** | Hook 开发高级指南 | create hook、PreToolUse、validate | "如何创建 PreToolUse Hook？" |
| **mcp-integration** | MCP 服务器集成 | MCP server、Model Context Protocol | "如何添加 MCP 服务器？" |
| **plugin-structure** | 插件目录结构指南 | plugin structure、plugin.json | "插件目录应该怎么组织？" |
| **plugin-settings** | 插件配置模式 | plugin settings、.local.md | "如何存储插件配置？" |
| **command-development** | 斜杠命令开发 | create command、slash command | "如何创建斜杠命令？" |
| **agent-development** | 代理开发指南 | create agent、agent frontmatter | "如何创建自定义代理？" |
| **skill-development** | 技能开发指南 | create skill、SKILL.md | "如何创建新技能？" |

---

## 34. pr-review-toolkit - PR 审查工具包

**版本**: v1.0.0 | **作者**: Daisy Hollman (Anthropic) | **许可**: MIT

**描述**: 6 个专业代理组成的 PR 审查工具包，覆盖注释、测试、错误处理、类型设计、代码质量和简化。

### 34.1 Agents

| 代理 | 模型 | 描述 | 触发场景 | 示例提问 |
|------|------|------|----------|----------|
| **comment-analyzer** | sonnet | 分析注释准确性和维护性 | 添加文档后、注释审查 | "检查注释是否准确" |
| **pr-test-analyzer** | sonnet | 分析测试覆盖质量和完整性 | PR 创建后、测试审查 | "测试是否全面覆盖？" |
| **silent-failure-hunter** | sonnet | 发现错误处理和静默失败 | 错误处理审查、catch 块检查 | "检查静默失败问题" |
| **type-design-analyzer** | sonnet | 分析类型设计质量和不变量 | 新类型引入、类型重构 | "审查 UserAccount 类型设计" |
| **code-reviewer** | sonnet | 通用代码审查 | 代码修改后、提交前 | "审查我的代码修改" |
| **code-simplifier** | sonnet | 代码简化和重构建议 | 代码审查通过后、代码整理 | "简化这段代码" |

---

## 35. ralph-wiggum - 迭代开发循环插件

**版本**: v1.0.0 | **作者**: Daisy Hollman (Anthropic) | **许可**: MIT

**描述**: Ralph Wiggum 技术实现 - 持续自引用 AI 循环，用于交互式迭代开发。

### 35.1 Commands

| 命令 | 描述 | 触发场景 | 示例用法 |
|------|------|----------|----------|
| **/ralph-loop** | 启动 Ralph 迭代循环 | 需要持续迭代的任务、TDD 开发 | `/ralph-loop "构建 REST API" --max-iterations 50` |
| **/cancel-ralph** | 取消当前 Ralph 循环 | 停止迭代、中断循环 | `/cancel-ralph` |
| **/help** | Ralph 帮助信息 | 了解 Ralph 用法 | `/help` |

---

## 36. security-guidance - 安全指导插件

**版本**: v1.0.0 | **作者**: David Dworken (Anthropic) | **许可**: MIT

**描述**: 安全提醒 Hook，在编辑文件时警告潜在安全问题，包括命令注入、XSS 和不安全代码模式。

---

## 37. claude-opus-4-5-migration - Opus 4.5 迁移插件

**版本**: v1.0.0 | **作者**: William Hu (Anthropic) | **许可**: MIT

**描述**: 将代码和提示词从 Sonnet 4.x / Opus 4.1 迁移到 Opus 4.5。

### 37.1 Skills

| 技能 | 描述 | 触发关键词 | 示例提问 |
|------|------|------------|----------|
| **claude-opus-4-5-migration** | Opus 4.5 迁移指南 | migrate、Opus 4.5、upgrade | "如何迁移到 Opus 4.5？" |

---

# 🔶 第三部分：第三方集成插件

> 以下插件来自 [claude-plugins-official/external_plugins](https://github.com/anthropics/claude-plugins-official)，提供与第三方服务的 MCP 集成

---

## 38. asana - Asana 项目管理集成

**作者**: Asana | **类型**: MCP 集成

**描述**: Asana 项目管理集成，创建管理任务、搜索项目、更新分配、跟踪进度。

| 触发场景 | 示例提问 |
|----------|----------|
| 创建 Asana 任务、项目管理 | "在 Asana 中创建一个新任务" |
| 搜索项目、更新状态 | "搜索 Asana 中的待办事项" |

---

## 39. context7 - 文档查询集成

**作者**: Upstash | **类型**: MCP 集成

**描述**: Context7 MCP 服务器，实时获取版本特定的文档和代码示例。

| 触发场景 | 示例提问 |
|----------|----------|
| 查询库文档、获取代码示例 | "查找 React 18 的 hooks 文档" |
| 版本特定文档 | "获取 Next.js 15 的路由文档" |

---

## 40. firebase - Google Firebase 集成

**作者**: Google | **类型**: MCP 集成

**描述**: Google Firebase MCP 集成，管理 Firestore、认证、云函数、托管和存储。

| 触发场景 | 示例提问 |
|----------|----------|
| Firestore 操作、用户认证 | "在 Firestore 中创建用户文档" |
| 云函数部署、托管管理 | "部署 Firebase 云函数" |

---

## 41. github - GitHub 仓库管理集成

**作者**: GitHub | **类型**: MCP 集成

**描述**: 官方 GitHub MCP 服务器，创建 Issue、管理 PR、审查代码、搜索仓库。

| 触发场景 | 示例提问 |
|----------|----------|
| 创建 Issue、管理 PR | "创建一个 GitHub Issue" |
| 代码搜索、仓库管理 | "搜索这个仓库的 PR" |

---

## 42. gitlab - GitLab DevOps 集成

**作者**: GitLab | **类型**: MCP 集成

**描述**: GitLab DevOps 平台集成，管理仓库、MR、CI/CD 流水线、Issue 和 Wiki。

| 触发场景 | 示例提问 |
|----------|----------|
| 管理 MR、CI/CD 流水线 | "查看 GitLab 流水线状态" |
| Issue 管理、Wiki | "创建 GitLab Issue" |

---

## 43. greptile - AI 代码搜索集成

**作者**: Greptile | **类型**: MCP 集成

**描述**: AI 驱动的代码库搜索和理解，使用自然语言查询代码、理解依赖和架构。

| 触发场景 | 示例提问 |
|----------|----------|
| 自然语言代码搜索 | "找到处理用户认证的代码" |
| 代码库理解、架构分析 | "这个项目的架构是什么？" |

---

## 44. laravel-boost - Laravel 开发集成

**作者**: Laravel | **类型**: MCP 集成

**描述**: Laravel 开发工具包 MCP 服务器，包括 Artisan 命令、Eloquent 查询、路由、迁移和框架特定代码生成。

| 触发场景 | 示例提问 |
|----------|----------|
| Artisan 命令、迁移 | "创建 Laravel 迁移" |
| Eloquent 查询、路由 | "生成 Laravel 控制器" |

---

## 45. linear - Linear 任务跟踪集成

**作者**: Linear | **类型**: MCP 集成

**描述**: Linear Issue 跟踪集成，创建 Issue、管理项目、更新状态、跨工作区搜索。

| 触发场景 | 示例提问 |
|----------|----------|
| 创建 Issue、项目管理 | "在 Linear 中创建 Bug 报告" |
| 状态更新、搜索 | "搜索 Linear 中的待办任务" |

---

## 46. playwright - 浏览器自动化集成

**作者**: Microsoft | **类型**: MCP 集成

**描述**: Microsoft Playwright 浏览器自动化和端到端测试 MCP 服务器，支持网页交互、截图、表单填写、元素点击。

| 触发场景 | 示例提问 |
|----------|----------|
| 浏览器自动化、E2E 测试 | "打开网页并截图" |
| 表单填写、页面交互 | "自动化测试登录流程" |

---

## 47. serena - 语义代码分析集成

**作者**: Oraios | **类型**: MCP 集成

**描述**: 语义代码分析 MCP 服务器，通过 LSP 集成提供智能代码理解、重构建议和代码库导航。

| 触发场景 | 示例提问 |
|----------|----------|
| 代码重构、导航 | "重构这个函数" |
| 代码理解、符号查找 | "查找这个类的所有引用" |

---

## 48. slack - Slack 工作区集成

**作者**: Slack | **类型**: MCP 集成

**描述**: Slack 工作区集成，搜索消息、访问频道、阅读线程，保持与团队沟通的连接。

| 触发场景 | 示例提问 |
|----------|----------|
| 搜索消息、读取频道 | "搜索 Slack 中关于部署的消息" |
| 团队沟通 | "查看 #dev 频道的最新消息" |

---

## 49. stripe - Stripe 支付集成

**版本**: v0.1.0 | **作者**: Stripe | **类型**: MCP 集成

**描述**: Stripe 开发插件，支付处理、Webhook、API 和安全集成。

| 触发场景 | 示例提问 |
|----------|----------|
| 支付处理、Webhook | "创建 Stripe 支付链接" |
| API 集成 | "设置 Stripe Webhook" |

---

## 50. supabase - Supabase 后端集成

**作者**: Supabase | **类型**: MCP 集成

**描述**: Supabase MCP 集成，数据库操作、认证、存储和实时订阅。

| 触发场景 | 示例提问 |
|----------|----------|
| 数据库操作、认证 | "执行 Supabase SQL 查询" |
| 实时订阅、存储 | "配置 Supabase 认证" |

---

# 🔷 第四部分：LSP 语言服务器插件

> 以下是 Language Server Protocol (LSP) 插件，提供特定语言的智能代码分析

---

## LSP 插件列表

| 插件 | 语言 | 描述 |
|------|------|------|
| **typescript-lsp** | TypeScript/JavaScript | TypeScript 语言服务器集成 |
| **pyright-lsp** | Python | Python 类型检查和语言服务 |
| **rust-analyzer-lsp** | Rust | Rust 语言分析器集成 |
| **gopls-lsp** | Go | Go 语言服务器集成 |
| **clangd-lsp** | C/C++ | Clang 语言服务器 |
| **jdtls-lsp** | Java | Eclipse JDT 语言服务器 |
| **csharp-lsp** | C# | C# 语言服务器 |
| **swift-lsp** | Swift | Swift 语言服务器 |
| **php-lsp** | PHP | PHP 语言服务器 |
| **lua-lsp** | Lua | Lua 语言服务器 |

---

## 📊 统计汇总

| 类别 | 数量 |
|------|------|
| **本地插件 (plugins/)** | 24 |
| **Anthropic 官方插件** | 13 |
| **第三方集成插件** | 13 |
| **LSP 插件** | 10 |
| **插件总数** | 60 |
| **Agents 总数** | 280+ |
| **Commands 总数** | 330+ |
| **Skills 总数** | 100+ |

---

> 📝 **使用提示**:
> - 使用 `/help` 查看各插件的帮助信息
> - 使用 `Skill` 工具加载特定技能
> - 使用 `Task` 工具启动特定代理
> - 第三方集成插件需要配置对应服务的 API Token
>
> 💡 **触发词说明**: 表格中的触发关键词可帮助 AI 自动识别何时调用对应的代理或技能。
>
> 🔗 **插件来源**:
> - **本地插件**: `plugins/` 目录
> - **Anthropic 官方**: [claude-code-plugins](https://github.com/anthropics/claude-code-plugins)
> - **第三方集成**: [claude-plugins-official/external_plugins](https://github.com/anthropics/claude-plugins-official)

---

*文档由傲娇大小姐 AI 助手自动生成* (￣▽￣*)
