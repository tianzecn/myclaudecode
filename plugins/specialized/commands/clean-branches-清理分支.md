# Clean Branches Command

清理已合并和过时的 git 分支

## 说明

按照以下系统方法清理 git 分支: **$ARGUMENTS**

1. **仓库状态分析**
   - 检查当前分支和未提交的更改
   - 列出所有本地和远程分支
   - 识别主分支名称 (main/master)
   - 查看最近的分支活动和合并历史

   ```bash
   # 检查当前状态
   git status
   git branch -a
   git remote -v

   # 检查主分支名称
   git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'
   ```

2. **安全预防措施**
   - 确保工作目录干净
   - 切换到 main/master 分支
   - 从远程拉取最新更改
   - 如需要,创建当前分支状态的备份

   ```bash
   # 确保状态干净
   git stash push -m "Backup before branch cleanup"
   git checkout main  # 或 master
   git pull origin main
   ```

3. **识别已合并分支**
   - 列出已合并到 main 的分支
   - 排除受保护的分支 (main, master, develop)
   - 检查本地和远程已合并分支
   - 验证合并状态以避免意外删除

   ```bash
   # 列出已合并的本地分支
   git branch --merged main | grep -v "main\\|master\\|develop\\|\\*"

   # 列出已合并的远程分支
   git branch -r --merged main | grep -v "main\\|master\\|develop\\|HEAD"
   ```

4. **识别过时分支**
   - 查找没有最近活动的分支
   - 检查每个分支的最后提交日期
   - 识别指定时间范围内的旧分支 (例如 30 天)
   - 考虑 feature/hotfix 分支的命名模式

   ```bash
   # 按最后提交日期列出分支
   git for-each-ref --format='%(committerdate) %(authorname) %(refname)' --sort=committerdate refs/heads

   # 查找超过 30 天的分支
   git for-each-ref --format='%(refname:short) %(committerdate)' refs/heads | awk '$2 < "'$(date -d '30 days ago' '+%Y-%m-%d')'"'
   ```

5. **交互式分支审查**
   - 在删除前审查每个分支
   - 检查分支是否有未合并的更改
   - 验证分支目的和状态
   - 在删除前请求确认

   ```bash
   # 检查未合并的更改
   git log main..branch-name --oneline

   # 显示分支信息
   git show-branch branch-name main
   ```

6. **受保护分支配置**
   - 识别永远不应删除的分支
   - 为重要分支配置保护规则
   - 记录分支保护策略
   - 为新仓库设置自动保护

   ```bash
   # 受保护分支示例
   PROTECTED_BRANCHES=("main" "master" "develop" "staging" "production")
   ```

7. **本地分支清理**
   - 安全删除已合并的本地分支
   - 删除过时的 feature 分支
   - 清理已删除远程的跟踪分支
   - 更新本地分支引用

   ```bash
   # 删除已合并的分支 (交互式)
   git branch --merged main | grep -v "main\\|master\\|develop\\|\\*" | xargs -n 1 -p git branch -d

   # 如需要强制删除 (谨慎使用)
   git branch -D branch-name
   ```

8. **远程分支清理**
   - 删除已合并的远程分支
   - 清理远程跟踪引用
   - 删除过时的远程分支
   - 更新远程分支信息

   ```bash
   # 清理远程跟踪分支
   git remote prune origin

   # 删除远程分支
   git push origin --delete branch-name

   # 删除已删除远程分支的本地跟踪
   git branch -dr origin/branch-name
   ```

9. **自动清理脚本**

   ```bash
   #!/bin/bash

   # Git 分支清理脚本
   set -e

   # 配置
   MAIN_BRANCH="main"
   PROTECTED_BRANCHES=("main" "master" "develop" "staging" "production")
   STALE_DAYS=30

   # 函数
   is_protected() {
       local branch=$1
       for protected in "${PROTECTED_BRANCHES[@]}"; do
           if [[ "$branch" == "$protected" ]]; then
               return 0
           fi
       done
       return 1
   }

   # 切换到主分支
   git checkout $MAIN_BRANCH
   git pull origin $MAIN_BRANCH

   # 清理已合并的分支
   echo "Cleaning up merged branches..."
   merged_branches=$(git branch --merged $MAIN_BRANCH | grep -v "\\*\\|$MAIN_BRANCH")

   for branch in $merged_branches; do
       if ! is_protected "$branch"; then
           echo "Deleting merged branch: $branch"
           git branch -d "$branch"
       fi
   done

   # 清理远程跟踪分支
   echo "Pruning remote tracking branches..."
   git remote prune origin

   echo "Branch cleanup completed!"
   ```

10. **团队协调**
    - 在清理共享分支前通知团队
    - 检查分支是否被他人使用
    - 协调分支清理计划
    - 记录分支清理程序

11. **分支命名规范清理**
    - 识别非标准命名的分支
    - 清理临时或实验性分支
    - 删除旧的 hotfix 和 feature 分支
    - 强制执行一致的命名规范

12. **验证和确认**
    - 验证重要分支仍然存在
    - 检查没有删除活跃的工作
    - 验证远程分支同步
    - 确认团队成员没有问题

    ```bash
    # 验证清理结果
    git branch -a
    git remote show origin
    ```

13. **文档和报告**
    - 记录已清理的分支
    - 报告发现的任何问题或冲突
    - 更新关于分支生命周期的团队文档
    - 创建分支清理计划和策略

14. **回滚程序**
    - 记录如何恢复已删除的分支
    - 使用 reflog 查找已删除分支的提交
    - 创建紧急恢复程序
    - 设置分支恢复脚本

    ```bash
    # 使用 reflog 恢复已删除的分支
    git reflog --no-merges --since="2 weeks ago"
    git checkout -b recovered-branch commit-hash
    ```

15. **自动化设置**
    - 设置自动分支清理脚本
    - 为分支清理配置 CI/CD 管道
    - 创建定期清理任务
    - 实施分支生命周期策略

16. **最佳实践实施**
    - 建立分支生命周期指南
    - 设置自动合并检测
    - 配置分支保护规则
    - 实施代码审查要求

**高级清理选项:**

```bash
# 清理所有已合并的分支,除了受保护的
git branch --merged main | grep -E "^  (feature|hotfix|bugfix)/" | xargs -n 1 git branch -d

# 带确认的交互式清理
git branch --merged main | grep -v "main\|master\|develop" | xargs -n 1 -p git branch -d

# 批量删除远程分支
git branch -r --merged main | grep origin | grep -v "main\|master\|develop\|HEAD" | cut -d/ -f2- | xargs -n 1 git push origin --delete

# 清理早于特定日期的分支
git for-each-ref --format='%(refname:short) %(committerdate:short)' refs/heads | awk '$2 < "2023-01-01"' | cut -d' ' -f1 | xargs -n 1 git branch -D
```

注意事项:
- 在清理前始终备份重要分支
- 在删除共享分支前与团队成员协调
- 首先在安全环境中测试清理脚本
- 记录所有清理程序和策略
- 设置定期清理计划以防止积累
