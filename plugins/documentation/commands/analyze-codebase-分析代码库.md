---
allowed-tools: Bash(find:*), Bash(ls:*), Bash(grep:*), Bash(wc:*), Bash(du:*), Bash(head:*), Bash(tail:*), Bash(cat:*), Bash(touch:*)
description: 生成整个代码库的全面分析和文档
---
# 全面的代码库分析
## 项目发现阶段
### 目录结构
!`find . -type d -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" -not -path "./build/*" -not -path "./.next/*" -not -path "./coverage/*"`
### 完整文件树
!`find . -type f -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./dist/*" -not -path "./build/*" -not -path "./.next/*" -not -path "./coverage/*" -not -path "./*.log"`
### 文件数量和大小分析
- 总文件数: !`find . -type f -not -path "./node_modules/*" -not -path "./.git/*"`
- 代码文件: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" -o -name "*.py" -o -name "*.java" -o -name "*.php" -o -name "*.rb" -o -name "*.go" -o -name "*.rs" -o -name "*.cpp" -o -name "*.c" \)`
- 项目大小: !`du -sh .`
## 配置文件分析
### 包管理
- Package.json: @package.json
- Package-lock.json 是否存在: !`find . -maxdepth 1 -name "package-lock.json"`
- Yarn.lock 是否存在: !`find . -maxdepth 1 -name "yarn.lock"`
- Requirements.txt: @requirements.txt
- Gemfile: @Gemfile
- Cargo.toml: @Cargo.toml
- Go.mod: @go.mod
- Composer.json: @composer.json
### 构建和开发工具
- Webpack 配置: @webpack.config.js
- Vite 配置: @vite.config.js
- Rollup 配置: @rollup.config.js
- Babel 配置: @.babelrc
- ESLint 配置: @.eslintrc.js
- Prettier 配置: @.prettierrc
- TypeScript 配置: @tsconfig.json
- Tailwind 配置: @tailwind.config.js
- Next.js 配置: @next.config.js
### 环境和 Docker
- .env 文件: !`find . -name ".env*" -type f`
- Docker 文件: !`find . -name "Dockerfile*" -o -name "docker-compose*"`
- Kubernetes 文件: !`find . -type f \( -name "*k8s*.yaml" -o -name "*k8s*.yml" -o -name "*kubernetes*.yaml" -o -name "*kubernetes*.yml" -o -name "*deployment*.yaml" -o -name "*deployment*.yml" \)`
### CI/CD 配置
- GitHub Actions: !`find .github -type f \( -name "*.yml" -o -name "*.yaml" \)`
- GitLab CI: @.gitlab-ci.yml
- Travis CI: @.travis.yml
- Circle CI: @.circleci/config.yml
## 源代码分析
### 主应用文件
- 主入口点: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -name "main.*" -o -name "index.*" -o -name "app.*" -o -name "server.*" \)`
- 路由/控制器: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -path "*/routes/*" -o -path "*/controllers/*" -o -path "*/api/*" \)`
- 模型/架构: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -path "*/models/*" -o -path "*/schemas/*" -o -path "*/entities/*" \)`
- 组件: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -path "*/components/*" -o -path "*/views/*" -o -path "*/pages/*" \)`
### 数据库和存储
- 数据库配置: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -name "*database*" -o -name "*db*" -o -name "*connection*" \)`
- 迁移文件: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -path "*/migrations/*" -o -path "*/migrate/*" \)`
- 种子文件: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -path "*/seeds/*" -o -path "*/seeders/*" \)`
### 测试文件
- 测试文件: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -name "*test*" -o -name "*spec*" \)`
- 测试配置: @jest.config.js
### API 文档
- API 文档: !`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -name "*api*.md" -o -name "swagger*" -o -name "openapi*" \)`
## 关键文件内容分析
### 根配置文件
@README.md
@LICENSE
@.gitignore
### 主应用入口点
!`find . -not -path "./node_modules/*" -not -path "./.git/*" \( -name "index.js" -o -name "index.ts" -o -name "main.js" -o -name "main.ts" -o -name "app.js" -o -name "app.ts" -o -name "server.js" -o -name "server.ts" \)`
## 你的任务
基于以上发现的所有信息，创建一个全面的分析，包括:
## 1. 项目概述
- 项目类型(Web 应用、API、库等)
- 技术栈和框架
- 架构模式(MVC、微服务等)
- 语言和版本
## 2. 详细的目录结构分析
对于每个主要目录，说明:
- 用途和在应用中的角色
- 关键文件及其功能
- 如何与其他部分连接
## 3. 文件逐个分解
按类别组织:
- **核心应用文件**: 主入口点、路由、业务逻辑
- **配置文件**: 构建工具、环境、部署
- **数据层**: 模型、数据库连接、迁移
- **前端/UI**: 组件、页面、样式、资源
- **测试**: 测试文件、模拟、固定数据
- **文档**: README、API 文档、指南
- **DevOps**: CI/CD、Docker、部署脚本
## 4. API 端点分析
如果适用，记录:
- 所有发现的端点及其方法
- 认证/授权模式
- 请求/响应格式
- API 版本控制策略
## 5. 架构深入分析
说明:
- 整体应用架构
- 数据流和请求生命周期
- 使用的关键设计模式
- 模块之间的依赖关系
## 6. 环境和设置分析
记录:
- 必需的环境变量
- 安装和设置过程
- 开发工作流程
- 生产部署策略
## 7. 技术栈分解
列出并说明:
- 运行时环境
- 框架和库
- 数据库技术
- 构建工具和打包器
- 测试框架
- 部署技术
## 8. 可视化架构图
创建一个全面的图表，显示:
- 高层系统架构
- 组件关系
- 数据流
- 外部集成
- 文件结构层次
使用 ASCII 艺术、mermaid 语法或详细的文本表示来显示:
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     前端        │────>│      API        │────>│    数据库       │
│   (React/Vue)   │     │   (Node/Flask)  │     │ (Postgres/Mongo)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
## 9. 关键见解和建议
提供:
- 代码质量评估
- 潜在改进
- 安全考虑
- 性能优化机会
- 可维护性建议
深入思考代码库结构，提供对加入项目的新开发人员或架构决策有价值的全面见解。
最后，将所有输出写入名为"codebase_analysis.md"的文件。
