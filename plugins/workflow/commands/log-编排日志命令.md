# 编排日志命令

将编排任务的工作记录到外部项目管理工具，如 Linear、Obsidian、Jira 或 GitHub Issues。

## 用法

```
/orchestration/log [TASK-ID] [options]
```

## 描述

自动在连接的项目管理工具或知识库中创建工作日志，传输任务完成数据、花费时间和进度说明，以保持外部系统同步。

## 基本命令

### 记录当前任务
```
/orchestration/log
```
将当前进行中的任务记录到可用工具。

### 记录特定任务
```
/orchestration/log TASK-003
```
记录特定任务的工作。

### 选择目标
```
/orchestration/log TASK-003 --choose
```
手动选择记录工作的位置。

## 目标选择

当有多个可用工具或没有明显连接时：

```
您想将此工作记录到哪里？

可用目标：
1. Linear (检测到 ENG-1234)
2. Obsidian (Daily Note)
3. Obsidian (Project: Authentication)
4. GitHub Issue (#123)
5. None - 跳过记录

选择目标 [1-5]:
```

## Obsidian 集成

### 每日笔记记录
```
/orchestration/log --obsidian-daily
```
追加到今天的每日笔记：

```markdown
## 工作日志 - 15:30

### TASK-003: JWT Implementation ✅

**花费时间**: 4.5 hours (10:00 - 14:30)
**状态**: Completed → QA

**我做了什么：**
- Implemented JWT token validation middleware
- Added refresh token logic
- Created comprehensive test suite
- Fixed edge case with token expiration

**代码统计：**
- Files: 8 modified
- Lines: +245 -23
- Coverage: 95%

**相关任务：**
- Next: [[TASK-005]] - User Profile API
- Blocked: [[TASK-007]] - Waiting for this

**提交：**
- `abc123`: feat(auth): implement JWT validation
- `def456`: test(auth): add validation tests

#tasks/completed #project/authentication
```

### 项目笔记记录
```
/orchestration/log --obsidian-project "Authentication System"
```
创建或追加到特定项目笔记。

### 自定义 Obsidian 位置
```
/orchestration/log --obsidian-path "Projects/Sprint 24/Work Log"
```

## Linear 集成
```
/orchestration/log TASK-003 --linear-issue ENG-1234
```
在 Linear issue 中创建工作日志评论。

## 智能检测

系统检测可用目标：

```
分析任务上下文...

找到连接：
✓ Linear: ENG-1234 (从分支名)
✓ Obsidian: 项目笔记存在
✓ GitHub: 无 issue 引用
✗ Jira: 未连接

建议：Linear ENG-1234
使用建议？[Y/n/choose different]
```

## 工作日志格式

### Obsidian 格式
```markdown
## 📋 Task: TASK-003 - JWT Implementation

### 摘要
- **状态**: 🟢 Completed
- **持续时间**: 4h 30m
- **日期**: 2024-03-15

### 进度详情
- [x] Token structure design
- [x] Validation middleware
- [x] Refresh mechanism
- [x] Test coverage

### 技术说明
- Used RS256 algorithm for signing
- Tokens expire after 15 minutes
- Refresh tokens last 7 days

### 链接
- Linear: [ENG-1234](linear://issue/ENG-1234)
- PR: [#456](github.com/...)
- Docs: [[JWT Implementation Guide]]

### 后续行动
- [ ] Code review feedback
- [ ] Deploy to staging
- [ ] Update API documentation

---
*Logged via Task Orchestration at 15:30*
```

### Linear 格式
```
Linear 中的工作日志评论，包含任务详情、时间跟踪和进度更新。
```

## 多目标记录

```
/orchestration/log TASK-003 --multi

选择所有记录目标：
[x] Linear - ENG-1234
[x] Obsidian - Daily Note
[ ] Obsidian - Project Note
[ ] GitHub - Create new issue

按 Enter 确认，Space 切换
```

## 批量操作

### 每日摘要到 Obsidian
```
/orchestration/log --daily-summary --obsidian

在每日笔记中创建摘要：

## 工作摘要 - 2024-03-15

### 已完成任务
- [[TASK-003]]: JWT Implementation (4.5h) ✅
- [[TASK-008]]: Login UI Updates (2h) ✅

### 进行中
- [[TASK-005]]: User Profile API (1.5h) 🔄

### 总时间：8 hours

### 主要成就
- Authentication system core complete
- All tests passing
- Ready for code review

### 明天的重点
- Complete user profile endpoints
- Start OAuth integration
```

### 周报告
```
/orchestration/log --weekly --obsidian-path "Weekly Reviews/Week 11"
```

## 模板

### 配置 Obsidian 模板
```yaml
obsidian_template:
  daily_note:
    heading: "## Work Log - {time}"
    include_stats: true
    add_tags: true
    link_tasks: true

  project_note:
    create_if_missing: true
    append_to_section: "## Task Progress"
    include_commits: true
```

### 配置 Linear 模板
```yaml
linear_template:
  include_time: true
  update_status: true
  add_labels: ["from-orchestration"]
```

## 交互模式

```
/orchestration/log --interactive

Task: TASK-003 - JWT Implementation
Status: Completed
Time: 4.5 hours

记录到哪里？（Space 选择，Enter 确认）
> [x] Linear (ENG-1234)
> [x] Obsidian Daily Note
> [ ] Obsidian Project Note
> [ ] New GitHub Issue

添加自定义说明？[y/N]: y
> Implemented using RS256, ready for review

记录到 2 个目标...
✓ Linear: Comment added to ENG-1234
✓ Obsidian: Added to daily note

查看日志？[y/N]:
```

## 示例

### 示例 1：当日结束记录
```
/orchestration/log --eod

当日结束摘要：
- 3 个任务工作
- 7.5 小时记录
- 2 已完成，1 进行中

记录到：
1. Obsidian Daily Note (推荐)
2. Linear (更新所有 3 个 issues)
3. Both
4. Skip

选择 [1]: 1

✓ Daily work log created in Obsidian
```

### 示例 2：冲刺回顾
```
/orchestration/log --sprint-review --week 11

收集第 11 周数据...
- 15 个任务已完成
- 3 进行中
- 52 小时记录

创建冲刺回顾：
1. Obsidian - "Sprint Reviews/Sprint 24"
2. Linear - Sprint 24 cycle
3. Both

选择 [3]: 3

✓ Sprint review created in both systems
```

### 示例 3：未找到连接
```
/orchestration/log TASK-009

未找到 TASK-009 的自动目标。

您想将此记录到哪里？
1. Obsidian - Daily Note
2. Obsidian - Create Project Note
3. Linear - Search for issue
4. GitHub - Create new issue
5. Skip logging

选择：2

输入项目名称：Security Audit
✓ Created "Security Audit" note with work log
```

## 配置

### 默认目标
```yaml
log_defaults:
  no_connection: "ask"  # ask|obsidian-daily|skip
  multi_connection: "ask"  # ask|all|first

  obsidian:
    default_location: "daily"  # daily|project|custom
    project_folder: "Projects"
    daily_folder: "Daily Notes"

  linear:
    auto_update_status: true
    include_commits: true
```

## 最佳实践

1. **设置偏好**：配置默认目标
2. **早期链接**：创建任务时连接到 PM 工具
3. **使用每日笔记**：适合个人跟踪
4. **项目笔记**：更适合团队协作
5. **定期同步**：不要让日志堆积

## 注意事项

- 尊重 MCP 连接和权限
- Obsidian 日志自动创建反向链接
- 支持多个同时目标
- 在系统间保留格式
- 可通过任务状态变更自动化
