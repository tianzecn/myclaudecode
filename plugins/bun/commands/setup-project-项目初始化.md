---
description: 初始化一个新的 Bun + TypeScript 后端项目，包含最佳实践设置（Hono、Prisma、Biome、测试、Docker）
allowed-tools: Bash, Write, AskUserQuestion, TodoWrite, Read
---

## 使命

从零开始搭建一个生产就绪的 Bun + TypeScript 后端项目，包含所有必要的工具、配置和项目结构。这将创建一个遵循行业最佳实践的坚实基础。

## 项目设置请求

$ARGUMENTS

## 工作流

### 步骤 0：初始化待办列表（必须首先执行）

创建待办列表来跟踪设置过程：

```
TodoWrite 包含以下项目：
- content: "收集项目需求和配置偏好"
  status: "in_progress"
  activeForm: "收集项目需求"
- content: "初始化 Bun 项目并安装依赖"
  status: "pending"
  activeForm: "初始化 Bun 项目"
- content: "配置 TypeScript（严格模式）"
  status: "pending"
  activeForm: "配置 TypeScript"
- content: "配置 Biome（格式化器 + 代码检查器）"
  status: "pending"
  activeForm: "配置 Biome"
- content: "设置 Prisma 与 PostgreSQL"
  status: "pending"
  activeForm: "设置 Prisma"
- content: "创建项目结构（文件夹）"
  status: "pending"
  activeForm: "创建项目结构"
- content: "创建核心工具（错误、日志、配置）"
  status: "pending"
  activeForm: "创建核心工具"
- content: "设置 Hono 应用和服务器"
  status: "pending"
  activeForm: "设置 Hono 应用"
- content: "创建中间件（错误处理器、日志、验证）"
  status: "pending"
  activeForm: "创建中间件"
- content: "设置环境变量和配置"
  status: "pending"
  activeForm: "设置环境配置"
- content: "创建 Docker 配置"
  status: "pending"
  activeForm: "创建 Docker 配置"
- content: "设置测试基础设施"
  status: "pending"
  activeForm: "设置测试"
- content: "创建 package.json 脚本"
  status: "pending"
  activeForm: "创建 npm 脚本"
- content: "创建 .gitignore 和其他配置文件"
  status: "pending"
  activeForm: "创建配置文件"
- content: "创建包含项目文档的 README.md"
  status: "pending"
  activeForm: "创建 README"
- content: "初始化 git 仓库"
  status: "pending"
  activeForm: "初始化 git"
- content: "运行初始质量检查"
  status: "pending"
  activeForm: "运行质量检查"
```

### 步骤 1：收集需求

询问用户项目配置偏好：

```
使用 AskUserQuestion 提出以下问题：

1. 项目名称：
   问题："你的后端项目名称是什么？"
   选项：[让用户输入自定义名称]

2. 数据库：
   问题："你将使用哪个数据库？"
   选项：
   - "PostgreSQL（推荐）"
   - "MySQL"
   - "SQLite（仅用于开发）"

3. 认证：
   问题："你是否需要从一开始就设置 JWT 认证？"
   选项：
   - "是，设置 JWT 认证"
   - "否，我稍后添加"

4. Docker：
   问题："是否包含 Docker 容器化配置？"
   选项：
   - "是，包含 Dockerfile 和 docker-compose.yml"
   - "否，跳过 Docker"

5. 附加功能：
   问题："你想包含哪些附加功能？"
   多选：true
   选项：
   - "Redis 缓存工具"
   - "文件上传处理"
   - "邮件服务集成"
   - "健康检查端点"
```

**存储答案**以便在设置步骤中使用。

### 步骤 2：初始化 Bun 项目

1. **初始化项目**
   ```bash
   bun init -y
   ```

2. **安装运行时依赖**
   ```bash
   bun add hono @hono/node-server
   bun add zod @prisma/client bcrypt jsonwebtoken pino
   ```

   如果选择了 JWT 认证：
   ```bash
   bun add bcrypt jsonwebtoken
   ```

   如果选择了 Redis 缓存：
   ```bash
   bun add ioredis
   ```

3. **安装开发依赖**
   ```bash
   bun add -d @types/node @types/bun typescript prisma @biomejs/biome
   ```

   如果选择了 JWT 认证：
   ```bash
   bun add -d @types/bcrypt @types/jsonwebtoken
   ```

### 步骤 3：配置 TypeScript

使用严格配置创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "bundler",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["bun-types"],
    "baseUrl": ".",
    "paths": {
      "@core/*": ["src/core/*"],
      "@database/*": ["src/database/*"],
      "@services/*": ["src/services/*"],
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 步骤 4：配置 Biome

1. **初始化 Biome**
   ```bash
   bunx @biomejs/biome init
   ```

2. **更新 biome.json**
   ```json
   {
     "$schema": "https://raw.githubusercontent.com/biomejs/biome/main/configuration_schema.json",
     "files": { "ignore": ["node_modules", "dist"] },
     "formatter": {
       "indentStyle": "space",
       "indentSize": 2,
       "lineWidth": 100,
       "quoteStyle": "single",
       "semicolons": "always"
     },
     "organizeImports": true,
     "javascript": { "formatter": { "trailingComma": "es5" } },
     "typescript": {
       "formatter": { "trailingComma": "es5" }
     }
   }
   ```

### 步骤 5：设置 Prisma

1. **初始化 Prisma**
   ```bash
   bunx prisma init
   ```

2. **更新 .env 中的 DATABASE_URL**（根据数据库选择）

   对于 PostgreSQL：
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
   ```

   对于 MySQL：
   ```
   DATABASE_URL="mysql://user:password@localhost:3306/dbname"
   ```

   对于 SQLite：
   ```
   DATABASE_URL="file:./dev.db"
   ```

3. **在 `prisma/schema.prisma` 中创建初始 Prisma schema**：
   - 根据数据库选择更新 datasource provider
   - 添加示例 User 模型
   - 如果选择了 JWT 认证，添加 Session 模型

### 步骤 6：创建项目结构

创建目录结构：

```bash
mkdir -p src/{core,database/repositories,services,controllers,middleware,routes,schemas,types,utils}
mkdir -p tests/{unit,integration,e2e}
```

结果：
```
src/
├── core/              # 核心工具
├── database/
│   ├── client.ts
│   └── repositories/  # 数据访问层
├── services/          # 业务逻辑
├── controllers/       # HTTP 处理器
├── middleware/        # 中间件函数
├── routes/            # API 路由
├── schemas/           # Zod 验证 schema
├── types/             # TypeScript 类型
└── utils/             # 工具函数
tests/
├── unit/
├── integration/
└── e2e/
```

### 步骤 7：创建核心工具

1. **错误类**（`src/core/errors.ts`）
   - ApiError 基类
   - BadRequestError、UnauthorizedError、ForbiddenError、NotFoundError、ConflictError、ValidationError

2. **日志器**（`src/core/logger.ts`）
   - 带有开发/生产配置的 Pino 日志器
   - 开发环境下的美化输出

3. **配置**（`src/core/config.ts`）
   - 环境变量加载
   - 类型安全的配置对象
   - 必需环境变量的验证

### 步骤 8：设置 Hono 应用

1. **创建 Hono 应用**（`src/app.ts`）
   - 初始化 Hono
   - 添加 CORS 中间件
   - 添加安全头中间件
   - 添加请求日志中间件
   - 添加全局错误处理器
   - 挂载健康检查路由（如果选择）

2. **创建服务器**（`src/server.ts`）
   - 导入 Hono 应用
   - 设置优雅关闭
   - 在配置的端口上启动服务器

### 步骤 9：创建中间件

1. **错误处理器**（`src/middleware/errorHandler.ts`）
   - 全局错误处理
   - ApiError 响应格式化
   - 日志记录

2. **验证中间件**（`src/middleware/validator.ts`）
   - validate() 用于请求体
   - validateQuery() 用于查询参数

3. **请求日志器**（`src/middleware/requestLogger.ts`）
   - 记录传入请求
   - 记录带持续时间的响应

4. **安全头**（`src/middleware/security.ts`）
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Strict-Transport-Security

5. **认证中间件**（如果选择 JWT）（`src/middleware/auth.ts`）
   - authenticate() 中间件
   - authorize() 中间件用于基于角色的访问控制

### 步骤 10：设置环境配置

1. **创建 .env.example**
   ```
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   JWT_SECRET=your-secret-key-change-in-production
   LOG_LEVEL=debug
   # 如果选择 Redis，添加 REDIS_URL
   # 根据选择添加其他环境变量
   ```

2. **创建 .env**（从 .env.example 复制）

3. **更新 .gitignore** 以排除 .env

### 步骤 11：创建 Docker 配置（如果选择）

1. **创建 Dockerfile**（多阶段构建）
   - 基础阶段
   - 依赖阶段
   - 构建阶段
   - 运行阶段
   - 健康检查

2. **创建 docker-compose.yml**
   - 应用服务
   - PostgreSQL 服务
   - Redis 服务（如果选择）
   - 健康检查
   - 卷挂载

3. **创建 .dockerignore**

### 步骤 12：设置测试

1. **创建测试工具**（`tests/setup.ts`）
   - 测试数据库连接
   - 测试数据工厂
   - 清理工具

2. **创建示例测试**
   - 单元测试示例（`tests/unit/example.test.ts`）
   - 集成测试示例（`tests/integration/health.test.ts`）

### 步骤 13：创建 Package.json 脚本

使用全面的脚本更新 `package.json`：

```json
{
  "scripts": {
    "dev": "bun --hot src/server.ts",
    "start": "NODE_ENV=production bun src/server.ts",
    "build": "bun build src/server.ts --target bun --outdir dist",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage",
    "lint": "biome lint --write",
    "format": "biome format --write",
    "check": "biome check --write",
    "typecheck": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "bun run src/database/seed.ts",
    "docker:build": "docker build -t [project-name] .",
    "docker:run": "docker-compose up",
    "docker:down": "docker-compose down"
  }
}
```

### 步骤 14：创建配置文件

1. **创建 .gitignore**
   ```
   node_modules/
   dist/
   .env
   .env.local
   *.log
   .DS_Store
   coverage/
   prisma/migrations/
   bun.lockb
   ```

2. **创建 .editorconfig**（可选）

3. **创建 .vscode/settings.json**（Biome 集成）
   ```json
   {
     "editor.defaultFormatter": "biomejs.biome",
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.organizeImports.biome": true,
       "source.fixAll.biome": true
     }
   }
   ```

### 步骤 15：创建 README.md

创建全面的 README，包含：
- 项目描述
- 技术栈
- 项目结构
- 先决条件
- 安装说明
- 开发命令
- 测试说明
- Docker 说明
- 环境变量
- API 文档（占位符）
- 贡献指南
- 许可证

### 步骤 16：初始化 Git 仓库

1. **初始化 git**
   ```bash
   git init
   ```

2. **创建初始提交**
   ```bash
   git add .
   git commit -m "Initial project setup: Bun + TypeScript + Hono + Prisma"
   ```

### 步骤 17：运行质量检查

1. **运行 Prisma generate**
   ```bash
   bunx prisma generate
   ```

2. **运行格式化器**
   ```bash
   bun run format
   ```

3. **运行代码检查器**
   ```bash
   bun run lint
   ```

4. **运行类型检查器**
   ```bash
   bun run typecheck
   ```

5. **运行测试**
   ```bash
   bun test
   ```

**在完成前验证所有检查通过**。

### 步骤 18：完成摘要

展示最终摘要：

```
✅ 项目设置完成！

项目：[project-name]
技术栈：Bun + TypeScript + Hono + Prisma + [database]

已创建：
- ✅ 项目结构（src/、tests/）
- ✅ TypeScript 配置（严格模式）
- ✅ Biome 配置（格式化 + lint）
- ✅ Prisma ORM 设置（[database]）
- ✅ Hono Web 框架
- ✅ 核心工具（错误、日志器、配置）
- ✅ 中间件（验证、认证、日志、安全）
- ✅ 环境配置
- ✅ 测试基础设施
- ✅ [Docker 配置]（如果选择）
- ✅ [JWT 认证]（如果选择）
- ✅ [Redis 缓存]（如果选择）
- ✅ Git 仓库已初始化

下一步：
1. 查看 .env 并使用你的数据库凭据更新
2. 运行数据库迁移：bun run db:migrate
3. 启动开发服务器：bun run dev
4. 打开 http://localhost:3000/health 验证设置
5. 开始实现你的 API 功能！

常用命令：
- bun run dev          # 启动带热重载的开发服务器
- bun run test         # 运行测试
- bun run check        # 格式化 + lint
- bun run db:studio    # 打开 Prisma Studio
- bun run docker:run   # 使用 Docker 启动

文档：
- 完整文档请参见 README.md
- 开发指南请参见 best-practices 技能
- 使用 /implement-api 命令构建功能
```

## 成功标准

项目设置完成的条件：

- ✅ 所有依赖已安装
- ✅ TypeScript 已配置（严格模式）
- ✅ Biome 已配置（格式化 + lint）
- ✅ Prisma 已设置并连接数据库
- ✅ 项目结构已创建
- ✅ 核心工具已实现
- ✅ Hono 应用和服务器已创建
- ✅ 中间件已设置
- ✅ 环境配置已创建
- ✅ 测试基础设施就绪
- ✅ Docker 配置已创建（如果选择）
- ✅ 所有质量检查通过
- ✅ Git 仓库已初始化
- ✅ README.md 已创建

## 错误处理

如果任何步骤失败：

1. **识别问题**
   - 阅读错误消息
   - 检查哪个命令失败

2. **常见问题：**
   - Bun 未安装 → 先安装 Bun
   - 数据库连接失败 → 更新 .env 中的 DATABASE_URL
   - 端口已被占用 → 更改 .env 中的 PORT
   - 缺少依赖 → 运行 `bun install`

3. **恢复：**
   - 修复问题
   - 重新运行失败的步骤
   - 继续剩余步骤

## 记住

此命令创建**生产就绪的基础**。设置完成后：
- 使用 `/implement-api` 构建功能
- 使用 `backend-developer` 代理进行实现
- 使用 `api-architect` 代理进行规划
- 遵循 best-practices 技能中的指南

结果是一个干净、结构良好、完全配置的 Bun 后端项目，可以开始功能开发。
