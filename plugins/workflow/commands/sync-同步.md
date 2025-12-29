---
description: 同步任务状态与 git 提交，确保版本控制和任务跟踪之间的一致性
---

# Orchestration Sync - 编排同步

将任务状态与 git 提交同步,确保版本控制和任务跟踪之间的一致性。

## 用法

```
/orchestration/sync [options]
```

## 描述

分析 git 历史和任务状态以识别差异,基于提交证据自动更新任务跟踪并维护双向一致性。

## 基本命令

### 完全同步
```
/orchestration/sync
```
执行 git 和任务状态之间的完整同步。

### 检查同步状态
```
/orchestration/sync --check
```
报告不一致而不做任何更改。

### 同步特定编排
```
/orchestration/sync --date 03_15_2024 --project auth_system
```

## 同步操作

### Git → 任务状态
基于提交消息更新任务状态:
```
找到的提交:
- feat(auth): implement JWT validation (TASK-003) ✓
  状态: in_progress → qa (基于提交)
  
- test(auth): add JWT validation tests (TASK-003) ✓
  状态: qa → completed (测试表明完成)
  
- fix(auth): resolve token expiration (TASK-007) ✓
  状态: todos → in_progress (工作已开始)
```

### 任务状态 → Git
验证任务状态与 git 证据一致。

## 功能

- 自动识别任务引用 (TASK-XXX)
- 从提交消息推断状态变更
- 检测不一致并建议修复
- 保留审计跟踪
- 支持批量同步

## 输出

生成同步报告,包含:
- 更新的任务状态
- 识别的不一致
- 建议的修复
- 完整的审计日志
