---
allowed-tools: Read, WebFetch, WebSearch, Bash
argument-hint: [api-url 或 openapi-文件路径] [--interactive]
description: 从 OpenAPI/Swagger 规范、API URL 或代码库自动生成 API 文档
---

## API 文档生成器

**目标**: $ARGUMENTS

## 项目分析

### 检测 API 类型
- OpenAPI/Swagger 规范: @openapi.json, @openapi.yaml, @swagger.json
- API 路由: @pages/api/ 或 @app/api/
- Apidog 项目配置: @apidog.json (如果存在)
- 包配置: @package.json
- TypeScript 配置: @tsconfig.json (如果存在)

### 现有文档
- README: @README.md (如果存在)
- API 文档: @docs/api/ (如果存在)
- 类型定义: @types/ (如果存在)

## 文档生成策略

### 策略 1: 从 OpenAPI/Swagger 规范生成

如果提供了规范文件或 URL:

#### 1a. 本地规范文件
读取并解析规范文件:
- OpenAPI 3.x: JSON 或 YAML 格式
- Swagger 2.0: JSON 或 YAML 格式

#### 1b. 远程规范 URL
使用 WebFetch 获取规范:
```typescript
const spec = await fetch('https://api.example.com/openapi.json');
```

#### 1c. 规范解析和验证
```typescript
interface OpenAPISpec {
  openapi: string; // "3.0.0", "3.1.0" 等
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers: Array<{
    url: string;
    description?: string;
  }>;
  paths: {
    [path: string]: PathItem;
  };
  components?: {
    schemas?: { [name: string]: Schema };
    responses?: { [name: string]: Response };
    parameters?: { [name: string]: Parameter };
  };
}
```

### 策略 2: 从 Next.js API 路由代码库生成

如果未提供规范,从代码库分析 API:

#### 2a. 发现 API 路由
扫描以下位置:
- **Pages Router**: `pages/api/**/*.{ts,js}`
- **App Router**: `app/api/**/route.{ts,js}`

#### 2b. 提取 API 信息
对每个 API 路由:
1. **路径和方法**: 从文件路径和导出函数确定
2. **请求/响应类型**: 从 TypeScript 类型提取
3. **注释**: 解析 JSDoc 注释获取描述
4. **验证**: 检查验证模式(Zod、Yup 等)

#### 2c. 示例代码分析
```typescript
// pages/api/users/[id].ts

/**
 * 通过 ID 获取用户
 * @param id - 用户 ID
 * @returns 用户对象
 */
export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const { id } = req.query;
  const user = await db.user.findUnique({ where: { id } });
  res.status(200).json(user);
}

/**
 * 更新用户
 * @param id - 用户 ID
 * @param body - 用户更新数据
 */
export async function PUT(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const updated = await db.user.update({
    where: { id },
    data: req.body,
  });
  res.status(200).json(updated);
}
```

从中提取:
- **端点**: `/api/users/[id]`
- **方法**: `GET`, `PUT`
- **参数**: `id` (路径参数)
- **描述**: 从 JSDoc 注释提取

### 策略 3: 从 Apidog 项目生成

如果检测到 `apidog.json`:

#### 3a. 使用 Apidog CLI
```bash
# 安装 Apidog CLI
npm install -g apidog-cli

# 导出 API 文档
apidog export --format openapi --output ./docs/openapi.json

# 生成 Markdown 文档
apidog generate-docs --output ./docs/api/
```

## 文档输出格式

### Markdown 文档结构

生成结构化的 Markdown 文档:

```markdown
# API 文档

## 概述

- **基础 URL**: `https://api.example.com`
- **版本**: 1.0.0
- **认证**: Bearer Token

## 端点

### 用户

#### GET /api/users

获取所有用户

**请求**
无请求体

**响应**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  ]
}
```

**状态码**
- 200: 成功
- 401: 未授权
- 500: 服务器错误

---

#### GET /api/users/:id

通过 ID 获取用户

**路径参数**
- `id` (string, 必需): 用户 ID

**响应**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "string"
}
```

---

#### POST /api/users

创建新用户

**请求体**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**响应**
```json
{
  "id": "string",
  "name": "string",
  "email": "string"
}
```

---

### 产品

#### GET /api/products

获取所有产品...
```

### 交互式 API 文档 (可选)

如果指定 `--interactive`:

1. **安装 Swagger UI**
   ```bash
   npm install swagger-ui-react swagger-ui-dist
   ```

2. **创建 Swagger UI 页面**
   ```typescript
   // pages/api-docs.tsx
   import SwaggerUI from 'swagger-ui-react';
   import 'swagger-ui-react/swagger-ui.css';

   export default function ApiDocs() {
     return <SwaggerUI url="/openapi.json" />;
   }
   ```

3. **提供 OpenAPI 规范**
   ```typescript
   // pages/api/openapi.ts
   export default function handler(req, res) {
     const spec = generateOpenAPISpec();
     res.status(200).json(spec);
   }
   ```

## 高级功能

### 1. 类型安全的 API 客户端

从 OpenAPI 规范生成 TypeScript 客户端:

```bash
# 安装 openapi-typescript
npm install openapi-typescript

# 生成 TypeScript 类型
openapi-typescript ./openapi.json --output ./types/api.ts
```

### 2. API 测试

从文档生成 API 测试:

```typescript
// 从 OpenAPI 规范生成测试
describe('Users API', () => {
  it('GET /api/users 应返回用户列表', async () => {
    const response = await fetch('/api/users');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users).toBeInstanceOf(Array);
  });

  it('POST /api/users 应创建用户', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    expect(response.status).toBe(201);
  });
});
```

### 3. API 版本控制

为 API 文档添加版本控制:

```markdown
# API 文档

## 版本

- **当前**: v2.0.0
- **支持的版本**: v1.x, v2.x
- **废弃的版本**: v0.x (将于 2024-12-31 移除)

## 迁移指南

### 从 v1 到 v2

1. **认证**: 现在需要 Bearer Token 而非 API Key
2. **响应格式**: 所有响应现在包装在 `{ data, meta }` 对象中
3. **分页**: 新的分页参数 `page` 和 `limit`
```

## 文档生成流程

1. **检测 API 来源**
   - 检查 OpenAPI/Swagger 文件
   - 扫描 Next.js API 路由
   - 检查 Apidog 配置

2. **提取 API 信息**
   - 解析规范或代码
   - 提取端点、方法、参数
   - 收集类型定义
   - 解析文档注释

3. **生成文档**
   - 创建 Markdown 文档
   - 生成交互式 UI (如果请求)
   - 导出 OpenAPI 规范
   - 生成 TypeScript 类型

4. **验证和测试**
   - 验证 OpenAPI 规范
   - 检查缺失的文档
   - 生成示例请求
   - 测试 API 端点

5. **输出**
   - 保存到 `docs/api/`
   - 更新 README
   - 生成变更日志
   - 创建迁移指南 (如果有版本变更)

根据检测到的 API 源和提供的参数,提供特定于项目的文档,包含所有端点、类型和示例。
