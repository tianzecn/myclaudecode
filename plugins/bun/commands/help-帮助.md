---
description: 显示 Bun Backend 插件的完整帮助信息 - 列出代理、命令、技能和使用示例
allowed-tools: Read
---

# Bun Backend 插件帮助

向用户展示以下帮助信息：

---

## Bun Backend 插件 v1.5.2

**使用 Bun 运行时进行生产级 TypeScript 后端开发。**

### 快速开始

```bash
/setup-project my-api
/implement-api Add user CRUD endpoints with authentication
/apidog sync
```

---

## 代理 (3)

| 代理 | 描述 | 模型 |
|------|------|------|
| **backend-developer** | 使用 Bun、Hono、Prisma 实现 TypeScript 后端功能 | Sonnet |
| **api-architect** | 设计后端 API 架构、数据库 schema、系统设计 | Opus |
| **apidog** | 将 API 规范同步到 Apidog 文档 | Sonnet |

---

## 命令 (4)

| 命令 | 描述 |
|------|------|
| **/implement-api** | 通过多代理编排实现完整的 API 开发周期 |
| **/setup-project** | 初始化新的 Bun + TypeScript 后端项目 |
| **/apidog** | 将 API 规范同步到 Apidog |
| **/help** | 显示此帮助信息 |

### 示例

```bash
/setup-project my-service
/implement-api Create REST endpoints for product catalog with search
/apidog sync --project-id abc123
```

---

## 技能 (1)

| 技能 | 描述 |
|------|------|
| **best-practices** | TypeScript 后端最佳实践大全（2025） |

### 最佳实践包含

- **camelCase 命名** 用于 API 和数据库
- **清洁架构**（routes → controllers → services → repositories）
- **安全性** - OWASP 合规、输入验证、认证模式
- **Prisma ORM** 模式和迁移
- **测试** 使用 Vitest 的测试策略
- **Docker** 容器化
- **AWS ECS** 部署指南

---

## 技术栈

| 技术 | 用途 |
|------|------|
| **Bun** | 运行时（快速、原生支持 TypeScript） |
| **Hono** | Web 框架（轻量、快速） |
| **Prisma** | ORM（类型安全的数据库访问） |
| **Biome** | 代码检查器/格式化器 |
| **Vitest** | 测试框架 |
| **Docker** | 容器化 |

---

## MCP 服务器

| 服务器 | 用途 |
|--------|------|
| **Apidog** | API 文档同步 |

### Apidog 设置

```bash
export APIDOG_PROJECT_ID="your-project-id"
export APIDOG_API_TOKEN="your-token"
```

---

## 架构模式

```
src/
├── routes/          # HTTP 路由定义
├── controllers/     # 请求处理
├── services/        # 业务逻辑
├── repositories/    # 数据访问
├── middleware/      # 认证、验证、日志
├── types/           # TypeScript 类型
└── utils/           # 工具函数
```

---

## 安装

```bash
# 添加市场（一次性操作）
/plugin marketplace add tianzecn/myclaudecode

# 安装插件
/plugin install bun@tianzecn-plugins
```

**可选**：配置 Apidog 集成以实现 API 文档同步。

---

## 更多信息

- **仓库**：https://github.com/tianzecn/myclaudecode
- **作者**：tianzecn @ tianzecn
