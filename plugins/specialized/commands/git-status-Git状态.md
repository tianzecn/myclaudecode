# Git 状态命令

显示详细的 git 仓库状态

*命令最初由 IndyDevDan 创建 (YouTube: https://www.youtube.com/@indydevdan) / DislerH (GitHub: https://github.com/disler)*

## 说明

通过执行以下步骤分析 git 仓库的当前状态:

1. **运行 Git 状态命令**
   - 执行 `git status` 查看当前工作树状态
   - 运行 `git diff HEAD origin/main` 检查与远程的差异
   - 执行 `git branch --show-current` 显示当前分支
   - 检查未提交的更改和未跟踪的文件

2. **分析仓库状态**
   - 识别已暂存 vs 未暂存的更改
   - 列出任何未跟踪的文件
   - 检查分支是否领先/落后于远程
   - 如果存在,审查任何合并冲突

3. **读取关键文件**
   - 审查 README.md 了解项目上下文
   - 检查重要文件中的任何最近更改
   - 如需要,理解项目结构

4. **提供摘要**
   - 当前分支及其与 main/master 的关系
   - 领先/落后的提交数
   - 修改文件列表及更改类型
   - 任何行动项(需要提交、需要拉取等)

此命令帮助开发者快速了解:
- 哪些更改待处理
- 仓库的同步状态
- 继续工作前是否需要任何操作

参数: $ARGUMENTS
