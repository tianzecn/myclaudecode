---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [issue-number] | --team | --project | --close-github | --skip-comments
description: 将单个 GitHub 问题转换为 Linear 任务，全面保留数据
---

# Issue to Linear Task - Issue 转 Linear 任务

将 GitHub issues 转换为 Linear 任务,全面字段映射: **$ARGUMENTS**

## 当前转换上下文

- 仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- Issue 详情: 基于 $ARGUMENTS issue 编号或选择条件
- Linear 团队: 可用的 Linear 团队和项目分配
- 用户映射: @user-mappings.json 或 GitHub-Linear 用户对应关系

## 任务

执行单个 GitHub issues 到 Linear 任务的精确转换:

**Issue 目标**: 使用 $ARGUMENTS 指定 issue 编号、转换选项、团队分配或处理偏好

**转换框架**:
1. **Issue 分析** - 获取完整 issue 数据,提取元数据,分析内容结构,推断优先级
2. **数据转换** - 准确映射字段,转换格式,保留关系,增强描述
3. **Linear 集成** - 以正确格式创建任务,分配团队/项目,设置优先级,管理标签
4. **内容迁移** - 导入带归属的评论,处理附件,保留格式,维护线程
5. **引用管理** - 创建双向链接,更新同步数据库,维护交叉引用,启用导航
6. **验证与确认** - 验证转换准确性,确认字段映射,验证关系,提供预览

**高级功能**: 智能优先级推断,智能用户映射,附件处理,评论线程,全面验证。

**数据保真度**: 保留原始格式,维护所有元数据,保持评论归属,确保关系完整性。

**输出**: 成功转换的 Linear 任务,完整数据保留、准确字段映射、双向引用和全面的转换摘要。
