---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [migration-strategy] | --gradual | --complete | --strict | --incremental
description: 将 JavaScript 项目迁移到 TypeScript，包含适当的类型和工具设置
---

# 迁移到 TypeScript

将 JavaScript 项目迁移到 TypeScript，具有全面的类型安全：**$ARGUMENTS**

## 当前 JavaScript 状态

- 项目结构：@package.json（分析 JS/TS 混合和依赖项）
- JavaScript 文件：!`find . -name "*.js" -not -path "./node_modules/*" | wc -l`
- 现有 TypeScript：!`find . -name "*.ts" -not -path "./node_modules/*" | wc -l`
- 构建系统：@webpack.config.js 或 @vite.config.js 或 @rollup.config.js

## 任务

系统地将 JavaScript 代码库迁移到 TypeScript，具有适当的类型和工具：

**迁移策略**：使用 $ARGUMENTS 指定渐进式迁移、完全转换、严格模式或增量方法

**迁移流程**：
1. **环境设置** - TypeScript 安装、tsconfig.json 配置、构建工具集成
2. **类型定义** - 安装 @types 包、创建自定义类型声明、定义接口
3. **文件迁移** - 将 .js 重命名为 .ts/.tsx、添加类型注解、解决编译器错误
4. **代码转换** - 使用适当的类型转换类、函数和模块
5. **错误解决** - 修复类型不匹配、null/undefined 处理、严格模式问题
6. **测试与验证** - 更新测试文件、配置类型检查、验证类型覆盖率

**高级功能**：泛型类型、映射类型、条件类型、模块扩展和严格编译器设置。

**开发者体验**：配置 IDE 集成、调试、Lint 规则和团队入职。

**输出**：完全类型化的 TypeScript 代码库，具有严格的类型检查、全面的 IntelliSense 和提高的开发者生产力。
