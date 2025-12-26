---
title: "我都装了哪些超级好用的Claude Code Skills？"
source: "https://mp.weixin.qq.com/s/227ww4re8falYQrjpP7SSw"
author:
  - "[[node]]"
published:
publist_time: "2025年11月26日 17:37"
created: 2025-11-28
description: "本文整理了用户常用的官方、第三方及自编技能"
tags:
  - "#ClaudeSkills #文档处理 #开发工具 #自动化 #效率提升"
summary: "这篇文章介绍了作者常用的Claude Skills，包括官方和第三方开发的工具，涵盖了文档处理、开发、调试、自动化等多个领域。"
area: "湖北"
site: "微信公众平台"
---
# 文章总结
这篇文章介绍了作者常用的Claude Skills，包括官方和第三方开发的工具，涵盖了文档处理、开发、调试、自动化等多个领域。
# 标签
#ClaudeSkills #文档处理 #开发工具 #自动化 #效率提升
# 正文内容
原创 node *2025年11月26日 17:37*

整理一下我最近经常使用的Skill，有官方的也有第三方的还有自己写的。

![129a9c81-a676-4bf9-a8e9-70838bc3619a.png](https://mmbiz.qpic.cn/sz_mmbiz_png/4HWyricuhgQejjx85TuMQFcS7CrkPQx0z0h38gmmee951h9Uw6RUqC0Fjskl38ILaLeeKia7SDjQB4IeSiboGPJfw/640?wx_fmt=png&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

先介绍官方的Skills，由Anthropic 官方维护，质量上乘，可以直接在Web和Claude Code中使用，基本上每个都很好用，也是参照学习的典范。

### docx - Word 文档处理

一个全面的 Word 文档创建、编辑和分析工具。

支持批注、修订追踪、格式保留和文本提取。

适用于创建新文档、修改内容、处理法律/商业文档的批注审阅流程。

https://github.com/anthropics/skills/tree/main/document-skills/docx

### pdf - PDF 操作工具包

综合性 PDF 处理工具，支持文本和表格提取、创建新 PDF、合并/拆分文档、表单填写和处理。

这个Skill是处理 PDF 文件的首选方案， 我一般就扔个PDF后它会自动进行处理。

https://github.com/anthropics/skills/tree/main/document-skills/pdf

### xlsx - Excel 电子表格

电子表格操作全能工具，包含了公式计算、图表生成、数据转换、格式化。

也支持读取分析现有文件或创建复杂的数据报表。

https://github.com/anthropics/skills/tree/main/document-skills/xlsx

### mcp-builder - MCP 服务器开发指南

用于高质量 MCP服务器开发。光写描述就可以了。

目前支持 FastMCP和 TypeScript 两种技术栈，包含代理中心设计原则和最佳实践。

https://github.com/anthropics/skills/tree/main/example-skills/mcp-server

### brand-guidelines - 品牌规范应用

可以直接通过这个快速复制Anthropic官方品牌颜色和字体。

https://github.com/anthropics/skills/tree/main/example-skills/brand-guidelines

internal-comms - 内部沟通文档

写方案必备，用于撰写各类内部沟通文档，象是状态报告、领导层更新、公司通讯、FAQ、事件报告等，它里还内置了提供专业的企业沟通模板。

https://github.com/anthropics/skills/tree/main/example-skills/internal-comms

### superpowers - 超能力技能库

社区评价最高的综合技能库，包含 20+ 实战技能。 提供 TDD、调试、协作模式等核心开发工作流。

内置 `/brainstorm` 、 `/write-plan` 、 `/execute-plan` 等强大命令。

自动代码审查工作流，Git worktree 并行开发，子代理驱动开发模式，技能质量测试框架

https://github.com/obra/superpowers

### systematic-debugging - 系统化调试

遇到 bug、测试失败或意外行为时的标准化调试流程。

在提出修复方案之前，强制执行系统化的问题分析步骤，避免盲目猜测。

https://github.com/travisvn/awesome-claude-skills

### test-driven-development - 测试驱动开发

实现任何功能或修复 bug 时，在编写实现代码之前先编写测试。

确保代码质量和可维护性的核心实践。

https://github.com/obra/superpowers/tree/main/skills/test-driven-development

### subagent-driven-development - 子代理驱动开发

为独立任务派发子代理，在迭代之间设置代码审查检查点。实现快速、可控的开发流程。

https://github.com/travisvn/awesome-claude-skills

###claude-starter - Claude Code 启动模板

生产就绪的 Claude Code 配置模板，包含 40 个自动激活技能，覆盖 8 大领域。

支持 TOON 格式，可节省 30-60% token 消耗。

https://github.com/travisvn/awesome-claude-skills

### using-git-worktrees Git Worktree 使用

创建隔离的 git worktree，支持智能目录选择和安全验证。

实现真正的并行开发分支管理。

https://github.com/obra/superpowers/tree/main/skills/using-git-worktrees

### iOS-Simulator - iOS 模拟器交互

让 Claude 能够与 iOS 模拟器交互，用于测试和调试 iOS 应用程序。

移动开发者的效率工具。

https://github.com/ComposioHQ/awesome-claude-skills

### Changelog-Generator - 更新日志生成器

从 git 提交记录自动创建面向用户的更新日志。

将技术性提交信息转换为客户友好的发布说明。

https://github.com/ComposioHQ/awesome-claude-skills

### frontend-design - 前端设计

创建独特的生产级前端界面。

生成富有创意、精致的代码，避免通用的 AI 风格美学。

https://github.com/mrgoonie/claudekit-skills/tree/main/frontend-design

### chrome-devtools - Chrome 开发工具

使用 Puppeteer CLI 脚本进行浏览器自动化、调试和性能分析。支持截图、网络监控、表单自动化等。

https://github.com/mrgoonie/claudekit-skills/tree/main/chrome-devtools

### meeting-insights-analyzer - 会议洞察分析

将会议记录转化为关于沟通模式的可操作洞察，提升会议效率和团队协作。

https://github.com/BehiSecc/awesome-claude-skills

### file-organizer - 文件整理器

智能整理电脑上的文件和文件夹， 自动分类、重命名、归档，保持工作区整洁。

https://github.com/BehiSecc/awesome-claude-skills

### claude-code-terminal-title - 终端标题管理

为每个 Claude Code 终端窗口设置动态标题，描述正在进行的工作， 任务管理不再混乱。

https://github.com/BehiSecc/awesome-claude-skills

### alirezarezvani/claude-skills

42 个领域专家 Skills，从营销到工程全覆盖。包含 Python 分析工具、知识库和即用模板。

https://github.com/alirezarezvani/claude-skills

### 小红书全自动图文视频发布

使用这个Skill来处理繁琐的图片文本上传，自动润色文章内容。

[使用Claude Code Skills实现小红书全自动图文视频发布Agent](https://mp.weixin.qq.com/s?__biz=MzIzMzQyMzUzNw==&mid=2247507574&idx=1&sn=6ccd63ca2880a1cd0c642571c9d7acfc&scene=21#wechat_redirect)

### Nano漫画风格学习读本

结合当下最火的nano banana来生成多张连续的漫画读本，给小孩子解释科学知识用的。

[使用Claude Code Skill 实现爆火的Nano漫画风格学习读本工作流](https://mp.weixin.qq.com/s?__biz=MzIzMzQyMzUzNw==&mid=2247509044&idx=1&sn=14e976c6de43fa759f4f6b4576f545b4&scene=21#wechat_redirect)

Skill的相关使用可以直接查看字节笔记网微信公众号的历史推送。

  

继续滑动看下一个

字节笔记本

向上滑动看下一个