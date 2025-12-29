---
allowed-tools: Read, Write, Edit, Bash
argument-hint: [pr-number] | --team | --estimate | --batch-process | --auto-create
description: 从 GitHub 拉取请求创建 Linear 任务，智能提取内容和任务大小
---

# Task from PR - 从 PR 创建任务

从 GitHub pull requests 创建 Linear 任务,智能分析: **$ARGUMENTS**

## 当前 PR 环境

- 仓库: !`gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || echo "无仓库上下文"`
- PR 状态: 基于 $ARGUMENTS PR 编号或批处理条件
- Linear 团队: 任务分配的可用团队
- 用户映射: GitHub 用户名到 Linear 用户对应关系

## 任务

从 GitHub pull requests 生成 Linear 任务,全面内容分析:

**PR 来源**: 使用 $ARGUMENTS 指定 PR 编号、团队分配、大小估算或批处理模式

**任务生成框架**:
1. **PR 分析** - 提取全面 PR 数据,解析描述结构,识别关键组件,分析变更
2. **内容提取** - 解析结构化部分,提取检查清单,识别技术细节,捕获需求
3. **智能估算** - 从代码变更、文件数量、审查评论、测试需求估算任务复杂度
4. **任务构建** - 以正确格式构建 Linear 任务,保留 PR 上下文,维护引用,结构化内容
5. **团队分配** - 映射到适当的 Linear 团队,基于代码区域分配,从标签设置优先级
6. **验证与创建** - 检查重复,验证任务结构,在 Linear 中创建,建立双向链接

**高级功能**: 智能内容解析,自动大小估算,智能团队映射,全面验证,批处理。

**质量保证**: 重复检测,内容验证,正确格式,关系维护,全面错误处理。

**输出**: 成功创建的 Linear 任务,全面 PR 上下文、准确大小估算、正确团队分配和完整的双向链接。
