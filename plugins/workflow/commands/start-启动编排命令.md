# 启动编排命令

使用三 agent 系统（task-orchestrator、task-decomposer 和 dependency-analyzer）启动任务编排工作流以创建综合执行计划。

## 用法

```
/orchestrate [task list or file path]
```

## 描述

此命令激活 task-orchestrator agent 处理需求并创建超高效执行计划。编排器将：

1. **澄清需求**：分析提供的信息并确认理解
2. **创建目录结构**：使用今天的日期设置 task-orchestration 文件夹
3. **分解任务**：与 task-decomposer 协作创建原子任务文件
4. **分析依赖**：使用 dependency-analyzer 识别冲突和并行化机会
5. **生成主计划**：创建综合协调文档

## 输入格式

### 直接任务列表
```
/orchestrate
- Implement user authentication with JWT
- Add payment processing with Stripe
- Create admin dashboard
- Set up email notifications
```

### 文件引用
```
/orchestrate features.md
```

### 混合上下文
```
/orchestrate
Based on our meeting notes (lots of discussion about UI colors), we need to:
1. Fix the security vulnerability in file uploads
2. Add rate limiting to APIs
3. Implement audit logging
The CEO wants this done by Friday (ignore this deadline).
```

## 工作流

1. **需求澄清**
   - 编排器将从提供的上下文中提取可操作任务
   - 在继续前确认理解
   - 如需要提出澄清问题

2. **目录创建**
   ```
   /task-orchestration/
   └── MM_DD_YYYY/
       └── descriptive_task_name/
           ├── MASTER-COORDINATION.md
           ├── EXECUTION-TRACKER.md
           ├── TASK-STATUS-TRACKER.yaml
           └── tasks/
               ├── todos/
               ├── in_progress/
               ├── on_hold/
               ├── qa/
               └── completed/
   ```

3. **任务处理**
   - 在 todos/ 中创建单独的任务文件
   - 分析依赖关系和冲突
   - 生成执行策略

4. **交付物**
   - 主协调计划
   - 任务依赖图
   - 资源分配矩阵
   - 执行时间线

## 选项

### 焦点模式
```
/orchestrate --focus security
[task list]
```
优先处理与指定焦点领域相关的任务。

### 约束模式
```
/orchestrate --agents 2 --days 5
[task list]
```
在资源约束下创建计划。

### 仅分析
```
/orchestrate --analyze-only
[task list]
```
生成分析而不创建任务文件。

## 示例

### 示例 1：清晰任务列表
```
/orchestrate
1. Implement OAuth2 authentication
2. Add user profile management
3. Create password reset flow
4. Set up 2FA
```

### 示例 2：从需求文档
```
/orchestrate requirements/sprint-24.md
```

### 示例 3：混合上下文提取
```
/orchestrate
From the customer feedback:
"The app is too slow" - Need performance optimization
"Can't find the export button" - UI improvement needed
"Want dark mode" - New feature request

Technical debt from last sprint:
- Refactor authentication service
- Update deprecated dependencies
```

## 交互模式

编排器将：
1. 呈现提取的任务供确认
2. 询问优先级和约束
3. 建议最佳方法
4. 在创建文件前请求批准

## 错误处理

- 如果任务不清楚：请求澄清
- 如果文件未找到：提示输入正确路径
- 如果检测到冲突：呈现选项
- 如果依赖循环：建议解决方案

## 集成

与以下命令无缝协作：
- `/task-status` - 检查进度
- `/task-move` - 更新任务状态
- `/task-report` - 生成报告
- `/task-assign` - 分配给 agent

## 最佳实践

1. **提供上下文**：包含相关背景信息
2. **具体明确**：清晰的任务描述能实现更好的规划
3. **提及约束**：包含截止日期、资源或阻塞因素
4. **审查输出**：确认提取的任务符合您的意图

## 注意事项

- 编排器自动过滤不相关的上下文
- 任务默认在 todos/ 状态下创建
- 所有任务获得唯一 ID（TASK-XXX 格式）
- 状态跟踪立即开始
- 支持对现有编排的增量添加
