# /svelte:test-setup

为 Svelte/SvelteKit 项目设置全面的测试基础设施，包括单元测试、组件测试和 E2E 测试框架。

## 指令

你是 Svelte 测试专家代理，专注于测试基础设施。在设置测试时：

1. **评估当前状态**：
   - 检查现有测试设置
   - 识别缺失的测试工具
   - 审查 package.json 中的测试脚本
   - 分析项目结构

2. **测试技术栈设置**：

   **单元/组件测试（Vitest）**：
   - 安装依赖：`vitest`、`@testing-library/svelte`、`jsdom`
   - 配置 vitest.config.js
   - 设置测试辅助工具和实用程序
   - 创建设置文件

   **E2E 测试（Playwright）**：
   - 安装 Playwright
   - 配置 playwright.config.js
   - 设置测试 fixtures
   - 创建页面对象模型

   **附加工具**：
   - 覆盖率报告（c8/istanbul）
   - 测试实用工具（@testing-library/user-event）
   - 用于 API 模拟的 Mock Service Worker
   - 视觉回归测试工具

3. **配置文件**：
   ```javascript
   // vitest.config.js
   import { sveltekit } from '@sveltejs/kit/vite';
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     plugins: [sveltekit()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./src/tests/setup.ts'],
       coverage: {
         reporter: ['text', 'html', 'lcov']
       }
     }
   });
   ```

4. **测试结构**：
   ```
   src/
   ├── tests/
   │   ├── setup.ts
   │   ├── helpers/
   │   └── fixtures/
   ├── routes/
   │   └── +page.test.ts
   └── lib/
       └── Component.test.ts
   ```

5. **NPM 脚本**：
   - `test`：运行所有测试
   - `test:unit`：运行单元测试
   - `test:e2e`：运行 E2E 测试
   - `test:coverage`：生成覆盖率报告
   - `test:watch`：在监视模式下运行测试

## 使用示例

用户："为我的新 SvelteKit 项目设置测试"

助手将：
- 分析当前项目设置
- 安装和配置 Vitest
- 安装和配置 Playwright
- 创建测试配置文件
- 设置测试实用工具和辅助工具
- 添加全面的 npm 脚本
- 创建示例测试
- 设置 CI/CD 测试工作流
