# 编排删除命令

安全地从编排系统中删除任务，更新所有引用和依赖关系。

## 用法

```
/orchestration/remove TASK-ID [options]
```

## 描述

从编排系统中完全删除任务，处理所有依赖关系、引用和相关文档。在删除前提供影响分析并确保系统一致性。

## 基本命令

### 删除单个任务
```
/orchestration/remove TASK-003
```
显示影响分析并在删除前确认。

### 强制删除
```
/orchestration/remove TASK-003 --force
```
跳过确认（谨慎使用）。

### 空运行
```
/orchestration/remove TASK-003 --dry-run
```
显示将受影响的内容而不做更改。

## 影响分析

删除前，系统分析：

```
任务删除影响分析：TASK-003
======================================

任务详情：
- 标题：JWT token validation
- 状态：in_progress
- 位置：/tasks/in_progress/TASK-003-jwt-validation.md

依赖关系：
- 阻塞：TASK-005 (User profile API)
- 阻塞：TASK-007 (Session management)
- 依赖于：无

找到的引用：
- MASTER-COORDINATION.md：第 45 行（Wave 1 tasks）
- EXECUTION-TRACKER.md：活跃任务计数
- TASK-005：列出 TASK-003 作为依赖
- TASK-007：列出 TASK-003 作为依赖

Git 历史：
- 2 个提交引用此任务
- 分支：feature/jwt-auth

警告：此任务有下游依赖！

继续删除？[y/N]
```

## 删除流程

### 1. 更新依赖任务
```
更新依赖任务：
- TASK-005：删除对 TASK-003 的依赖
  新状态：准备开始（无阻塞）

- TASK-007：删除对 TASK-003 的依赖
  警告：仍被 TASK-009 阻塞
```

### 2. 更新跟踪文件
```yaml
# TASK-STATUS-TRACKER.yaml 更新：
status_history:
  TASK-003: [REMOVED - archived to .removed/]

current_status_summary:
  in_progress: [TASK-003 removed from list]

removal_log:
  - task_id: TASK-003
    removed_at: "2024-03-15T16:00:00Z"
    removed_by: "user"
    reason: "Requirement changed"
    final_status: "in_progress"
```

### 3. 更新协调文档
```
应用的更新：
✓ MASTER-COORDINATION.md - 从 Wave 1 删除
✓ EXECUTION-TRACKER.md - 更新任务计数
✓ TASK-DEPENDENCIES.yaml - 删除所有引用
✓ 依赖图已重新生成
```

## 选项

### 归档而非删除
```
/orchestration/remove TASK-003 --archive
```
移动到 `.removed/` 目录而不是删除。

### 删除多个任务
```
/orchestration/remove TASK-003,TASK-005,TASK-008
```
按依赖顺序分析和删除多个任务。

### 按模式删除
```
/orchestration/remove --pattern "oauth-*"
```
删除所有匹配模式的任务。

### 级联删除
```
/orchestration/remove TASK-003 --cascade
```
同时删除依赖此任务的任务。

## 处理特殊情况

### 有提交的任务
```
警告：TASK-003 有关联的提交：
- abc123: "feat(auth): implement JWT validation"
- def456: "test(auth): add JWT tests"

选项：
[1] 保留提交，仅删除任务
[2] 向提交消息添加删除说明
[3] 取消删除
```

### QA/已完成的任务
```
警告：TASK-003 处于 'completed' 状态

这通常意味着工作已完成。考虑：
[1] 归档任务而不是删除
[2] 记录删除原因
[3] 检查是否应还原提交
```

### 关键路径任务
```
错误：TASK-003 在关键路径上！

删除此任务将影响项目时间表：
- 当前完成：5 天
- 删除后：7 天（因重新规划）

使用 --force-critical 覆盖
```

## 删除策略

### 软删除（默认）
```
/orchestration/remove TASK-003
```
- 归档任务文件
- 更新所有引用
- 记录删除原因
- 保留 git 历史

### 硬删除
```
/orchestration/remove TASK-003 --hard
```
- 永久删除任务文件
- 删除所有痕迹
- 更新 git 跟踪
- 无法恢复

### 替换删除
```
/orchestration/remove TASK-003 --replace-with TASK-015
```
- 将依赖转移到新任务
- 更新所有引用
- 保持连续性

## 撤销功能

### 最近删除
```
/orchestration/remove --undo-last
```
恢复最近删除的任务。

### 从归档恢复
```
/orchestration/remove --restore TASK-003
```
恢复已归档任务及其所有引用。

## 示例

### 示例 1：过时功能
```
/orchestration/remove TASK-008 --reason "Feature descoped"

删除 TASK-008：OAuth provider integration
- 无依赖
- 尚无提交
- 安全删除

任务删除成功。
```

### 示例 2：重复任务
```
/orchestration/remove TASK-012 --replace-with TASK-005

删除重复：TASK-012
转移到：TASK-005
- 依赖已转移：2
- 引用已更新：4

重复已删除，TASK-005 已更新。
```

### 示例 3：需求变更
```
/orchestration/remove TASK-003,TASK-004,TASK-005 --reason "Auth system redesigned"

删除认证任务组：
- 要删除 3 个任务
- 2 个有提交（将归档）
- 5 个依赖任务需要更新

继续？[y/N]
```

## 审计跟踪

所有删除都会被记录：
```yaml
# .orchestration-audit.yaml
removals:
  - task_id: TASK-003
    removed_at: "2024-03-15T16:00:00Z"
    removed_by: "user-id"
    reason: "Requirement changed"
    status_at_removal: "in_progress"
    dependencies_affected: ["TASK-005", "TASK-007"]
    commits_preserved: ["abc123", "def456"]
    archived_to: ".removed/2024-03-15/TASK-003/"
```

## 最佳实践

1. **始终检查依赖**：删除前审查影响
2. **记录原因**：提供清晰的删除原因
3. **归档重要工作**：对已完成工作使用 --archive
4. **更新团队**：通知关键删除
5. **审查提交**：检查代码是否需要还原

## 集成

### 与其他命令
```
# 首先检查状态
/orchestration/status --task TASK-003

# 然后如需要删除
/orchestration/remove TASK-003
```

### 批量操作
```
# 查找并删除所有超过 30 天的 on-hold 任务
/orchestration/find --status on_hold --older-than 30d | /orchestration/remove --batch
```

## 安全功能

- 需要确认（除非 --force）
- 检查并警告依赖
- 默认保留提交
- 维护审计跟踪
- 最近删除的撤销功能

## 注意事项

- 已删除任务默认归档 30 天
- Git 提交永不自动还原
- 依赖关系得到优雅处理
- 整个过程保持系统一致性
