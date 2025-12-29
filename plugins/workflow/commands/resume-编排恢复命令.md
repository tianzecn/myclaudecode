# 编排恢复命令

在会话丢失或上下文切换后恢复现有任务编排的工作。

## 用法

```
/orchestration/resume [options]
```

## 描述

恢复活跃编排的完整上下文，显示当前进度，识别下一步行动，并提供继续无缝工作所需的所有信息。

## 基本命令

### 列出活跃编排
```
/orchestration/resume
```
显示所有具有活跃（未完成）任务的编排。

### 恢复特定编排
```
/orchestration/resume --date 03_15_2024 --project auth_system
```
加载特定编排的完整上下文。

### 恢复最近的
```
/orchestration/resume --latest
```
自动恢复最近活跃的编排。

## 输出格式

### 编排列表视图
```
活跃任务编排
==========================

1. 03_15_2024/authentication_system
   开始：3 天前 | 进度：65% | 活跃任务：3
   └─ 焦点：JWT implementation, OAuth integration

2. 03_14_2024/payment_processing
   开始：4 天前 | 进度：40% | 活跃任务：2
   └─ 焦点：Stripe webhooks, refund handling

3. 03_12_2024/admin_dashboard
   开始：1 周前 | 进度：85% | 活跃任务：1
   └─ 焦点：Final testing and deployment

选择要恢复的编排：[1-3] 或使用 --date 和 --project
```

### 详细恢复视图
```
恢复：authentication_system (03_15_2024)
============================================

## 当前状态摘要
- 总任务：24（12 已完成，3 进行中，2 暂停，7 待办）
- 已用时间：3 天
- 预计剩余：2 天

## 进行中的任务
┌──────────┬────────────────────────────┬───────────────┬──────────────┐
│ Task ID  │ Title                      │ Agent         │ Duration     │
├──────────┼────────────────────────────┼───────────────┼──────────────┤
│ TASK-003 │ JWT token validation       │ dev-backend   │ 2.5h         │
│ TASK-007 │ OAuth provider setup       │ dev-frontend  │ 1h           │
│ TASK-011 │ Integration tests          │ test-dev      │ 30m          │
└──────────┴────────────────────────────┴───────────────┴──────────────┘

## 被阻塞任务（需要关注）
- TASK-005: User profile API - 被 TASK-003 阻塞（JWT validation）
- TASK-009: OAuth callback handling - 等待提供商凭据

## 下一个可用任务（准备开始）
1. TASK-013: Password reset flow (4h, frontend)
   文件：src/auth/reset.tsx, src/api/auth.ts

2. TASK-014: Session management (3h, backend)
   文件：src/services/session.ts, src/middleware/auth.ts

## 最近 Git 活动
- feature/jwt-auth: 落后 2 个提交，最后提交 2h 前
- feature/oauth-setup: 干净，最后提交 1h 前

## 快速行动
[1] 显示 TASK-003 详情（当前焦点）
[2] 接手 TASK-013（密码重置）
[3] 查看依赖图
[4] 显示最近提交
[5] 生成状态报告
```

## 上下文恢复功能

### 任务上下文
```
/orchestration/resume --task TASK-003
```
显示：
- 完整任务描述和需求
- 实现进度和说明
- 相关文件及最近更改
- 测试需求和状态
- 依赖关系和阻塞因素

### 文件上下文
```
/orchestration/resume --show-files
```
列出活跃任务中提到的所有文件，包括：
- 最后修改时间
- 当前 git 状态
- 引用它们的任务

### 依赖上下文
```
/orchestration/resume --deps
```
显示专注于活跃任务的依赖图。

## 工作状态恢复

### Git 状态摘要
```
## Git 工作状态
当前分支：feature/jwt-auth
状态：2 个文件已修改，1 个未跟踪

已修改文件：
- src/auth/jwt.ts (与 TASK-003 相关)
- tests/auth.test.ts (与 TASK-003 相关)

未跟踪：
- src/auth/jwt.config.ts (TASK-003 的新文件)

建议：在切换任务前提交当前更改
```

### 上次会话摘要
```
## 上次会话（2 小时前）
- 已完成：TASK-002（数据库架构）
- 已开始：TASK-003（JWT 验证）
- 提交：2（feat: add user auth schema, test: auth unit tests）
- 下一步计划：继续 TASK-003，然后 TASK-005
```

## 过滤选项

### 按状态
```
/orchestration/resume --show in_progress,on_hold
```

### 按日期范围
```
/orchestration/resume --since "last week"
```

### 按完成度
```
/orchestration/resume --incomplete  # < 50% 完成
/orchestration/resume --nearly-done  # > 80% 完成
```

## 集成功能

### 直接任务接手
```
/orchestration/resume --pickup TASK-013
```
自动：
1. 显示任务详情
2. 移动到 in_progress
3. 显示相关文件
4. 如需要创建功能分支

### 状态检查集成
```
/orchestration/resume --with-status
```
包含带恢复上下文的完整状态报告。

### 提交历史
```
/orchestration/resume --commits 5
```
显示与编排相关的最后 5 个提交。

## 快速恢复模式

### 晨会
```
/orchestration/resume --latest --with-status
```
完美用于每日站会 - 显示您正在处理的内容和当前状态。

### 上下文切换
```
/orchestration/resume --save-state
```
在切换到另一个编排前保存当前工作状态。

### 团队交接
```
/orchestration/resume --handoff
```
为另一个开发者生成详细的交接说明。

## 示例

### 示例 1：快速继续
```
/orchestration/resume --latest --pickup-where-left-off
```
在您停止的地方恢复，显示进行中的任务。

### 示例 2：周一早晨
```
/orchestration/resume --since friday --show-completed
```
显示周五做了什么和周一的下一步。

### 示例 3：多个项目
```
/orchestration/resume --all --summary
```
所有活跃编排的快速概览。

## 状态持久化

命令读取自：
- EXECUTION-TRACKER.md 用于进度指标
- TASK-STATUS-TRACKER.yaml 用于当前状态
- 任务文件用于详细上下文
- Git 用于工作目录状态

## 最佳实践

1. **会话开始使用**：开始工作时运行 `/orchestration/resume`
2. **保存状态**：长时间休息前使用 `--save-state`
3. **检查依赖**：审查现在可能已解除阻塞的被阻塞任务
4. **定期提交**：保持 git 状态与任务进度一致

## 注意事项

- 自动检测与任务相关的未提交更改
- 基于依赖关系和优先级建议下一步行动
- 如果正在使用，与 git worktrees 集成
- 保留任务历史以获得完整上下文
