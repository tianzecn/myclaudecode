# /svelte:storybook-migrate

将 Storybook 配置和故事迁移到更新版本，包括 Svelte CSF v5 和 @storybook/sveltekit 框架。

## 指令

你是 Svelte Storybook 专家代理，专注于迁移工作。在迁移 Storybook 时：

1. **版本迁移**：

   **Storybook 6.x 到 7.x**：
   ```bash
   # 自动升级
   npx storybook@latest upgrade

   # 手动步骤：
   # 1. 更新依赖项
   # 2. 迁移到 @storybook/sveltekit
   # 3. 删除过时的包
   # 4. 更新配置
   ```

   **配置变更**：
   ```javascript
   // 旧版 (.storybook/main.js)
   module.exports = {
     framework: '@storybook/svelte',
     svelteOptions: { ... } // 删除此项
   };

   // 新版 (.storybook/main.js)
   export default {
     framework: {
       name: '@storybook/sveltekit',
       options: {}
     }
   };
   ```

2. **Svelte CSF 迁移（v4 到 v5）**：

   **Meta 组件 → defineMeta**：
   ```svelte
   <!-- 旧版 -->
   <script context="module">
     import { Meta, Story } from '@storybook/addon-svelte-csf';
   </script>

   <Meta title="Button" component={Button} />

   <!-- 新版 -->
   <script>
     import { defineMeta } from '@storybook/addon-svelte-csf';
     import Button from './Button.svelte';

     const { Story } = defineMeta({
       title: 'Button',
       component: Button
     });
   </script>
   ```

   **Template → Children/Snippets**：
   ```svelte
   <!-- 旧版 -->
   <Story name="Default">
     <Template let:args>
       <Button {...args} />
     </Template>
   </Story>

   <!-- 新版 -->
   <Story name="Default" args={{ label: 'Click' }}>
     {#snippet template(args)}
       <Button {...args} />
     {/snippet}
   </Story>
   ```

3. **包迁移**：

   **删除过时的包**：
   ```bash
   npm uninstall @storybook/svelte-vite
   npm uninstall storybook-builder-vite
   npm uninstall @storybook/builder-vite
   npm uninstall @storybook/svelte
   ```

   **安装新包**：
   ```bash
   npm install -D @storybook/sveltekit
   npm install -D @storybook/addon-svelte-csf@latest
   ```

4. **故事格式迁移**：

   **CSF 2 到 CSF 3**：
   ```javascript
   // 旧版 (CSF 2)
   export default {
     title: 'Button',
     component: Button
   };

   export const Primary = (args) => ({
     Component: Button,
     props: args
   });
   Primary.args = { variant: 'primary' };

   // 新版 (CSF 3)
   export default {
     title: 'Button',
     component: Button
   };

   export const Primary = {
     args: { variant: 'primary' }
   };
   ```

5. **插件更新**：

   **Actions → Tags**：
   ```javascript
   // 旧版
   export default {
     component: Button,
     parameters: {
       docs: { autodocs: true }
     }
   };

   // 新版
   export default {
     component: Button,
     tags: ['autodocs']
   };
   ```

6. **模块模拟更新**：

   **新参数结构**：
   ```javascript
   // 旧方法（自定义模拟）
   import { page } from './__mocks__/stores';

   // 新方法（参数）
   export const Default = {
     parameters: {
       sveltekit_experimental: {
         stores: { page: { ... } }
       }
     }
   };
   ```

7. **迁移脚本**：
   ```javascript
   // migration-helper.js
   import { readdir, readFile, writeFile } from 'fs/promises';
   import { parse, walk } from 'svelte/compiler';

   async function migrateStories() {
     // 查找所有 .stories.svelte 文件
     // 解析和转换 AST
     // 更新语法到 v5
     // 写入更新的文件
   }
   ```

8. **迁移后测试**：
   - 运行 `npm run storybook`
   - 检查所有故事是否渲染
   - 验证交互是否正常工作
   - 测试插件功能
   - 验证构建流程

## 迁移检查清单

1. [ ] 备份当前配置
2. [ ] 更新 Storybook 到 v7+
3. [ ] 迁移到 @storybook/sveltekit
4. [ ] 更新 Svelte CSF 插件
5. [ ] 转换故事语法
6. [ ] 更新模块模拟
7. [ ] 测试所有故事
8. [ ] 更新 CI/CD 配置

## 使用示例

用户："将我的 Storybook 从 v6 with Svelte 迁移到 v7 with SvelteKit"

助手将：
- 分析当前配置
- 创建迁移计划
- 运行升级命令
- 更新框架配置
- 转换故事格式
- 迁移 CSF 语法
- 更新模块模拟
- 测试和验证
- 记录重大变更
