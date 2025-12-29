# 任务查找命令

使用各种条件在所有编排中搜索和定位任务。

## 用法

```
/task-find [search-term] [options]
```

## 描述

强大的搜索功能，可通过 ID、内容、状态、依赖关系或任何其他条件快速定位任务。支持正则表达式、模糊匹配和复杂查询。

## 基本搜索

### 按任务 ID
```
/task-find TASK-001
/task-find TASK-*
```

### 按标题/内容
```
/task-find "authentication"
/task-find "payment processing"
```

### 按状态
```
/task-find --status in_progress
/task-find --status qa,completed
```

## 高级搜索

### 正则表达式
```
/task-find --regex "JWT|OAuth"
/task-find --regex "TASK-0[0-9]{2}"
```

### 模糊搜索
```
/task-find --fuzzy "autentication"  # 找到 "authentication"
/task-find --fuzzy "paymnt"         # 找到 "payment"
```

### 多条件
```
/task-find --status todos --priority high --type feature
/task-find --agent dev-backend --created-after yesterday
```

## 搜索操作符

### 布尔操作符
```
/task-find "auth AND login"
/task-find "payment OR billing"
/task-find "security NOT test"
```

### 字段特定搜索
```
/task-find title:"user authentication"
/task-find description:"security vulnerability"
/task-find agent:dev-frontend
/task-find blocks:TASK-001
```

### 日期范围
```
/task-find --created "2024-03-10..2024-03-15"
/task-find --modified "last 3 days"
/task-find --completed "this week"
```

## 输出格式

### 默认列表视图
```
找到 3 个匹配 "authentication" 的任务：

TASK-001: Implement JWT authentication
  Status: in_progress | Agent: dev-frontend | Created: 2024-03-15
  Location: /task-orchestration/03_15_2024/auth_system/tasks/in_progress/

TASK-004: Add OAuth2 authentication
  Status: todos | Priority: high | Blocked by: TASK-001
  Location: /task-orchestration/03_15_2024/auth_system/tasks/todos/

TASK-007: Authentication middleware tests
  Status: todos | Type: test | Depends on: TASK-001
  Location: /task-orchestration/03_15_2024/auth_system/tasks/todos/
```

### 详细视图
```
/task-find TASK-001 --detailed
```
显示完整任务内容，包括描述、实现说明和历史。

### 树形视图
```
/task-find --tree --root TASK-001
```
以树形格式显示任务及其所有依赖。

## 过滤选项

### 按编排
```
/task-find --orchestration "03_15_2024/payment_system"
/task-find --orchestration "*/auth_*"
```

### 按属性
```
/task-find --has-dependencies
/task-find --no-dependencies
/task-find --blocking-others
/task-find --effort ">4h"
```

### 按关系
```
/task-find --depends-on TASK-001
/task-find --blocks TASK-005
/task-find --related-to TASK-003
```

## 特殊搜索

### 查找循环依赖
```
/task-find --circular-deps
```

### 查找孤立任务
```
/task-find --orphaned
```

### 查找重复任务
```
/task-find --duplicates
```

### 查找过期任务
```
/task-find --stale --days 7
```

## 快速过滤器

### 准备开始
```
/task-find --ready
```
显示没有阻塞依赖的 todos。

### 关键路径
```
/task-find --critical-path
```
显示关键路径上的任务。

### 高影响
```
/task-find --high-impact
```
显示阻塞多个其他任务的任务。

## 导出选项

### 复制结果
```
/task-find "auth" --copy
```
将结果复制到剪贴板。

### 导出路径
```
/task-find --status todos --export paths
```
导出文件路径用于批量操作。

### 生成报告
```
/task-find --report
```
创建详细搜索报告。

## 示例

### 示例 1：为 Agent 查找工作
```
/task-find --status todos --suitable-for dev-frontend --ready
```

### 示例 2：查找阻塞问题
```
/task-find --status on_hold --show-blockers
```

### 示例 3：安全审计
```
/task-find "security OR auth OR permission" --type "feature,bugfix"
```

### 示例 4：冲刺规划
```
/task-find --status todos --effort "<4h" --no-dependencies
```

## 搜索快捷方式

### 最近任务
```
/task-find --recent 10
```

### 我的任务
```
/task-find --mine  # 使用当前 agent 上下文
```

### 今天修改的
```
/task-find --modified today
```

## 复杂查询

### 复合搜索
```
/task-find '(title:"auth" OR description:"security") AND status:todos AND -blocks:*'
```

### 保存的搜索
```
/task-find --save "security-todos"
/task-find --load "security-todos"
```

## 性能提示

1. **使用索引**：状态和 ID 搜索最快
2. **缩小范围**：尽可能指定编排
3. **缓存结果**：对重复搜索使用 `--cache`
4. **限制结果**：对大结果集使用 `--limit 20`

## 集成

### 与其他命令
```
/task-find "payment" --status todos | /task-move in_progress
```

### 批量操作
```
/task-find --filter "priority:low" | /task-update priority:medium
```

## 注意事项

- 搜索 task-orchestration/ 中的所有任务文件
- 默认不区分大小写（使用 --case 区分大小写）
- 结果按相关性排序，除非另有说明
- 支持使用管道操作符进行命令链接
- 文件更改时自动更新搜索索引
