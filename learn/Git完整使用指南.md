# Git 完整使用指南 - 从基础到 Claude Code 高效集成

## 目录


1. [Git 核心基础](#git-%E6%A0%B8%E5%BF%83%E5%9F%BA%E7%A1%80)
2. [Git 常规协作](#git-%E5%B8%B8%E8%A7%84%E5%8D%8F%E4%BD%9C)
3. [Claude Code 中的 Git 集成](#claude-code-%E4%B8%AD%E7%9A%84-git-%E9%9B%86%E6%88%90)
4. [Git 工作流命令](#git-%E5%B7%A5%E4%BD%9C%E6%B5%81%E5%91%BD%E4%BB%A4)
5. [高级 Git 技巧](#%E9%AB%98%E7%BA%A7-git-%E6%8A%80%E5%B7%A7)
6. [Git 最佳实践](#git-%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5)
7. [常见问题解决](#%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%E8%A7%A3%E5%86%B3)

## Git 核心基础

> **帮我提交代码，只提交和本次修改内容有关的文件．提交记录写范点用中文**

### 什么是 Git

Git 是现代软件开发的基石，它能有效管理项目版本，尤其擅长处理多人协作的复杂场景。通过 Git，你可以：

* ✅ 跟踪代码的每一次变更
* ✅ 回滚到任意历史版本
* ✅ 多人并行开发不互相干扰
* ✅ 合并不同分支的代码
* ✅ 备份代码到远程服务器

### Git 工作流程的三个核心区域

```
工作区 (Working Directory)
    ↓ git add
暂存区 (Staging Area)
    ↓ git commit
版本库 (Repository)
    ↓ git push
远程仓库 (Remote Repository)
```

**工作区**: 你在电脑上能看到并直接编辑文件的目录
**暂存区**: 临时存放你标记好、准备下一步提交的修改
**版本库**: 永久存储项目所有版本记录的地方
**远程仓库**: 托管在云端的版本库（如 GitHub、Gitee）

### 全局配置

初次使用 Git，需要先设定你的身份信息：

```bash
# 设置用户名
git config --global user.name "Your Name"
# 设置邮箱
git config --global user.email "your.email@example.com"
# 查看配置
git config --list
# 设置默认编辑器（可选）
git config --global core.editor "code --wait"
# 设置默认分支名
git config --global init.defaultBranch main
```

### 初始化仓库

```bash
# 初始化新仓库
cd your-project
git init
# 克隆现有仓库
git clone https://github.com/username/repo.git
# 克隆指定分支
git clone -b branch-name https://github.com/username/repo.git
```


## Git 常规协作

### 日常基本操作流程

#### 1. 查看状态

```bash
# 查看当前状态
git status
# 查看简洁状态
git status -s
# 查看分支信息
git status -sb
```

#### 2. 添加文件到暂存区

```bash
# 添加单个文件
git add filename.txt
# 添加所有修改的文件
git add .
# 添加所有 .js 文件
git add *.js
# 交互式添加
git add -i
# 添加部分修改
git add -p filename.txt
```

#### 3. 提交更改

```bash
# 提交暂存区的修改
git commit -m "feat: 添加用户登录功能"
# 添加并提交（跳过 git add）
git commit -am "fix: 修复登录bug"
# 修改最后一次提交
git commit --amend
# 修改最后一次提交信息
git commit --amend -m "新的提交信息"
```

#### 4. 查看历史记录

```bash
# 查看提交历史
git log
# 查看简洁历史
git log --oneline
# 查看图形化历史
git log --graph --oneline --all
# 查看最近 5 次提交
git log -5
# 查看某个文件的历史
git log filename.txt
# 查看详细的修改内容
git log -p
# 查看统计信息
git log --stat
```

#### 5. 查看差异

```bash
# 查看工作区和暂存区的差异
git diff
# 查看暂存区和版本库的差异
git diff --staged
# 查看两个分支的差异
git diff branch1 branch2
# 查看某个文件的差异
git diff filename.txt
```


### 分支管理

分支是 Git 的精髓，它允许开发人员在不影响主线的情况下，独立进行新功能开发或修复 bug。

```
main
  ├─ feature-A
  │    └─ feature-A-1
  └─ feature-B
       └─ bugfix-B-1
```

#### 创建和切换分支

```bash
# 查看所有分支
git branch
# 查看远程分支
git branch -r
# 查看所有分支（包括远程）
git branch -a
# 创建新分支
git branch feature-login
# 切换到分支
git checkout feature-login
# 创建并切换（推荐）
git checkout -b feature-login
# 使用 switch 命令（新语法）
git switch feature-login
git switch -c feature-login  # 创建并切换
```

#### 合并分支

```bash
# 切换到目标分支
git checkout main
# 合并指定分支
git merge feature-login
# 取消合并（如果有冲突）
git merge --abort
# 使用 squash 合并（将多个提交合并为一个）
git merge --squash feature-login
# 使用 rebase 合并
git rebase main
```

#### 删除分支

```bash
# 删除本地分支
git branch -d feature-login
# 强制删除分支
git branch -D feature-login
# 删除远程分支
git push origin --delete feature-login
```

#### 重命名分支

```bash
# 重命名当前分支
git branch -m new-branch-name
# 重命名指定分支
git branch -m old-name new-name
```


### 远程仓库操作

#### 关联远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/username/repo.git
# 查看远程仓库
git remote -v
# 重命名远程仓库
git remote rename origin upstream
# 删除远程仓库
git remote remove origin
# 修改远程仓库 URL
git remote set-url origin https://github.com/username/new-repo.git
```

#### 推送代码

```bash
# 推送到远程仓库
git push origin main
# 首次推送并设置上游分支
git push -u origin main
# 推送所有分支
git push --all
# 推送标签
git push --tags
# 强制推送（谨慎使用）
git push -f origin main
```

#### 拉取代码

```bash
# 拉取并合并
git pull origin main
# 拉取但不合并
git fetch origin
# 拉取所有远程分支
git fetch --all
# 拉取并 rebase
git pull --rebase origin main
```


### 典型的团队协作流程

```bash
# 1. 克隆仓库
git clone https://github.com/team/project.git
cd project
# 2. 创建功能分支
git checkout -b feature/user-login
# 3. 开发并提交
git add .
git commit -m "feat: 实现用户登录功能"
# 4. 拉取最新代码（避免冲突）
git checkout main
git pull origin main
# 5. 合并到功能分支
git checkout feature/user-login
git merge main
# 6. 解决冲突（如果有）
# 编辑冲突文件
git add .
git commit -m "merge: 解决合并冲突"
# 7. 推送到远程
git push -u origin feature/user-login
# 8. 在 GitHub/Gitee 上创建 Pull Request
# 9. 代码审查通过后，合并到主分支
# 10. 删除功能分支
git branch -d feature/user-login
git push origin --delete feature/user-login
```


## Claude Code 中的 Git 集成

Claude Code 不仅支持所有标准的 Git 命令，还提供了一系列增强功能，将 Git 操作与 AI 能力深度融合。

### 直接执行 Git 命令

在 Claude Code 的交互界面中，你可以直接告诉 AI：

```bash
# 提交代码
"帮我把项目代码提交到仓库"
# 查看状态
"查看 git 状态"
# 创建分支
"创建一个新分支 feature-payment"
# 切换分支
"切换到 main 分支"
# 合并分支
"把 feature-payment 合并到 main"
```

省去了切换到终端的步骤，让代码保存更加流畅。

### 使用 Git Worktrees 实现并行开发

当需要同时处理多个分支任务（如一个新功能和一个紧急 bug 修复）时，`git worktree` 是一个绝佳的解决方案。

#### 什么是 Worktree

Worktree 允许你将同一个仓库的不同分支检出到不同的目录中，每个目录都是一个隔离的工作环境。

```
project/              # 主仓库 (main 分支)
../project-feature-a  # worktree (feature-a 分支)
../project-bugfix     # worktree (bugfix 分支)
```

#### 操作步骤

```bash
# 1. 为新分支创建 worktree
git worktree add ../project-feature-a -b feature-a
# 2. 为已有分支创建 worktree
git worktree add ../project-bugfix bugfix-123
# 3. 查看所有 worktree
git worktree list
# 4. 在新目录中工作
cd ../project-feature-a
claude  # 启动 Claude Code
# 5. 清理 worktree
git worktree remove ../project-feature-a
# 6. 清理所有无效的 worktree
git worktree prune
```

#### Worktree 的优势

* ✅ 多任务并行：同时处理多个分支，互不干扰
* ✅ 上下文纯净：每个 Claude Code 实例都有独立的上下文
* ✅ 快速切换：无需频繁 checkout，避免文件变动
* ✅ 避免冲突：不同分支的修改完全隔离

### 结合 CLAUDE.md 与 .gitignore

#### CLAUDE.md 的作用

`CLAUDE.md` 文件用于定义 AI 的代码生成规则、代码风格等。

**项目级 CLAUDE.md** - 提交到 Git 仓库，团队共享：

```markdown
# 项目：电商系统

## 技术栈
- Frontend: React + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL

## 编码规范
- 使用 ESLint + Prettier
- 遵循函数式编程
- 优先使用 TypeScript
```

**个人级 CLAUDE.local.md** - 添加到 `.gitignore`，避免提交：

```markdown
# 个人偏好
- 使用 4 空格缩进
- 喜欢详细的注释
```

#### .gitignore 配置

```bash
# .gitignore 文件

# Claude Code 个人配置
.claude/CLAUDE.local.md
.claude/local-*

# AI 生成的临时文件
.claude/temp/
.claude/cache/

# 计划文档（可选）
.claude/plan/
```

### 通过 GitHub Action 实现自动化

Claude Code 提供了 GitHub Action 集成，可以将其无缝集成到你的 GitHub 工作流中。

#### 安装 GitHub App

```bash
# 在 Claude Code 中执行
/install-github-app
```

#### 使用方式

在 GitHub 的 Issue 或 Pull Request 中，直接 @claude 让 AI 自动完成任务：

```bash
# 根据 Issue 创建 PR
@claude implement this feature

# 修复 Bug
@claude fix the TypeError in the user dashboard component

# 代码审查
@claude review this PR

# 生成测试
@claude add tests for the login component

# 更新文档
@claude update the README with the new API endpoints
```


## Git 工作流命令

### ZCF 提供的 Git 命令

ZCF (Zero-Config Claude-Code Flow) 提供了一系列 Git 自动化命令，简化 Git 操作。

#### 1. /zcf:git-commit - 智能提交

自动分析代码改动并生成符合规范的 commit 信息。

```bash
# 使用命令
/zcf:git-commit
# 可选参数
/zcf:git-commit --no-verify        # 跳过 Git hooks
/zcf:git-commit --all              # 提交所有修改
/zcf:git-commit --amend            # 修改最后一次提交
/zcf:git-commit --signoff          # 添加 Signed-off-by
/zcf:git-commit --emoji            # 使用 emoji
/zcf:git-commit --scope <scope>    # 指定范围
/zcf:git-commit --type <type>      # 指定类型
```

**功能**:

* ✅ 自动分析 `git diff` 和 `git status`
* ✅ 生成 Conventional Commits 格式的提交信息
* ✅ 支持 emoji 提交
* ✅ 自动运行本地 Git hooks（可跳过）
* ✅ 必要时建议拆分提交

**Conventional Commits 格式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:

* `feat`: 新功能
* `fix`: Bug 修复
* `docs`: 文档更新
* `style`: 代码格式（不影响功能）
* `refactor`: 重构
* `perf`: 性能优化
* `test`: 测试相关
* `chore`: 构建过程或辅助工具变动

**示例**:

```
feat(auth): 添加用户登录功能

- 实现 JWT token 验证
- 添加登录表单验证
- 集成第三方登录

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

#### 2. /zcf:git-rollback - 交互式回滚

安全地回滚到历史版本。

```bash
# 使用命令
/zcf:git-rollback
# 可选参数
/zcf:git-rollback --branch <branch>    # 指定分支
/zcf:git-rollback --target <rev>       # 指定目标版本
/zcf:git-rollback --mode reset         # 使用 reset 模式
/zcf:git-rollback --mode revert        # 使用 revert 模式
/zcf:git-rollback --depth <n>          # 回滚 n 个版本
/zcf:git-rollback --dry-run            # 预览不执行
/zcf:git-rollback --yes                # 跳过确认
```

**功能**:

* ✅ 列出所有分支
* ✅ 列出历史版本
* ✅ 二次确认后执行回滚
* ✅ 支持 reset 和 revert 两种模式

**reset vs revert**:

* **reset**: 重置到指定版本，丢弃之后的提交（危险）
* **revert**: 创建新提交撤销指定提交（安全）

#### 3. /zcf:git-cleanBranches - 清理分支

安全地清理已合并或过期的分支。

```bash
# 使用命令
/zcf:git-cleanBranches

# 可选参数
/zcf:git-cleanBranches --base <branch>      # 基准分支（默认 main）
/zcf:git-cleanBranches --stale <days>       # 过期天数
/zcf:git-cleanBranches --remote             # 清理远程分支
/zcf:git-cleanBranches --force              # 强制删除
/zcf:git-cleanBranches --dry-run            # 预览不执行
/zcf:git-cleanBranches --yes                # 跳过确认
```

**功能**:

* ✅ 查找已合并的分支
* ✅ 查找过期的分支（N 天未更新）
* ✅ 保护重要分支（main、develop、master）
* ✅ 支持 dry-run 模式

**保护分支列表**:

* main
* master
* develop
* dev
* staging
* production

#### 4. /zcf:git-worktree - 工作树管理

管理 Git worktree，实现多分支并行开发。

```bash
# 添加 worktree
/zcf:git-worktree add <path> -b <branch>
# 列出所有 worktree
/zcf:git-worktree list
# 删除 worktree
/zcf:git-worktree remove <path>
# 清理无效 worktree
/zcf:git-worktree prune
# 在新 worktree 中打开 IDE
/zcf:git-worktree add <path> -b <branch> -o
# 其他参数
--track              # 追踪远程分支
--guess-remote       # 猜测远程分支
--detach             # 分离 HEAD
--checkout           # 立即检出
--lock               # 锁定 worktree
```

**默认目录**: `../.zcf/项目名/`

**示例**:

```bash
# 创建新分支的 worktree
/zcf:git-worktree add ../feature-payment -b feature/payment
# 列出所有 worktree
/zcf:git-worktree list
# 删除 worktree
/zcf:git-worktree remove ../feature-payment
```

### 自定义 Git 命令

你可以创建项目级的自定义命令来封装常用的 Git 操作序列。

#### 示例 1: 修复 GitHub Issue

在 `.claude/commands/` 目录下创建 `fix-github-issue.md`：

```markdown
---
argument-hint: [issue-number]
description: 分析并修复 GitHub Issue
allowed-tools: Read, Write, Bash(git:*), Bash(gh:*)
---

# 修复 GitHub Issue

请分析并修复这个 GitHub Issue：#$ARGUMENTS

## 执行步骤

1. 使用 `gh issue view` 命令查看 Issue 详情
2. 分析问题的根本原因
3. 创建新分支 `fix/issue-$ARGUMENTS`
4. 实施必要的修改来解决 Issue
5. 编写或更新测试用例
6. 确保所有测试通过
7. 提交代码并生成规范的 commit 信息
8. 推送代码并创建 Pull Request
9. 在 PR 中引用原 Issue (#$ARGUMENTS)

## 提交信息格式

fix(#$ARGUMENTS): [简短描述]

- 详细说明修复内容
- 解释为什么这样修复

Closes #$ARGUMENTS
```

使用方法：

```bash
/fix-github-issue 123
```

#### 示例 2: 功能开发流程

创建 `.claude/commands/feature-workflow.md`：

```markdown
---
argument-hint: [feature-name]
description: 完整的功能开发流程
---

# 功能开发流程: $ARGUMENTS

## 阶段 1: 准备工作

1. 确保在最新的 main 分支
2. 拉取最新代码
3. 创建功能分支 `feature/$ARGUMENTS`

## 阶段 2: 开发

1. 实现功能
2. 编写单元测试
3. 编写集成测试
4. 更新文档

## 阶段 3: 提交

1. 运行测试确保全部通过
2. 运行 lint 检查
3. 使用 `/zcf:git-commit` 提交代码
4. 推送到远程仓库

## 阶段 4: 代码审查

1. 创建 Pull Request
2. 添加适当的标签和审阅者
3. 等待审查反馈
4. 根据反馈修改代码

## 阶段 5: 合并

1. 确保 CI/CD 全部通过
2. 合并到 main 分支
3. 删除功能分支
4. 更新项目文档
```


## 高级 Git 技巧

### 撤销修改

#### 撤销工作区修改

```bash
# 撤销单个文件的修改
git checkout -- filename.txt
# 撤销所有文件的修改
git checkout -- .
# 使用 restore 命令（新语法）
git restore filename.txt
git restore .
```

#### 撤销暂存区修改

```bash
# 从暂存区移除文件（保留工作区修改）
git reset HEAD filename.txt
# 使用 restore 命令
git restore --staged filename.txt
```

#### 撤销提交

```bash
# 撤销最后一次提交（保留修改）
git reset --soft HEAD~1
# 撤销最后一次提交（不保留修改）
git reset --hard HEAD~1
# 撤销最后 3 次提交
git reset --soft HEAD~3
# 撤销到指定提交
git reset --soft <commit-hash>
```

### Stash（储藏）

临时保存当前工作，切换到其他分支。

```bash
# 储藏当前修改
git stash
# 储藏时添加说明
git stash save "修复登录bug的临时储藏"
# 查看储藏列表
git stash list
# 应用最新储藏
git stash apply
# 应用指定储藏
git stash apply stash@{0}
# 应用并删除储藏
git stash pop
# 删除储藏
git stash drop stash@{0}
# 清空所有储藏
git stash clear
# 创建分支并应用储藏
git stash branch feature-name
```

### Rebase（变基）

将一系列提交移动到新的基础上。

```bash
# 将当前分支 rebase 到 main
git rebase main
# 交互式 rebase（合并提交）
git rebase -i HEAD~3
# 继续 rebase（解决冲突后）
git rebase --continue
# 跳过当前提交
git rebase --skip
# 取消 rebase
git rebase --abort
```

**交互式 rebase 命令**:

* `pick`: 使用提交
* `reword`: 使用提交但修改提交信息
* `edit`: 使用提交但停下来修改
* `squash`: 与前一个提交合并
* `fixup`: 与前一个提交合并但丢弃提交信息
* `drop`: 删除提交

### Cherry-Pick（拣选）

将指定提交应用到当前分支。

```bash
# 应用单个提交
git cherry-pick <commit-hash>
# 应用多个提交
git cherry-pick <commit1> <commit2>
# 应用提交范围
git cherry-pick <commit1>..<commit2>
# 取消 cherry-pick
git cherry-pick --abort
# 继续 cherry-pick
git cherry-pick --continue
```

### Tag（标签）

标记重要的版本。

```bash
# 创建轻量标签
git tag v1.0.0
# 创建附注标签
git tag -a v1.0.0 -m "发布 1.0.0 版本"
# 查看所有标签
git tag
# 查看标签信息
git show v1.0.0
# 推送标签到远程
git push origin v1.0.0
# 推送所有标签
git push --tags
# 删除本地标签
git tag -d v1.0.0
# 删除远程标签
git push origin :refs/tags/v1.0.0
```

### 子模块（Submodule）

在一个 Git 仓库中包含另一个 Git 仓库。

```bash
# 添加子模块
git submodule add https://github.com/user/repo.git path/to/submodule
# 克隆包含子模块的仓库
git clone --recursive https://github.com/user/repo.git
# 初始化子模块
git submodule init
# 更新子模块
git submodule update
# 更新所有子模块到最新版本
git submodule update --remote
# 删除子模块
git submodule deinit path/to/submodule
git rm path/to/submodule
```


## Git 最佳实践

### 提交规范

#### Conventional Commits

遵循约定式提交规范，使提交历史清晰易读。

**格式**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**示例**:

```bash
feat(auth): 添加 OAuth2 登录支持

- 集成 Google OAuth2
- 集成 GitHub OAuth2
- 添加 OAuth 配置页面

Breaking Change: 旧的登录 API 已废弃
Closes #123
```

#### Emoji 提交

使用 emoji 使提交更直观。

| Emoji | 代码 | 说明 |
|----|----|----|
| ✨ | `:sparkles:` | 新功能 |
| 🐛 | `:bug:` | Bug 修复 |
| 📝 | `:memo:` | 文档更新 |
| 🎨 | `:art:` | 代码格式/结构改进 |
| 🚀 | `:rocket:` | 性能优化 |
| 🔒 | `:lock:` | 安全问题修复 |
| ♻️ | `:recycle:` | 重构 |
| ✅ | `:white_check_mark:` | 添加测试 |
| 🔧 | `:wrench:` | 配置文件修改 |
| 🗑️ | `:wastebasket:` | 删除代码/文件 |

**示例**:

```bash
✨ feat: 添加用户头像上传功能
🐛 fix: 修复文件上传失败的问题
📝 docs: 更新 API 文档
```

### 分支命名规范

```bash
# 功能分支
feature/user-authentication
feature/payment-integration

# Bug 修复分支
bugfix/login-error
fix/memory-leak

# 热修复分支（紧急修复）
hotfix/critical-security-patch

# 发布分支
release/v1.2.0

# 实验性分支
experimental/new-ui
```

### .gitignore 最佳实践

```bash
# .gitignore 示例

# 操作系统
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Node.js
node_modules/
npm-debug.log
yarn-error.log

# Python
__pycache__/
*.pyc
.pytest_cache/
venv/

# 环境变量
.env
.env.local
.env.*.local

# 构建产物
dist/
build/
*.min.js
*.min.css

# 日志
logs/
*.log

# Claude Code
.claude/temp/
.claude/cache/
.claude/CLAUDE.local.md

# 临时文件
*.tmp
*.bak
*~
```

### Git Hooks

自动化代码检查和格式化。

#### Pre-commit Hook

在提交前运行代码检查。

创建 `.git/hooks/pre-commit`：

```bash
#!/bin/bash

# 运行 ESLint
echo "运行 ESLint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ ESLint 检查失败，请修复错误后再提交"
    exit 1
fi

# 运行 Prettier
echo "运行 Prettier..."
npm run format:check
if [ $? -ne 0 ]; then
    echo "❌ 代码格式不规范，请运行 npm run format"
    exit 1
fi

# 运行测试
echo "运行测试..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ 测试失败，请修复后再提交"
    exit 1
fi

echo "✅ 所有检查通过"
exit 0
```

#### 使用 Husky

更方便的 Git Hooks 管理工具。

```bash
# 安装 Husky
npm install --save-dev husky

# 初始化
npx husky install

# 添加 pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"

# 添加 commit-msg hook（检查提交信息格式）
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```


## 常见问题解决

### 冲突解决

#### 合并冲突

```bash
# 查看冲突文件
git status
# 冲突标记示例
<<<<<<< HEAD
当前分支的内容
=======
要合并的分支的内容
>>>>>>> feature-branch
# 解决冲突后
git add resolved-file.txt
git commit -m "merge: 解决合并冲突"
```

#### 使用工具解决冲突

```bash
# 使用 VS Code
code --wait --diff file1 file2
# 使用 Beyond Compare
git config --global merge.tool bc
git config --global mergetool.bc.path "C:/Program Files/Beyond Compare 4/bcomp.exe"
git mergetool
```

### 误操作恢复

#### 恢复已删除的提交

```bash
# 查看所有操作记录
git reflog
# 恢复到指定提交
git reset --hard <commit-hash>
```

#### 恢复已删除的分支

```bash
# 查看删除的分支
git reflog
# 恢复分支
git checkout -b recovered-branch <commit-hash>
```

#### 恢复已删除的文件

```bash
# 恢复到最后一次提交的状态
git checkout HEAD -- filename.txt
# 恢复到指定提交的状态
git checkout <commit-hash> -- filename.txt
```

### 清理仓库

#### 删除大文件

```bash
# 查找大文件
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -10

# 从历史中删除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/large-file" \
  --prune-empty --tag-name-filter cat -- --all

# 清理和回收空间
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### 使用 BFG Repo-Cleaner

更快速的清理工具。

```bash
# 安装 BFG
brew install bfg  # macOS
choco install bfg-repo-cleaner  # Windows
# 删除大于 100MB 的文件
bfg --strip-blobs-bigger-than 100M repo.git
# 删除指定文件
bfg --delete-files filename.txt repo.git
# 清理
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 性能优化

```bash
# 压缩仓库
git gc --aggressive --prune=now
# 查看仓库大小
du -sh .git
# 清理不可达的对象
git prune
# 优化打包
git repack -a -d --depth=250 --window=250
```


## 总结

Git 为软件开发提供了坚实的版本控制基础，而 Claude Code 则在此基础上，通过智能化的命令和工作流集成，极大地提升了开发效率和自动化水平。

### 关键要点



1. **掌握基础**: 理解工作区、暂存区、版本库的概念
2. **规范提交**: 使用 Conventional Commits 格式
3. **分支管理**: 合理使用分支实现并行开发
4. **Claude Code 集成**: 利用 AI 自动化 Git 操作
5. **工作流命令**: 使用 ZCF 提供的 Git 命令简化操作
6. **最佳实践**: 遵循团队约定和行业标准

### 学习资源

* **官方文档**: https://git-scm.com/doc
* **Pro Git 书籍**: https://git-scm.com/book/zh/v2
* **GitHub Guides**: https://guides.github.com/
* **ZCF GitHub**: https://github.com/UfoMiao/zcf
* **Conventional Commits**: https://www.conventionalcommits.org/

### 常用命令速查表

```bash
# 基础操作
git init                    # 初始化仓库
git clone <url>             # 克隆仓库
git status                  # 查看状态
git add .                   # 添加所有修改
git commit -m "message"     # 提交
git push                    # 推送
git pull                    # 拉取
# 分支操作
git branch                  # 查看分支
git checkout -b <branch>    # 创建并切换分支
git merge <branch>          # 合并分支
git branch -d <branch>      # 删除分支
# 历史查看
git log --oneline --graph   # 图形化历史
git diff                    # 查看差异
git show <commit>           # 查看提交详情
# 撤销操作
git reset --soft HEAD~1     # 撤销提交
git restore <file>          # 恢复文件
git stash                   # 储藏修改
# Claude Code 命令
/zcf:git-commit             # 智能提交
/zcf:git-rollback           # 交互式回滚
/zcf:git-cleanBranches      # 清理分支
/zcf:git-worktree           # 工作树管理
```

熟练掌握 Git 与 Claude Code 的结合使用，将是你在现代软件开发中无往不利的强大武器！


*最后更新: 2025-11-06*
*版本: v1.0*