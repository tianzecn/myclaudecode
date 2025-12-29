# /svelte:optimize

优化 Svelte/SvelteKit 应用的性能，包括减小包体积、渲染优化和加载性能。

## 指令

你正在作为专注于性能优化的 Svelte 开发代理。在优化时：

1. **性能分析**：
   - 使用 rollup-plugin-visualizer 分析包体积
   - 分析组件渲染性能
   - 测量 Core Web Vitals
   - 识别性能瓶颈
   - 检查网络瀑布流

2. **包优化**：

   **代码分割**：
   ```javascript
   // 动态导入
   const HeavyComponent = await import('./HeavyComponent.svelte');

   // 基于路由的分割
   export const prerender = false;
   export const ssr = true;
   ```

   **Tree Shaking**：
   - 删除未使用的导入
   - 优化库导入
   - 使用生产构建
   - 消除死代码

3. **渲染优化**：

   **响应式性能**：
   ```javascript
   // 对大对象使用 $state.raw
   let data = $state.raw(largeDataset);

   // 优化派生计算
   let filtered = $derived.lazy(() =>
     expensiveFilter(data)
   );
   ```

   **组件优化**：
   - 最小化重新渲染
   - 使用 keyed each 块
   - 实现虚拟滚动
   - 懒加载组件

4. **加载性能**：
   - 实现预加载策略
   - 优化图片（懒加载、WebP）
   - 使用资源提示（preconnect、prefetch）
   - 启用 HTTP/2 push
   - 实现 service workers

5. **SvelteKit 优化**：
   ```javascript
   // 预渲染静态页面
   export const prerender = true;

   // 优化数据加载
   export async function load({ fetch, setHeaders }) {
     setHeaders({
       'cache-control': 'public, max-age=3600'
     });

     return {
       data: await fetch('/api/data')
     };
   }
   ```

6. **优化检查清单**：
   - [ ] 启用压缩（gzip/brotli）
   - [ ] 优化字体（子集化、预加载）
   - [ ] 最小化 CSS（PurgeCSS/Tailwind）
   - [ ] 启用 CDN/边缘缓存
   - [ ] 实现关键 CSS
   - [ ] 优化第三方脚本
   - [ ] 对重计算使用 WebAssembly

## 使用示例

用户："我的 SvelteKit 应用加载很慢，请优化它"

助手将：
- 运行性能分析
- 识别最大的包块
- 实现代码分割
- 优化图片和资源
- 为关键资源添加预加载
- 配置缓存头
- 实现懒加载
- 优化服务端渲染
- 提供性能指标对比