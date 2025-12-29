# 任务状态命令

使用各种过滤和报告选项检查编排系统中任务的当前状态。

## 用法

```
/task-status [options]
```

## 描述

提供所有活跃编排的任务进度、状态分布和执行指标的综合可见性。

## 命令变体

### 基本状态概览
```
/task-status
```
显示所有活跃编排的所有任务摘要。

### 今日任务
```
/task-status --today
```
仅显示今天编排的任务。

### 特定编排
```
/task-status --date 03_15_2024 --project payment_integration
```
显示特定编排的任务。

### 状态过滤器
```
/task-status --status in_progress
/task-status --status qa
/task-status --status on_hold
```
仅显示具有指定状态的任务。

### 详细视图
```
/task-status --detailed
```
显示每个任务的综合信息。

## 输出格式

### 摘要视图（默认）
```
任务编排状态摘要
=================================

活跃编排：3
总任务：47

状态分布：
┌─────────────┬───────┬────────────┐
│ Status      │ Count │ Percentage │
├─────────────┼───────┼────────────┤
│ completed   │  12   │    26%     │
│ qa          │   5   │    11%     │
│ in_progress │   3   │     6%     │
│ on_hold     │   2   │     4%     │
│ todos       │  25   │    53%     │
└─────────────┴───────┴────────────┘

活跃任务（in_progress）：
- TASK-001: Implement JWT authentication (Agent: dev-frontend)
- TASK-007: Create payment webhook handler (Agent: dev-backend)
- TASK-012: Write integration tests (Agent: test-developer)

被阻塞任务（on_hold）：
- TASK-004: User profile API (Blocked by: TASK-001)
- TASK-009: Payment confirmation UI (Blocked by: TASK-007)
```

### 详细视图
```
任务详情：03_15_2024/authentication_system
==================================================

TASK-001: Implement JWT authentication
Status: in_progress
Agent: dev-frontend
Started: 2024-03-15T14:30:00Z
Duration: 3.5 hours
Progress: 75% (est. 1 hour remaining)
Dependencies: None
Blocks: TASK-004, TASK-005
Location: /task-orchestration/03_15_2024/authentication_system/tasks/in_progress/

Status History:
- todos → in_progress (2024-03-15T14:30:00Z) by dev-frontend
```

### 时间线视图
```
/task-status --timeline
```
显示甘特风格的任务执行时间线。

### 速度报告
```
/task-status --velocity
```
显示完成率和性能指标。

## 过滤选项

### 按 Agent
```
/task-status --agent dev-frontend
```

### 按优先级
```
/task-status --priority high
```

### 按类型
```
/task-status --type feature
/task-status --type bugfix
```

### 多重过滤器
```
/task-status --status todos --priority high --type security
```

## 快速行动

### 显示关键路径
```
/task-status --critical-path
```
突出显示阻塞其他任务的任务。

### 显示过期
```
/task-status --overdue
```
显示超过预估时间的任务。

### 显示可用
```
/task-status --available
```
显示准备接手的 todos 任务。

## 集成命令

### 导出状态
```
/task-status --export markdown
/task-status --export csv
```

### 监视模式
```
/task-status --watch
```
实时更新状态（每 30 秒刷新）。

## 示例

### 示例 1：晨会视图
```
/task-status --today --detailed
```

### 示例 2：查找被阻塞工作
```
/task-status --status on_hold --show-blockers
```

### 示例 3：Agent 工作负载
```
/task-status --by-agent --status in_progress
```

### 示例 4：冲刺进度
```
/task-status --date 03_15_2024 --metrics
```

## 指标和分析

### 完成指标
- 每任务平均时间
- 每天完成任务数
- 状态转换时间

### 瓶颈分析
- 最阻塞任务
- 最长 on_hold 持续时间
- 关键路径持续时间

### Agent 性能
- 每个 agent 的任务数
- 平均完成时间
- 当前工作负载

## 最佳实践

1. **每日检查**：每天早晨运行 `/task-status --today`
2. **阻塞因素审查**：定期检查 `/task-status --status on_hold`
3. **进度跟踪**：使用 `/task-status --velocity` 查看趋势
4. **资源规划**：监控 `/task-status --by-agent`

## 注意事项

- 状态数据从 TASK-STATUS-TRACKER.yaml 文件读取
- 所有时间以本地时区显示
- 已完成任务包含在指标中但不在活跃列表中
- 使用 `--all` 标志包含历史编排
