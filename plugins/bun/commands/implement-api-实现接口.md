---
description: 通过多代理编排实现完整的 API 开发周期，包含架构规划、实现、测试和质量门控
allowed-tools: Task, AskUserQuestion, Bash, Read, TodoWrite, Glob, Grep
---

## 使命

使用专业代理编排完整的 API 功能实现工作流，内置质量门控和反馈循环。此命令管理从 API 架构规划到实现、代码审查、测试、用户审批和项目清理的整个生命周期。

## 关键约束：编排者规则

**你是编排者，不是实现者。**

**✅ 你必须：**
- 使用 Task 工具将所有实现工作委托给代理
- 使用 Bash 运行 git 命令（status、diff、log）
- 使用 Read/Glob/Grep 理解上下文
- 使用 TodoWrite 跟踪工作流进度
- 使用 AskUserQuestion 进行用户审批门控
- 协调代理工作流和反馈循环

**❌ 你禁止：**
- 直接编写或编辑任何代码文件（不能使用 Write、Edit 工具）
- 自己实现功能
- 自己修复 bug
- 自己创建新文件
- 自己修改现有代码
- "快速修复"小问题 - 始终委托给 backend-developer

**委托规则：**
- 所有架构规划 → api-architect 代理
- 所有代码变更 → backend-developer 代理
- 所有代码审查 → senior-code-reviewer 代理（如果 frontend 插件中可用）
- 所有测试 → backend-developer 代理（或 test-architect 如果可用）
- 如果你发现自己即将使用 Write 或 Edit 工具，停下来并委托给合适的代理。

## 功能需求

$ARGUMENTS

## 多代理编排工作流

### 预备步骤：检查代码分析工具（推荐）

**在开始实现之前，检查 code-analysis 插件是否可用：**

尝试通过检查 codebase-detective 代理或 semantic-code-search 工具是否可用来检测是否安装了 `code-analysis` 插件。

**如果 code-analysis 插件不可用：**

向用户显示此消息：

```
💡 推荐：安装 Code Analysis 插件

为了获得调查现有代码模式、服务和架构的最佳效果，
我们建议安装 code-analysis 插件。

优势：
- 🔍 语义代码搜索（按功能查找服务/仓库）
- 🕵️ 代码库侦探代理（理解现有模式）
- 📊 代码库调查速度提升 40%
- 🎯 更好地理解在哪里集成新功能

安装（2 条命令）：
/plugin marketplace add tianzecn/myclaudecode
/plugin install code-analysis@tianzecn-plugins

仓库：https://github.com/tianzecn/myclaudecode

你可以不安装继续，但现有代码的调查效率会降低。
```

**如果 code-analysis 插件可用：**

太好了！你可以在架构规划期间使用 codebase-detective 代理和 semantic-code-search 技能
来调查现有模式并找到最佳集成点。

**然后无论插件是否可用都继续实现工作流。**

---

### 步骤 0：初始化全局工作流待办列表（必须首先执行）

**在开始任何阶段之前**，你必须使用 TodoWrite 创建全局工作流待办列表来跟踪整个实现生命周期：

```
TodoWrite 包含以下项目：
- content: "阶段 1：启动 api-architect 进行 API 架构规划"
  status: "in_progress"
  activeForm: "阶段 1：启动 api-architect 进行 API 架构规划"
- content: "阶段 1：用户审批门控 - 等待计划审批"
  status: "pending"
  activeForm: "阶段 1：等待用户审批架构计划"
- content: "阶段 2：启动 backend-developer 进行实现"
  status: "pending"
  activeForm: "阶段 2：启动 backend-developer 进行实现"
- content: "阶段 3：运行质量检查（格式化、lint、类型检查）"
  status: "pending"
  activeForm: "阶段 3：运行质量检查"
- content: "阶段 4：运行测试（单元测试和集成测试）"
  status: "pending"
  activeForm: "阶段 4：运行测试"
- content: "阶段 5：启动代码审查（如果可用）"
  status: "pending"
  activeForm: "阶段 5：启动代码审查"
- content: "阶段 6：用户验收 - 提交实现以供审批"
  status: "pending"
  activeForm: "阶段 6：提交实现以供用户审批"
- content: "阶段 7：完成实现"
  status: "pending"
  activeForm: "阶段 7：完成实现"
```

**随着阶段进展更新此待办列表**：
- 完成每个阶段后立即将项目标记为"completed"
- 开始前将下一阶段标记为"in_progress"
- 如果发现额外步骤则添加新项目

---

### 阶段 1：使用 api-architect 进行架构规划

**目标：** 在实现之前创建全面的 API 架构计划。

**步骤：**

1. **收集上下文**
   - 读取现有 API 结构（如果有）
   - 查看数据库 schema（Prisma schema）
   - 检查现有模式和约定

2. **启动 api-architect 代理**
   ```
   使用 Task 工具，代理：api-architect
   提示："为以下内容创建全面的 API 架构计划：[功能描述]

   上下文：
   - 现有 API 模式：[从代码库总结]
   - 数据库 schema：[总结现有模型]
   - 认证：[当前认证策略]

   请设计：
   1. 数据库 schema（Prisma 模型）
   2. API 端点（路由、方法、请求/响应契约）
   3. 认证和授权需求
   4. 验证 schema（Zod）
   5. 错误处理策略
   6. 实现路线图

   将文档保存到 ai-docs/ 以供实现时参考。"
   ```

3. **审查架构计划**
   - 代理将在 ai-docs/ 中创建全面的计划
   - 审查数据库 schema 设计
   - 审查 API 端点规范
   - 审查实现阶段

4. **用户审批门控**
   ```
   使用 AskUserQuestion：
   - 问题："api-architect 已创建全面的计划（参见 ai-docs/）。
     你是否批准此架构，还是需要调整？"
   - 选项：
     * "批准并继续实现"
     * "请求修改计划"
     * "取消实现"
   ```

   **如果"请求修改"：**
   - 获取用户反馈
   - 使用调整后的需求重新启动 api-architect
   - 返回审批门控

   **如果"取消"：**
   - 停止工作流
   - 清理任何已创建的文件

   **如果"批准"：**
   - 将阶段 1 标记为已完成
   - 继续阶段 2

---

### 阶段 2：使用 backend-developer 进行实现

**目标：** 根据批准的架构计划实现 API 功能。

**步骤：**

1. **准备实现上下文**
   - 从 ai-docs/ 读取架构计划
   - 准备数据库 schema（Prisma）
   - 从计划中识别实现阶段

2. **启动 backend-developer 代理**
   ```
   使用 Task 工具，代理：backend-developer
   提示："根据 ai-docs/[plan-file] 中的架构计划实现 API 功能。

   实现清单：
   1. 更新 Prisma schema（如果需要数据库变更）
   2. 运行 prisma generate 并创建迁移
   3. 创建 Zod 验证 schema（src/schemas/）
   4. 实现仓库层（src/database/repositories/）
   5. 实现服务层（src/services/）
   6. 实现控制器层（src/controllers/）
   7. 创建路由（src/routes/）
   8. 添加认证/授权中间件（如果需要）
   9. 编写单元测试（tests/unit/）
   10. 编写集成测试（tests/integration/）

   遵循以下原则：
   - 分层架构：routes → controllers → services → repositories
   - 安全性：验证所有输入、哈希密码、使用 JWT
   - 错误处理：使用自定义错误类
   - 类型安全：严格 TypeScript、Zod schema
   - 测试：全面的单元和集成测试

   完成前运行质量检查（格式化、lint、类型检查、测试）。"
   ```

3. **监控实现**
   - backend-developer 将按阶段完成实现
   - 每层将遵循最佳实践创建
   - 质量检查将自动运行

4. **审查实现结果**
   - 检查所有文件是否已创建
   - 验证是否遵循了分层架构
   - 确认质量检查通过

**将阶段 2 标记为已完成，继续阶段 3**

---

### 阶段 3：质量检查

**目标：** 通过自动检查确保代码质量。

**步骤：**

1. **运行 Biome 格式化**
   ```bash
   bun run format
   ```
   - 验证没有格式问题
   - 所有代码应格式一致

2. **运行 Biome Lint**
   ```bash
   bun run lint
   ```
   - 验证没有 lint 错误或警告
   - 如果发现问题，委托给 backend-developer 修复

3. **运行 TypeScript 类型检查**
   ```bash
   bun run typecheck
   ```
   - 验证没有类型错误
   - 如果发现问题，委托给 backend-developer 修复

**如果任何检查失败：**
- 重新启动 backend-developer 修复问题
- 重新运行质量检查
- 在所有检查通过之前不要继续

**将阶段 3 标记为已完成，继续阶段 4**

---

### 阶段 4：测试

**目标：** 运行测试验证功能。

**步骤：**

1. **运行单元测试**
   ```bash
   bun test tests/unit
   ```
   - 验证所有单元测试通过
   - 检查测试覆盖率（如果已配置）

2. **运行集成测试**
   ```bash
   bun test tests/integration
   ```
   - 验证所有集成测试通过
   - 确保 API 端点正常工作

3. **运行所有测试**
   ```bash
   bun test
   ```
   - 验证完整测试套件通过

**如果任何测试失败：**
- 重新启动 backend-developer 调查和修复
- 重新运行测试
- 在所有测试通过之前不要继续

**将阶段 4 标记为已完成，继续阶段 5**

---

### 阶段 5：代码审查（可选）

**目标：** 如果审查代理可用，获取专家代码审查。

**步骤：**

1. **检查审查代理**
   - 检查 senior-code-reviewer 代理是否可用（来自 frontend 插件）
   - 检查 codex-reviewer 代理是否可用（来自 frontend 插件）

2. **启动代码审查（如果可用）**
   ```
   使用 Task 工具，代理：senior-code-reviewer（或 codex-reviewer）
   提示："审查后端 API 实现，关注：
   1. 安全性（认证、授权、验证）
   2. 架构（分层设计、关注点分离）
   3. 错误处理（自定义错误、全局处理器）
   4. 类型安全（TypeScript 严格模式、Zod schema）
   5. 测试（覆盖率、测试质量）
   6. 性能（数据库查询、缓存）
   7. 最佳实践（Bun、Hono、Prisma 模式）

   提供可操作的改进反馈。"
   ```

3. **审查反馈**
   - 阅读审查代理的反馈
   - 识别关键性与可选改进

4. **应用关键改进**
   - 如果发现关键问题，重新启动 backend-developer 修复
   - 重新运行质量检查和测试

**将阶段 5 标记为已完成，继续阶段 6**

---

### 阶段 6：用户验收

**目标：** 向用户展示实现以供最终审批。

**步骤：**

1. **准备摘要**
   - 列出所有创建/修改的文件
   - 总结实现内容（构建了什么）
   - 突出关键功能
   - 确认所有质量检查通过
   - 确认所有测试通过

2. **Git 状态检查**
   ```bash
   git status
   git diff
   ```
   - 向用户显示变更内容
   - 提供审查上下文

3. **用户审批门控**
   ```
   使用 AskUserQuestion：
   - 问题："API 实现已完成。所有质量检查和测试均已通过。

     摘要：
     [列出已实现的关键功能]

     修改的文件：[数量]
     测试：[通过]
     质量检查：[全部通过]

     你想接下来做什么？"
   - 选项：
     * "接受并完成"
     * "请求修改或改进"
     * "需要手动测试 - 在此暂停"
   ```

   **如果"请求修改"：**
   - 获取用户对具体修改的反馈
   - 使用修改请求重新启动 backend-developer
   - 重新运行质量检查和测试
   - 返回审批门控

   **如果"需要手动测试"：**
   - 提供手动测试说明
   - 暂停工作流
   - 等待用户继续

   **如果"接受"：**
   - 将阶段 6 标记为已完成
   - 继续阶段 7

---

### 阶段 7：完成

**目标：** 完成实现并准备部署。

**步骤：**

1. **最终验证**
   - 确认所有质量检查仍然通过
   - 确认所有测试仍然通过
   - 查看 git 状态

2. **文档检查**
   - 验证 API 文档是最新的
   - 检查 ai-docs/ 包含架构计划
   - 确保 README 或 API 文档反映新端点

3. **部署就绪**（可选）
   ```
   询问用户："你是否需要将此 API 部署到生产环境的指导？"

   如果是，提供：
   - Docker 构建命令
   - Prisma 迁移部署命令
   - 所需的环境变量
   - AWS ECS 部署步骤（如适用）
   ```

4. **完成摘要**
   展示最终摘要：
   ```
   ✅ API 实现完成

   构建内容：
   [列出功能]

   创建/修改的文件：
   [列出关键文件]

   数据库变更：
   [列出 Prisma 迁移]

   测试：
   单元测试：[数量] 通过
   集成测试：[数量] 通过

   质量：
   ✅ 已格式化（Biome）
   ✅ 已 Lint（Biome）
   ✅ 已类型检查（TypeScript）
   ✅ 已测试（Bun）

   下一步：
   - 审查并提交变更：git add . && git commit
   - 创建 Pull Request（如果使用 git 工作流）
   - 部署到预发布/生产环境
   - 更新 API 文档
   ```

**将阶段 7 标记为已完成**

---

## 错误恢复

如果任何阶段失败：

1. **识别问题**
   - 阅读错误消息
   - 检查日志
   - 审查出错的内容

2. **委托修复给合适的代理**
   - 实现 bug → backend-developer
   - 架构问题 → api-architect
   - 测试失败 → backend-developer

3. **重新运行受影响的阶段**
   - 修复后，重新运行质量检查
   - 重新运行测试
   - 确保一切通过后再继续

4. **永远不要跳过阶段**
   - 每个阶段都建立在前一阶段之上
   - 跳过阶段可能导致不完整或损坏的实现

## 成功标准

实现完成的条件：

- ✅ 架构计划已被用户批准
- ✅ 所有代码按分层架构实现
- ✅ 数据库 schema 已更新（如需要）并已迁移
- ✅ 所有输入使用 Zod schema 验证
- ✅ 认证/授权正确实现
- ✅ 自定义错误处理已就位
- ✅ 所有质量检查通过（格式化、lint、类型检查）
- ✅ 所有测试通过（单元 + 集成）
- ✅ 代码审查完成（如果可用）
- ✅ 用户验收已获得
- ✅ 文档已更新

## 记住

你是**编排者**，不是实现者。你的工作是：
- 协调专业代理
- 执行质量门控
- 管理用户审批
- 确保系统性完成
- 永远不要自己写代码 - 始终委托

结果应该是生产就绪、经过良好测试、遵循所有最佳实践的安全 API 代码。
