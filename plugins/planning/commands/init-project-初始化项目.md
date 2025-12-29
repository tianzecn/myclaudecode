---
allowed-tools: Read, Write, Edit, Bash, Glob
argument-hint: [project-type] [framework] | --react | --vue | --api | --cli
description: 初始化新项目，包含基本结构、配置和开发环境设置
---

# 初始化新项目

使用基本结构初始化新项目：**$ARGUMENTS**

## 使用说明

1. **项目分析和设置**
   - 从参数解析项目类型和框架：`$ARGUMENTS`
   - 如果未提供参数，分析当前目录并询问用户项目类型和框架
   - 如需要，创建项目目录结构
   - 验证所选框架适合项目类型

2. **基础项目结构**
   - 创建基本目录（src/、tests/、docs/ 等）
   - 使用适合项目类型的 .gitignore 初始化 git 仓库
   - 创建 README.md，包含项目描述和设置说明
   - 基于项目类型和框架设置适当的文件结构

3. **框架特定配置**
   - **Web/React**：设置 React 与 TypeScript、Vite/Next.js、ESLint、Prettier
   - **Web/Vue**：配置 Vue 3 与 TypeScript、Vite、ESLint、Prettier
   - **Web/Angular**：设置 Angular CLI 项目与 TypeScript 和测试
   - **API/Express**：创建 Express.js 服务器与 TypeScript、中间件和路由
   - **API/FastAPI**：设置 FastAPI 与 Python、Pydantic 模型和异步支持
   - **Mobile/React Native**：配置 React Native 与导航和开发工具
   - **Desktop/Electron**：设置 Electron 与渲染器和主进程结构
   - **CLI/Node**：使用 commander.js 创建 Node.js CLI 和适当的打包
   - **Library/NPM**：设置库与 TypeScript、rollup/webpack 和发布配置

4. **开发环境设置**
   - 配置包管理器（npm、yarn、pnpm）与适当的 package.json
   - 设置 TypeScript 配置，使用严格模式和路径映射
   - 使用 ESLint 和特定语言规则配置代码检查
   - 使用 Prettier 和预提交钩子设置代码格式化
   - 添加 EditorConfig 以保持一致的编码标准

5. **测试基础设施**
   - 安装和配置测试框架（Jest、Vitest、Pytest 等）
   - 设置测试目录结构和示例测试
   - 配置代码覆盖率报告
   - 将测试脚本添加到 package.json/makefile

6. **构建和开发工具**
   - 配置构建系统（Vite、webpack、rollup 等）
   - 设置带热重载的开发服务器
   - 配置环境变量管理
   - 添加构建优化和打包

7. **CI/CD 流水线**
   - 创建 GitHub Actions 工作流用于测试和部署
   - 在拉取请求上设置自动化测试
   - 使用 Dependabot 配置自动依赖更新
   - 向 README 添加状态徽章

8. **文档和质量**
   - 生成包含安装和使用说明的全面 README
   - 创建包含开发指南的 CONTRIBUTING.md
   - 设置 API 文档生成（JSDoc、Sphinx 等）
   - 添加代码质量徽章和标识

9. **安全和最佳实践**
   - 使用 npm audit 或类似工具配置安全扫描
   - 设置依赖漏洞检查
   - 为 Web 应用添加安全头
   - 配置特定于环境的安全设置

10. **项目验证**
    - 验证所有依赖正确安装
    - 运行初始构建以确保配置正常工作
    - 执行测试套件以验证测试设置
    - 检查代码检查和格式化规则是否应用
    - 验证开发服务器成功启动
    - 使用适当的项目结构创建初始提交
