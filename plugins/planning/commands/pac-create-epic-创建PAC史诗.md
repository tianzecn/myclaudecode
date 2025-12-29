---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [epic-name] | --name | --description | --owner
description: 按照 Product as Code 规范创建新的 PAC 史诗
---

# 创建 PAC 史诗

遵循 Product as Code 规范创建新的 epic，包含引导式工作流：**$ARGUMENTS**

## PAC 配置检查

- PAC 目录：!`ls -la .pac/ 2>/dev/null || echo "No .pac directory found"`
- PAC 配置：@.pac/pac.config.yaml（如果存在）
- 现有 epics：!`ls -la .pac/epics/ 2>/dev/null | head -10`

## 任务

创建新的 Product as Code epic：

**参数**：
- Epic 名称（如果不使用 --name 标志则为必需）
- --name <name>：Epic 名称
- --description <desc>：Epic 描述
- --owner <owner>：Epic 负责人
- --scope <scope>：范围定义

**Epic 创建流程**：
1. 验证 PAC 配置存在（如果缺失，建议使用 `/project:pac-configure`）
2. 从名称生成 epic ID（格式：epic-[kebab-case-name]）
3. 在 `.pac/epics/[epic-id].yaml` 中创建遵循 PAC v0.1.0 规范的 epic YAML 文件
4. 包含必需的元数据：id、name、created 时间戳、owner
5. 添加规范，包含 description、scope、success criteria、constraints、dependencies
6. 创建 epic 目录结构：`.pac/epics/[epic-id]/`
7. 如果存在 `.pac/index.yaml`，更新 PAC 索引
8. 如果在 git 仓库中，创建 git 分支 `pac/[epic-id]`

如果信息缺失，交互式提示用户提供 epic 详情。

**下一步**：使用 `/project:pac-create-ticket --epic [epic-id]` 向此 epic 添加 tickets。
