---
allowed-tools: Read, Write, Bash
argument-hint: [scope] | --github-issues | --linear-tasks | --priority-analysis | --team-assignment
description: 智能问题分类，自动分类、优先级排序和团队分配
---

# 问题分类

通过自动路由和团队分配智能地分类和优先处理问题：**$ARGUMENTS**

## 当前分类上下文

- 仓库：!`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "No repo context"`
- 待处理问题：!`gh issue list --state open --limit 1 --json number | jq length 2>/dev/null || echo "Check manually"`
- Linear 团队：可用的 Linear 团队和项目分配用于路由
- 分类积压：当前未分类问题的数量和时长

## 任务

执行智能问题分析，包含自动分类和优先级分配：

**分类范围**：使用 $ARGUMENTS 聚焦于 GitHub issues、Linear 任务、优先级分析或团队分配优化

**分类框架**：
1. **问题分析** - 提取问题元数据、分析内容模式、评估严重性指标、评估影响范围
2. **类别分类** - 识别问题类型（bug、功能、文档）、评估复杂度级别、确定紧急因素
3. **优先级评估** - 使用严重性、影响、工作量和业务价值指标计算优先级分数
4. **团队路由** - 将问题技能与团队专业知识匹配、平衡工作负载分布、考虑当前冲刺能力
5. **标签管理** - 应用一致的标签方案、维护分类标准、启用过滤和报告
6. **SLA 分配** - 设置响应时间期望、建立解决目标、跟踪性能指标

**高级功能**：自动严重性检测、智能团队匹配、工作负载平衡、SLA 监控、升级工作流。

**质量保证**：一致性验证、分类准确性跟踪、团队满意度监控、流程优化反馈。

**输出**：完整的问题分类，包含优先级分配、团队路由建议、SLA 目标和流程改进见解。
