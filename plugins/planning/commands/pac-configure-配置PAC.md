---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [project-name] | --minimal | --epic-name | --owner
description: 初始化 Product as Code（PAC）项目结构，包含模板和配置
---

# 配置 PAC 项目

初始化 Product as Code (PAC) 项目结构：**$ARGUMENTS**

## 当前项目状态

- Git 状态：!`git status --porcelain | wc -l` 个未提交的变更
- PAC 结构：!`ls -la .pac/ 2>/dev/null | head -5 || echo "No PAC directory"`
- 现有 epics：!`find .pac/epics/ -name "*.yaml" 2>/dev/null | wc -l`

## 任务

配置和初始化 PAC 项目结构，用于版本控制的产品管理：

**设置流程**：
1. **项目分析** - 验证 git 仓库并分析现有 PAC 结构
2. **目录创建** - 创建 `.pac/` 结构，包含 epics、tickets 和 templates
3. **配置文件** - 生成 `pac.config.yaml`，包含项目元数据和默认值
4. **模板创建** - 创建遵循 PAC v0.1.0 规范的 epic 和 ticket 模板
5. **初始内容** - 基于用户输入创建第一个 epic 和 ticket
6. **集成设置** - 配置 git hooks 和验证脚本

**参数**：使用 --minimal 创建基本结构，--epic-name 设置初始 epic，--owner 设置产品负责人。

**下一步**：使用 `/project:pac-create-epic` 和 `/project:pac-create-ticket` 管理产品开发。
