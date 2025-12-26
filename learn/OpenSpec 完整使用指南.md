# OpenSpec 完整使用指南

## 目录

1. [什么是 OpenSpec](#什么是-openspec)
2. [核心特点](#核心特点)
3. [工作流总览](#工作流总览)
4. [安装与初始化](#安装与初始化)
5. [完整开发流程](#完整开发流程)
6. [实战案例](#实战案例)
7. [与其他工具对比](#与其他工具对比)
8. [常用命令](#常用命令)
9. [最佳实践](#最佳实践)

---

## 什么是 OpenSpec

### 定义

**OpenSpec** 是一个轻量级的规范驱动开发工具，旨在让人类与 AI 编码助手通过"规范驱动的开发"达成一致。

- **GitHub 仓库**: https://github.com/Fission-AI/OpenSpec
- **定位**: 比 Cursor Plan 更细、比 spec-kit 更轻
- **核心理念**: 规范驱动 + 变更管理
- **开源协议**: MIT

### 核心价值

相比其他工具：
- **比 spec-kit 更轻量** - 流程更简单，上手更快
- **比 Cursor Plan 更完善** - 结构更清晰，追溯更强
- **变更分组管理** - 每次功能变更独立跟踪
- **反馈循环强大** - AI 可以不停分析、生成计划，在反馈循环中迭代

### 适用场景

✅ **最适合**:
- 修改现有功能
- 功能迭代与演进
- 触及多个规范的变更
- 需要完整追溯的项目

❌ **不太适合**:
- 从 0 到 1 的新项目（用 spec-kit 更好）
- 简单的 Bug 修复
- 原型验证

---

## 核心特点

### 1. 两大部分

```
project/
├── specs/          # 当前的规范状态
│   ├── spec1.md
│   └── spec2.md
└── changes/        # 变更提案与演进记录
    ├── 001-feature-a/
    ├── 002-feature-b/
    └── archive/
```

**specs**:
- 存储当前项目的所有活跃规范
- 代表项目的"当前真相"
- 每个规范对应一个功能模块

**changes**:
- 存储每次功能变更的完整记录
- 包括提案、计划、任务、设计
- 完成后可以归档

### 2. 五个步骤

```
1. Propose（提案）
   ↓
2. Review & Align（审查与对齐规范）
   ↓
3. Plan with Feedback Loop（反复分析并给出计划）
   ↓
4. Implement（实施任务）
   ↓
5. Archive & Update Specs（归档并更新规范）
```

### 3. 变更分组

OpenSpec 的一个重要差异是：**把"功能的每次变更"分组到一个文件夹中**，便于跟踪关联的规范、任务和设计。

例如：
```
changes/
└── 001-replace-image-model/
    ├── proposal.md      # 提案
    ├── spec.md          # 规范
    ├── plan.md          # 计划
    ├── tasks.md         # 任务
    └── design.md        # 设计文档
```

### 4. 工具支持

OpenSpec 支持多种常用工具：

- **GitHub Copilot**
- **Claude Code**
- **Codex (GPT-5)**
- **Cursor**
- **其他 AI 编程助手**

### 5. 交互方式

- ✅ **命令行操作** - 简单直接
- ✅ **自然语言对话** - 驱动流程
- ✅ **AGENTS.md 兼容** - 便于安装和使用

---

## 工作流总览

### 阶段图

```
┌─────────────────────────────────────────────────────────┐
│                    OpenSpec 工作流                        │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. PROPOSE              创建变更提案                    │
│     │                    - Why: 为什么要做                │
│     │                    - What: 要做什么                 │
│     │                    - Impact: 影响范围               │
│     ↓                                                     │
│                                                           │
│  2. REVIEW & ALIGN       审查与对齐                      │
│     │                    - 验证提案格式                   │
│     │                    - 检查规范一致性                 │
│     │                    - 明确需求边界                   │
│     ↓                                                     │
│                                                           │
│  3. PLAN (循环)          制定计划                        │
│     │  ↻                 - AI 分析提案                    │
│     │  ↻                 - 生成实施计划                   │
│     │  ↻                 - 反馈循环迭代                   │
│     ↓                    - 直至满意                       │
│                                                           │
│  4. IMPLEMENT            执行实施                        │
│     │                    - 按任务开发                     │
│     │                    - 持续测试验证                   │
│     │                    - 更新状态                       │
│     ↓                                                     │
│                                                           │
│  5. ARCHIVE              归档与更新                      │
│     │                    - 归档变更记录                   │
│     └──────────────────> - 更新 specs                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### 详细流程

#### 1. Propose（提案）

**目标**: 明确要做什么变更，为什么要做

**提案结构**:
```markdown
## Why（为什么）
- 当前痛点是什么
- 为什么需要这个变更
- 预期带来的价值

## What（做什么）
- 具体要实现的功能
- 功能边界
- 不包括的内容

## Impact（影响）
- 影响的模块
- 可能的风险
- 需要协调的团队
```

#### 2. Review & Align（审查与对齐）

**目标**: 确保提案符合规范，与现有 specs 对齐

**检查项**:
- ✅ 提案格式正确（必须使用 MUST、SHALL、SHOULD 等规范用语）
- ✅ 与现有规范不冲突
- ✅ 需求边界清晰
- ✅ 验收标准明确

**验证命令**:
```bash
# 格式验证
openspec validate

# 严格验证
openspec validate --strict
```

#### 3. Plan with Feedback Loop（计划 + 反馈循环）

**目标**: AI 反复分析并给出最优计划

**反馈循环**:
```
人类: 我需要把图片模型改为 Qwen
  ↓
AI: 分析提案，生成初步计划
  ↓
人类: 需要支持更多参数（步数、尺寸、格式等）
  ↓
AI: 更新计划，补充参数配置
  ↓
人类: 确认计划，准备实施
```

**特点**:
- 🔄 **可以无限迭代** - 直到计划满意为止
- 🎯 **逐步细化** - 从粗到细，从抽象到具体
- 💡 **AI 智能补充** - AI 会主动发现遗漏的点

#### 4. Implement（实施）

**目标**: 按照计划和任务列表实施

**执行方式**:
```bash
# 自然语言触发
请开始实施这个变更

# 或者 AI 会提示
现在开始实施吗？我可以按任务顺序执行。
```

**实施过程**:
- 逐个任务执行
- 实时更新 tasks.md
- 遇到问题及时沟通
- 完成后自动测试

#### 5. Archive & Update Specs（归档与更新）

**目标**: 归档变更记录，更新项目规范

**归档操作**:
```bash
# 提示 AI 归档
请将这次变更存档

# 或手动归档
openspec archive <change-id>
```

**归档结果**:
```
changes/
├── archive/
│   └── 001-replace-image-model/   # 归档的变更
│       ├── proposal.md
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
└── 002-new-feature/               # 新的变更

specs/
└── image-generation.md            # 更新后的规范（标记 ADDED Requirements）
```

---

## 安装与初始化

### 安装 OpenSpec

```bash
# 使用 npm
npm install -g openspec

# 使用 pnpm
pnpm add -g openspec

# 使用 yarn
yarn global add openspec
```

### 初始化项目

```bash
# 进入项目目录
cd your-project

# 初始化 OpenSpec
openspec init

# 选择 AI 编程工具
? Which AI coding tool are you using?
  ❯ Codex (GPT-5)
    Claude Code
    GitHub Copilot
    Cursor
    Other
```

### 生成的目录结构

```
your-project/
├── openspec/
│   ├── changes/           # 变更记录
│   │   └── .gitkeep
│   ├── specs/             # 当前规范
│   │   └── .gitkeep
│   ├── project.md         # 项目说明
│   └── AGENTS.md          # AI 代理配置
├── .gitignore
└── README.md
```

### 初始化后的三项工作

OpenSpec 会提示你完成三项工作：

1. **填写 project.md**
   ```bash
   请阅读 openspec/project.md，并帮助我填写有关我的项目、
   技术堆栈和惯例的详细信息
   ```

2. **创建第一个变更提案**
   ```bash
   我要添加的功能是什么？
   ```

3. **了解 OpenSpec 工作流**
   ```bash
   请解释 OpenSpec 的工作流程
   ```

---

## 完整开发流程

### 示例：替换图片生成模型

假设我们要把项目中的图片生成模型从 FLUX 替换为 Qwen Image。

#### 步骤 1: 让 AI 了解项目

```bash
# 如果模板是英文，先翻译
请将 openspec/ 目录下的所有文档翻译成中文

# 让 AI 阅读并补充项目信息
请阅读并补充 project.md，了解当前项目的：
- 技术栈
- 架构设计
- 开发规范
- 部署方式
```

**project.md 内容示例**:
```markdown
# 项目概览

## 项目名称
OpenJourney - Midjourney UI 开源替代

## 技术栈
- 前端：Next.js 14 + TypeScript + Tailwind CSS
- 后端：Node.js + Express
- AI：Replicate API
- 数据库：SQLite（本地存储）

## 当前架构
- 图片生成：使用 FLUX 模型
- 视频生成：使用其他模型
- 用户认证：GitHub OAuth

## 开发规范
- TypeScript strict mode
- ESLint + Prettier
- 测试覆盖率 > 80%
```

#### 步骤 2: 创建变更提案

```bash
# 发起提案
我想把图片生成模型从黑森林的 FLUX 改为 Qwen Image，
因为在 Replicate 上成本更低、生成质量更高
```

**AI 会自动生成提案**:

```markdown
# 提案：替换图片生成模型为 Qwen Image

## Why（为什么）
- 当前使用的 FLUX 模型成本较高
- Qwen Image 在 Replicate 上的成本更低
- Qwen Image 生成质量更高
- 更好的中文支持

## What（做什么）
- 将图片生成 API 调用从 FLUX 切换到 Qwen Image
- 更新 UI 配置，支持 Qwen 的参数设置
- 保持向后兼容，不影响现有功能
- 更新文档和示例

## Impact（影响）
- 影响模块：图片生成服务
- API 调用参数变化
- UI 设置界面需要调整
- 成本降低约 30%
```

**保存位置**: `openspec/changes/001-replace-image-model/proposal.md`

#### 步骤 3: 验证提案格式

```bash
# AI 会提示运行验证
请运行命令验证提案格式

# 执行验证
openspec validate
```

**验证结果**:
```
❌ 发现问题：
- 第 10 行：应使用 "MUST" 而非 "需要"
- 第 15 行：应使用 "SHALL" 而非 "将会"

正在自动修正...

✅ 验证通过！提案格式符合规范。
```

#### 步骤 4: 提供详细文档

```bash
# 发送 Qwen Image API 文档
请查看 Qwen Image 在 Replicate 上的 API 文档：
https://replicate.com/qwen/qwen-image

需要支持的参数：
- prompt: 提示词
- num_inference_steps: 推理步数 (1-50)
- guidance_scale: 引导系数 (1-20)
- width: 图片宽度
- height: 图片高度
- output_format: 输出格式 (jpg, png, webp)
- output_quality: 输出质量 (1-100)
```

**AI 更新提案和规范**:
```markdown
# 规范：Qwen Image 参数支持

## Requirements

The system MUST support the following Qwen Image parameters:

### Core Parameters
- prompt (string, required): 图片生成提示词
- num_inference_steps (integer, 1-50, default: 20): 推理步数
- guidance_scale (float, 1-20, default: 7.5): 引导系数

### Image Settings
- width (integer, default: 1024): 图片宽度
- height (integer, default: 1024): 图片高度
- output_format (enum: jpg|png|webp, default: webp): 输出格式
- output_quality (integer, 1-100, default: 90): 输出质量
```

#### 步骤 5: 再次验证

```bash
openspec validate --strict
```

**通过验证**:
```
✅ 提案格式正确
✅ 规范用语符合标准（MUST, SHALL, SHOULD）
✅ 与现有 specs 无冲突
✅ 可以进入实施阶段
```

#### 步骤 6: 生成计划和任务

```bash
# AI 会自动生成
请基于提案生成详细的实施计划和任务列表
```

**生成的 plan.md**:
```markdown
# 实施计划：Qwen Image 集成

## 1. API 层改造
- 创建 Qwen Image API 客户端
- 实现参数转换逻辑
- 添加错误处理

## 2. UI 层改造
- 更新设置面板，添加新参数控件
- 实现参数验证
- 更新提示文本

## 3. 测试
- 单元测试：API 客户端
- 集成测试：完整流程
- E2E 测试：用户界面

## 4. 文档
- 更新 API 文档
- 更新用户指南
- 添加迁移说明
```

**生成的 tasks.md**:
```markdown
# 任务列表

## Phase 1: API 客户端 (4h)
- [ ] 创建 QwenImageClient 类
- [ ] 实现 generateImage 方法
- [ ] 添加参数验证
- [ ] 编写单元测试

## Phase 2: UI 改造 (3h)
- [ ] 添加参数设置组件
- [ ] 实现参数联动逻辑
- [ ] 更新样式
- [ ] 编写组件测试

## Phase 3: 集成 (2h)
- [ ] 连接 API 和 UI
- [ ] 实现完整流程
- [ ] 测试边界情况
- [ ] 修复发现的问题

## Phase 4: 文档和部署 (1h)
- [ ] 更新 README
- [ ] 编写迁移指南
- [ ] 提交代码审查
- [ ] 部署到生产环境

总计：约 10 小时
```

#### 步骤 7: 开始实施

```bash
# 提示 AI 开始
请开始实施这个变更
```

**AI 执行过程**:
```
✓ 创建 QwenImageClient 类
✓ 实现 generateImage 方法
✓ 添加参数验证
✓ 编写单元测试
⚠ 发现问题：API Key 失效
```

**遇到问题时的处理**:
```bash
# 发现 API Key 问题
错误：API Key 无效

# 更换有效的 Key
已更新 .env 文件，请继续

✓ API 测试通过
✓ 开始 UI 改造...
```

#### 步骤 8: 完成与验证

```bash
# AI 完成所有任务
✓ 所有任务已完成
✓ 测试全部通过
✓ 代码已提交

# 人工验证
请在本地测试生成几张图片，确认功能正常
```

**手动测试**:
```bash
# 运行应用
npm run dev

# 测试生成
- 输入提示词："a cute cat"
- 调整参数：steps=30, width=1024, height=1024
- 点击生成
- ✓ 生成成功，质量良好
```

#### 步骤 9: 归档变更

```bash
# 提示归档
请将这次变更存档

# AI 执行归档
✓ 变更已归档到 openspec/changes/archive/001-replace-image-model/
✓ 规范已更新到 openspec/specs/image-generation.md
```

**归档后的目录**:
```
openspec/
├── changes/
│   └── archive/
│       └── 001-replace-image-model/
│           ├── proposal.md
│           ├── spec.md
│           ├── plan.md
│           └── tasks.md
└── specs/
    └── image-generation.md  # 已更新，顶部标记 ADDED Requirements
```

#### 步骤 10: 检查任务状态

```bash
# 查看 tasks.md
# 应该所有任务都打勾

# 如果未打勾
请自检并更新 tasks.md 的完成状态
```

**更新后的 tasks.md**:
```markdown
## Phase 1: API 客户端 (4h)
- [x] 创建 QwenImageClient 类
- [x] 实现 generateImage 方法
- [x] 添加参数验证
- [x] 编写单元测试

## Phase 2: UI 改造 (3h)
- [x] 添加参数设置组件
- [x] 实现参数联动逻辑
- [x] 更新样式
- [x] 编写组件测试

## Phase 3: 集成 (2h)
- [x] 连接 API 和 UI
- [x] 实现完整流程
- [x] 测试边界情况
- [x] 修复发现的问题

## Phase 4: 文档和部署 (1h)
- [x] 更新 README
- [x] 编写迁移指南
- [ ] 提交代码审查（需人工处理）
- [ ] 部署到生产环境（需人工处理）

完成度：90% (18/20)
```

---

## 实战案例

### 案例：OpenJourney 图片模型替换

**项目背景**:
- OpenJourney 是模仿 Midjourney UI 的开源项目
- 原使用 FLUX 模型
- 需要替换为 Qwen Image（成本更低、质量更高）

**使用工具**: Codex (GPT-5) + OpenSpec

**完整流程**:

#### 1. 初始化

```bash
cd openjourney
openspec init

# 选择 Codex
? Which AI coding tool? Codex (GPT-5)
```

#### 2. 项目理解

```bash
# 翻译模板
请将 openspec/ 目录下的文档翻译成中文

# 让 AI 理解项目
请阅读项目代码，并补充 project.md 中的信息
```

**AI 分析结果**:
```markdown
# 项目分析

## 当前技术栈
- Next.js 14 + TypeScript
- Replicate API
- 图片模型：黑森林 FLUX
- 视频模型：其他模型

## 架构特点
- 前后端一体
- 本地 SQLite 存储
- GitHub OAuth 认证
```

#### 3. 创建提案

```bash
我想把图片生成模型从黑森林的 FLUX 改为 Qwen Image
```

**生成的提案**:
```markdown
# 提案：替换为 Qwen Image

## Why
- 降低 API 成本 (~30%)
- 提升生成质量
- 更好的中文支持

## What
- 替换 API 调用
- 更新 UI 参数设置
- 保持向后兼容

## Impact
- 图片生成模块
- 设置界面
- API 成本
```

#### 4. 验证与完善

```bash
# 运行验证
openspec validate

# 提供详细文档
这是 Qwen Image 的 API 文档...

# AI 更新规范
已更新 spec.md，添加了所有参数支持
```

#### 5. 实施

```bash
请开始实施

# 遇到 API Key 问题
⚠ API Key 失效

# 更换 Key 后继续
已更新 Key，继续实施

✓ 实施完成
```

#### 6. 测试

**左侧原有报错**: 已被 AI 修复

**功能测试**:
- ✅ 图片生成正常
- ✅ 视频生成正常
- ✅ 历史记录可查看
- ✅ 参数设置生效

#### 7. 归档

```bash
请将变更存档

✓ 已归档到 archive/001-replace-image-model/
✓ 已更新 specs/image-generation.md
```

**耗时**: 约 2 小时（包括测试和调试）

**结果**:
- 功能完整
- 质量提升
- 成本降低
- 完整追溯

---

## 与其他工具对比

### OpenSpec vs Spec Kit

| 特性 | OpenSpec | Spec Kit |
|------|----------|----------|
| **定位** | 功能迭代工具 | 从 0 到 1 工具 |
| **核心结构** | specs + changes | specs only |
| **变更管理** | 每个变更独立文件夹 | 单一规范文件 |
| **追溯能力** | ⭐⭐⭐⭐⭐ 强大 | ⭐⭐⭐ 基础 |
| **反馈循环** | ⭐⭐⭐⭐⭐ 强调迭代 | ⭐⭐⭐ 一次性 |
| **归档功能** | ✅ 完整归档 | ❌ 无归档 |
| **学习曲线** | ⭐⭐⭐ 中等 | ⭐⭐ 简单 |
| **适合场景** | 现有项目改造 | 新项目搭建 |

### OpenSpec vs Kiro

| 特性 | OpenSpec | Kiro |
|------|----------|------|
| **类型** | CLI 工具 | IDE 软件 |
| **集成方式** | 命令行 + AI 对话 | IDE 内置 |
| **变更管理** | 分组文件夹 | 内置版本控制 |
| **学习成本** | 低 | 中 |
| **价格** | 免费开源 | 商业软件 |
| **灵活性** | 高 | 中 |

### 选择建议

#### 选择 OpenSpec：
✅ 需要详细的变更追溯
✅ 经常修改现有功能
✅ 多人协作，需要清晰的变更历史
✅ 希望工具轻量、灵活

#### 选择 Spec Kit：
✅ 从 0 到 1 开发新项目
✅ 需要快速搭建 MVP
✅ 项目结构简单
✅ 不太关注变更历史

#### 选择 Kiro：
✅ 需要 IDE 一体化体验
✅ 愿意为工具付费
✅ 团队统一使用同一 IDE
✅ 需要强大的自动化能力

---

## 常用命令

### 初始化与配置

```bash
# 安装 OpenSpec
npm install -g openspec

# 初始化项目
openspec init

# 在现有项目初始化
openspec init --here

# 指定 AI 工具
openspec init --ai codex
openspec init --ai claude
openspec init --ai copilot
```

### 变更管理

```bash
# 列出当前变更
openspec list

# 查看现有规范
openspec view

# 显示特定变更
openspec show <change-id>

# 查看已归档变更
openspec show --archived <change-id>
```

### 验证与检查

```bash
# 验证提案格式
openspec validate

# 严格验证（检查规范用语）
openspec validate --strict

# 检查一致性
openspec check
```

### 归档与更新

```bash
# 归档变更
openspec archive <change-id>

# 归档并更新规范
openspec archive <change-id> --update-specs

# 列出已归档变更
openspec list --archived
```

### 辅助命令

```bash
# 查看帮助
openspec help

# 查看版本
openspec version

# 生成报告
openspec report

# 导出变更历史
openspec export <change-id>
```

### AI 对话触发

```bash
# 在 AI 对话中使用（不需要命令行）

# 创建提案
"我要添加一个新功能..."

# 验证提案
"请验证提案格式"

# 开始实施
"请开始实施这个变更"

# 归档变更
"请将这次变更存档"

# 检查状态
"请检查 tasks.md 并更新完成状态"
```

---

## 最佳实践

### 1. 提案编写

#### 好的提案示例

```markdown
# 提案：添加深色模式支持

## Why（为什么）
- 当前应用只支持浅色主题
- 用户反馈夜间使用体验差（占比 60%）
- 竞品已支持深色模式
- 符合现代应用设计趋势

## What（做什么）
- 实现系统级主题切换
- 支持自动跟随系统设置
- 提供手动切换按钮
- 保存用户偏好设置
- 所有页面和组件适配深色主题

## Impact（影响）
- 影响模块：所有 UI 组件、主题系统
- 需要更新：约 50 个组件文件
- 估算工作量：约 3-4 天
- 不影响现有功能，纯增量开发
```

#### 差的提案示例

```markdown
# 提案：改进 UI

## Why
UI 不好看

## What
让 UI 好看

## Impact
可能会改很多地方
```

### 2. 规范用语

必须使用标准的规范用语（RFC 2119）：

| 用语 | 含义 | 示例 |
|------|------|------|
| MUST | 必须 | The system MUST validate user input |
| SHALL | 应当 | The API SHALL return JSON format |
| SHOULD | 应该 | Error messages SHOULD be user-friendly |
| MAY | 可以 | The UI MAY include animations |
| MUST NOT | 不得 | Passwords MUST NOT be stored in plain text |

**错误示例**:
```markdown
- 需要验证用户输入
- 应该返回 JSON
- 可以添加动画
```

**正确示例**:
```markdown
- The system MUST validate user input
- The API SHALL return JSON format
- The UI MAY include animations
```

### 3. 反馈循环利用

充分利用 OpenSpec 的反馈循环特性：

```bash
# 第 1 轮
人类: 添加用户认证功能
AI: 生成初步计划

# 第 2 轮
人类: 需要支持多种登录方式（邮箱、GitHub、Google）
AI: 更新计划，添加多种认证

# 第 3 轮
人类: 还要支持记住我和自动登录
AI: 继续更新计划

# 第 4 轮
人类: 确认计划，开始实施
AI: 开始实施
```

**优势**:
- 逐步细化需求
- 避免一次性考虑不周
- AI 主动发现遗漏
- 最终计划更完善

### 4. 任务粒度控制

**好的任务粒度**:
```markdown
- [ ] 创建 UserAuth 组件 (2h)
- [ ] 实现邮箱登录逻辑 (1.5h)
- [ ] 添加 GitHub OAuth (1h)
- [ ] 实现记住我功能 (0.5h)
- [ ] 编写单元测试 (1h)
```

**差的任务粒度**:
```markdown
- [ ] 实现用户认证 (1周)
```

**原则**:
- 每个任务 0.5-4 小时
- 任务可独立测试
- 任务有明确产出
- 避免相互依赖

### 5. 归档时机

**何时归档**:
- ✅ 所有任务完成
- ✅ 测试全部通过
- ✅ 代码已合并到主分支
- ✅ 文档已更新
- ✅ 已部署到生产（如需要）

**不要过早归档**:
- ❌ 任务只完成了 80%
- ❌ 还有 Bug 待修复
- ❌ 文档未更新
- ❌ 代码未经审查

### 6. 规范更新

每次归档时，检查是否需要更新 specs：

```markdown
# specs/authentication.md

## ADDED Requirements (2025-11-06)
The system MUST support GitHub OAuth authentication

## MODIFIED Requirements (2025-11-06)
The system MUST store user sessions for 30 days (was 7 days)

## DEPRECATED Requirements (2025-11-06)
~~The system MAY support SMS authentication~~ (removed due to cost)
```

### 7. 变更命名

使用清晰、描述性的变更名称：

**好的命名**:
```
001-add-github-oauth
002-implement-dark-mode
003-optimize-image-loading
004-fix-memory-leak
```

**差的命名**:
```
001-update
002-fix
003-improve
004-change
```

### 8. 文档维护

保持文档同步更新：

```
每次变更后，同步更新：
├── README.md          # 项目说明
├── CHANGELOG.md       # 变更日志
├── API.md             # API 文档
└── openspec/
    ├── specs/         # 更新规范
    └── changes/       # 归档变更
```

### 9. 团队协作

**变更分配**:
```bash
# 在提案中标注负责人
Assigned to: @alice
Reviewers: @bob, @charlie
Estimated: 2 days
Priority: High
```

**代码审查**:
```bash
# 创建 PR 时引用变更
PR: Implement GitHub OAuth (#001-add-github-oauth)

See openspec/changes/001-add-github-oauth/ for:
- Proposal
- Specification
- Implementation plan
- Task checklist
```

### 10. 版本管理

使用 Git 管理 OpenSpec 文件：

```bash
# 提交提案
git add openspec/changes/001-*/proposal.md
git commit -m "docs: add GitHub OAuth proposal"

# 提交规范
git add openspec/changes/001-*/spec.md
git commit -m "docs: add GitHub OAuth spec"

# 提交实现
git add src/
git commit -m "feat: implement GitHub OAuth"

# 归档变更
git add openspec/
git commit -m "docs: archive GitHub OAuth change"
```

---

## 总结

### 核心优势

1. **轻量级** - 比 spec-kit 更简单，比 Cursor Plan 更完善
2. **变更分组** - 每个功能变更独立管理，便于追溯
3. **反馈循环** - AI 可以反复迭代计划，直到满意
4. **完整归档** - 所有变更记录都可以归档和查询
5. **灵活对接** - 支持多种 AI 编程工具

### 适用场景

✅ **最适合**:
- 现有项目的功能迭代
- 需要详细变更追溯
- 多人协作开发
- 复杂的功能改造

❌ **不适合**:
- 从 0 到 1 的新项目（用 Spec Kit）
- 简单的 Bug 修复
- 原型快速验证

### 学习资源

- **GitHub 仓库**: https://github.com/Fission-AI/OpenSpec
- **文档**: https://github.com/Fission-AI/OpenSpec/blob/main/README.md
- **示例**: https://github.com/Fission-AI/OpenSpec/tree/main/examples
- **Issues**: https://github.com/Fission-AI/OpenSpec/issues

### 相关工具

- **Spec Kit**: https://github.com/github/spec-kit
- **Kiro**: https://kiro.dev/
- **BMAD-METHOD**: https://github.com/bmad-code-org/BMAD-METHOD

---

**最后更新**: 2025-11-06
**版本**: v1.0
**作者**: 根据公开文章整理
