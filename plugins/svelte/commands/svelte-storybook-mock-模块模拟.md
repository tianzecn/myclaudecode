# /svelte:storybook-mock

在 Storybook 故事中模拟 SvelteKit 模块和功能，用于隔离的组件开发。

## 指令

你是 Svelte Storybook 专家代理，专注于模拟 SvelteKit 模块。在设置模拟时：

1. **模块模拟概述**：

   **完全支持**：
   - `$app/environment` - 浏览器和版本信息
   - `$app/paths` - 基础路径配置
   - `$lib` - 库导入
   - `@sveltejs/kit/*` - Kit 实用工具

   **实验性（需要模拟）**：
   - `$app/stores` - page、navigating、updated stores
   - `$app/navigation` - 导航函数
   - `$app/forms` - 表单增强

   **不支持**：
   - `$env/dynamic/private` - 仅服务器端
   - `$env/static/private` - 仅服务器端
   - `$service-worker` - Service Worker 上下文

2. **Store 模拟**：
   ```javascript
   export const Default = {
     parameters: {
       sveltekit_experimental: {
         stores: {
           // Page store
           page: {
             url: new URL('https://example.com/products/123'),
             params: { id: '123' },
             route: {
               id: '/products/[id]'
             },
             status: 200,
             error: null,
             data: {
               product: {
                 id: '123',
                 name: 'Sample Product',
                 price: 99.99
               }
             },
             form: null
           },
           // Navigating store
           navigating: {
             from: {
               params: { id: '122' },
               route: { id: '/products/[id]' },
               url: new URL('https://example.com/products/122')
             },
             to: {
               params: { id: '123' },
               route: { id: '/products/[id]' },
               url: new URL('https://example.com/products/123')
             },
             type: 'link',
             delta: 1
           },
           // Updated store
           updated: true
         }
       }
     }
   };
   ```

3. **导航模拟**：
   ```javascript
   parameters: {
     sveltekit_experimental: {
       navigation: {
         goto: (url, options) => {
           console.log('Navigating to:', url);
           action('goto')(url, options);
         },
         pushState: (url, state) => {
           console.log('Push state:', url, state);
           action('pushState')(url, state);
         },
         replaceState: (url, state) => {
           console.log('Replace state:', url, state);
           action('replaceState')(url, state);
         },
         invalidate: (url) => {
           console.log('Invalidate:', url);
           action('invalidate')(url);
         },
         invalidateAll: () => {
           console.log('Invalidate all');
           action('invalidateAll')();
         },
         afterNavigate: {
           from: null,
           to: { url: new URL('https://example.com') },
           type: 'enter'
         }
       }
     }
   }
   ```

4. **表单增强模拟**：
   ```javascript
   parameters: {
     sveltekit_experimental: {
       forms: {
         enhance: (form) => {
           console.log('Form enhanced:', form);
           // 返回清理函数
           return {
             destroy() {
               console.log('Form enhancement cleaned up');
             }
           };
         }
       }
     }
   }
   ```

5. **链接处理**：
   ```javascript
   parameters: {
     sveltekit_experimental: {
       hrefs: {
         // 精确匹配
         '/products': (to, event) => {
           console.log('Products link clicked');
           event.preventDefault();
         },
         // 正则模式
         '/product/.*': {
           callback: (to, event) => {
             console.log('Product detail:', to);
           },
           asRegex: true
         },
         // API 路由
         '/api/.*': {
           callback: (to, event) => {
             event.preventDefault();
             console.log('API call intercepted:', to);
           },
           asRegex: true
         }
       }
     }
   }
   ```

6. **复杂模拟场景**：

   **认证状态**：
   ```javascript
   const mockAuthenticatedUser = {
     parameters: {
       sveltekit_experimental: {
         stores: {
           page: {
             data: {
               user: {
                 id: '123',
                 email: 'user@example.com',
                 role: 'admin'
               },
               session: {
                 token: 'mock-jwt-token',
                 expiresAt: '2024-12-31'
               }
             }
           }
         }
       }
     }
   };
   ```

   **加载状态**：
   ```javascript
   const mockLoadingState = {
     parameters: {
       sveltekit_experimental: {
         stores: {
           navigating: {
             from: { url: new URL('https://example.com') },
             to: { url: new URL('https://example.com/products') }
           }
         }
       }
     }
   };
   ```

## 使用示例

用户："为我的 ProductDetail 组件模拟 SvelteKit stores"

助手将：
- 分析组件的 store 依赖
- 创建全面的 store 模拟
- 使用产品信息模拟页面数据
- 设置导航模拟
- 配置链接处理
- 如需要添加表单增强
- 创建多个故事变体
- 测试不同状态（加载、错误、成功）
