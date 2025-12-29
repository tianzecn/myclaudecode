# Superpowers 插件深度分析与使用指南

> 本文档是对 Superpowers 插件的深度分析，帮助开发者理解其设计哲学、工作流程以及正确使用方法。

---

## 一、Superpowers 是什么？

**本质**：一套完整的软件开发工作流系统，而非简单的辅助工具

**核心理念**：通过技能(Skills)强制执行最佳实践，让 AI 无法"偷懒"

**设计哲学**：
- Test-First（测试优先）
- Systematic over Ad-hoc（系统化而非临时性）
- YAGNI（You Aren't Gonna Need It）
- DRY（Don't Repeat Yourself）

这是由 Jesse Vincent 开发的 Claude Code 插件，包含 **14 个核心技能** 和 **3 个斜杠命令**，组成一个完整的开发工作流。

---

## 二、核心工作流（黄金流程）

```
┌────────────────────────────────────────────────────────────────────┐
│  用户提出需求："帮我实现 XXX 功能"                                    │
└────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────┐
│  阶段1: brainstorming（头脑风暴）                                    │
│  - 一次一个问题理解需求                                              │
│  - 提出 2-3 种方案及权衡                                            │
│  - 分段展示设计（200-300字/段）                                      │
│  - 保存设计文档到 docs/plans/YYYY-MM-DD-<topic>-design.md           │
└────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────┐
│  阶段2: using-git-worktrees（创建隔离工作区）                         │
│  - 检测/创建 .worktrees 目录                                        │
│  - 验证 .gitignore 设置                                             │
│  - 创建新分支和工作树                                                │
│  - 运行项目设置和测试验证                                            │
└────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────┐
│  阶段3: writing-plans（编写实施计划）                                 │
│  - 将工作拆解为 2-5 分钟的小任务                                     │
│  - 每个任务包含：精确文件路径、完整代码、验证步骤                       │
│  - 强调 TDD：写测试 → 运行失败 → 实现 → 通过 → 提交                   │
│  - 保存计划到 docs/plans/YYYY-MM-DD-<feature>.md                    │
└────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────┐
│  阶段4: subagent-driven-development（子智能体驱动开发）               │
│  - 每个任务派发独立的子智能体执行                                     │
│  - 两阶段审查：                                                      │
│    ① 规格符合性审查（代码是否匹配需求）                               │
│    ② 代码质量审查（代码是否高质量）                                   │
│  - 循环直到所有任务完成                                              │
└────────────────────────────────────────────────────────────────────┘
                                    ↓
┌────────────────────────────────────────────────────────────────────┐
│  阶段5: finishing-a-development-branch（完成开发分支）               │
│  - 验证所有测试通过                                                  │
│  - 提供选项：合并/创建PR/保留/丢弃                                   │
│  - 清理工作树                                                       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 三、14 个技能详解

| 类别 | 技能名 | 触发时机 | 核心功能 |
|------|--------|---------|---------|
| **协作** | `brainstorming` | 任何创意工作前 | 苏格拉底式设计细化 |
| | `writing-plans` | 有需求后、写代码前 | 创建详细实施计划 |
| | `executing-plans` | 有计划后（并行会话） | 批量执行+人工检查点 |
| | `subagent-driven-development` | 有计划后（同会话） | 子智能体+两阶段审查 |
| | `dispatching-parallel-agents` | 需要并发时 | 多子智能体协调 |
| **Git** | `using-git-worktrees` | 开始功能开发时 | 创建隔离工作区 |
| | `finishing-a-development-branch` | 任务完成时 | 合并/PR决策流程 |
| **测试** | `test-driven-development` | 实现任何功能时 | RED-GREEN-REFACTOR |
| | `verification-before-completion` | 声明完成前 | 确保真正修复 |
| **调试** | `systematic-debugging` | 遇到任何bug时 | 四阶段根因分析 |
| **代码审查** | `requesting-code-review` | 任务间 | 审查前检查清单 |
| | `receiving-code-review` | 收到反馈后 | 响应反馈工作流 |
| **元技能** | `using-superpowers` | 会话开始时 | 技能使用指南 |
| | `writing-skills` | 创建新技能时 | 技能开发最佳实践 |

---

## 四、TDD 铁律

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
（没有先失败的测试，就不能写生产代码）
```

### 核心循环：RED-GREEN-REFACTOR

1. **RED**（写失败测试）- 写一个会失败的测试
2. **GREEN**（最小代码通过）- 写最少的代码让测试通过
3. **REFACTOR**（清理）- 在测试保护下重构

### 违反后果

**先写代码后写测试？删除代码，重新开始！**

### 常见借口及驳斥

| 借口 | 现实 |
|------|------|
| "太简单了不需要测试" | 简单代码也会出错，测试只要30秒 |
| "我后面会写测试" | 后写的测试立即通过，什么也证明不了 |
| "删除X小时的工作太浪费" | 沉没成本谬误，保留未验证代码才是技术债 |
| "TDD太教条了" | TDD是实用的：找bug比调试快，防止回归 |
| "已经手动测试过了" | 临时测试 ≠ 系统测试，无记录无法复现 |
| "探索阶段不需要测试" | 可以探索，但要丢弃探索代码，用TDD重新实现 |

---

## 五、系统化调试四阶段

### Phase 1: 根因调查（Root Cause Investigation）

- 仔细阅读错误信息和堆栈跟踪
- 稳定复现问题
- 检查最近变更
- 在多组件系统中收集证据

### Phase 2: 模式分析（Pattern Analysis）

- 找到类似的工作代码
- 对比参考实现
- 识别差异

### Phase 3: 假设与测试（Hypothesis and Testing）

- 形成单一假设
- 最小化测试
- 验证后继续

### Phase 4: 实施修复（Implementation）

- 创建失败的测试用例
- 实施单一修复
- 验证修复
- **如果3次修复都失败 → 质疑架构！**

### 调试铁律

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
（没有根因调查，就不能尝试修复）
```

---

## 六、使用指南（实例演示）

### 方式一：使用斜杠命令（推荐新手）

```bash
# 1. 头脑风暴阶段
/superpowers:brainstorm 我想添加用户认证功能

# 2. 编写计划
/superpowers:write-plan

# 3. 执行计划
/superpowers:execute-plan
```

### 方式二：自动触发（推荐熟练后）

技能会根据上下文自动触发，你只需要正常对话：

```
你：帮我实现一个用户登录系统

Claude：我正在使用 brainstorming 技能来理解你的需求...
        首先，我想了解几个问题：
        1. 你打算使用什么认证方式？
           A. Session-based（传统方式）
           B. JWT（无状态）
           C. OAuth（第三方登录）
```

### 实战示例：添加表单验证功能

**Step 1: 启动项目**
```
你：帮我给注册表单添加邮箱验证功能
```

**Step 2: Brainstorming 自动触发**
```
Claude：我正在使用 brainstorming 技能来细化需求...

让我先了解一下当前项目状态...
[检查 package.json, src/ 目录结构]

关于邮箱验证，我想确认：
验证时机应该是哪种？
1. 实时验证（输入时）
2. 提交时验证
3. 两者都要
```

**Step 3: 设计确认后创建工作区**
```
Claude：设计已确认！我正在使用 using-git-worktrees 技能...

[检查 .worktrees/ 目录存在]
[验证已在 .gitignore 中]
[创建: git worktree add .worktrees/email-validation -b feature/email-validation]
[运行 npm install]
[运行 npm test - 全部通过]

工作区就绪：.worktrees/email-validation
测试基线：47 tests passing
```

**Step 4: 编写计划**
```
Claude：我正在使用 writing-plans 技能创建实施计划...

# 邮箱验证实施计划

## Task 1: 添加验证函数

**文件:**
- 创建: `src/validators/email.ts`
- 测试: `tests/validators/email.test.ts`

**Step 1: 写失败测试**
```typescript
test('rejects empty email', () => {
  expect(validateEmail('')).toEqual({ valid: false, error: 'Email required' });
});
```

**Step 2: 运行测试验证失败**
运行: `npm test tests/validators/email.test.ts`
预期: FAIL - validateEmail is not defined
...
```

**Step 5: 执行计划（两阶段审查）**
```
Claude：我正在使用 subagent-driven-development 执行计划...

[派发实现子智能体处理 Task 1]
实现者：已完成邮箱验证函数，4/4 测试通过

[派发规格符合性审查子智能体]
规格审查：✅ 符合规格 - 所有需求已实现

[派发代码质量审查子智能体]
质量审查：✅ 通过 - 代码清晰，测试覆盖完整

[标记 Task 1 完成]
...
```

### 调试示例

```
你：tests/api.test.ts 突然开始失败了

Claude：我正在使用 systematic-debugging 技能...

## Phase 1: 根因调查

**读取错误信息:**
Error: Connection refused at localhost:5432

**检查最近变更:**
git log --oneline -5
# 发现 3 commits ago 修改了数据库配置

**收集证据:**
docker ps | grep postgres
# 结果: 没有 postgres 容器

**根因确定:** Docker postgres 容器未启动

## Phase 4: 实施

**创建失败测试:** 已存在（当前失败的测试）

**修复:**
docker-compose up -d postgres

**验证:**
npm test tests/api.test.ts
# 全部通过
```

---

## 七、关键红线（绝不能做的事）

| 领域 | 绝对禁止 |
|------|---------|
| **TDD** | 先写代码后写测试 |
| **调试** | 不调查就猜测修复 |
| **计划** | 跳过设计直接实现 |
| **审查** | 跳过任何一阶段审查 |
| **工作树** | 不验证 .gitignore 就创建 |

---

## 八、技能优先级

当多个技能可能适用时：

1. **流程技能优先**（brainstorming, debugging）- 决定如何做
2. **实现技能其次**（TDD, writing-plans）- 指导执行

示例：
- "帮我构建 X" → 先 brainstorming，再用实现技能
- "修复这个 bug" → 先 debugging，再用领域特定技能

---

## 九、安装方法

```bash
# 1. 添加 marketplace
/plugin marketplace add obra/superpowers-marketplace

# 2. 安装插件
/plugin install superpowers@superpowers-marketplace

# 3. 验证安装
/help
# 应该看到 /superpowers:brainstorm 等命令

# 4. 更新插件
/plugin update superpowers
```

---

## 十、核心价值总结

| 维度 | 价值 |
|------|------|
| **质量** | 两阶段审查 + TDD = 高质量代码 |
| **效率** | 子智能体并行 + 自动化流程 = 快速迭代 |
| **可靠性** | 系统化调试 = 首次修复率 95% |
| **一致性** | 强制工作流 = 稳定输出质量 |

---

## 十一、最重要的三点

1. **先 Brainstorm 后动手** - 别急着写代码
2. **TDD 是铁律** - 没有失败的测试就没有生产代码
3. **系统化调试** - 猜测修复是愚蠢的行为

---

*本文档基于 Superpowers v4.0.2 版本分析生成*
*分析时间：2025年12月*
