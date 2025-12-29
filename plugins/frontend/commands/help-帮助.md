---
allowed-tools: Read
argument-hint:
description: 显示前端插件可用命令和代理的帮助信息
---

## Frontend 插件帮助

### 可用命令

#### 开发工作流
- **/api-docs** - 从 OpenAPI/Swagger 或代码生成 API 文档
- **/cleanup-artifacts** - 清理构建产物和缓存
- **/help** - 显示此帮助信息
- **/implement-ui** - 从设计或描述实现 UI 组件
- **/import-figma** - 从 Figma 导入设计并生成代码
- **/review** - 多模型代码审查系统
- **/validate-ui** - 使用 Playwright 验证 UI 实现

#### Next.js 工具
- **/nextjs-api-tester** - 测试和验证 Next.js API 路由
- **/nextjs-bundle-analyzer** - 分析和优化包大小
- **/nextjs-component-generator** - 生成优化的 React 组件
- **/nextjs-middleware-creator** - 创建 Next.js 中间件
- **/nextjs-migration-helper** - 迁移助手(Pages→App Router,JS→TS)
- **/nextjs-performance-audit** - 全面的性能审计
- **/nextjs-scaffold** - 创建新的 Next.js 应用

#### Vercel 集成
- **/vercel-analytics** - 配置 Vercel Analytics 和 Speed Insights
- **/vercel-deploy-optimize** - 优化和部署到 Vercel
- **/vercel-edge-function** - 生成 Vercel 边缘函数
- **/vercel-env-sync** - 同步环境变量

### 可用代理

#### 前端架构师
用于规划和架构前端应用的专家级代理。

**使用方式:**
```
@frontend-architect 如何架构一个大型 Next.js 应用?
```

**专长:**
- Next.js App Router 架构
- 组件设计模式
- 状态管理策略
- 性能优化
- 代码组织

#### Vercel 部署专家
Vercel 部署和优化专家。

**使用方式:**
```
@vercel-specialist 如何优化我的 Vercel 部署?
```

**专长:**
- Vercel 配置
- 边缘函数
- 环境变量管理
- 性能监控
- CDN 优化

#### React 性能优化器
专注于 React 应用性能优化。

**使用方式:**
```
@react-optimizer 如何减少我的包大小?
```

**专长:**
- 包大小优化
- 代码分割
- 懒加载
- 渲染性能
- Core Web Vitals

### 常见工作流

#### 1. 创建新的 Next.js 应用
```bash
/nextjs-scaffold my-app --typescript --tailwind
cd my-app
npm run dev
```

#### 2. 从 Figma 导入设计
```bash
/import-figma <figma-url>
/implement-ui <组件名>
/validate-ui
```

#### 3. API 开发
```bash
/nextjs-api-tester /api/users
/api-docs
```

#### 4. 性能优化
```bash
/nextjs-performance-audit --all
/nextjs-bundle-analyzer
```

#### 5. 部署到 Vercel
```bash
/vercel-env-sync --push
/vercel-deploy-optimize --preview
```

### 配置

#### 所需环境变量
```bash
# Figma 访问(用于 /import-figma)
FIGMA_ACCESS_TOKEN=your-token

# Apidog 集成(用于 /api-docs)
APIDOG_API_TOKEN=your-token

# GitHub(用于 /review)
GITHUB_PERSONAL_ACCESS_TOKEN=your-token

# Chrome(用于 /validate-ui)
CHROME_EXECUTABLE_PATH=/path/to/chrome
```

#### 推荐的 VS Code 扩展
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin

### 最佳实践

#### 组件开发
1. 使用 `/nextjs-component-generator` 创建组件
2. 使用 `/implement-ui` 从设计实现
3. 使用 `/validate-ui` 验证
4. 使用 `/review` 审查代码

#### 性能优化
1. 使用 `/nextjs-performance-audit` 建立基线
2. 使用 `/nextjs-bundle-analyzer` 分析包
3. 实现优化
4. 使用 `/vercel-deploy-optimize` 部署

#### 代码质量
1. 使用 `/review` 进行多模型审查
2. 修复已识别的问题
3. 使用 `/cleanup-artifacts` 清理
4. 使用 `/validate-ui` 验证功能

### 获取更多帮助

对于特定命令的详细帮助:
```bash
/命令名 --help
```

对于代理能力:
```bash
@代理名 你能做什么?
```

### 支持

- 文档: `agent_docs/`
- 示例: `plugins/frontend/examples/`
- 问题: 在此仓库创建 GitHub issue
