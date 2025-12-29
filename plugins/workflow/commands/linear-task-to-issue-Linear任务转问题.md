---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [task-id] | --repo | --milestone | --close-linear | --skip-attachments
description: 将 Linear 任务转换为 GitHub 问题，保留关系和元数据映射
---

# Linear Task to Issue - Linear 任务转 Issue

将 Linear 任务转换为 GitHub issues,全面关系映射: **$ARGUMENTS**

## 当前任务上下文

- 任务详情: 基于 $ARGUMENTS 任务标识符或选择条件
- 目标仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- 用户映射: Linear 邮箱到 GitHub 用户名对应关系
- 附件处理: Linear 附件访问和 GitHub 上传能力

## 任务

执行 Linear 任务到 GitHub issues 的精确转换:

**任务目标**: 使用 $ARGUMENTS 指定任务标识符、目标仓库、里程碑映射或处理偏好

**转换框架**:
1. **任务分析** - 获取完整 Linear 任务数据,提取关系,分析内容结构,识别优先级
2. **内容转换** - 构建 GitHub issue 主体,映射 Linear 字段,保留格式,处理富文本内容
3. **GitHub 集成** - 以正确结构创建 issue,应用标签,分配用户,设置里程碑,管理关系
4. **附件迁移** - 下载 Linear 附件,上传到 GitHub,更新引用,维护可访问性
5. **评论导入** - 转移带归属的评论,保留时间戳,维护上下文,处理提及
6. **交叉引用设置** - 创建双向链接,更新 Linear 任务,维护同步数据库,启用导航

**高级功能**: 富文本内容转换,附件处理,关系映射,用户提及翻译,全面验证。

**关系管理**: 保留父子关系,维护团队上下文,映射项目关联,处理依赖关系。

**输出**: 成功创建的 GitHub issue,完整数据迁移、准确字段映射、保留关系和全面的转换报告。
