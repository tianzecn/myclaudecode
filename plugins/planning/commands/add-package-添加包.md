---
allowed-tools: Read, Write, Edit, Bash, Glob
argument-hint: [package-name] [package-type] | --library | --application | --tool
description: 添加并配置新包到工作空间，包含合适的结构和依赖
---

# 添加包到工作空间

添加并配置新的项目依赖：**$ARGUMENTS**

## 使用说明

1. **包定义和分析**
   - 从参数解析包名称和类型：`$ARGUMENTS`（格式：name [type]）
   - 如果未提供参数，提示输入包名称和类型
   - 验证包名称遵循工作空间命名约定
   - 确定包类型：library、application、tool、shared、service、component-library
   - 检查与现有包的命名冲突

2. **包结构创建**
   - 在适当的工作空间位置创建包目录（packages/、apps/、libs/）
   - 根据类型设置标准包目录结构：
     - `src/` 用于源代码
     - `tests/` 或 `__tests__/` 用于测试
     - `docs/` 用于包文档
     - `examples/` 用于使用示例（如果是 library）
     - `public/` 用于静态资源（如果是 application）
   - 创建包特定的配置文件

3. **包配置设置**
   - 生成 package.json 包含适当的元数据：
     - 遵循工作空间约定的名称
     - 与工作空间策略对齐的版本
     - dependencies 和 devDependencies
     - build、test、lint、dev 的脚本
     - 入口点和 exports 配置
   - 配置 TypeScript（tsconfig.json）继承工作空间设置
   - 设置包特定的代码检查和格式化规则

4. **包类型特定设置**
   - **Library**：配置构建系统、导出定义、API 文档
   - **Application**：设置路由、环境配置、构建优化
   - **Tool**：配置 CLI 设置、二进制导出、命令定义
   - **Shared**：设置通用工具、类型定义、共享常量
   - **Service**：配置服务器设置、API 路由、数据库连接
   - **Component Library**：设置 Storybook、组件导出、样式系统

5. **工作空间集成**
   - 在工作空间配置中注册包（nx.json、lerna.json 等）
   - 配置包依赖和 peer dependencies
   - 设置跨包导入和引用
   - 配置工作空间范围的构建顺序和依赖
   - 将包添加到工作空间脚本和任务运行器

6. **开发环境**
   - 配置包特定的开发服务器（如果适用）
   - 设置热重载和监视模式
   - 配置调试和 source maps
   - 设置开发代理和 API 模拟（如果需要）
   - 配置环境变量管理

7. **测试基础设施**
   - 为包设置测试框架配置
   - 创建初始测试文件和示例
   - 配置测试覆盖率报告
   - 设置包特定的测试脚本
   - 配置与其他工作空间包的集成测试

8. **构建和部署**
   - 为包类型配置构建系统
   - 设置构建产物和输出目录
   - 配置打包和优化
   - 设置包发布配置（如果是 library）
   - 配置部署脚本（如果是 application）

9. **文档和示例**
   - 创建包 README，包含安装和使用说明
   - 设置 API 文档生成
   - 创建使用示例和演示
   - 记录包架构和设计决策
   - 将包添加到工作空间文档

10. **验证和集成测试**
    - 验证包构建成功
    - 测试包安装和导入
    - 验证工作空间依赖解析
    - 测试开发工作流和热重载
    - 验证 CI/CD 流水线包含新包
    - 测试跨包功能和集成
