---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [api-type] | --openapi | --graphql | --rest | --grpc | --interactive
description: 从代码生成全面的 API 文档，包含交互式示例和测试功能
---

# API 文档生成器

从代码生成 API 文档：$ARGUMENTS

## 当前 API 上下文

- API 端点：!`find . -name "*route*" -o -name "*controller*" -o -name "*api*" | head -5`
- API 规范：!`find . -name "*openapi*" -o -name "*swagger*" -o -name "*.graphql" | head -3`
- 服务器框架：@package.json 或从导入检测
- 现有文档：@docs/api/ 或 @api-docs/（如果存在）
- 测试文件：!`find . -name "*test*" -path "*/api/*" | head -3`

## 任务

生成具有交互式功能的全面 API 文档：$ARGUMENTS

1. **代码分析与发现**
   - 扫描代码库中的 API 端点、路由和处理器
   - 识别 REST API、GraphQL schema 和 RPC 服务
   - 映射控制器类、路由定义和中间件
   - 发现请求/响应模型和数据结构

2. **文档工具选择**
   - 根据技术栈选择适当的文档工具：
     - **OpenAPI/Swagger**：带交互式文档的 REST API
     - **GraphQL**：GraphiQL、GraphQL Playground 或 Apollo Studio
     - **Postman**：API 集合和文档
     - **Insomnia**：API 设计和文档
     - **Redoc**：替代的 OpenAPI 渲染器
     - **API Blueprint**：基于 Markdown 的 API 文档

3. **API 规范生成**

   **对于使用 OpenAPI 的 REST API：**
   ```yaml
   openapi: 3.0.0
   info:
     title: $ARGUMENTS API
     version: 1.0.0
     description: $ARGUMENTS 的全面 API
   servers:
     - url: https://api.example.com/v1
   paths:
     /users:
       get:
         summary: 列出用户
         parameters:
           - name: page
             in: query
             schema:
               type: integer
         responses:
           '200':
             description: 成功响应
             content:
               application/json:
                 schema:
                   type: array
                   items:
                     $ref: '#/components/schemas/User'
   components:
     schemas:
       User:
         type: object
         properties:
           id:
             type: integer
           name:
             type: string
           email:
             type: string
   ```

4. **端点文档**
   - 记录所有 HTTP 方法（GET、POST、PUT、DELETE、PATCH）
   - 指定请求参数（路径、查询、头部、主体）
   - 定义响应 schema 和状态码
   - 包含错误响应和错误代码
   - 记录身份验证和授权要求

5. **请求/响应示例**
   - 为每个端点提供真实的请求示例
   - 包含格式正确的示例响应数据
   - 显示不同的响应场景（成功、错误、边缘情况）
   - 记录内容类型和编码

6. **身份验证文档**
   - 记录身份验证方法（API 密钥、JWT、OAuth）
   - 解释授权范围和权限
   - 提供身份验证示例和令牌格式
   - 记录会话管理和刷新令牌流程

7. **数据模型文档**
   - 定义所有数据 schema 和模型
   - 记录字段类型、约束和验证规则
   - 包含实体之间的关系
   - 提供示例数据结构

8. **错误处理文档**
   - 记录所有可能的错误响应
   - 解释错误代码及其含义
   - 提供故障排除指导
   - 包含速率限制和节流信息

9. **交互式文档设置**

   **Swagger UI 集成：**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>API 文档</title>
     <link rel="stylesheet" type="text/css" href="./swagger-ui-bundle.css" />
   </head>
   <body>
     <div id="swagger-ui"></div>
     <script src="./swagger-ui-bundle.js"></script>
     <script>
       SwaggerUIBundle({
         url: './api-spec.yaml',
         dom_id: '#swagger-ui'
       });
     </script>
   </body>
   </html>
   ```

10. **代码注释和注解**
    - 为 API 处理器添加内联文档
    - 使用框架特定的注解工具：
      - **Java**：@ApiOperation、@ApiParam（Swagger 注解）
      - **Python**：使用 FastAPI 或 Flask-RESTX 的文档字符串
      - **Node.js**：使用 swagger-jsdoc 的 JSDoc 注释
      - **C#**：XML 文档注释

11. **自动化文档生成**

    **对于 Node.js/Express：**
    ```javascript
    const swaggerJsdoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'API 文档',
          version: '1.0.0',
        },
      },
      apis: ['./routes/*.js'],
    };

    const specs = swaggerJsdoc(options);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    ```

12. **测试集成**
    - 从文档生成 API 测试集合
    - 包含测试脚本和验证规则
    - 设置自动化 API 测试
    - 记录测试场景和预期结果

13. **版本管理**
    - 记录 API 版本控制策略
    - 维护多个 API 版本的文档
    - 记录弃用时间表和迁移指南
    - 跟踪版本之间的破坏性变更

14. **性能文档**
    - 记录速率限制和节流策略
    - 包含性能基准和 SLA
    - 记录缓存策略和头部
    - 解释分页和过滤选项

15. **SDK 和客户端库文档**
    - 从 API 规范生成客户端库
    - 记录 SDK 使用和示例
    - 提供不同语言的快速入门指南
    - 包含集成示例和最佳实践

16. **环境特定文档**
    - 记录不同环境（开发、测试、生产）
    - 包含环境特定的端点和配置
    - 记录部署和配置要求
    - 提供环境设置说明

17. **安全文档**
    - 记录安全最佳实践
    - 包含 CORS 和 CSP 策略
    - 记录输入验证和清理
    - 解释安全头部及其用途

18. **维护和更新**
    - 设置自动化文档更新
    - 创建保持文档最新的流程
    - 定期审查和验证文档
    - 将文档审查集成到开发工作流

**框架特定示例：**

**FastAPI（Python）：**
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="我的 API", version="1.0.0")

class User(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    """根据 ID 获取用户。"""
    return {"id": user_id, "name": "张三", "email": "zhangsan@example.com"}
```

**Spring Boot（Java）：**
```java
@RestController
@Api(tags = "用户")
public class UserController {

    @GetMapping("/users/{id}")
    @ApiOperation(value = "根据 ID 获取用户")
    public ResponseEntity<User> getUser(
        @PathVariable @ApiParam("用户 ID") Long id) {
        // 实现
    }
}
```

记住要保持文档与代码变更同步，并使其对内部团队和外部使用者都易于访问。
