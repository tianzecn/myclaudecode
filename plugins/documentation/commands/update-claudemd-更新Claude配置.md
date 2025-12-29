---
allowed-tools: Bash(git diff:*), Bash(git log:*), Bash(git status:*), Bash(find:*), Bash(grep:*), Bash(wc:*), Bash(ls:*)
description: 根据最近的代码变更自动更新 CLAUDE.md 文件
---

# 更新 Claude.md 文件

## 当前 Claude.md 状态
@CLAUDE.md

## Git 分析

### 当前仓库状态
!`git status --porcelain`

### 最近变更（最近 10 次提交）
!`git log --oneline -10`

### 详细最近变更
!`git log --since="1 week ago" --pretty=format:"%h - %an, %ar : %s" --stat`

### 最近差异分析
!`git diff HEAD~5 --name-only | head -20`

### 关键变更的详细差异
!`git diff HEAD~5 -- "*.js" "*.ts" "*.jsx" "*.tsx" "*.py" "*.md" "*.json" | head -200`

### 新添加的文件
!`git diff --name-status HEAD~10 | grep "^A" | head -15`

### 删除的文件
!`git diff --name-status HEAD~10 | grep "^D" | head -10`

### 修改的核心文件
!`git diff --name-status HEAD~10 | grep "^M" | grep -E "(package\.json|README|config|main|index|app)" | head -10`

## 项目结构变更
!`find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" | head -10`

## 配置变更
!`git diff HEAD~10 -- package.json tsconfig.json webpack.config.js next.config.js .env* docker* | head -100`

## API/路由变更
!`git diff HEAD~10 -- "**/routes/**" "**/api/**" "**/controllers/**" | head -150`

## 数据库/模型变更
!`git diff HEAD~10 -- "**/models/**" "**/schemas/**" "**/migrations/**" | head -100`

## 你的任务

基于当前 CLAUDE.md 内容和上述所有 git 分析，创建更新后的 CLAUDE.md 文件：

## 1. 保留重要的现有内容
- 保留核心项目描述和架构
- 维护重要的设置说明
- 保留关键架构决策和模式
- 保留基本的开发工作流信息

## 2. 整合最近的变更
分析 git diff 和日志以识别：
- **新功能**：添加了什么新功能？
- **API 变更**：新端点、修改的路由、更新的参数
- **配置更新**：构建工具、依赖项、环境变量的变更
- **文件结构变更**：新目录、移动的文件、删除的组件
- **数据库变更**：新模型、schema 更新、迁移
- **Bug 修复**：影响系统工作方式的重要修复
- **重构**：重大代码重组或架构变更

## 3. 更新关键部分
智能更新这些 CLAUDE.md 部分：

### 项目概述
- 如果范围改变，更新描述
- 注明新增的技术或框架
- 更新版本信息

### 架构
- 记录新的架构模式
- 注明重大结构变更
- 更新组件关系

### 设置说明
- 添加新的环境变量
- 如果依赖项改变，更新安装步骤
- 注明新的配置要求

### API 文档
- 添加在路由中发现的新端点
- 更新现有端点文档
- 注明身份验证或参数变更

### 开发工作流
- 根据 package.json 中的新脚本更新
- 注明新的开发工具或流程
- 如果改变，更新测试程序

### 最近变更部分
添加"最近更新"部分，包含：
- 从 git 分析得出的主要变更摘要
- 新功能及其影响
- 重要的 bug 修复
- 开发者应该知道的破坏性变更

### 文件结构
- 更新新文件夹的目录说明
- 注明重新定位或重组的文件
- 记录新的重要文件

## 4. 智能内容管理
- **不要重复**：避免重复已经充分记录的信息
- **优先考虑相关性**：关注影响开发者使用代码的变更
- **保持简洁**：总结而不是列出每一个小变更
- **维护结构**：遵循现有的 CLAUDE.md 组织
- **添加时间戳**：注明主要更新的时间

## 5. 输出格式
提供完整更新的 CLAUDE.md 内容，组织如下：

```markdown
# 项目名称

## 概述
[更新的项目描述]

## 架构
[更新的架构信息]

## 设置与安装
[更新的设置说明]

## 开发工作流
[更新的开发流程]

## API 文档
[更新的 API 信息]

## 文件结构
[更新的目录说明]

## 最近更新（更新时间：YYYY-MM-DD）
[最近变更摘要]

## 重要说明
[开发者的关键信息]
```

完成后，提供总结报告包括：
- 主要变更类型
- 新增的功能
- 架构调整
- 配置更新
- 需要开发者注意的事项
