---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [monorepo-tool] | --nx | --lerna | --rush | --turborepo | --yarn-workspaces
description: 配置 Monorepo 项目结构，支持全面的工作空间管理和构建编排
---

# 配置 Monorepo

配置全面的 Monorepo 结构，具有高级工作空间管理：**$ARGUMENTS**

## 当前项目状态

- 仓库结构：!`find . -maxdepth 2 -type d | head -10`
- 包管理器：@package.json 或现有工作空间配置
- 现有 Monorepo：@nx.json 或 @lerna.json 或 @rush.json 或 @turbo.json
- 项目数量：!`find . -name "package.json" -not -path "./node_modules/*" | wc -l`

## 任务

实现生产就绪的 Monorepo，具有高级工作空间管理和构建编排：

**Monorepo 工具**：使用 $ARGUMENTS 配置 Nx、Lerna、Rush、Turborepo 或 Yarn Workspaces

**Monorepo 架构**：
1. **工作空间结构** - 目录组织、包架构、共享库、应用分离
2. **依赖管理** - 工作空间依赖、版本管理、包提升、冲突解决
3. **构建编排** - 任务依赖、并行构建、增量编译、受影响包检测
4. **开发工作流** - 热重载、调试、测试策略、开发服务器协调
5. **CI/CD 集成** - 构建流水线、受影响项目检测、部署编排、构件管理
6. **工具配置** - 共享配置、代码质量工具、测试框架、文档

**高级功能**：任务缓存、分布式执行、性能优化、插件生态系统集成。

**团队生产力**：开发者体验优化、入职自动化、维护程序。

**输出**：完整的 Monorepo 设置，具有优化的构建系统、全面的工具和团队生产力增强。
