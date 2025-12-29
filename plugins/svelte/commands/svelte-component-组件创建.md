---
allowed-tools: Read, Write, Edit
argument-hint: [component-name] [--typescript] [--story]
description: 创建新的 Svelte 组件，遵循最佳实践，支持 TypeScript 和测试
---

# 创建 Svelte 组件

创建新的 Svelte 组件：$ARGUMENTS

## 当前 Svelte 项目

- Svelte 配置：@svelte.config.js 或 @vite.config.js（如果存在）
- 组件目录：@src/components/ 或 @src/lib/（如果存在）
- TypeScript 配置：@tsconfig.json（检测 TypeScript 使用情况）
- 测试配置：@vitest.config.js 或 @jest.config.js（如果存在）

## 任务

创建遵循最佳实践的 Svelte 组件。创建组件时：

1. **收集需求**：
   - 组件名称和用途
   - Props 接口
   - 要触发的事件
   - 需要的插槽
   - 状态管理需求
   - TypeScript 偏好

2. **组件结构**：
   ```svelte
   <script lang="ts">
     // 导入
     // 类型定义
     // Props
     // 状态
     // 派生值
     // 副作用
     // 函数
   </script>

   <!-- 标记 -->

   <style>
     /* 作用域样式 */
   </style>
   ```

3. **最佳实践**：
   - 使用 TypeScript/JSDoc 进行适当的 prop 类型定义
   - 在适当的地方实现 $bindable props
   - 默认创建无障碍标记
   - 添加适当的 ARIA 属性
   - 使用语义化 HTML 元素
   - 包含键盘导航支持

4. **可创建的组件类型**：
   - **UI 组件**：按钮、卡片、模态框等
   - **表单组件**：带验证的输入框、自定义表单控件
   - **布局组件**：头部、侧边栏、网格
   - **数据组件**：表格、列表、数据可视化
   - **实用组件**：传送门、过渡、错误边界

5. **附加文件**：
   - 创建配套测试文件
   - 如适用，添加 Storybook 故事
   - 创建使用文档
   - 从 index 文件导出

## 使用示例

用户："创建一个带有可自定义 header、footer 插槽和关闭功能的 Modal 组件"

助手将：
- 创建具有适当结构的 Modal.svelte
- 实现焦点陷阱和键盘处理
- 添加过渡效果
- 创建带有基本测试的 Modal.test.js
- 提供使用示例
- 建议无障碍改进
