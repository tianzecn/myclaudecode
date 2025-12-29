---
description: 使用适当的前缀和格式更新分支名称，强制执行命名约定，支持语义前缀，并管理远程分支更新。
author: giselles-ai
author-url: https://github.com/giselles-ai
version: 1.0.0
---

# 更新分支名称

按照以下步骤更新当前分支名称：

1. 使用 `git diff main...HEAD` 检查当前分支与主分支 HEAD 之间的差异
2. 分析已更改的文件以了解正在进行的工作
3. 根据变更确定适当的描述性分支名称
4. 使用 `git branch -m [new-branch-name]` 更新当前分支名称
5. 使用 `git branch` 验证分支名称已更新