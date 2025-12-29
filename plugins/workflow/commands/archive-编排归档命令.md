# 编排归档命令

正确归档已完成的编排，同时保留有价值的数据、指标和经验教训供未来参考。

## 用法

```
/orchestration/archive [options]
```

## 描述

管理已完成编排的归档流程，提取洞察、保留关键数据，并组织历史信息以供未来分析和学习。

## 基本命令

### 归档已完成的编排
```
/orchestration/archive
```
自动识别并归档所有完全完成的编排。

### 归档特定编排
```
/orchestration/archive --date 03_15_2024 --project auth_system
```
归档特定编排并完整保留数据。

### 带分析的归档
```
/orchestration/archive --analyze
```
在归档前执行全面分析，提取经验教训。

## 归档流程

### 归档前分析
```
## 归档前分析：auth_system (03_15_2024)

完成状态：
- 总任务数：24（24 已完成，0 活跃）
- 持续时间：8 天（预计：6 天）
- 最终速度：3.0 任务/天
- 质量评分：92%（平均 2 次 QA 迭代）

待处理项：
- 无活跃任务
- 无阻塞依赖
- Git 分支：3 已合并，0 待处理
- 文档：完成

准备归档：✓
```

### 数据提取
```
## 提取归档数据

性能指标：
✓ 任务完成时间
✓ 速度计算
✓ 质量指标
✓ 资源利用率
✓ 依赖模式

项目产物：
✓ 所有任务文件和元数据
✓ Git 提交历史关联
✓ 状态转换日志
✓ Agent 分配模式

学习要点：
✓ 做得好的地方
✓ 痛点和瓶颈
✓ 估算准确性
✓ 团队协作洞察
```

### 归档结构
```
/archived-orchestrations/
└── 2024/
    └── Q1/
        └── 03_15_2024_auth_system/
            ├── ARCHIVE-SUMMARY.md
            ├── LESSONS-LEARNED.md
            ├── METRICS-REPORT.json
            ├── original-files/
            │   ├── MASTER-COORDINATION.md
            │   ├── EXECUTION-TRACKER.md
            │   ├── TASK-STATUS-TRACKER.yaml
            │   └── tasks/
            ├── analytics/
            │   ├── velocity-chart.png
            │   ├── dependency-graph.svg
            │   └── timeline-visualization.html
            └── git-correlation/
                ├── commit-task-mapping.json
                └── branch-analysis.md
```

## 归档选项

### 快速归档
```
/orchestration/archive --quick
```
无需详细分析的快速归档，适用于简单编排。

### 深度分析归档
```
/orchestration/archive --deep-analysis
```
全面分析包括：
- 详细性能指标
- 模式识别
- 预测性洞察
- 与类似项目的比较分析

### 选择性归档
```
/orchestration/archive --include tasks,metrics --exclude original-files
```
自定义归档内容选择。

## 分析功能

### 性能分析
```
## 性能分析摘要

速度分析：
- 峰值速度：4.2 任务/天（第 3 天）
- 平均速度：3.0 任务/天
- 速度趋势：稳定，随时间改善 15%

任务指标：
- 平均任务持续时间：3.8h（vs 4.0h 预估）
- 估算准确性：87%（优秀）
- 最准确估算：后端任务（95%）
- 最不准确估算：UI 任务（72%）

质量指标：
- 首次通过 QA 成功率：78%
- 平均 QA 迭代：1.3
- 生产环境零严重 bug
- 文档完整性：95%
```

### 团队绩效
```
## 团队绩效洞察

Agent 有效性：
┌─────────────────┬──────────────┬─────────────┬──────────────┐
│ Agent           │ Tasks Done   │ Avg Duration│ Quality Score│
├─────────────────┼──────────────┼─────────────┼──────────────┤
│ dev-backend     │ 12 tasks     │ 3.2h        │ 94%          │
│ dev-frontend    │ 8 tasks      │ 4.1h        │ 89%          │
│ qa-engineer     │ 4 reviews    │ 1.5h        │ 96%          │
│ test-developer  │ 6 tasks      │ 2.8h        │ 91%          │
└─────────────────┴──────────────┴─────────────┴──────────────┘

协作模式：
- 跨职能任务：占总数的 20%
- 结对编程事件：8 次
- 知识转移会议：3 次
- 最佳团队规模：4 个 agent（已确认）
```

### 经验教训提取
```
## 经验教训

做得好的地方：
1. 早期依赖识别防止了主要阻塞
2. JWT 实现模式可用于未来认证项目
3. 并行测试方法减少了 QA 瓶颈
4. 每日站会形式保持团队一致

痛点：
1. OAuth 提供商文档不完整（外部因素）
2. 项目中期数据库架构变更导致 1 天延迟
3. 测试环境不稳定影响了 3 个任务
4. 前端-后端 API 契约最初不明确

流程改进：
1. 在实现前添加 API 契约审查关卡
2. 实施测试环境监控
3. 创建 OAuth 集成模板供未来使用
4. 添加数据库变更影响评估

估算洞察：
- 安全任务始终低估 25%
- 使用新库的 UI 任务需要 40% 更长时间
- 集成任务需要 20% 缓冲用于外部依赖
- 与开发并行的测试可节省 30% 总时间
```

## 归档验证

### 完整性检查
```
## 归档完整性验证

必需数据：
✓ 所有 24 个任务文件已保留
✓ 状态跟踪历史完整
✓ Git 提交关联已验证
✓ 性能指标已计算
✓ Agent 分配已记录

数据完整性：
✓ 未检测到损坏文件
✓ 时间线一致性已验证
✓ 依赖图已验证
✓ 指标计算已确认

归档质量：100% 完整
```

### 历史关联
```
## 历史关联分析

类似项目比较：
- user_management (02_20_2024)：85% 相似
- payment_system (01_15_2024)：60% 相似
- admin_dashboard (03_01_2024)：45% 相似

性能比较：
- 本项目：3.0 任务/天（高于平均）
- 团队平均：2.7 任务/天
- 最佳表现：3.4 任务/天（payment_system）
- 最差表现：2.1 任务/天（admin_dashboard）

学习应用机会：
- 将 JWT 模式应用于即将到来的 mobile_auth 项目
- 将依赖分析模板用于 API 项目
- 为集成密集型工作复制测试策略
```

## 归档格式

### 标准归档
```
/orchestration/archive --format standard
```
创建包含所有基本数据和分析的结构化归档。

### 轻量归档
```
/orchestration/archive --format light
```
最小归档，仅包含关键指标和经验教训。

### 研究归档
```
/orchestration/archive --format research
```
适合学术研究或深度分析的全面归档。

### 模板归档
```
/orchestration/archive --format template
```
从成功模式创建可重用模板。

## 查询和检索

### 搜索归档
```
/orchestration/archive --search "JWT authentication"
```
查找具有类似需求的已归档编排。

### 比较归档
```
/orchestration/archive --compare 03_15_2024 02_20_2024
```
两个已归档编排之间的详细比较。

### 提取模板
```
/orchestration/archive --extract-template auth_system
```
从成功归档创建编排模板。

## 集成功能

### 指标仪表板
```
/orchestration/archive --dashboard
```
生成已归档编排指标的可视化仪表板。

### 知识库
```
/orchestration/archive --knowledge-base
```
将经验教训集成到可搜索知识库。

### 预测分析
```
/orchestration/archive --predict similar_to:auth_system
```
使用归档数据预测类似未来项目的结果。

## 自动化选项

### 自动归档已完成
```
/orchestration/archive --auto-schedule weekly
```
每周自动归档已完成的编排。

### 智能归档规则
```
/orchestration/archive --rules "age:>30days status:completed"
```
归档满足特定条件的编排。

### 归档通知
```
/orchestration/archive --notify team@company.com
```
发送归档完成通知及关键洞察。

## 示例

### 示例 1：标准项目归档
```
/orchestration/archive --date 03_15_2024 --project auth_system --analyze
```

### 示例 2：批量归档已完成
```
/orchestration/archive --all-completed --since "last month"
```

### 示例 3：创建项目模板
```
/orchestration/archive --date 03_15_2024 --create-template auth_pattern
```

### 示例 4：研究分析
```
/orchestration/archive --search "authentication" --analyze-patterns
```

## 存储管理

### 归档位置
```
Default: ./archived-orchestrations/
Custom: /orchestration/archive --location /shared/archives/
```

### 压缩选项
```
/orchestration/archive --compress high
```
在保持数据完整性的同时减少存储需求。

### 保留策略
```
/orchestration/archive --retention "keep:2years delete:metrics-only"
```

## 最佳实践

1. **定期归档**：不要让已完成的编排积累
2. **分析后归档**：提取最大学习价值
3. **保留上下文**：包含足够的上下文供未来参考
4. **模板创建**：将成功模式转换为模板
5. **团队审查**：在归档前分享洞察
6. **搜索优化**：使用一致的标签和关键词

## 配置

### 归档设置
```yaml
archive:
  auto_archive_after: "30 days"
  analysis_depth: "standard"
  preserve_git_history: true
  create_visualizations: true
  retention_period: "2 years"
  compression_level: "medium"
```

## 恢复选项

### 从归档恢复
```
/orchestration/archive --restore 03_15_2024_auth_system
```
将已归档编排恢复到活动状态（少见用例）。

### 提取特定数据
```
/orchestration/archive --extract metrics 03_15_2024_auth_system
```
从已归档编排中检索特定数据。

## 注意事项

- 已归档编排默认为只读
- 所有归档操作都会被记录用于审计
- 归档分析随着机器学习的应用而改进
- 从归档创建的模板可立即使用
- 归档数据有助于预测性编排模型
- 支持与外部备份系统集成
