---
title: "开源两个 Claude Skill：Codex+NanoBanana"
source: "https://mp.weixin.qq.com/s/O4v6xiDFtojmueUXYjD-Ng"
author:
  - "[[Feisky]]"
published:
publist_time: "2025年11月24日 19:30"
created: 2025-11-28
description: "最近把常用的两个功能做成了 Skill 开源出来，直接替代 MCP。最大的优势是渐进式加载，只在需要的时候才加载相关内容，避免了 Token 浪费的问题，用起来确实省心太多了。"
tags:
  - "#ClaudeCode #TokenOptimization #CodexSkill #NanobananaSkill #OpenSource"
summary: "文章介绍了Claude Code使用MCP时Token占用过高的问题，作者开源了Codex-skill和Nanobanana-skill两个Skill以解决这一问题。"
area: "上海"
site: "微信公众平台"
---
# 文章总结
文章介绍了Claude Code使用MCP时Token占用过高的问题，作者开源了Codex-skill和Nanobanana-skill两个Skill以解决这一问题。
# 标签
#ClaudeCode #TokenOptimization #CodexSkill #NanobananaSkill #OpenSource
# 正文内容
![cover_image](https://mmbiz.qpic.cn/mmbiz_jpg/ibUvYDg8ZxjMcl1cjIpKFWrnVVhiaXdz3kGr9iaRuY2HXncnBrSMLLk2oaLBn4I6LEiaHc7B6VOYuVf5oWZ4aobX8Q/0?wx_fmt=jpeg)

原创 Feisky [Feisky](https://mp.weixin.qq.com/s/) *2025年11月24日 19:30*

Claude Code 配 MCP 有个很大的问题，Token 占用太夸张了。有些项目光是加载 MCP 和上下文就能吃掉 120k + 的 Token，还没开始写代码就已经消耗 60% 的上下文空间了，太离谱了。

最近把常用的两个功能做成了 Skill 开源出来，直接替代 MCP。最大的优势是渐进式加载，只在需要的时候才加载相关内容，避免了 Token 浪费的问题，用起来确实省心太多了。建议你也试试把常用的 MCP 替换成 Skill，节省大量 Token 空间不说，响应速度还会更快、更省钱。

安装方法非常简单。打开 Claude Code 之后，两行命令搞定：

```
/plugin marketplace add feiskyer/claude-code-settings
/plugin install claude-code-settings
```

装完后，你会得到两个 Skill（以及这个项目提供的其他 Agent 和 Slash Command）：

•

Codex-skill：调度 Codex 来实现 Claude Code 的设计、Review 代码或者其他需要强指令遵循的场景。

•

Nanobanana-skill：调用 Gemini 3 Pro Image（也就是 Nano Banana Pro）来绘图、做PPT、画信息图、修改图片等。

•

安装后需要创建 ~/.nanobanana.env 文件并配置 Gemini API Key，格式为 `GEMINI_API_KEY=<your-api-key>` 。

以下是几个使用示例：

Codex：

Nano Banana Pro：

•

Draw an image of a serene mountain landscape at sunset with a lake

•

Draw a 4K image of futuristic cityscape with flying cars

这两个 Skill 我都放在自己的 https://github.com/feiskyer/claude-code-settings 项目里开源了，想试的话按上面的步骤直接装插件就行。

你平时用 Claude Code 的时候，还有哪些好用的 Skill？欢迎在评论区分享。

---

好了，今天就聊到这儿。如果你也在探索 AI 工具和云原生技术,欢迎关注 Feisky 公众号，我会定期分享实践中的发现和踩坑经验。

  

继续滑动看下一个

Feisky

向上滑动看下一个

Feisky