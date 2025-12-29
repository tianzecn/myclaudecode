---
allowed-tools: Bash, Read, Grep, Glob
argument-hint: [time-period] | --sprint | --quarter | --all
description: 追踪并分析项目里程碑进度，支持预测分析
---

# 里程碑追踪

通过全面分析追踪和监控项目里程碑进度：**$ARGUMENTS**

## 当前项目上下文

- 项目活动：!`git log --oneline --since="30 days ago" | wc -l` 次提交
- 活跃分支：!`git branch -r | wc -l` 个远程分支
- 最近发布：!`git tag -l --sort=-creatordate | head -5`
- 里程碑数据：@.github/milestones/ 或 Linear 集成

## 任务

生成全面的里程碑跟踪报告，分析项目交付进度：

**时间周期**：使用 $ARGUMENTS 或默认为当前冲刺/季度

**分析维度**：
1. **里程碑进度跟踪**
   - 当前里程碑完成率
   - 速度趋势和燃尽分析
   - 关键路径识别
   - 依赖映射和风险评估

2. **预测分析**
   - 带置信区间的完成日期预测
   - 风险调整后的时间线建议
   - 资源分配优化
   - 场景规划（假设分析）

3. **健康指标**
   - 进度遵守指标
   - 团队能力利用率
   - 阻塞因素识别和影响
   - 质量与交付平衡

**输出**：交互式里程碑仪表板，包含可视化进度指标、预测分析、风险评估和里程碑交付优化的可行建议。
