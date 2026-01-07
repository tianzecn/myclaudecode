---
name: 更新项目文档
description: 手动触发自动化文档更新，更新 CHANGELOG、project-status、architecture 等文档
category: Documentation
tags: [docs, changelog, status]
---

# 更新项目文档

用户手动触发文档更新。执行以下步骤：

## Step 1: 收集信息

1. 回顾本次会话中完成的工作
2. 检查 git status 查看有哪些文件变更
3. 确定变更的类型（新功能/修复/重构/架构变更）

## Step 2: 确认更新范围

向用户确认需要更新哪些文档：

- [ ] CHANGELOG.md - 版本变更记录
- [ ] docs/project-status.md - 项目状态
- [ ] docs/architecture.md - 架构设计（如有架构变更）

## Step 3: 执行更新

### CHANGELOG.md 更新

在适当版本下添加变更记录：

```markdown
### [Category]

- **Feature/Fix Name** - Brief description
```

Categories:

- **Added**: 新功能
- **Changed**: 功能变更
- **Fixed**: Bug 修复
- **Removed**: 移除的功能

### docs/project-status.md 更新

1. 更新 `最后更新` 日期
2. 将完成的任务从"进行中"移到"近期完成"
3. 添加新的进行中任务（如有）
4. 更新"下次继续"建议

### docs/architecture.md 更新（如需要）

- 更新架构图
- 更新模块职责
- 添加新的 ADR（架构决策记录）

## Step 4: 输出总结

完成后输出：

```
📝 文档更新完成：

✅ CHANGELOG.md - [更新内容摘要]
✅ docs/project-status.md - [更新内容摘要]
⏭️ docs/architecture.md - 无需更新

是否需要提交这些文档变更？
```

## 快捷用法

```
/update-docs              # 自动判断并更新所有需要的文档
/update-docs changelog    # 仅更新 CHANGELOG
/update-docs status       # 仅更新 project-status
/update-docs all          # 强制更新所有文档
```
