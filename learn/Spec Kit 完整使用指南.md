# Spec Kit 完整使用指南

## 目录


1. [什么是 Spec Kit](#%E4%BB%80%E4%B9%88%E6%98%AF-spec-kit)
2. [核心理念：规格驱动开发](#%E6%A0%B8%E5%BF%83%E7%90%86%E5%BF%B5%E8%A7%84%E6%A0%BC%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91)
3. [Spec Kit 工作流程](#spec-kit-%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%A8%8B)
4. [快速开始](#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
5. [完整开发流程](#%E5%AE%8C%E6%95%B4%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B)
6. [实战案例](#%E5%AE%9E%E6%88%98%E6%A1%88%E4%BE%8B)
7. [与其他工具对比](#%E4%B8%8E%E5%85%B6%E4%BB%96%E5%B7%A5%E5%85%B7%E5%AF%B9%E6%AF%94)
8. [常见问题](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98)
9. [最佳实践](#%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)


---

## 什么是 Spec Kit

### 定义

**Spec Kit** 是 GitHub 官方开源的一个开发工具包（MIT 许可），基于一个简单而强大的理念：**先写规范，再写代码**。

* **GitHub 仓库**: https://github.com/github/spec-kit
* **Star 数**: 10k+ ⭐
* **发布时间**: 2025年9月
* **开源协议**: MIT

### 核心组件

Spec Kit 不仅仅是方法论，它是一套可落地的工具链：

* **Specify CLI工具** - 命令行工具
* **自动化脚本** - 流程自动化
* **模版文件** - 标准化文档模板

### 支持的 AI 代理

* **GitHub Copilot**
* **Claude Code**
* **Gemini CLI**
* **Cursor**（间接支持）
* **Trae**（社区验证）


---

## 核心理念：规格驱动开发

### 什么是规格驱动开发（Spec-Driven Development）

规格驱动开发的核心，是通过标准化的规格文件将模糊需求转化为：

* ✅ **可执行** - 明确的实施步骤
* ✅ **可跟踪** - 完整的变更记录
* ✅ **可验收** - 清晰的质量标准

### 为什么需要规格驱动

语言模型擅长 **补全模式**，但并不擅长 **读心术**。如果只是靠一两句「vibe coding」式的提示词，很容易得到看似对、实则不完全匹配意图的代码。

**传统开发问题**：

* ❌ 需求模糊，返工频繁
* ❌ 代码质量参差不齐
* ❌ 测试覆盖率不足
* ❌ 团队协作困难

**规格驱动解决方案**：

* ✅ 把"你真正要的是什么（What/Why）"说清楚
* ✅ 给出"怎么做（How）"的约束
* ✅ 拆解成可验证的小任务
* ✅ 由 AI 代理去实现

### 核心价值

Spec Kit 的价值不在于"它能不能一键出代码"，而在于它把团队的"意图"变成有约束、有证据链、可再生的资产。当规格成为"唯一真相"，当测试把"真相"守住，代码就不再是"手工翻译"，而是可再生成的"表达"。


---

## Spec Kit 工作流程

### 四个核心阶段

```
Specify → Plan → Tasks → Implement
```

#### 1. Specify（制定规范）

**目标**: 只谈目标与体验，不谈技术选型

* 描述用户旅程
* 定义边界条件
* 明确验收标准
* 产出：完整的 **spec.md**

**示例命令**:

```bash
/specify 想实现一个类似 Kimi 的 AI 聊天应用，支持流式AI对话，
支持查看历史聊天，用户可以建立新对话，支持通过github登录。
```

#### 2. Plan（技术规划）

**目标**: 给出技术栈与约束，生成技术实施计划

* 声明技术栈
* 定义架构设计
* 确定合规与性能指标
* 产出：**plan.md**、**data-model.md**、**contracts/**、**research.md**

**示例命令**:

```bash
/plan 使用vite+vue3+TDesign作为前端框架，使用node.js作为后端技术栈，
采用一体化部署方案。调用 glm4.6的api参考:https://docs.bigmodel.cn/api-reference/
```

#### 3. Tasks（任务分解）

**目标**: 把规范与计划拆成可执行、可测试的小任务列表

* 分解为具体任务
* 定义依赖关系
* 估算时间
* 标记优先级
* 产出：**tasks.md**

**示例命令**:

```bash
/tasks
```

#### 4. Implement（实施执行）

**目标**: 按任务逐一（或并行）实现，并在每一步进行校验

* 按任务顺序开发
* 执行测试验证
* 持续集成
* 产出：可运行的代码

### 扩展命令

除了核心四阶段，Spec Kit 还提供：

* **/constitution** - 制定项目章程
* **/clarify** - 澄清需求
* **/analyze** - 一致性分析


---

## 快速开始

### 安装

#### 方式 1: 使用 uvx（推荐）

```bash
# 安装并初始化新项目
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>

# 在现有目录初始化
uvx --from git+https://github.com/github/spec-kit.git specify init --here
```

#### 方式 2: 指定 AI 代理

```bash
# Claude Code
specify init <PROJECT_NAME> --ai claude

# Gemini CLI
specify init <PROJECT_NAME> --ai gemini

# GitHub Copilot
specify init <PROJECT_NAME> --ai copilot
```

#### 方式 3: 忽略代理工具检查

如果只想拉取模板，不检查本地是否安装了对应代理工具：

```bash
specify init <PROJECT_NAME> --ignore-agent-tools
```

### 初始化项目

```bash
# 1. 初始化
specify init my-project

# 2. 进入项目目录
cd my-project

# 3. 查看生成的文件结构
ls -la
```

### 生成的目录结构

```
my-project/
├── .cursor/              # Cursor 配置目录
│   ├── commands/
│   │   ├── constitution.md
│   │   ├── specify.md
│   │   ├── clarify.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   ├── analyze.md
│   │   └── implement.md
│   └── rules/
├── specs/               # 规范目录
│   └── 001-feature-name/
│       ├── spec.md
│       ├── plan.md
│       ├── tasks.md
│       ├── data-model.md
│       ├── contracts/
│       │   ├── api-spec.json
│       │   └── signalr-spec.md
│       ├── research.md
│       ├── quickstart.md
│       └── checklists/
│           └── requirements.md
└── README.md
```


---

## 完整开发流程

### 步骤 1: 建立项目章程（Constitution）

**目的**: 制定项目的核心治理原则和开发标准

```bash
/constitution 制定以代码质量、测试标准、用户体验一致性及性能要求为核心的原则
```

**生成文件**: `constitution.md`

**核心章节**:

#### 🎯 核心原则


1. 代码质量至上 - 严格的代码质量标准和审查要求
2. 全面测试标准 - TDD开发模式，90%以上测试覆盖率
3. 用户体验一致性 - 统一的设计系统和交互标准
4. 性能要求标准 - 明确的性能基准和监控要求
5. 工具链标准化 - 统一的接口规范和命令格式

#### ⚙️ 技术标准

* 开发环境要求（Node.js、Git、Markdown等）
* 代码组织原则（模块化、目录结构、模板驱动）
* 安全要求（输入验证、权限管理、安全审计）

#### 🔄 工作流程约定

6步开发流程：


1. 需求分析 ( /clarify )
2. 规格制定 ( /specify )
3. 计划制定 ( /plan )
4. 任务分解 ( /tasks )
5. 质量检查 ( /analyze )
6. 实施执行 ( /implement )

### 步骤 2: 生成需求规格说明书（Specify）

**目的**: 描述要构建什么，专注于功能，而非技术实现

```bash
/specify 想实现一个类似 Kimi 的 AI 聊天应用，支持流式AI对话，
支持查看历史聊天，用户可以建立新对话，支持通过github登录。
```

**生成内容**:

* `spec.md` - 功能规范
* `data-model.md` - 数据模型设计
* `contracts.md` - API接口规范
* `research.md` - 技术调研
* `quickstart.md` - 快速开始指南
* `checklists/requirements.md` - 需求检查清单

**spec.md 包含**:

* 用户故事
* 功能需求
* 验收场景
* 边界条件

### 步骤 3: 澄清需求（Clarify）

**目的**: 识别模糊不清的地方，通过提问来明确需求

```bash
/clarify
```

AI 会提出针对性的澄清问题，例如：

* 用户认证方式的具体实现？
* 对话历史的存储方式？
* 流式对话的实时性要求？
* 多用户并发的处理策略？

### 步骤 4: 技术实现规划（Plan）

**目的**: 指定技术栈和架构设计

```bash
/plan 使用vite+vue3+TDesign作为前端框架，使用node.js作为后端技术栈，
采用一体化部署方案。调用 glm4.6的api
```

**生成/更新内容**:

* 更新 `plan.md`
* 技术栈详细说明
* 架构图
* 存储选择
* 性能目标
* 测试约束

**plan.md 包含**:

* 技术背景
* 架构设计
* 模块划分
* 接口定义
* 部署方案
* 测试策略

### 步骤 5: 自动分解任务（Tasks）

**目的**: 将实现规划分解为详细的可执行任务

```bash
/tasks
```

**生成内容**: `tasks.md`

**任务结构**:

* 86个具体任务，按6个阶段组织：
  * 阶段1：项目初始化 (12个任务)
  * 阶段2：基础设施 (21个任务)
  * 阶段3-6：4个用户故事实现 (43个任务)
  * 阶段7：完善优化 (10个任务)
* 并行执行策略：65%任务可并行开发
* MVP定义：44个任务，约2周开发时间

**任务特点**:

* ✅ 小而可测 - 每个任务能独立验证
* ✅ 明确依赖 - 清晰的前置条件
* ✅ 时间估算 - 合理的工期预估
* ✅ 优先级标注 - MVP vs 增强功能

### 步骤 6: 一致性分析（Analyze）

**目的**: 执行跨文档的一致性和质量分析

```bash
/analyze
```

**检查项目**:

* spec.md、plan.md、tasks.md 之间的一致性
* 需求覆盖完整性
* 技术可行性
* 任务分解合理性

### 步骤 7: 实施执行（Implement）

**目的**: 按照任务列表逐一实现

```bash
/implement
```

**实施策略**:

* **自动化实施** - AI 自动按任务顺序实现
* **手动按任务执行** - 人工选择任务执行
* **MVP优先开发** - 先实现核心功能

**执行过程**:


1. 按任务顺序开发
2. 每个任务完成后自动测试
3. 持续集成验证
4. 更新 tasks.md 状态


---

## 实战案例

### 案例 1: 使用 Trae + Spec Kit 开发 AI 聊天应用

**项目背景**: 开发一个类似 Kimi 的 AI 聊天应用

**技术栈**:

* 前端：Vite + Vue3 + TDesign
* 后端：Node.js
* AI：GLM-4.6

**实施步骤**:

#### 1. 初始化工程

```bash
specify init deeptalk
```

#### 2. 翻译模板文件

```bash
将 #.cursor 目录下的所有md文件的核心内容翻译成中文。
```

#### 3. 制定项目规章

```bash
#constitution.zh.md 制定以代码质量、测试标准、用户体验一致性及
性能要求为核心的原则
```

#### 4. 生成需求规格说明书

```bash
#specify.zh.md 想实现一个类似 Kimi 的 AI 聊天应用，支持流式AI对话，
支持查看历史聊天，用户可以建立新对话，支持通过github登录。
```

#### 5. 技术实现规划

```bash
#plan.zh.md 使用vite+vue3+TDesign作为前端框架，使用node.js作为后端技术栈，
采用一体化部署方案。调用 glm4.6的api参考:https://docs.bigmodel.cn/api-reference/
```

#### 6. 自动分解任务

```bash
#tasks.zh.md
```

#### 7. 实现策略

AI 提供了几个选择：

* 自动化实施
* 手动按任务执行
* MVP优先开发

选择自动化实施后，AI 开始按照任务列表自动实现功能。

**耗时**: 约2小时完成 MVP

**结果**: 成功实现了一个可运行的 AI 聊天应用

### 案例 2: Claude Code 生成「AI 发展史」静态站

**项目背景**: 生成一个展示 AI 发展史的 HTML 页面

**使用工具**: Claude Code + Spec Kit

**实施过程**:


1. **/specify** - 描述目标与用户体验
2. Claude Code 自动拉起模板、提出澄清问题
3. 产出用户故事、功能需求、验收场景
4. **/plan** - 生成技术背景、存储选择、性能目标
5. **/tasks** - 任务分解（强调 TDD/测试先行）

**产出**:

* 契约测试
* CLI 工具
* 多语言支持
* 主题切换
* 完整的项目结构

### 案例 3: Gemini CLI + Spec Kit 的信息整合页

**项目背景**: 检索 Spec Kit 最新消息并生成页面

**使用工具**: Gemini CLI + Spec Kit

**实施步骤**:


1. **/specify** - 让 Gemini 检索最新消息
2. 项目初始化后生成 spec.md、plan.md、research.md 等文档
3. 汉化模板（建议在 /specify 开始前汉化）
4. **/plan** 与 **/tasks** 进入执行

**反思**: 这个需求完全可以让 Gemini 直接整合搜索结果解决，搞爬虫与翻译流水线反而把简单问题复杂化。

**教训**: Spec Kit 适合从 0\~1 的项目，不适合简单的信息整合任务。


---

## 与其他工具对比

### Spec Kit vs Kiro vs BMAD-METHOD

| 特性 | Spec Kit | Kiro | BMAD-METHOD |
|----|----|----|----|
| **定位** | 流程骨架，轻量级 | IDE 一体化体验 | 多角色协作框架 |
| **主要语言** | Python + Shell | TypeScript | JavaScript |
| **适用场景** | 个人/小团队快速落地 | IDE 内第一公民 | 中大团队/企业级 |
| **核心特点** | 4阶段流程清晰 | Spec-Driven + MCP + Hooks | 多代理敏捷工作流 |
| **上手难度** | ⭐⭐ 易 | ⭐⭐⭐ 中 | ⭐⭐⭐⭐ 难 |
| **学习曲线** | 平缓 | 中等 | 陡峭 |
| **团队规模** | 1-5人 | 1-10人 | 5-50人 |
| **开源协议** | MIT | 商业软件 | MIT |
| **GitHub Stars** | 10k+ | N/A | 5k+ |

### 该如何选？

#### 选择 Spec Kit

✅ 个人/小团队、要快速把思路落地
✅ 需要标准化的流程骨架
✅ 直接嵌入现有的 Copilot/Claude/Gemini 命令流
✅ 轻量、易上手，还能长期演化

#### 选择 Kiro

✅ 偏 IDE 一体化体验
✅ 把 Spec-Driven 概念做成 IDE 内的第一公民
✅ 配合 MCP 与 Agent Hooks
✅ 能把大量重复性工作自动化，同时保证变更过程可控可审计

#### 选择 BMAD-METHOD

✅ 中大团队/企业、强调角色分工与治理
✅ 提供更完整的「多代理敏捷」工作流
✅ 规划阶段极其细致
✅ 适合把规范、架构、开发、测试与知识沉淀统一到一套协作模型里
✅ 能扩展到业务、创作等更多领域

### Spec Kit vs OpenSpec

| 特性 | Spec Kit | OpenSpec |
|----|----|----|
| **定位** | 从 0 到 1 | 修改现有功能 |
| **结构** | 4阶段流程 | 5步骤 + 变更分组 |
| **适用场景** | 新项目搭建 | 功能迭代与演进 |
| **变更管理** | 单一规范 | 变更分组 + 归档 |
| **追溯能力** | 基础 | 强大 |
| **学习曲线** | ⭐⭐ | ⭐⭐⭐ |

**何时选 OpenSpec**:

* 当你在"修改现有功能"或"触及多个规范"时
* 需要系统化跟踪"规范—任务—设计"的演进
* OpenSpec 的变更分组与规范驱动流程尤其有用


---

## 常见问题

### 1. 如何处理中英文混用？

**问题**: Spec Kit 默认模板是英文的

**解决方案**:

```bash
# 翻译所有模板文件
将 #.cursor 目录下的所有md文件的核心内容翻译成中文。
```

**建议**: 在 /specify 开始前就将模板汉化，阅读更顺滑

### 2. 如何验证提案格式？

**问题**: 生成的提案不符合规范

**解决方案**:

```bash
# 运行校验命令
openspec validate

# 严格校验
openspec validate --strict
```

**注意**:

* 必须使用规范性用语（如 MUST、SHALL、SHOULD）
* 遵循 RFC 2119 标准

### 3. 如何查看当前状态？

```bash
# 查看当前变更
openspec list

# 查看现有 spec
openspec view

# 查看特定变更
openspec show <change-id>

# 如果提示 "no change found"，多半是已归档
openspec show --archived
```

### 4. tasks.md 未按预期打勾怎么办？

**问题**: 任务完成后状态未更新

**解决方案**:

```bash
# 让 AI 自检并更新状态
请检查 tasks.md 并更新已完成任务的状态
```

**注意**: 有些需要人工验证的任务（如"在本地用真实提示词验证并保存到图库"）需要手动标记完成

### 5. API Key 失效导致运行失败

**问题**: 代码实现完美，但运行失败

**常见原因**:

* API Key 过期
* API Key 未配置
* API Key 权限不足

**解决方案**:


1. 检查 `.env` 文件
2. 更换有效的 API Key
3. 验证 API Key 权限

### 6. 如何归档变更？

```bash
# 提示 AI 归档
请将这次变更存档

# 手动归档
openspec archive <change-id>
```

归档后：

* 变更移至 `archive/` 文件夹
* 规范更新至 `specs/` 文件夹
* `openspec list` 显示为空

### 7. 支持哪些 IDE/代理？

**官方支持**:

* GitHub Copilot
* Claude Code
* Gemini CLI

**社区验证**:

* Cursor（选择 Cursor 模板）
* Trae（选择 Cursor 模板，实测可用）
* Windsurf（待验证）

### 8. 如何处理大型项目？

**问题**: 项目过大，任务过多

**解决方案**:


1. **分模块管理** - 为每个模块创建独立的 spec
2. **MVP优先** - 先实现核心功能
3. **增量迭代** - 逐步添加功能
4. **使用 OpenSpec** - 更适合大型项目的变更管理

### 9. 如何自定义模板？

**位置**: `.cursor/commands/` 目录

**可自定义内容**:

* constitution.md - 项目章程模板
* specify.md - 规格说明模板
* plan.md - 技术规划模板
* tasks.md - 任务分解模板

**建议**: 保留核心结构，只修改具体内容

### 10. 如何与团队协作？

**Git 集成**:

```bash
# 提交规范文件
git add specs/
git commit -m "feat: add user authentication spec"
git push

# 创建 PR
gh pr create --title "Spec: User Authentication"
```

**协作建议**:

* constitution.md 由团队共同制定
* 每个功能由一个人负责 specify
* plan 阶段需要技术评审
* tasks 实施可以并行分工


---

## 最佳实践

### 1. 项目初始化

```bash
# 步骤1: 初始化项目
specify init my-project --ai claude

# 步骤2: 进入项目
cd my-project

# 步骤3: 翻译模板（可选）
# 在 AI 代理中运行：
将 .cursor 目录下的所有md文件翻译成中文

# 步骤4: 制定项目章程
/constitution 制定以代码质量、测试标准、用户体验一致性及性能要求为核心的原则
```

### 2. 功能开发

```bash
# 步骤1: 描述功能（What/Why）
/specify 实现用户登录功能，支持邮箱和第三方登录

# 步骤2: 澄清需求（如需要）
/clarify

# 步骤3: 制定技术方案
/plan 使用 Next.js + NextAuth + Prisma

# 步骤4: 分解任务
/tasks

# 步骤5: 质量检查
/analyze

# 步骤6: 开始实施
/implement
```

### 3. 迭代优化

```bash
# 当功能需要调整时：

# 方式1: 更新 spec
/specify [更新内容]

# 方式2: 直接修改 spec.md 文件
# 然后运行：
/analyze  # 检查一致性
/plan     # 更新计划
/tasks    # 更新任务
/implement # 重新实施
```

### 4. 质量保证

#### 测试驱动开发（TDD）

Spec Kit 强调测试先行：

```markdown
## 测试要求（tasks.md 示例）

- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 编写端到端测试
- [ ] 测试覆盖率达到 90%
- [ ] 所有测试通过
```

#### 代码审查

constitution.md 中定义代码审查标准：

```markdown
## 代码审查要求

1. 每个 PR 至少 2 人审查
2. 必须通过所有自动化测试
3. 代码覆盖率不得低于 90%
4. 必须符合 ESLint 规范
5. 必须有完整的文档注释
```

### 5. 文档管理

#### 及时更新

* spec.md - 功能需求变更时更新
* plan.md - 技术方案调整时更新
* tasks.md - 任务进度实时更新
* constitution.md - 团队规范变更时更新

#### 版本控制

```bash
# 使用 Git 管理规范文件
git add specs/
git commit -m "docs: update user auth spec"
git tag -a v1.0.0 -m "Release v1.0.0"
git push --tags
```

### 6. 团队协作

#### 角色分工

* **产品经理** - 负责 /specify，定义功能需求
* **架构师** - 负责 /plan，设计技术方案
* **项目经理** - 负责 /tasks，分解任务
* **开发工程师** - 负责 /implement，实现功能
* **测试工程师** - 负责验证，确保质量

#### 会议流程


1. **需求评审会** - 评审 spec.md
2. **技术评审会** - 评审 plan.md
3. **任务分配会** - 分配 tasks.md 中的任务
4. **代码评审会** - 评审实现代码
5. **复盘会** - 总结经验教训

### 7. 常用命令速查

```bash
# 初始化
specify init my-project --ai claude --ignore-agent-tools
specify init --here  # 在当前目录

# 核心流程
/constitution        # 制定章程
/specify            # 定义功能
/clarify            # 澄清需求
/plan               # 技术方案
/tasks              # 任务分解
/analyze            # 一致性检查
/implement          # 开始实施

# OpenSpec 专用
openspec init       # 初始化
openspec list       # 列出变更
openspec view       # 查看规范
openspec show       # 显示变更
openspec validate   # 验证格式
openspec archive    # 归档变更
```

### 8. 提示词技巧

#### 好的提示词示例

```bash
# ✅ 清晰明确
/specify 实现用户登录功能，支持邮箱登录和 GitHub OAuth登录，
包含忘记密码、记住我等功能，符合 GDPR 规范

# ✅ 包含约束
/plan 使用 Next.js 14 + TypeScript + Tailwind CSS，
采用服务端渲染（SSR），API 路由使用 tRPC

# ✅ 具体可测
/tasks 任务应该小而独立，每个任务不超过 4 小时，
包含明确的验收标准和测试用例
```

#### 差的提示词示例

```bash
# ❌ 过于模糊
/specify 做一个网站

# ❌ 缺少约束
/plan 用前端框架

# ❌ 目标不明
/tasks 把功能做出来
```

### 9. 错误处理

#### 常见错误与解决方案

| 错误 | 原因 | 解决方案 |
|----|----|----|
| "Command not found" | 未安装 Spec Kit | 运行安装命令 |
| "Invalid spec format" | 规范格式不正确 | 运行 `openspec validate` |
| "No change found" | 变更已归档 | 使用 `--archived` 参数 |
| "API Key invalid" | API Key 失效 | 更换有效 Key |
| "Tests failed" | 测试未通过 | 检查实现代码 |

### 10. 性能优化

#### 任务并行执行

```markdown
## 并行策略（tasks.md 示例）

### 可并行任务组
- [ ] 前端UI开发 (4h)
- [ ] 后端API开发 (4h)
- [ ] 数据库设计 (2h)

### 依赖任务组
- [ ] 数据库迁移 (1h) -> 前置条件
- [ ] API集成测试 (2h) -> 依赖上述两个任务
```

#### MVP 优先

识别 MVP 任务，优先实现核心功能：

```markdown
## MVP 任务（约 44 个任务，2周）

### 核心功能
- [x] 用户注册登录
- [x] 基础对话功能
- [x] 消息存储
- [ ] 基础UI界面

### 增强功能（可延后）
- [ ] 多语言支持
- [ ] 主题切换
- [ ] 高级设置
```


---

## 总结

### 核心要点


1. **先写规范，再写代码** - Spec Kit 的核心理念
2. **四阶段流程** - Specify → Plan → Tasks → Implement
3. **质量驱动** - TDD、测试覆盖率、代码审查
4. **团队协作** - 角色分工、规范共享、版本控制
5. **持续优化** - 迭代改进、文档更新、经验沉淀

### 适用场景

✅ **最适合**:

* 从 0 到 1 的新项目
* MVP 快速开发
* 团队协作项目
* 需要严格质量控制的项目

❌ **不适合**:

* 简单的信息整合任务
* 原型验证（过于重量级）
* 紧急 Bug 修复（流程太长）

### 学习资源

* **GitHub 仓库**: https://github.com/github/spec-kit
* **官方博客**: https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/
* **Releases**: https://github.com/github/spec-kit/releases
* **Issues**: https://github.com/github/spec-kit/issues

### 替代方案

* **Kiro**: https://kiro.dev/
* **BMAD-METHOD**: https://github.com/bmad-code-org/BMAD-METHOD
* **OpenSpec**: https://github.com/Fission-AI/OpenSpec


---

**最后更新**: 2025-11-06
**版本**: v1.0
**贡献者**: 根据公开文章整理