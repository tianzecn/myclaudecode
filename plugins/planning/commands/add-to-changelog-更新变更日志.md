---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [version] [change-type] [message] | --added | --changed | --fixed
description: 按照 Keep a Changelog 格式向项目变更日志添加条目
---

# 更新变更日志

向项目的 CHANGELOG.md 文件添加新条目：**$ARGUMENTS**

## 使用示例
- `/add-to-changelog 1.1.0 added "New markdown to BlockDoc conversion feature"`
- `/add-to-changelog 1.0.2 fixed "Bug in HTML renderer causing incorrect output"`

## 当前变更日志状态

- 现有变更日志：@CHANGELOG.md（如果存在）
- 项目版本文件：@package.json 或 @setup.py（如果存在）

## 任务

将指定的变更条目添加到 CHANGELOG.md：

**参数**：
- Version：第一个参数（例如，"1.1.0"）
- Change Type：第二个参数（added/changed/deprecated/removed/fixed/security）
- Message：第三个参数（变更的描述）

**要求**：
1. 如果不存在，则创建带有标准标题的 CHANGELOG.md
2. 查找或创建带有今天日期的版本部分
3. 在适当的变更类型部分下添加条目
4. 遵循 Keep a Changelog 格式和语义化版本控制
5. 如果这是新版本，更新包版本文件

变更日志应遵循 [Keep a Changelog](https://keepachangelog.com/) 格式。
