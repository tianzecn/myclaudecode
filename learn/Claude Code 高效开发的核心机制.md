# Claude Code 高效开发的核心机制

> 从上下文管理到工作流设计，从老项目改造到性能优化的完整指南

## 目录

1. [上下文管理精髓](#上下文管理精髓)
2. [高效工作流设计](#高效工作流设计)
3. [老项目改造实战](#老项目改造实战)
4. [成本与性能优化](#成本与性能优化)

---

## 上下文管理精髓

### Claude Code记忆系统的真相

很多人对Claude Code的记忆机制存在误解，以为用久了AI就会"学习"你的习惯。但实际情况是：

#### 三层记忆结构

**1. 短期记忆（当前聊天）**
- 200K tokens的对话窗口
- 就像人的工作记忆，能记住当前在干什么
- 到92%会自动触发压缩
- 满了就得压缩或清理

**2. 中期记忆（自动压缩）**
- 自动压缩过程包括4个阶段：
  - **分析阶段**：Claude分析当前会话中的关键信息
  - **总结阶段**：创建结构化的决策和代码更改摘要
  - **替换阶段**：用压缩摘要替换旧消息
  - **继续阶段**：在保留核心上下文的基础上继续工作

**压缩的利弊分析：**
- ✅ 节省token成本
- ✅ 清理无关信息，提升专注度
- ✅ 有时能帮助Claude"重新思考"陷入的错误路径
- ❌ 丢失上下文细节和"叙事线索"
- ❌ 需要1-2分钟处理时间
- ❌ 可能丢失重要的调试信息

**3. 长期记忆（CLAUDE.md文件）**
- ✅ **CLAUDE.md会被自动读取** - 每次启动Claude Code时自动加载
- ❌ **CLAUDE.md不会自动更新** - 需要手动或明确指示才会更新

**为什么设计成手动更新？**
- 防止记忆污染：避免临时讨论或错误决策污染长期记忆
- 用户完全控制：开发者主动决定什么值得长期记住
- 版本控制友好：CLAUDE.md作为代码资产，需要有意识的更改
- 避免上下文噪音：防止无关信息稀释重要的项目知识

### 记忆管理的正确姿势

#### 1. # 键大法

```bash
# 在聊天时随手记录重要信息
# use TypeScript strict mode for this project
# API rate limit is 100 requests per minute
# Docker on M1 needs --platform flag

# Claude会问你存哪个文件
```

#### 2. 主动更新记忆

```bash
# 明确告诉Claude更新记忆
"把我们刚讨论的认证方案加到CLAUDE.md里"
"这个bug的解决方案记一下，别让下次再踩坑"
```

**实战技巧：**
```bash
# 遇到前端页面展示问题，先用playwright mcp查看前端页面和console的日志快速定位具体的问题
```
将这类常见问题的解决方案更新到个人CLAUDE.md后，就不用每次都手动调试了。

#### 3. 定期维护

```bash
# 每周问问Claude
"看看CLAUDE.md里有没有过时的信息需要更新"
"这次会话有什么值得记录的？"
```

### 四层记忆系统

Claude Code的记忆系统实际有四层，优先级从上到下：

```bash
# 1. 企业级（老板说了算）
/Library/Application Support/ClaudeCode/CLAUDE.md

# 2. 个人全局（你的编码习惯）
~/.claude/CLAUDE.md

# 3. 项目级（这个项目的规则）
./CLAUDE.md

# 4. 目录级（特定模块的规则）
./frontend/CLAUDE.md
./backend/CLAUDE.md
```

**就像CSS一样，specificity高的覆盖低的。**

#### 实用的分层策略

**个人全局设置**
```markdown
# ~/.claude/CLAUDE.md
# 我的编码偏好
- 永远用TypeScript严格模式
- 测试优先开发
- 不在commit里用emoji
- 喜欢函数式编程
```

**项目特定设置**
```markdown
# ./CLAUDE.md
# 这个项目的规则
## 技术栈
- Next.js 14 + App Router
- PostgreSQL + Prisma
- Tailwind CSS

## 构建命令
- 开发: pnpm dev
- 测试: pnpm test
- 类型检查: pnpm typecheck
```

**模块级设置**
```markdown
# ./components/CLAUDE.md
# React组件的规则
- 所有组件都要有TypeScript类型
- 用forwardRef处理ref传递
- props解构要有默认值
```

### 上下文管理：70%原则

别等到100%才处理，那时候已经晚了：

```bash
# 看到右下角70%就开始行动
/compact  # 压缩历史，保留重要信息
/clear    # 换任务时彻底清空
```

### 分而治之：一个会话一件事

以前喜欢在一个会话里又改前端又搞后端，结果Claude经常搞混。现在学乖了：

- 前端功能开一个会话
- 后端API开另一个会话
- 调试问题单独开会话

### 方法论的本质

无论是什么AI编程方法论（PRP、6A、PRD、BMAD、Spec、CCPM等），本质都在解决几个核心问题：

#### 1. 上下文管理问题
- **症状**："Claude老是忘记之前说过的话"、"重复问相同问题"
- **本质**：如何在有限的token窗口内维持有效的项目上下文
- **解法**：
  - PRP通过结构化prompt保持上下文连贯性
  - CCPM通过分层记忆管理长期项目知识
  - 6A通过阶段性总结避免上下文丢失

#### 2. 需求表达问题
- **症状**："AI理解不了我想要什么"、"输出总是偏离预期"
- **本质**：如何将模糊的人类想法转化为AI能理解的精确指令
- **解法**：
  - PRD通过产品需求文档标准化需求描述
  - Spec通过技术规格书细化实现细节
  - BMAD通过业务-技术映射消除理解偏差

#### 3. 质量控制问题
- **症状**："AI生成的代码质量不稳定"、"缺乏统一标准"
- **本质**：如何确保AI输出满足项目的质量要求和编码规范
- **解法**：
  - 所有方法论都包含验证机制和质量检查点
  - 通过模板化、检查清单保证输出一致性
  - 建立反馈循环持续优化输出质量

#### 4. 协作效率问题
- **症状**："团队成员用AI的效果差异很大"、"无法复用AI工作成果"
- **本质**：如何标准化AI使用流程，让团队协作更高效
- **解法**：
  - 建立共享的prp库和工作流模板
  - 统一的项目记忆和知识管理
  - 可复现的AI辅助开发流程

---

## 高效工作流设计

### 环境与心法

#### 1. 技术栈选型：只用AI最擅长的

因为AI擅长，意味着社区里相关的高质量代码多，AI训练得更充分，犯错率更低。

**推荐技术栈：**
- 网站/插件前端：Next.js + TypeScript
- 后端服务：Python
- 样式：Tailwind CSS
- 数据库：Supabase (或Postgres)
- 部署：Vercel

**实战经验：**
- 前端框架中，AI改Vue很不好用，但改React就很不错
- 后者在AI编程更通用

#### 2. CLAUDE.md：给AI注入项目"灵魂"

这是启动任何项目前的**必做项**。在项目根目录创建CLAUDE.md：

```markdown
# 项目基础信息：AiReddit 浏览器插件
- 技术栈：Next.js, TypeScript, Tailwind CSS, Chrome Extension Manifest V3
- 核心功能：AI内容本地化、AI回复建议、社区规则解读
- 目标平台：Reddit

# 代码规范
- 组件使用 PascalCase 命名
- API请求函数必须使用 try-catch 包裹

# 注意事项
- 所有与Chrome API交互的代码，必须在 content-script.js 或 background.js 中处理
```

#### 3. 全局提示词 (/memory)：为AI装上"审视之眼"

有时候，不是AI不行，是需求方没想好自己要干嘛导致效率低。

**"自虐式"提示词：**
```
用中文回答。每次都用审视的目光，仔细看我输入的潜在问题，你要指出我的问题，并给出明显在我思考框架之外的建议。如果你觉得我说的太离谱了，你就骂回来，帮我瞬间清醒。
```

它能有效防止提出模糊或不切实际的需求，让AI从被动执行者变成主动的、有批判性思维的协作伙伴。

#### 4. Git版本控制：唯一"后悔药"

Claude Code没有内置版本管理。

**开箱即用实践：**
```bash
git init  # 项目开始时立刻初始化
git commit -m "feat: implement RedNote2Reddit capture button"  # 每完成一个最小可用功能点，立刻提交
git checkout -b feature/ai-reply-suggestion  # 开发新功能时，创建新分支
```

当AI把代码改崩时，`git reset --hard` 能让你一秒回到解放前。

### 核心工作流

#### 1. 交互模式切换 (Shift + Tab)：三板斧应对不同场景

**最高频的快捷键：**
- **规划阶段**：切换到**计划模式 (Plan Mode)**，让AI先出具详细的实现步骤
- **执行阶段**：确认计划后，切换到**自动接受编辑 (Auto-Accept Edits)**，批量生成代码
- **调试阶段**：切换回**一般模式**，进行精细的手动确认和修改

根据任务阶段选择合适的模式，能极大提升效率。

#### 2. 探索-计划 (think 模式)：先谋后动

对于复杂功能，不要直接让它写代码：

```bash
ultrathink hard: 为"发帖建议分析"功能制定一个详细计划。需要分析当前subreddit的热门帖子，提炼主题和标题模式，并结合用户输入的产品名，生成3个不同的发帖角度。将计划保存到 planning/post-suggestion.md。
```

**思考预算控制：**
- `think` - 基础思考
- `think hard` - 更深入思考
- `think harder` - 认真思考
- `ultrathink` - 终极思考模式

强制AI先输出详细计划，确保实现路径正确，避免一开始就走偏。

#### 3. 测试驱动开发 (TDD)

这是**防止AI"自由发挥"的最强手段**。

```javascript
// utils/parser.test.js
test('should extract title and content from RedNote HTML', () => { ... });

// 提示词
我们正在进行TDD。请在 utils/parser.js 中实现 parseRedNoteHTML 函数，让它能通过这个测试。不要修改测试文件。
```

测试用例为AI提供了清晰、客观、唯一的完成标准，极大约束其行为，保证代码质量。

#### 4. 自定义Slash命令：封装重复工作

将高频任务封装成命令：

```markdown
# .claude/commands/create-component.md
---
description: "为AiReddit插件创建一个新的React组件"
---
请在 src/components/ 目录下，创建一个名为 $ARGUMENTS.tsx 的新文件。组件需要使用Tailwind CSS，并导出一个基础的React函数组件。
```

**使用：**
```bash
/create-component ReplySuggestionPanel
```

将多步操作简化为一行指令，极大提升开发效率。

#### 5. Meta-Slash-Commands：让AI帮你写命令

连创建自动化的过程也可以自动化：

```bash
/create-versioned-command 'gh:review-pr "审查并评论GitHub PR" project'
```

#### 6. v0.dev + Claude Code：搞定UI

**组合拳：**
1. 在v0.dev中用自然语言描述："一个侧边栏设置面板，包含一个API Key输入框，和一个模型选择下拉菜单。"
2. 将v0生成的React+Tailwind代码复制出来
3. 交给Claude Code："这是设置面板的UI代码，请为它接入状态管理，并实现保存设置到 chrome.storage 的逻辑。"

**v0.dev擅长UI生成，Claude Code擅长逻辑实现。**

### 精准沟通技巧

#### 1. 精准指令：不说废话，只给有效信息

❌ **模糊指令**：
```
"修复一下回复建议的bug"
```

✅ **详细指令**：
```
修复 ReplySuggestionPanel 组件的bug：当点击'获取回复建议'按钮时，如果API请求失败，现在界面会卡住。请在 catch 块中添加逻辑，将 isLoading 状态设为 false ，并显示一条错误提示。
```

#### 2. 刨根问底：别怕问"白痴"问题

```bash
我是一个完全不懂Chrome插件开发的后端程序员。请用一个寄快递的例子，解释 background.js 和 content-script.js 之间为什么要用 sendMessage 通信，以及回调函数扮演了什么角色。
```

不要假装你看懂了。把AI当成一个耐心的老师，反复追问，直到你真正理解为止。

#### 3. 上下文管理命令

```bash
/clear    # 完成功能后，准备开始新任务前
/compact  # 压缩历史，保留重要信息
/memory   # 查看加载的记忆文件
```

#### 4. 多种数据输入方式

```bash
cat error.log | claude "分析错误"  # 管道输入，处理日志
@/src/utils/api.js                # @文件，让AI阅读特定文件
/path/to/design.png               # 输入图片路径，让AI看UI设计稿
```

#### 5. 回滚和历史

```bash
回滚    # 一键撤销AI的"骚操作"
ESC x 2 # 快速调出并重新编辑之前的指令
```

### 扩展与自动化

#### 1. MCP集成：扩展能力

```bash
# context7 - 获取最新文档
"请使用 context7 ，告诉我最新版 react-query 中 useQuery 的 staleTime 和 cacheTime 选项有什么区别。"

# puppeteer - 浏览器操作
"使用 puppeteer 打开这个Reddit帖子，截图整个评论区，分析评论的情绪倾向。"
```

MCP让Claude Code突破自身知识库限制，能力边界极大扩展。

#### 2. Bash模式 (!)：简单命令无需动脑

```bash
!ls -l  # 直接在bash中执行，速度快，不花钱
```

对于简单的shell命令，使用 `!` 前缀无需经过大模型思考。

#### 3. 无头模式 (claude -p "...")：CI/CD集成

```json
// package.json
"scripts": {
  "lint:claude": "claude -p '检查所有暂存文件，报告不符合ESLint规范的地方。'"
}
```

无头模式让Claude Code可以作为自动化脚本的一部分被调用。

#### 4. Pre-Commit Hooks：提交前的最后一道防线

在 `.git/hooks/pre-commit` 中加入脚本，让Claude Code在每次提交前自动检查代码。

#### 5. Claude Code Hooks：生命周期内的精细控制

```json
// .claude/settings.json
[[hooks]]
event = "PostToolUse"
[hooks.matcher]
tool_name = "edit_file"
file_paths = ["src/**/*.tsx"]
command = "prettier --write $CLAUDE_FILE_PATHS"
```

Hooks提供了在Claude Code执行流程中注入自定义逻辑的能力。

### 架构与重构

#### 1. Roo Code + Claude Code：架构先行

**分工合作：**
1. 在VSCode中安装Roo Code插件，选择 Architect 模式
2. 与Roo Code对话，明确模块划分
3. 将Roo Code生成的架构图和Markdown文档，发给Claude Code进行编码

**Roo Code擅长架构设计，Claude Code擅长代码实现。**

#### 2. 持续重构：别让"代码屎山"埋了你

```bash
请分析 content-script.js 文件。它现在同时处理了DOM操作、API请求和状态缓存，逻辑混乱。请提出一个重构方案，将其拆分为三个独立的模块：dom-controller.js, api-handler.js, state-manager.js。先给我重构计划，不要直接动手。
```

AI在反复修改后容易产生"代码熵增"。定期、主动地让AI进行重构，是保持代码库健康的必要操作。

#### 3. 复杂逻辑拆分为微服务

当单个文件或模块的逻辑复杂度超出AI能稳定处理的范畴时，将其拆分为独立的、通过HTTP通信的服务，是解决"AI幻觉"的根本手段。

#### 4. 学习设计模式和代码简洁之道

```bash
你刚才为我生成了api-handler.js。请分析一下，这个实现符合哪些设计模式（如工厂模式、单例模式）？是否遵循了《代码简洁之道》中的单一职责原则？
```

**你对软件工程的理解深度，决定了AI编程效果的上限。**

### 协作技巧

#### 1. Code Review模式：双Claude协作

开两个终端窗口：

```bash
# 终端1
claude "实现AI回复建议的UI界面"

# 终端2
claude "请审查刚才实现的ReplySuggestionPanel.tsx组件，检查其代码风格和可复用性。"
```

利用AI的"左右互搏"，从不同角度发现代码中的潜在问题。

#### 2. 并行开发 (git worktree)：多个AI同时干活

```bash
git worktree add -b feature/ui-polish ../aireddit-ui
git worktree add -b feature/performance ../aireddit-perf
# 分别在两个新目录中启动Claude Code
```

git worktree为并行开发提供了完美的、相互隔离的环境，极大提升开发吞吐量。

#### 3. IDE集成：在熟悉的环境中实践

将Claude Code集成在Cursor或VS Code的终端里，继续使用IDE原生功能，取长补短。

#### 4. CLI快捷键（Emacs模式）

```bash
Ctrl + A / Ctrl + E  # 跳转行首/行尾
Ctrl + U / Ctrl + K  # 删除整行/行尾内容
```

---

## 老项目改造实战

### 破除误区

**很多人以为Claude Code只适合从零开始的新项目。大错特错！**

真实情况是：90%的开发工作都在维护和优化已有项目。一个成熟的业务系统，可能有着：

- 10万+行历史代码
- 5年以上的技术债务
- 3代程序员的编码风格
- 文档缺失或过时
- 复杂的业务逻辑纠缠

**这恰恰是Claude Code最闪光的舞台。**

### 五大经典场景

#### 场景一：接手陌生项目，快速理解代码架构

**传统方式**：花2-3周时间啃代码，画架构图，理解业务逻辑

**Claude Code方式**：15分钟完成项目全景分析

```bash
# 快速理解项目结构
claude "@. 分析这个项目的整体架构，包括：
1. 技术栈和依赖关系
2. 核心业务模块
3. 数据流向
4. 潜在的技术债务
5. 改进建议"

# 理解特定模块
claude "@src/payment/ 这个支付模块的业务逻辑是什么？有哪些风险点？"

# 分析数据库设计
claude "@migrations/ @models/ 分析数据库设计，找出可能的性能瓶颈"
```

**真实效果**：一位开发者用Claude Code接手了一个6万行的电商系统，原本需要1个月才能熟悉的项目，3天就能开始正常开发。

#### 场景二：老代码重构，精准定位改进点

**最常见的痛点**：明知道代码有问题，但不知道从哪里开始改。

```bash
# 代码质量全面体检
claude "/review 全面分析这个项目的代码质量，按优先级列出需要重构的地方"

# 性能瓶颈分析
claude "@src/api/ 找出这些API接口的性能问题，给出具体优化方案"

# 安全漏洞扫描
claude "@src/ 检查代码中的安全隐患，特别是SQL注入、XSS等常见问题"

# 技术债务评估
claude "@. 评估技术债务，哪些地方急需重构？给出重构路线图"
```

**创建专业重构子代理**：

```markdown
# .claude/agents/refactor-expert.md
---
name: refactor-expert
description: 代码重构专家，专门处理老项目优化
tools: Read, Edit, Bash, Grep, Glob
---

你是资深重构专家，专门处理遗留系统优化：

重构策略：
1. 识别代码异味和反模式
2. 评估重构风险和收益
3. 提供渐进式重构方案
4. 确保向后兼容性
5. 生成重构前后的测试用例

每次重构都要：
- 保持功能不变
- 提供回滚方案
- 添加必要的测试
- 文档化改动原因
```

#### 场景三：新需求开发，无缝融入现有架构

**核心挑战**：如何在不破坏现有系统的前提下，优雅地添加新功能？

```bash
# 需求分析和架构设计
claude "@src/ 现在要添加一个用户积分系统，分析现有架构，设计最佳的集成方案"

# 影响面评估
claude "@src/user/ @src/order/ 新增积分功能会影响哪些现有模块？需要哪些改动？"

# 渐进式开发计划
claude "制定积分系统的开发计划，要求：
1. 不影响现有功能
2. 可以分阶段上线
3. 易于测试和回滚
4. 符合现有代码规范"
```

**Git Worktrees的威力**：

```bash
# 创建新功能分支的独立工作空间
git worktree add ../project-points-system -b feature/points-system main
cd ../project-points-system

# 在独立环境中开发，Claude保持完整上下文
claude "基于现有架构开发积分系统，确保与现有代码风格一致"

# 主分支的开发工作完全不受影响
cd ../main-project
claude "继续优化用户注册流程"
```

#### 场景四：Bug修复，快速定位根本原因

**生产环境报错**：订单支付成功但状态未更新

```bash
# 问题定位
claude "@src/payment/ @src/order/ @logs/ 分析支付成功但订单状态未更新的问题，可能的原因有哪些？"

# 代码路径追踪
claude "追踪从支付回调到订单状态更新的完整代码路径，找出可能的断点"

# 生成调试方案
claude "为这个bug创建详细的调试方案，包括：
1. 日志收集策略
2. 本地复现步骤
3. 修复后的验证方法
4. 防止类似问题的改进建议"
```

**调试专家子代理自动介入**：

```bash
# 自动触发调试流程
claude "生产环境出现订单状态异常，需要紧急修复"
# Claude会自动调用debugger子代理，进行系统化的问题诊断
```

#### 场景五：性能优化，数据驱动的改进

**业务增长，系统变慢**：

```bash
# 性能瓶颈分析
claude "@src/api/ @monitoring/ 根据监控数据，分析API响应时间变慢的原因"

# 数据库查询优化
claude "@models/ @queries/ 找出慢查询，提供优化方案，包括索引建议"

# 前端性能优化
claude "@frontend/ 分析前端性能问题，提供bundle优化和加载优化方案"

# 缓存策略设计
claude "为这个电商系统设计多层缓存策略，提升响应速度"
```

**性能优化专家子代理**：

```markdown
# .claude/agents/performance-optimizer.md
---
name: performance-optimizer
description: 性能优化专家，专门处理系统性能问题
---

我是性能优化专家，专注于：

优化维度：
- 数据库查询优化（索引、查询重写）
- API响应时间优化
- 前端加载性能
- 内存使用优化
- 并发处理能力

每次优化都提供：
- 性能基线测试
- 优化前后对比
- 风险评估
- 监控指标建议
```

### 真实改造案例

**项目背景**：5年历史的内容管理系统，50万用户，代码混乱，性能下降

#### 第1周：项目全面体检

```bash
claude "@. 全面分析这个CMS系统，给出健康报告和改进路线图"
```

**发现问题**：
- 数据库查询N+1问题严重
- 前端资源未压缩，首屏加载慢
- 缓存策略缺失
- 代码重复率高达40%

#### 第2-3周：核心性能优化

```bash
# 数据库优化
claude "@models/ 优化所有模型的查询关系，解决N+1问题"

# 前端优化
claude "@frontend/ 优化打包配置，实现代码分割和懒加载"

# 缓存层添加
claude "为这个CMS添加Redis缓存层，设计合理的缓存策略"
```

#### 第4-5周：新功能开发

```bash
# 使用worktree并行开发
git worktree add ../cms-search -b feature/elasticsearch
git worktree add ../cms-api -b feature/api-v2

# 两个功能同时开发，互不影响
```

#### 第6周：全面测试和上线

```bash
claude "设计完整的测试策略，确保新功能不影响现有业务"
```

**改造结果**：
- 页面加载速度提升70%
- 服务器响应时间从800ms降至200ms
- 代码重复率降至15%
- 新增全文搜索功能
- 团队开发效率提升3倍

### 最佳实践

#### 1. 建立项目知识库

```bash
# 创建项目记忆文件
claude "/memory 创建这个项目的知识库，包括：
- 核心业务逻辑
- 技术架构决策
- 常见问题和解决方案
- 部署和运维注意事项"
```

#### 2. 设置专项子代理

为老项目的常见任务创建专门的AI助手：

- **legacy-code-expert**：专门理解和维护老代码
- **migration-specialist**：处理数据迁移和版本升级
- **hotfix-manager**：快速修复生产问题

#### 3. 配置安全权限

老项目通常更敏感，需要更严格的权限控制：

```json
{
  "permissions": {
    "ask": ["Edit(*)", "Bash(deploy:*)"],
    "deny": [
      "Read(./.env*)",
      "Read(./config/production*)",
      "Bash(rm:*)",
      "Bash(DROP:*)"
    ]
  }
}
```

#### 4. 利用MCP集成监控系统

```bash
# 连接错误监控
claude mcp add sentry https://mcp.sentry.dev/mcp

# 连接性能监控
claude mcp add datadog npx @datadog/mcp-server

# 直接在Claude中查看生产问题
claude "查看最近24小时的错误报告，分析根本原因"
```

### 突破性功能

#### 1. 智能代码分析器

```bash
# 针对特定功能点的深度分析
claude "@src/checkout/ 这个结算流程有性能问题，帮我：
1. 分析每个步骤的耗时
2. 找出可优化的点
3. 提供具体的改进代码
4. 评估改进的风险"
```

#### 2. 渐进式重构助手

```bash
# 安全的重构策略
claude "将@src/user/UserService.js这个1000行的类，安全地重构为多个小类：
1. 保持现有API不变
2. 提供详细的重构步骤
3. 每步都可以独立测试
4. 提供回滚方案"
```

#### 3. 依赖关系分析器

```bash
# 修改前的影响面评估
claude "如果我要修改@src/models/User.js，会影响哪些文件？
给出完整的依赖关系图和风险评估"
```

### 立即行动

#### 第一步：项目健康体检（5分钟）

```bash
claude "@. 给这个项目做全面体检，列出前5个最需要改进的地方"
```

#### 第二步：创建项目记忆（10分钟）

```bash
claude "/init 为这个项目创建CLAUDE.md知识库"
```

#### 第三步：设置专项子代理（15分钟）

复制上面的重构专家和性能优化专家配置

#### 第四步：选择一个小功能试水（30分钟）

```bash
claude "选择一个低风险的小功能进行优化，作为Claude Code的试点"
```

---

## 成本与性能优化

### 会话管理策略

#### 1. 会话开始的ritual

```bash
# 1. 检查加载的记忆文件
/memory

# 2. 快速回顾项目状态
"简单说说这个项目现在的状态"

# 3. 明确今天要干什么
"今天我想实现用户登录功能，包括JWT认证"
```

#### 2. 会话结束的习惯

```bash
# 1. 保存重要决策
"把今天讨论的认证流程记到CLAUDE.md"

# 2. 总结问题和解决方案
"这次遇到的CORS问题和解决方案记一下"

# 3. 规划下次继续的点
"下次我们从哪里继续？"
```

#### 3. 踩坑记录

每次解决一个难题，都要记下来：

```bash
# 立即记录解决方案
# M1 Mac Docker build需要 --platform=linux/amd64
# PostgreSQL连接池大小设为20最优
# Next.js middleware在/api路由前执行
```

### 高级技巧

#### 1. 子代理分工合作

```bash
/agents  # 创建专门的代理

# 代码审查官：专门挑刺
code-reviewer.md - 找bug、查安全漏洞

# 测试工程师：写测试用例
test-engineer.md - 测试覆盖率、边界案例

# 文档管理员：维护文档
doc-writer.md - API文档、使用说明
```

#### 2. MCP扩展能力

别只用基础功能，Claude Code支持很多插件：

```json
{
  "mcpServers": {
    "github": "GitHub集成，自动PR review",
    "postgres": "数据库直接查询",
    "puppeteer": "浏览器自动化测试"
  }
}
```

#### 3. 成本控制

Token不是免费的，省着点用：

- **主动压缩**：70%就压缩，别等自动
- **外部文档**：详细规范放docs/里，按需引用
- **分离关注点**：不同功能分开会话

### 利用thinking模式

Claude有个隐藏技能，不同的关键词能触发不同强度的思考：

```bash
"think"          # 基础思考
"think hard"     # 更深入思考
"think harder"   # 认真思考
"ultrathink"     # 终极思考模式
```

有复杂问题就让它多想想，别急。

### 版本升级

定期运行升级命令，确保你用的是最新版的Claude Code：

```bash
npm install -g claude-code
```

---

## 总结

核心就一句话：**你必须成为一个优秀的架构师和项目经理，才能把Claude Code这个能力超群但毫无经验的"实习生"，调教成你最得力的编程伙伴。**

### 四个关键要点

1. **理解记忆机制**：掌握三层记忆系统，主动管理CLAUDE.md
2. **优化工作流程**：善用Plan Mode、TDD、自定义命令
3. **重视老项目**：90%的工作在维护，Claude Code是老项目救星
4. **控制成本**：70%原则、分离关注点、主动压缩

### 行动建议

1. 从一个小功能开始实践
2. 建立项目知识库（CLAUDE.md）
3. 创建专项子代理
4. 持续优化工作流

**老项目 + Claude Code = 开发效率翻10倍！** 🚀

---

## 参考资料

- Claude Code记忆系统深度解析：从上下文压缩到高效开发实践
- 30个进阶技巧彻底榨干Claude Code价值
- Claude Code：不只是新项目神器，更是老项目救星
