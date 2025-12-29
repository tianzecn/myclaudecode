---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [file-path] | [component-name]
description: 生成全面的测试套件,包含单元测试、集成测试和边界情况覆盖
---

# 生成测试

为以下目标生成全面的测试套件: $ARGUMENTS

## 当前测试设置

- 测试框架: @package.json or @jest.config.js or @vitest.config.js (检测框架)
- 现有测试: !`find . -name "*.test.*" -o -name "*.spec.*" | head -5`
- 测试覆盖率: !`npm run test:coverage 2>/dev/null || echo "无覆盖率脚本"`
- 目标文件: @$ARGUMENTS (如果提供了文件路径)

## 任务

我将分析目标代码并创建完整的测试覆盖,包括:

1. 单个函数和方法的单元测试
2. 组件交互的集成测试
3. 边缘情况和错误处理测试
4. 外部依赖的 mock 实现
5. 根据需要的测试工具和辅助函数
6. 适当的性能和快照测试

## 流程

我将遵循以下步骤:

1. 分析目标文件/组件结构
2. 识别所有可测试的函数、方法和行为
3. 检查项目中现有的测试模式
4. 遵循项目命名约定创建测试文件
5. 实现包含适当 setup/teardown 的全面测试用例
6. 添加必要的 mock 和测试工具
7. 验证测试覆盖率并添加缺失的测试用例

## 测试类型

### 单元测试

- 使用各种输入测试单个函数
- 组件渲染和属性处理
- 状态管理和生命周期方法
- 工具函数的边缘情况和错误条件

### 集成测试

- 组件交互测试
- 使用 mock 响应的 API 集成
- 服务层集成
- 端到端用户工作流

### 框架特定测试

- **React**: 使用 React Testing Library 的组件测试
- **Vue**: 使用 Vue Test Utils 的组件测试
- **Angular**: 使用 TestBed 的组件和服务测试
- **Node.js**: API 端点和中间件测试

## 测试最佳实践

### 测试结构

- 使用描述行为的测试名称
- 遵循 AAA 模式 (Arrange、Act、Assert)
- 使用 describe 块对相关测试分组
- 使用适当的 setup 和 teardown 实现测试隔离

### Mock 策略

- Mock 外部依赖和 API 调用
- 使用工厂模式生成测试数据
- 为异步操作实现适当的清理
- Mock 计时器和日期以实现确定性测试

### 覆盖率目标

- 目标是 80%+ 的代码覆盖率
- 关注关键业务逻辑路径
- 测试正常路径和错误场景
- 包含边界值测试

我将适应您项目的测试框架 (Jest、Vitest、Cypress 等) 并遵循已建立的模式。
