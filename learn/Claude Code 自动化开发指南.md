# Claude Code 自动化开发指南

> 从Slash Command工作流到Agent团队，从自动化部署到生产力工具集成的完整指南

## 目录


1. [Slash Command工作流编排](#slash-command%E5%B7%A5%E4%BD%9C%E6%B5%81%E7%BC%96%E6%8E%92)
2. [Agent系统与专业角色](#agent%E7%B3%BB%E7%BB%9F%E4%B8%8E%E4%B8%93%E4%B8%9A%E8%A7%92%E8%89%B2)
3. [自动化集成与部署](#%E8%87%AA%E5%8A%A8%E5%8C%96%E9%9B%86%E6%88%90%E4%B8%8E%E9%83%A8%E7%BD%B2)
4. [生产力工具集成](#%E7%94%9F%E4%BA%A7%E5%8A%9B%E5%B7%A5%E5%85%B7%E9%9B%86%E6%88%90)


---

## Slash Command工作流编排

### 为什么需要Slash Command？

想象一下这样的场景：你刚写完一段关键代码，需要进行全面审查：代码质量、安全漏洞、性能瓶颈、测试覆盖等等，每一项都需要专业的Agent帮你完成。

如果每次都要手动输入：

```bash
首先使用 code-reviewer subagent 检查我最近的代码，针对需要改进的内容，使用 optimizer subagent 修复代码
```

**太麻烦了！**

这就是Slash Commands的价值——将复杂的多步骤工作流封装成一个简单的命令。

### Agent的调用方式

在使用Slash Commands之前，先了解Agent的两种调用方式：

#### 1. 自动委派

当你的提示词包含了一些Agent的描述，或者执行到了某些步骤，就会根据情况自动去调用。

#### 2. 显式调用

```bash
使用 code-reviewer subagent 检查的我最近的代码
```

直接明确指定要调用哪个Agent。

### 什么是Slash Commands？

输入 `/` 就可以看到一堆命令列表。系统内置了很多Slash Commands，但更强大的是：**Claude Code还可以自定义斜杠命令**。

### 自定义斜杠命令

每一个斜杠命令都是一个markdown文件，存放在：

* **全局**：`~/.claude/commands/`
* **项目级别**：`.claude/commands/`

#### 语法

```bash
/<command-name> [arguments]
```

* `<command-name>`：markdown的文件名
* `[arguments]`：可选参数，可以是一句提示词
* `$ARGUMENTS`：在命令中接收参数的占位符

#### 文件结构

```markdown
---
allowed-tools: Bash(npm build:*), ...
argument-hint: 检查XXX
description: XXX
model: claude-4-sonnet
---

## Context

- 当前的 git status: !`git status`
- ...

## Task

1. 根据 $ARGUMENTS XXX
2. 对比 @src/xxx.ts XXX
3. 深度思考XXX
```

#### 关键要素解析

**1. 元数据（---包裹部分）**

* `allowed-tools`：该命令可以使用哪些工具
* `argument-hint`：所需的参数提示
* `description`：命令的一句话描述
* `model`：可以自定义模型，默认使用当前对话的模型

**2. 执行命令**

语法：`!`command\`\`

执行斜杠命令时，会先执行这些命令并将输出作为上下文。

**3. 参数引用**

`$ARGUMENTS`：使用斜杠命令时传入的参数

**4. 文件引用**

`@path`：引用指定文件，一般用于项目中的斜杠命令

**5. 思考模式**

当提示词包含 `深度思考XXX` 或 `Think deeply about XXX`，Claude Code会进行多步骤的推理。

### 实战案例：全面代码审查命令

#### 预期使用方式

```bash
/full-review 检查身份验证模块
```

然后Claude Code就会全面检查这部分代码。

#### 创建命令文件

在 `~/.claude/commands/` 目录中创建 `full-review.md`：

```markdown
---
description: 全面的代码审查
---

执行多个专业的 subagent 进行全面审查，并明确调用任务工具：

[扩展思考：该工作流程通过协调多个专业审查代理，实施彻底的多角度审查。每个 agent 负责检查不同方面，最终将结果整合为统一的行动计划。]

使用任务工具与专业的 subagent 并行执行审查：

## 1. 代码质量检查

- 使用 subagent_type="code-reviewer"
- 提示词: "对以下代码进行质量与可维护性审查：$ARGUMENTS。检查代码异味、可读性、文档完整性及最佳实践遵循情况"。
- 重点：代码整洁原则、SOLID 原则、DRY 原则、命名规范

## 2. 安全审查

- 使用 subagent_type="security-auditor"
- 提示词: "对以下内容进行安全审计：$ARGUMENTS。检查漏洞、OWASP合规性、认证问题及数据保护措施"。
- 重点: 注入风险、身份验证、授权机制、数据加密

## 3. 架构评审

- 使用 subagent_type="architect-reviewer"
- 提示词: "审查以下架构设计与模式：$ARGUMENTS。评估其可扩展性、可维护性及对架构原则的遵循程度。"。
- 重点: 服务边界、耦合性、内聚性、设计模式

## 4. 性能分析

- 使用 subagent_type="performance-engineer"
- 提示词: "分析以下内容的性能特征：$ARGUMENTS。识别瓶颈、资源使用情况以及优化机会。"。
- 重点: 响应时间，内存使用情况，数据库查询，缓存

## 5. 测试覆盖率评估

- 使用 subagent_type="test-automator"
- 提示词: "评估以下内容的测试覆盖范围与质量：$ARGUMENTS。检查单元测试、集成测试，并识别测试覆盖中的空白。"。
- 重点: 覆盖率指标，测试质量，边界情况，测试可维护性

## 合并报告结构

将所有反馈整理成一份统一报告：

- **关键问题** (必须修复): 安全漏洞、功能故障、架构缺陷
- **推荐** (应该修复): 性能瓶颈、代码质量问题、测试缺失
- **建议** (建议修复): 重构机会，文档改进
- **正面反馈** (哪方面做得好): 良好实践以维护和复制

目标: $ARGUMENTS
```

就这样，一份对代码进行全面分析的自定义斜杠命令就完成了，它集合了5个Agent共同对内容进行审查。

### 更多资源

**wshobson/commands 仓库**：预设了一套适用于Claude Code的Slash Commands集合，有丰富的针对复杂任务的多agent编排。

GitHub地址：https://github.com/wshobson/commands

### 高级玩法

这种工作流可以做得更复杂、更智能。你甚至可以在睡觉前启动一个完整的项目审查流程，第二天醒来就能看到详细的分析报告。充分利用Claude Code的按时间段限流，**让AI持续为你打工**。


---

## Agent系统与专业角色

### Agent是什么？

Agent（子智能体）是Claude Code中的专业助手，每个Agent都有特定的领域知识和技能。就像一个开发团队，有前端专家、后端专家、安全专家、性能优化专家等。

### 世界顶级Agent仓库

#### wshobson/agents

**GitHub地址**：https://github.com/wshobson/agents

* ⭐ 8800+ Stars（项目只有三周历史）
* 📦 73个生产环境可用的Agent
* ✅ Production-ready，质量有保证

### 一键安装所有Agent

不需要手动一个个安装，让Claude Code帮你搞定：

```bash
https://github.com/wshobson/agents 把这些Agents 全部安装到我的 ClaudeCodeCLI里, 跳过重复的
```

Claude Code会自动帮你安装全部73个Agent！

### 正常使用方法

**错误做法**：一股脑调用所有Agent，浪费时间和Token

**正确做法**：先让Claude Code判断需要哪些专业对口的Agent

```bash
我想要分析我们当前项目的算法性能,你建议我们使用哪些Agents来做?先和我讨论Agents调度方案,和我确认后,再执行.
```

Claude Code会给出建议，比如对于"算法性能优化"任务，它可能推荐：


1. **performance-engineer** - 性能分析
2. **code-reviewer** - 代码质量检查
3. **algorithm-specialist** - 算法优化
4. **profiler** - 性能剖析
5. **memory-optimizer** - 内存优化
6. **database-optimizer** - 数据库查询优化
7. **test-automator** - 性能测试

确认后，它会开始调度这些Agent并行工作。

### 实战案例

#### 案例1：全面代码审查

```bash
用尽量多的agent 检查我们的项目,只检查,不修改代码
```

**结果**：

* Token消耗：300K+
* 总时长：30分钟
* 调用Agent数量：数十个

#### 案例2：复杂项目分析

```bash
我想要分析我们当前项目的算法性能
```

**结果**：

* Token消耗：400K+
* 总时长：40+分钟
* 调用Agent数量：数十个

### 多任务并发

**重要技巧**：可以同时开多个Terminal，开多任务！

```bash
# Terminal 1
claude "全面审查代码质量"

# Terminal 2
claude "优化性能瓶颈"

# Terminal 3
claude "生成API文档"
```

同时安排多个需要耗时很长的复杂任务，然后放心地睡觉去吧～

**Claude Code并不需要睡觉！** 😄

### SuperClaude框架

**GitHub地址**：https://github.com/SuperClaude-Org/SuperClaude_Framework

⭐ **16000+ Stars**

专为Claude Code设计的增强框架，提供：

* 25种快捷命令
* 15个专业智能体
* 7种工作模式
* 8个MCP服务器

#### 15个专业Agent

SuperClaude配备了15个专业Agent，都具备领域专业知识：


 1. **前端开发专家** - UI/UX实现
 2. **后端架构师** - 服务端设计
 3. **安全审计员** - 安全漏洞扫描
 4. **性能优化师** - 性能分析与优化
 5. **测试工程师** - 测试用例编写
 6. **数据库专家** - SQL优化
 7. **DevOps工程师** - 部署与CI/CD
 8. **代码审查员** - 代码质量检查
 9. **文档编写者** - 技术文档生成
10. **API设计师** - RESTful API设计
11. **算法专家** - 算法优化
12. **移动开发专家** - iOS/Android开发
13. **机器学习工程师** - ML模型训练
14. **区块链专家** - 智能合约开发
15. **云架构师** - 云原生架构设计

#### 7种工作模式

就像给AI助手**切换不同的工作人格**：


1. **头脑风暴模式** - 激发创意
2. **商业面板模式** - 多角度战略分析
3. **任务协调模式** - 高效调度工具
4. **高效协调模式** - 节省token消耗
5. **任务管理模式** - 系统化推进进度
6. **深度思考模式** - 复杂问题分析
7. **快速执行模式** - 快速原型开发

### 手把手打造贴身助手

#### 第一步：设计助手团队

在文件中创建一个后缀名为".md"的文件，描述你想要的Agent：

```markdown
# 我的开发团队

## 前端开发专家
负责React/Vue组件开发，精通TypeScript和Tailwind CSS

## 后端架构师
精通Node.js/Python，熟悉微服务架构和数据库设计

## DevOps工程师
负责CI/CD、Docker容器化和云部署

## 测试工程师
编写单元测试、集成测试和E2E测试
```

你也可以让AI帮你写提示词。

#### 第二步：配置MCP

推荐去**Smithery**寻找你想要的MCP：


1. 进去挑选符合的MCP
2. 获取API Key
3. 回到命令行，粘贴运行即可

#### 第三步：生成Agent

```bash
# 输入命令
/agent

# 选择 "Create new agent"

# 选择作用域
1. 项目使用
2. 全局使用

# 输入Agent描述
把你.md中的一个助手描述放进去

# 选择MCP工具
默认全部，也可以按需选择

# 选择模型
根据个人喜好
```

重复这个过程，配置不同的助手。

#### 第四步：测试Agent

```bash
# 初始化
/init

# 这一步让总助手基于子助手写一个助手的规章制度
```

现在只需输入关键字，即可触发对应的Agent！


---

## 自动化集成与部署

### 无头模式 (claude -p "...")

将Claude Code集成到CI/CD流程：

```json
// package.json
"scripts": {
  "lint:claude": "claude -p '检查所有暂存文件，报告不符合ESLint规范的地方。'",
  "test:claude": "claude -p '运行所有测试，生成覆盖率报告'",
  "deploy:check": "claude -p '检查部署前的所有检查项'"
}
```

### Pre-Commit Hooks

在 `.git/hooks/pre-commit` 中加入脚本：

```bash
#!/bin/bash

# 让Claude Code检查代码
claude -p "检查暂存的代码，报告任何问题"

# 如果发现问题，阻止提交
if [ $? -ne 0 ]; then
  echo "代码检查失败，请修复后再提交"
  exit 1
fi
```

### Claude Code Hooks

更精细的生命周期控制：

```json
// .claude/settings.json
{
  "hooks": [
    {
      "event": "PostToolUse",
      "matcher": {
        "tool_name": "edit_file",
        "file_paths": ["src/**/*.tsx"]
      },
      "command": "prettier --write $CLAUDE_FILE_PATHS"
    },
    {
      "event": "PreCommit",
      "command": "npm run lint"
    }
  ]
}
```

Hooks提供了**在Claude Code执行流程中注入自定义逻辑的能力**，实现更深层次的自动化。

### 并行开发 (git worktree)

```bash
# 创建多个独立工作空间
git worktree add -b feature/ui-polish ../project-ui
git worktree add -b feature/performance ../project-perf
git worktree add -b feature/api-v2 ../project-api

# 在每个工作空间启动Claude Code
cd ../project-ui && claude "开发UI美化功能"
cd ../project-perf && claude "优化性能瓶颈"
cd ../project-api && claude "实现API v2"
```

多个Claude Code实例并行工作，**极大提升开发吞吐量**。

### 持续集成示例

#### GitHub Actions集成

```yaml
# .github/workflows/claude-review.yml
name: Claude Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          claude -p "审查这个PR的代码，提供详细的反馈" > review.md

      - name: Post Review
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: review
            });
```

### 自动化工作流最佳实践

#### 1. 睡前任务调度

```bash
# 启动多个长时间任务
claude "全面重构用户认证模块" &
claude "优化数据库查询性能" &
claude "生成完整的API文档" &
claude "编写E2E测试用例" &

# 第二天醒来查看结果
```

#### 2. 成本控制

```bash
# 设置Token限制
claude --max-tokens 100000 "执行这个任务"

# 使用更便宜的模型
claude --model haiku "简单的代码格式化任务"
```

#### 3. 任务队列管理

创建一个任务队列文件：

```bash
# tasks.txt
全面代码审查
性能优化
安全漏洞扫描
生成API文档
编写测试用例
```

然后用脚本批量执行：

```bash
#!/bin/bash
while IFS= read -r task; do
  claude "$task" > "results/$task.md"
done < tasks.txt
```


---

## 生产力工具集成

### 8个强大的MCP服务器

SuperClaude集成的8个MCP，让Claude Code的能力边界极大扩展：

#### 1. Context7：最新文档查询

**功能**：拉取最新、最准确的官方文档和代码示例

```bash
"使用 context7 告诉我最新版 react-query 中 useQuery 的 staleTime 和 cacheTime 选项有什么区别。"
```

**为什么重要**：

* Claude的知识有截止日期
* Context7确保使用最新版本的文档
* 大大提高代码的可用性和正确性

#### 2. Sequential：复杂分析

**功能**：结构化、渐进式思考

```bash
"使用 sequential 分析这个复杂的架构问题"
```

**特点**：

* 把思考过程拆分成清晰的步骤
* 跟踪思考过程的进展
* 生成思路摘要
* 适合复杂问题分析

#### 3. Magic MCP：UI组件生成

**功能**：访问和使用Magic UI组件库

```bash
"使用 magic 创建一个带动画效果的登录表单"
```

**优势**：

* 精美的动画和交互组件
* 开箱即用的UI组件
* 节省UI开发时间

#### 4. Playwright：浏览器自动化

**功能**：操纵浏览器进行自动化测试

```bash
"使用 playwright 打开这个网站，测试登录流程，截图并分析"
```

**用途**：

* E2E测试
* UI截图对比
* 自动化交互测试
* 性能监控

#### 5. Morphllm：批量转换

**功能**：精准的原地修改和批量转换

```bash
"使用 morphllm 将所有组件从class组件改为function组件"
```

**适用场景**：

* 跨文件的重构
* 批量重命名
* 逻辑调整
* 代码风格统一

#### 6. Serena：会话持久化

**功能**：会话持久化与项目上下文管理

```bash
"使用 serena 保存这个设计决策"
```

**价值**：

* 创建并调用记忆
* 保存项目设计、重构计划
* 多轮交互保持连贯性
* 真正的协同开发体验

#### 7. Tavily：深度网页搜索

**功能**：深入、快速地抓取和分析网络信息

```bash
"使用 tavily 研究最新的React 19特性"
```

**特点**：

* 深度研究
* 高度相关的结果
* 快速抓取
* 智能分析

#### 8. Chrome DevTools：性能分析

**功能**：网页开发与性能分析

```bash
"使用 chrome-devtools 分析这个页面的性能瓶颈"
```

**用途**：

* 审查DOM元素
* 调试JavaScript
* 分析网络请求
* 性能记录和评估
* 识别内存泄漏
* 优化加载速度

### v0.dev + Claude Code组合

**v0.dev擅长UI生成，Claude Code擅长逻辑实现。**

```bash
# 1. 在v0.dev中生成UI
"一个侧边栏设置面板，包含一个API Key输入框，和一个模型选择下拉菜单。"

# 2. 将代码复制到Claude Code
"这是设置面板的UI代码，请为它接入状态管理，并实现保存设置到 chrome.storage 的逻辑。"
```

### Roo Code + Claude Code组合

**Roo Code擅长架构设计，Claude Code擅长代码实现。**

```bash
# 1. 在VSCode中安装Roo Code插件，选择 Architect 模式
# 2. 与Roo Code对话，明确模块划分
# 3. 将Roo Code生成的架构图和Markdown文档，发给Claude Code
"根据这个架构设计，实现用户认证模块"
```

### IDE集成

将Claude Code集成在Cursor或VS Code的终端里：

```bash
# 在VSCode终端中
claude "重构这个组件"

# 继续使用IDE的原生功能
# - 文件管理
# - 代码高亮
# - 调试工具
```

取长补短，最佳组合。

### Bash模式 (!)

对于简单命令，无需经过大模型：

```bash
!ls -l              # 列出文件
!git status         # 查看git状态
!npm test           # 运行测试
```

**优势**：

* 速度快
* 不消耗Token
* 适合简单命令

### MCP服务器推荐列表

#### 开发工具类

* **Context7** - 最新文档查询
* **Sequential** - 复杂分析
* **Playwright** - 浏览器自动化
* **Chrome DevTools** - 性能分析

#### 代码处理类

* **Morphllm** - 批量转换
* **Serena** - 会话持久化
* **Magic** - UI组件生成

#### 信息检索类

* **Tavily** - 深度网页搜索
* **DeepWiki** - GitHub仓库文档
* **Exa AI** - 智能搜索

#### 数据库类

* **PostgreSQL** - 数据库查询
* **SQLite** - 轻量级数据库
* **Redis** - 缓存操作

#### 云服务类

* **AWS** - AWS资源管理
* **Azure** - Azure资源管理
* **Google Cloud** - GCP资源管理

### 安装SuperClaude

SuperClaude支持多种安装方式：

```bash
# 使用 pipx（推荐）
pipx install superclaude

# 使用 pip
pip install superclaude

# 使用 npm
npm install -g superclaude
```

**注意**：如果之前安装过V3版本，需要先卸载旧版再安装V4版本。


---

## 总结

### 四大核心能力


1. **Slash Command工作流编排**
   * 将复杂任务封装成简单命令
   * 支持多Agent协同
   * 可复用的工作流
2. **Agent系统与专业角色**
   * 73个生产级Agent
   * 15个专业领域智能体
   * 7种工作模式
   * 智能调度与并行执行
3. **自动化集成与部署**
   * CI/CD集成
   * Pre-commit hooks
   * Git worktree并行开发
   * 无头模式自动化
4. **生产力工具集成**
   * 8个强大的MCP服务器
   * IDE集成
   * v0.dev + Roo Code组合
   * 丰富的工具生态

### 最佳实践

#### 1. 睡前任务调度

利用Claude Code不需要睡觉的特点，睡前启动长时间任务，第二天醒来查看结果。

#### 2. 多任务并发

使用git worktree或多个Terminal，同时运行多个Claude Code实例。

#### 3. 智能Agent调度

不要一股脑调用所有Agent，让Claude Code先判断需要哪些专业对口的Agent。

#### 4. 成本控制

* 使用Bash模式执行简单命令
* 为不同任务选择合适的模型
* 设置Token限制
* 主动压缩上下文

#### 5. 工作流封装

将高频、复杂的任务封装成Slash Command，提升效率。

### 行动建议


1. **安装Agent库**

   ```bash
   https://github.com/wshobson/agents 把这些Agents 全部安装到我的 ClaudeCodeCLI里
   ```
2. **创建自定义命令**
   * 从一个简单的命令开始
   * 逐步完善你的命令库
   * 参考wshobson/commands仓库
3. **配置MCP服务器**
   * 安装Context7、Playwright等核心MCP
   * 根据需求添加更多MCP
4. **建立自动化流程**
   * 配置Pre-commit hooks
   * 集成到CI/CD
   * 设置定时任务

**让AI持续为你打工，而你可以去睡觉！** 😴


---

## 参考资料

* 使用 Claude Code 的 Slash Command 编排工作流，让 AI 半夜持续为你打工
* 斩获 1.6 万 Star！让你的 Claude Code 战斗力爆表
* 一键让你的Claude Code拥有所有世界顶级Agent
* 手把手教你打造Claude code贴身助手

### 重要链接

* **wshobson/agents**：https://github.com/wshobson/agents
* **wshobson/commands**：https://github.com/wshobson/commands
* **SuperClaude Framework**：https://github.com/SuperClaude-Org/SuperClaude_Framework
* **Smithery MCP市场**：https://smithery.ai


