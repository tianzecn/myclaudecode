# 任务报告命令

生成关于任务执行、进度和指标的综合报告。

## 用法

```
/task-report [report-type] [options]
```

## 描述

为项目管理、冲刺回顾和性能分析创建详细报告。支持多种报告类型和输出格式。

## 报告类型

### 执行摘要
```
/task-report executive
```
面向利益相关者的高级概览，包含关键指标和进度。

### 冲刺报告
```
/task-report sprint --date 03_15_2024
```
详细的冲刺进度，包含燃尽图和速度。

### 每日站会
```
/task-report standup
```
已完成、进行中和被阻塞的内容。

### 性能报告
```
/task-report performance --period week
```
团队和个人性能指标。

### 依赖报告
```
/task-report dependencies
```
可视化依赖图和瓶颈分析。

## 输出示例

### 执行摘要报告
```
执行摘要 - 认证系统项目
================================================
报告日期：2024-03-15
项目开始：2024-03-13
持续时间：3 天（60% 完成）

关键指标
-----------
• 总任务：24
• 已完成：12（50%）
• 进行中：3（12.5%）
• 已阻塞：2（8.3%）
• 剩余：7（29.2%）

时间表
--------
• 原始估算：5 天
• 当前预测：5.5 天
• 风险级别：低

亮点
----------
✓ 核心认证 API 已完成
✓ 数据库架构已迁移
✓ 单元测试通过（98% 覆盖率）

阻塞因素
--------
⚠ 支付集成等待外部 API
⚠ UI 组件需要设计批准

下一个里程碑
--------------
→ 完成 JWT 实现（今天）
→ 集成测试（明天）
→ 安全审计（第 4 天）
```

### 冲刺燃尽报告
```
/task-report burndown --sprint current
```
```
冲刺燃尽 - Sprint 24
===========================

按天剩余任务：
Day 1: ████████████████████ 24
Day 2: ████████████████     20
Day 3: ████████████         15 (TODAY)
Day 4: ████████             10 (projected)
Day 5: ████                 5  (projected)

速度指标：
- 平均：4.5 任务/天
- 昨天：5 个任务
- 今天：3 个任务（进行中）

风险评估：按计划进行
```

### 性能报告
```
团队性能报告 - 第 11 周
=================================

按 Agent：
┌─────────────────┬────────┬───────────┬─────────┬────────────┐
│ Agent           │ Completed │ Avg Time │ Quality │ Efficiency │
├─────────────────┼────────┼───────────┼─────────┼────────────┤
│ dev-frontend    │    8   │   3.2h    │   95%   │    125%    │
│ dev-backend     │    6   │   4.1h    │   98%   │    110%    │
│ test-developer  │    4   │   2.8h    │   100%  │    115%    │
└─────────────────┴────────┴───────────┴─────────┴────────────┘

按任务类型：
- Features：12 已完成（平均 3.8h）
- Bugfixes：4 已完成（平均 1.5h）
- Tests：8 已完成（平均 2.2h）

质量指标：
- 首次通过率：88%
- 需要返工：2 个任务
- 阻塞时间：总计 4.5 小时
```

## 自定义选项

### 时间段
```
/task-report summary --from 2024-03-01 --to 2024-03-15
/task-report summary --last 7d
/task-report summary --this-month
```

### 特定项目
```
/task-report sprint --project authentication_system
```

### 格式选项
```
/task-report executive --format markdown
/task-report executive --format html
/task-report executive --format pdf
```

### 包含/排除
```
/task-report summary --include completed,qa
/task-report summary --exclude on_hold
```

## 专业报告

### 关键路径分析
```
/task-report critical-path
```
显示直接影响完成时间的任务。

### 瓶颈分析
```
/task-report bottlenecks
```
识别导致延迟的任务。

### 资源利用
```
/task-report resources
```
显示 agent 分配和可用性。

### 风险评估
```
/task-report risks
```
识别潜在延迟和问题。

## 可视化选项

### 甘特图
```
/task-report gantt --weeks 2
```

### 依赖图
```
/task-report dependencies --visual
```

### 状态流
```
/task-report flow --animated
```

## 自动化报告

### 调度报告
```
/task-report schedule daily-standup --at "9am"
/task-report schedule weekly-summary --every friday
```

### 电子邮件报告
```
/task-report executive --email team@company.com
```

## 比较报告

### 冲刺比较
```
/task-report compare --sprint 23 24
```

### 周环比
```
/task-report trends --weeks 4
```

## 示例

### 示例 1：晨会状态
```
/task-report standup --format slack
```
生成 Slack 格式的站会报告。

### 示例 2：冲刺回顾
```
/task-report sprint --include-velocity --include-burndown
```
用于回顾会议的综合冲刺指标。

### 示例 3：阻塞因素聚焦
```
/task-report blockers --show-dependencies --show-resolution
```
深入了解阻碍进度的因素。

## 集成功能

### 导出到工具
```
/task-report export-jira
/task-report export-asana
/task-report export-github
```

### API 端点
```
/task-report api --generate-endpoint
```
创建 API 端点用于外部访问。

## 最佳实践

1. **每日回顾**：每天早晨运行站会报告
2. **周总结**：周五生成性能报告
3. **冲刺规划**：使用速度趋势进行估算
4. **利益相关者更新**：调度自动执行摘要

## 报告组件

每个报告可以包含：
- 摘要统计
- 时间线可视化
- 按状态的任务列表
- Agent 性能
- 依赖分析
- 风险评估
- 建议
- 历史趋势

## 注意事项

- 报告使用所有 TASK-STATUS-TRACKER.yaml 文件的数据
- 已完成任务包含在历史指标中
- 时间计算默认使用工作时间
- 所有时间以本地时区显示
- 图表需要终端 unicode 支持
