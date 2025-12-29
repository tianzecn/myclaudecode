# 编排优化命令

分析和优化任务编排以提高效率、减少瓶颈并最大化团队生产力。

## 用法

```
/orchestration/optimize [options]
```

## 描述

对活跃和历史编排执行全面分析，以识别优化机会、建议工作流改进，并提供可操作的洞察以实现更好的任务管理。

## 基本命令

### 分析当前编排
```
/orchestration/optimize
```
分析最近活跃的编排以查找瓶颈和低效率。

### 优化特定编排
```
/orchestration/optimize --date 03_15_2024 --project auth_system
```
对特定编排进行深度分析并提供详细建议。

### 性能分析
```
/orchestration/optimize --performance
```
专注于时间、速度和资源利用指标。

### 依赖优化
```
/orchestration/optimize --dependencies
```
分析任务依赖以寻找并行化机会。

## 分析领域

### 瓶颈检测
```
## 识别的瓶颈

关键路径分析：
- TASK-003 (JWT validation)：阻塞 4 个下游任务
- 持续时间：5.5h（估算的 150%）
- 影响：12h 并行工作延迟

队列分析：
- on_hold 队列：6 个任务（平均等待 2.3 天）
- QA 队列：3 个任务（平均等待 8h）
- 建议：增加 QA 容量或并行测试

资源约束：
- dev-backend：3 个活跃任务（过载）
- dev-frontend：0 个活跃任务（未充分利用）
- 建议：交叉培训或重新分配合适任务
```

### 速度指标
```
## 速度分析

当前指标：
- 任务/天：2.1（目标：3.0）
- 平均任务持续时间：4.2h（vs 3.5h 估算）
- 状态转换：todos→in_progress（2h 平均等待）

历史比较：
- 上周：2.8 任务/天（快 33%）
- 最佳周：3.4 任务/天（最佳条件）

趋势问题：
- 估算准确性下降（65% vs 上月 80%）
- QA 反馈循环增加 40%
```

### 依赖分析
```
## 依赖优化

并行化机会：
1. TASK-007、TASK-008 可与 TASK-003 并发运行
   潜在节省时间：6 小时

2. 前端任务独立于当前后端工作
   可并行化：TASK-009、TASK-010、TASK-011

关键路径优化：
- 当前：24 小时（顺序）
- 优化后：16 小时（并行执行）
- 节省：8 小时（33% 改进）

依赖简化：
- 移除错误依赖：TASK-012 → TASK-004
- 合并相关任务：TASK-014 + TASK-015
```

## 优化策略

### 资源重新分配
```
/orchestration/optimize --rebalance
```

建议最佳任务分配：
```
## 推荐的资源变更

当前负载：
┌─────────────────┬────────────┬─────────────┬────────────┐
│ Agent           │ Active     │ Queue       │ Utilization│
├─────────────────┼────────────┼─────────────┼────────────┤
│ dev-backend     │ 3 tasks    │ 2 tasks     │ 180%       │
│ dev-frontend    │ 0 tasks    │ 4 tasks     │ 0%         │
│ qa-engineer     │ 2 tasks    │ 1 task      │ 120%       │
│ test-developer  │ 1 task     │ 0 tasks     │ 60%        │
└─────────────────┴────────────┴─────────────┴────────────┘

建议：
1. Move TASK-007 (API tests) to test-developer
2. Assign TASK-009 (UI components) to dev-frontend
3. Split TASK-003 into backend/frontend components
```

### 任务重组
```
/orchestration/optimize --restructure
```

建议任务修改：
```
## 任务重组机会

过大任务（>6h 估算）：
- TASK-003: JWT validation (8h)
  → 拆分：JWT core (4h) + JWT middleware (3h) + Tests (1h)

过小任务（<1h 估算）：
- TASK-011: Update config (0.5h)
- TASK-012: Fix typos (0.25h)
  → 合并为维护批次

错误标记的依赖：
- TASK-008 实际上不需要 TASK-003
  → 移除依赖，添加到并行执行
```

### 工作流改进
```
/orchestration/optimize --workflow
```

流程优化建议：
```
## 工作流优化

状态转换延迟：
- todos → in_progress：4.2h 平均（目标：<2h）
- in_progress → qa：1.2h 平均（良好）
- qa → completed：6.8h 平均（目标：<4h）

建议：
1. 实施自动分配规则
2. 在高峰时段增加 QA 容量
3. 创建任务准备清单

沟通改进：
- 23% 的阻塞因需求不清晰
- 15% 的 QA 失败因缺少上下文
- 在 in_progress 前添加需求审查关卡
```

## 历史分析

### 趋势分析
```
/orchestration/optimize --trends --days 30
```

显示性能趋势：
```
## 30天性能趋势

速度趋势：↓ -15%
- 第 1 周：3.2 任务/天
- 第 2 周：2.9 任务/天
- 第 3 周：2.8 任务/天
- 第 4 周：2.7 任务/天

质量趋势：↓ -8%
- QA 拒绝率增加
- 每任务返工时间增加 12%

效率指标：
- 估算准确性：68%（从 78% 下降）
- 并行执行率：45%（从 40% 上升）
- 阻塞任务持续时间：1.8 天平均（从 1.2 天上升）
```

### 模式识别
```
## 识别的模式

任务类型性能：
- Features：3.2h 平均（接近估算）
- Bugfixes：2.1h 平均（低估 40%）
- Tests：1.8h 平均（高估 20%）
- Security：5.1h 平均（严重低估）

一天中时间模式：
- 早晨开始：完成快 25%
- 午餐后阻塞：可能性高 40%
- 当日结束 QA：失败率高 60%

Agent 专业化：
- dev-backend：API 任务快 2 倍
- dev-frontend：UI 任务快 30%
- 跨职能任务：比专业化慢 50%
```

## 优化行动

### 立即行动
```
/orchestration/optimize --execute immediate
```

应用安全优化：
1. 重新平衡当前任务分配
2. 移除识别的错误依赖
3. 基于历史数据更新任务估算
4. 重新调度阻塞任务

### 结构性变更
```
/orchestration/optimize --execute structural --confirm
```

需要确认：
1. 任务拆分/合并
2. 工作流流程变更
3. Agent 角色修改
4. 依赖重组

### 持续优化
```
/orchestration/optimize --schedule daily
```

设置自动优化：
- 每日速度监控
- 每周瓶颈分析
- 每月趋势报告
- 自动重新平衡建议

## 模拟模式

### 假设分析
```
/orchestration/optimize --simulate "add agent:dev-fullstack"
```

预测变更影响：
```
## 模拟结果：添加 dev-fullstack

预期改进：
- 速度：2.7 → 3.4 任务/天（+26%）
- 关键路径：24h → 18h（-25%）
- 队列时间：4.2h → 2.1h（-50%）

资源利用：
- 后端过载：180% → 120%（最佳）
- 前端未充分利用：0% → 80%（良好）
- 总体效率：+35%

ROI 分析：
- 成本：+1 团队成员
- 交付速度：+26%
- 质量影响：中性到积极
```

## 集成功能

### 自动优化
```
/orchestration/optimize --auto-apply --threshold conservative
```

自动应用满足保守安全标准的优化。

### 通知系统
```
/orchestration/optimize --alerts bottleneck,velocity,quality
```

为优化机会设置警报。

### 历史学习
```
/orchestration/optimize --learn-from previous_projects/
```

从过去的编排中吸取经验。

## 报告

### 优化报告
```
/orchestration/optimize --report detailed
```

生成包含以下内容的综合优化报告：
- 当前状态分析
- 识别的机会
- 推荐行动
- 预期影响指标
- 实施时间表

### 执行摘要
```
/orchestration/optimize --summary executive
```

面向领导层的高级优化洞察。

## 最佳实践

1. **定期分析**：每周对活跃编排运行优化
2. **增量变更**：逐步应用优化以衡量影响
3. **监控影响**：跟踪优化前后的指标
4. **团队沟通**：与团队分享优化洞察
5. **持续学习**：使用历史数据改进未来编排

## 示例

### 示例 1：每日优化检查
```
/orchestration/optimize --quick --auto-rebalance
```

### 示例 2：困难项目的深度分析
```
/orchestration/optimize --date 03_15_2024 --project auth_system --deep-analysis
```

### 示例 3：团队绩效审查
```
/orchestration/optimize --trends --days 90 --team-focus
```

## 配置

### 优化规则
在编排配置中设置：
```yaml
optimization:
  auto_rebalance: true
  bottleneck_threshold: 2h
  velocity_target: 3.0
  quality_threshold: 85%
  parallel_execution_target: 60%
```

## 注意事项

- 所有优化都可通过审计跟踪撤销
- 模拟模式允许安全实验
- 历史数据随时间提高优化准确性
- 与所有其他编排命令集成
- 支持每种项目类型的自定义优化规则
