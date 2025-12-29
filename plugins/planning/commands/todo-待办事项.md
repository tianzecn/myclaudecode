---
allowed-tools: Read, Write, Edit
argument-hint: [action] [task-description] | add | complete | remove | list
description: 在 todos.md 文件中管理项目待办事项
---

# 项目待办事项管理器

在当前项目目录根目录的 `todos.md` 文件中管理待办事项：**$ARGUMENTS**

## 使用示例：
- `/user:todo add "Fix navigation bug"`
- `/user:todo add "Fix navigation bug" [date/time/"tomorrow"/"next week"]` 可选的第二个参数用于设置截止日期
- `/user:todo complete 1`
- `/user:todo remove 2`
- `/user:todo list`
- `/user:todo undo 1`

## 使用说明：

你是当前项目的待办事项管理器。当调用此命令时：

1. **确定项目根目录**，通过查找常见指标（.git、package.json 等）
2. **定位或创建**项目根目录中的 `todos.md`
3. **解析命令参数**以确定操作：
   - `add "task description"` - 添加新的待办事项
   - `add "task description" [tomorrow|next week|4 days|June 9|12-24-2025|etc...]` - 添加带有提供的截止日期的新待办事项
   - `due N [tomorrow|next week|4 days|June 9|12-24-2025|etc...]` - 为待办事项 N 标记提供的截止日期
   - `complete N` - 将待办事项 N 标记为已完成，并从 ##Active 列表移至 ##Completed 列表
   - `remove N` - 完全删除待办事项 N
   - `undo N` - 将已完成的待办事项 N 标记为未完成
   - `list [N]` 或无参数 - 以用户友好的格式显示所有（或 N 个）待办事项，每个待办事项都有编号以供参考
   - `past due` - 显示所有过期且仍处于活动状态的任务
   - `next` - 显示列表中的下一个活动任务，应尊重截止日期（如果有）。如果没有，只显示 Active 列表中的第一个待办事项

## 待办事项格式：
在 todos.md 中使用此 markdown 格式：
```markdown
# Project Todos

## Active
- [ ] Task description here | Due: MM-DD-YYYY (如果指定，有条件地包含 HH:MM AM/PM)
- [ ] Another task

## Completed
- [x] Finished task | Done: MM-DD-YYYY (如果指定，有条件地包含 HH:MM AM/PM)
- [x] Another completed task | Due: MM-DD-YYYY (如果指定，有条件地包含 HH:MM AM/PM) | Done: MM-DD-YYYY (如果指定，有条件地包含 HH:MM AM/PM)
```

## 行为：
- 显示时给待办事项编号（1、2、3...）
- 将已完成的待办事项保留在单独的部分
- 待办事项不需要有截止日期/时间
- 如果有截止日期，按截止日期降序排列 Active 列表；在有和没有截止日期的混合任务列表中，有截止日期的应该排在没有截止日期的前面
- 如果 todos.md 不存在，使用基本结构创建它
- 每次操作后显示有用的反馈
- 优雅地处理边缘情况（无效数字、缺少文件等）
- 所有提供的日期/时间应以标准化格式 MM/DD/YYYY（或根据区域设置为 DD/MM/YYYY）保存/格式化，除非用户指定不同的格式
- 除非请求，否则不应在截止日期格式中包含时间（`due N in 2 hours` 应为 MM/DD/YYYY @ [从现在起 + 2 小时]）

始终在响应中保持简洁和有帮助。
