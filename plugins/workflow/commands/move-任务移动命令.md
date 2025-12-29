# 任务移动命令

遵循任务管理协议在状态文件夹之间移动任务。

## 用法

```
/task-move TASK-ID new-status [reason]
```

## 描述

通过在状态文件夹之间移动文件和更新跟踪信息来更新任务状态。遵循所有协议规则，包括验证和审计跟踪。

## 基本命令

### 开始处理任务
```
/task-move TASK-001 in_progress
```
从 todos → in_progress

### 完成实现
```
/task-move TASK-001 qa "Implementation complete, ready for testing"
```
从 in_progress → qa

### 任务通过 QA
```
/task-move TASK-001 completed "All tests passed"
```
从 qa → completed

### 阻塞任务
```
/task-move TASK-004 on_hold "Waiting for TASK-001 API completion"
```
移动到 on_hold 并说明原因

### 解除阻塞
```
/task-move TASK-004 todos "Dependencies resolved"
```
从 on_hold → todos

### QA 失败
```
/task-move TASK-001 in_progress "Failed integration test - fixing null pointer"
```
从 qa → in_progress

## 批量操作

### 移动多个任务
```
/task-move TASK-001,TASK-002,TASK-003 in_progress
```

### 按过滤器移动
```
/task-move --filter "priority:high status:todos" in_progress
```

### 使用模式移动
```
/task-move TASK-00* qa "Batch testing ready"
```

## 验证规则

命令强制执行：
1. **有效转换**：仅允许的状态变更
2. **每个 Agent 一个任务**：如果 agent 有进行中的任务会警告
3. **依赖检查**：如果依赖未满足会警告
4. **文件存在**：在移动前验证任务存在

## 状态转换图

```
todos ──────→ in_progress ──────→ qa ──────→ completed
  ↓               ↓               ↓
  └───────────→ on_hold ←─────────┘
                  ↓
                todos/in_progress
```

## 选项

### 强制移动
```
/task-move TASK-001 completed --force
```
绕过验证（谨慎使用）

### 空运行
```
/task-move TASK-001 qa --dry-run
```
显示将要发生的事情而不执行

### 带分配
```
/task-move TASK-001 in_progress --assign dev-frontend
```
将任务分配给特定 agent

### 带时间估算
```
/task-move TASK-001 in_progress --estimate 4h
```
开始时更新时间估算

## 错误处理

### 任务未找到
```
Error: TASK-999 not found in any status folder
Suggestion: Use /task-status to see available tasks
```

### 无效转换
```
Error: Cannot move from 'completed' to 'todos'
Valid transitions from completed: None (terminal state)
```

### Agent 冲突
```
Warning: dev-frontend already has TASK-002 in progress
Continue? (y/n)
```

### 依赖阻塞
```
Warning: TASK-004 depends on TASK-001 (currently in_progress)
Moving to on_hold instead? (y/n)
```

## 自动化

### 完成时自动移动
```
/task-move TASK-001 --auto-progress
```
当条件满足时自动移动到下一状态

### 计划移动
```
/task-move TASK-005 in_progress --at "tomorrow 9am"
```

### 条件移动
```
/task-move TASK-007 qa --when "TASK-006 completed"
```

## 示例

### 示例 1：开发者工作流
```
# 开始工作
/task-move TASK-001 in_progress

# 完成并测试
/task-move TASK-001 qa "Implementation done, tests passing"

# 审查后
/task-move TASK-001 completed "Code review approved"
```

### 示例 2：处理阻塞
```
# 因依赖而阻塞
/task-move TASK-004 on_hold "Waiting for auth API from TASK-001"

# 准备好时解除阻塞
/task-move TASK-004 todos "TASK-001 now in QA, API available"
```

### 示例 3：QA 工作流
```
# QA 接手任务
/task-move TASK-001 qa --assign qa-engineer

# 发现问题
/task-move TASK-001 in_progress "Bug: handling empty responses"

# 修复并重新测试
/task-move TASK-001 qa "Bug fixed, ready for retest"
```

## 状态更新详情

每次移动更新：
1. **文件位置**：物理文件移动
2. **状态跟踪器**：TASK-STATUS-TRACKER.yaml 条目
3. **任务元数据**：任务文件中的状态字段
4. **执行跟踪器**：整体进度指标

## 最佳实践

1. **始终提供原因**：特别是阻塞和失败
2. **检查依赖**：在移动到 in_progress 之前
3. **更新估算**：开始工作时
4. **清晰的阻塞原因**：帮助其他人理解延迟

## 集成

- 在 `/task-status` 后使用查看可用任务
- 更新反映在 `/task-report` 中
- 如果配置则触发通知
- 记录所有移动用于审计跟踪

## 注意事项

- 移动是原子的 - 要么完全完成要么回滚
- 状态历史是永久的且不可编辑
- 时间戳使用 ISO-8601 格式的当前时间
- Agent 名称从上下文自动检测
