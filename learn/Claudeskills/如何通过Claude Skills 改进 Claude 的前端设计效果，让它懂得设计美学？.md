---
title: "如何通过Claude Skills 改进 Claude 的前端设计效果，让它懂得设计美学？"
source: "https://mp.weixin.qq.com/s/SLCTa7uOujyqOMVjs6yvfw"
author:
  - "[[微信公众平台]]"
published:
publist_time: "2025年11月14日 18:01"
created: 2025-11-17
description: "建议收藏"
tags:
summary: "本文阐述了Claude推出的“Skills”机制。该机制通过按需加载独立技能包动态引导模型，解决了大模型因“分布收敛”而产生的设计平庸问题，使其能从生成“AI模板网站”转变为输出具有品牌特色和高级审美的前端代码。"
area: "北京"
site: "微信公众平台"
---
# 文章总结
本文阐述了Claude推出的“Skills”机制。该机制通过按需加载独立技能包动态引导模型，解决了大模型因“分布收敛”而产生的设计平庸问题，使其能从生成“AI模板网站”转变为输出具有品牌特色和高级审美的前端代码。
# 标签

# 正文内容
*2025年11月14日 18:01*

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/Noq6Cbiaibsbe819d50fXw5b19llwibD1xPibFjVXOZcuvbMNWWmKOpnIkpVC257ibNG0I1OM6xKkvuQnKZ9FrBic3xw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

【温馨提示】： 本文内容整理自网络，旨在进行信息分享与学习交流，若涉及版权问题，请原作者随时通过后台联系我们，我们将第一时间删除。感谢理解！

  

  

一个普遍现象：

> “如果让一个大模型生成网页，而不给任何具体要求，它几乎总会输出白底紫色渐变、Inter 字体、简单布局。”

这并不是 Claude 或 ChatGPT“懒”，而是模型的自然倾向。 原因在于—— **分布收敛（Distributional Convergence）** ：  

  
AI 在采样生成内容时，会倾向于“训练数据中最常见、最安全”的设计样式。

  

结果就是：

- 生成的页面安全但平庸；
- 缺乏品牌特色；
- 看起来像“AI模板网站”。

  

Claude 团队称这种现象为 **“AI Slop”美学** —— 即AI生成的那种无差别、无灵魂的统一风格。

## 关键思路：通过「Skills」加载专属设计指导

  

Claude 提出的解决方案是一个新机制：

> **Skills（技能系统）——按需加载的可重用上下文模块。**

  

传统做法是：  
在系统提示（system prompt）中塞入大量风格和规则， 但这样会让模型在执行其他任务（如写代码、分析数据）时被无关信息干扰。

**Skills 机制的核心改进是：**

- 把某一类专业知识（如前端设计规范）写成独立的文档；
- Claude 只在相关任务（如生成网页）时 **动态加载** 这些文档；
- 执行完任务后自动卸载，无需占用上下文。

  

换句话说：

> Claude 可以像调用“插件”一样，随时取用特定技能，而不会“记混”不同任务的上下文。

## Claude 的前端设计 Skill 案例

  

Claude 团队开发了一个约 **400 tokens** 的前端美学技能包， 这个技能能让 Claude 在生成网页代码时自动遵循更高级的设计原则。

  

Skill 内容涵盖四个关键维度👇

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qa8fgxD0icxJ0Se89L5AXd49iczSpBQxZphjwbv6hYSh30kIdzT3SKmVA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)

  

📌 重点在于：Claude 不再是“你告诉它用什么颜色”， 而是理解“ **如何构建一个有风格的设计系统** ”。

## 实际效果：Claude 学会“有审美的设计”

Claude 团队展示了几组对比案例👇

### 🖥️ 1. SaaS 落地页

- ❌ 无Skill版本：白底 + 紫渐变 + Inter 字体。
![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qsdDZfXVKaqR5y8doEuX6gAz5uUBOVguC5QGyIicdPV8IMesT8gIq0nA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2)

  

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qibIvROAZHq5tbyc1Ej0pXm0dOwia42UUIpaw3jKMGI2mk2micIeVJ5fuQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)

### 📚 2. 博客布局

- ❌ 默认输出：系统字体 + 平面布局。
	![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8q3YVAujFHTpoIIpYZJ22SewbVC1Vzo1EPP8AyOl8sjSqJh8JwSX6ibsw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4)
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qL5BNnFiaV4Q8E70QibiaEUxzicOY2P5iajzCPauwicyEeI8lo5susb4nBbYw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5)

### 🧭 3. 管理面板

- ❌ 传统UI：灰白色、扁平。
	![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8q95tx1Rh9iceP8S0m0sMaxiaG1q9iaEsB5Cav3vmAcx49Q0JibIhm7QESpA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6)
- ![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8ql0jw8LluqGjfsSmSViag7yn0DVmtJiaNHJTuiaJIM2eftumwmpaOMCKsQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7)

  

Claude 的设计表现变得更像“人类前端工程师的作品”， 而非生成式AI的模板产物。

## 第二个Skill：web-artifacts-builder

除了视觉美感，Claude 团队还发现另一个问题—— Claude 默认只能在 **单一 HTML 文件** 中生成前端项目。 这导致复杂项目（如 React 应用）难以构建。

  

于是他们又开发了 **web-artifacts-builder Skill** ：

- 帮助 Claude 自动创建多文件 React + Tailwind CSS 项目；
- 在内部使用 Parcel 打包成单文件，以便预览。

  

📈 效果：

- 生成的应用结构更清晰，交互功能更完整；
- 例如任务管理器、白板应用都变得功能丰富、代码优雅。

---

## 核心思想：模型有能力，只缺“领域引导”

Claude 团队在结尾强调：

> “Claude 并不是不会设计，而是默认过于保守。”

  

通过 Skills：

- 你可以把“公司设计规范”、“组件风格”、“动画习惯”写入独立 Skill；
- Claude 在需要时调用，从而持续输出 **符合团队标准的界面** 。

  

换句话说， **Skill 就是组织级 Prompt 模板** ：

- 可复用
- 可分享
- 可版本管理

  

最终，让 AI 设计不只是生成，而是 **体系化协作** 。

## 一句话总结

> **Claude 的 Skills 机制，让 AI 从“会写代码”进化为“懂设计”。**  
> 它让模型在每次任务中都能调用最合适的领域知识，  
> 让前端生成从“模板式输出”变成“品牌级创造”。

---

**以下是 Calude 团队内容全文翻译**

## Improving frontend design through Skills

## 通过Claude Skills改进前端设计

---

  

当你让一个 LLM 在没有明确指引的情况下构建一个落地页时，你会发现它几乎总会默认使用 Inter 字体、白底紫色渐变、极少的动效。

  

问题出在哪？ 分布式收敛（distributional convergence）。在采样阶段，模型根据训练数据中的统计模式来预测 token。那些“安全”的设计选择，也就是普遍适用、不会冒犯任何人的设计，在网页训练数据中的出现频率最高。没有额外指令时，Claude 就会从这个高概率中心采样。

  

对于做 ToC 产品的开发者来说，这种千篇一律的审美会削弱品牌辨识度。而 AI 生成的界面很快会被看出“AI 味太重”并被忽略。

  

### The steerability challenge

### 可控性挑战

  

好消息是：Claude 在正确提示下高度可控。比如告诉 Claude “不要用 Inter 和 Roboto” 或 “用氛围背景而不是纯色背景”，效果立刻变好。这种对指令的敏感性反而是一种能力，它意味着 Claude 能适应不同设计语境、约束与审美偏好。

  

但问题随之而来：任务越专业，你需要提供的上下文越多。对于前端设计，有效指导涉及字体原则、色彩理论、动画模式、背景策略等多个维度。你必须明确告诉模型哪些默认要避开、哪些备选方案要优先。

  

你当然可以把所有内容塞进系统提示词里，但那样所有任务——无论是写 Python、分析数据、写邮件——都会背上前端设计的上下文负担。于是问题变成：如何在“需要的时候”提供 Claude 专业领域指导，同时又不让无关任务被迫背负额外上下文？

  

## Skills: dynamic context loading

## Skills：动态加载上下文

这正是 Skills 的用途：按需提供专业化上下文，而无需长期占用上下文窗口。Skill 本质上是一个文档（通常是 markdown），里面包含指导、限制与领域知识，放在 Claude 可以通过文件读取工具访问的目录中。Claude 可以在运行时动态加载这些技能，逐步增强其上下文，而不是一开始就把所有内容塞进来。

  

当 Claude 装备好这些技能以及读取它们的工具后，它能根据任务自动识别并加载相关的技能。例如，当被要求构建 landing page 或创建 React 组件时，Claude 可以按需加载前端设计技能，并即时应用这些指令。这就是关键心智模型：Skills 是按需激活的提示与上下文资源，为特定任务提供专业指导，并避免永久性占用上下文。

  

这样开发者便能在不扩张上下文窗口的情况下，充分利用 Claude 的可控性。正如我们之前讨论的，过多上下文会损害模型表现，保持上下文轻量且聚焦极其关键。Skill 让有效提示可复用且上下文化。

  

## Prompting for better frontend output

## 通过提示提升前端输出质量

我们可以通过创建一个前端设计技能，在不增加永久上下文负担的情况下，大幅提升 Claude 生成的 UI。核心思路是，把前端设计当作前端工程师思考的方式来处理。你越能把审美改进映射到可实现的前端代码，Claude 执行得就越好。

  

基于这一点，我们总结了几个提示特别有效的维度：字体、动效、背景效果和主题。这些都能很自然映射到可写的代码。在提示中实现这一点不需要技术细节，只需使用更具针对性的语言，让模型更认真地思考这些设计轴即可。这和我们在上下文工程文章中提出的“选择合适高度提示”的理念一致：既避免低水平的硬编码（如指定具体 hex 色值），也避免高空虚指令。

  

### Typography

### 字体

我们先从字体入手。下面这个提示能明显让 Claude 使用更有趣的字体：

```
<use_interesting_fonts>
  Typography instantly signals quality. Avoid using boring, generic fonts. Never use: Inter, Roboto, Open Sans, Lato, default system fonts Here are some examples of good, impactful choices: - Code aesthetic: JetBrains Mono, Fira Code, Space Grotesk - Editorial: Playfair Display, Crimson Pro - Technical: IBM Plex family, Source Sans 3 - Distinctive: Bricolage Grotesque, Newsreader Pairing principle: High contrast = interesting. Display + monospace, serif + geometric sans, variable font across weights. Use extremes: 100/200 weight vs 800/900, not 400 vs 600. Size jumps of 3x+, not 1.5x. Pick one distinctive font, use it decisively. Load from Google Fonts.
</use_interesting_fonts>
```

**仅使用基础提示词的输出：**

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qW1jTY4U4c1A1IQXDgSU2wuwRgXr5FnXCqNgg4NvdiafHjIRXuPKm0ibA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=8)

**加入字体技能后的输出：**

**![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qf1nOcDia5HMPRJ9LrmVh8thEzlQpADl20YOMg0NUW4xeDibX3brY6juw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=9)**

很有趣的是，强调字体会顺带让模型在其他设计层面也做得更好。

  

字体只是第一步，那整个界面的审美一致性呢？

  

### Themes

### 主题

另一个有效维度是让设计靠近某种主题风格。Claude 对各种流行主题很熟，我们可以用这些主题来告诉它我们想要的审美。例如：

  

```
<always_use_rpg_theme>
  Always design with RPG aesthetic: - Fantasy-inspired color palettes with rich, dramatic tones - Ornate borders and decorative frame elements - Parchment textures, leather-bound styling, and weathered materials - Epic, adventurous atmosphere with dramatic lighting - Medieval-inspired serif typography with embellished headers
</always_use_rpg_theme>
```

  

这会生成如下的 RPG 风 UI：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qQXBepf1sasJRLbJ20fH3icVv2M6sREM66tqdBhOAwEkqkZJFTSd5Gibw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=10)

  

字体和主题证明了针对性提示的有效性。但如果每个维度都要手动写提示，就太繁琐了。那么我们能否把所有改进都合并成一个可复用资产？

  

### A general-purpose prompt

### 一个通用提示

同样的原则适用于动效（动画与微交互）与背景设计（深度感、氛围感）。于是我们打造了一个约 400 tokens 的技能提示——足够精简，不会造成上下文膨胀，但能显著改善字体、色彩、动效与背景：

  

```
<frontend_aesthetics>
  You tend to converge toward generic, "on distribution" outputs. In frontend design,this creates what users call the "AI slop" aesthetic. Avoid this: make creative,distinctive frontends that surprise and delight. Focus on: - Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics. - Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration. - Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. - Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic. Avoid generic AI-generated aesthetics: - Overused font families (Inter, Roboto, Arial, system fonts) - Clichéd color schemes (particularly purple gradients on white backgrounds) - Predictable layouts and component patterns - Cookie-cutter design that lacks context-specific character Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you
  think outside the box!
</frontend_aesthetics>
```

  

在这个例子里，我们先提供目标与问题背景，这有助于模型对齐预期。然后我们按前面提到的设计维度逐项给出指导。最后加入额外限制，避免 Claude 跳到另一个局部最优解，例如频繁使用 Space Grotesk 字体。最后的“think outside the box”强化了创造性。

  

### Impact on frontend design

### 前端设计效果提升

加载该技能后，Claude 在多种前端任务中的输出都会变得更好，包括：

  

**示例 1：SaaS 落地页**

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qcdMx7ukOG6Smvk4hrAPYA3PsWdXnar8KdekkIPG33qLX2Agh0nPxHA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=11)

**AI 生成的 SaaS 登录页面，采用通用 Inter 字体、紫色渐变和标准布局，未使用任何技能。**

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qxNOREHXKRAhH1iawuBJJ0C0b5bMUZdzu19NI5HSRGOWn35HIt17IzVQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=12)

*在与上述渲染图相同的提示下，结合前端技能，AI 生成的前端现在具有独特的排版、协调的配色方案和分层背景*

**示例 2：博客布局**

**![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qt1xVIC76kpVSXf6ENWOicfcMbMDfxklFBia8B0UZXLoziaAkxyOPXAF0Q/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=13)**

*AI 生成的博客布局，采用默认系统字体和纯白色背景，未使用任何技能*

*![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qy1FYLuwjH50hTrDbzS3kM8n29pywDO2vOGklDmaAichyXZ5cH1tj2Uw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=14)*

*使用与前端技能相同的提示生成的 AI 博客布局，具有大气深度和精致间距的编辑字体*

**示例 3：后台仪表板**

**![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qp2CYf5ic08TGux8POsqF5CicS2l7RmO2URamibRt1bKm0BRxbtzkfuHDw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=15)**

*AI 生成的管理仪表盘，包含标准 UI 组件，视觉层次结构极少，未使用技能*

*![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8q9FkZfgCtDaB5J6FmH7uBLkYYT5qgfVJVXYibHyPANUDTFibsUNxsRvhw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=16)*

*AI 生成的管理仪表板，具有大胆的排版、统一的深色主题和有目的的动效，除了前端技能外，还使用了相同的提示*

## Improving artifact quality in claude.ai with Skills

## 使用 Skills 改善 claude.ai 中的 artifact 质量

审美不是唯一限制。Claude 在构建 artifact 时也受架构限制。Artifacts 是 Claude 在聊天界面中生成与展示的可编辑内容，如代码或文档。

  

Claude 默认只构建“单文件 HTML + CSS + JS”，因为它理解 artifact 只有保持单 HTML 才能被正确渲染。

  

就像你让一个前端工程师只能写一个 HTML 文件，他们也很难构建复杂界面。因此我们推测，如果给 Claude 提供使用更丰富工具链的指令，它能够生成更强大的 artifact。

  

于是我们创建了 web-artifacts-builder skill。它利用 Claude 的 use a computer，指导 Claude 用多个文件与现代 Web 技术（React、Tailwind、shadcn/ui）构建 artifact。技能内部暴露脚本：（1）快速搭建 React 项目，（2）使用 Parcel 将最终项目打包为一个 HTML 文件以满足 artifact 渲染要求。

  

这样 Claude 就能轻松使用 Tailwind 的响应式布局、shadcn/ui 的组件等工具构建更完整的应用。

  

**示例：白板应用**

当在没有 web-artifacts-builder 技能的情况下提示 Claude 创建一个白板应用时，Claude 输出了一个非常基本的界面：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qCSCKNTkAsA25CBRa4YqvxibvMs5ZUY3pRibkxWkuKH9UlaT9FVSW3hRw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=17)

  

另一方面，当使用新的 web-artifacts-builder 技能时，Claude 开箱即用地生成了一个更简洁、功能更丰富的应用程序，其中包括绘制不同的形状和文本：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qE4asGJibHUMtEvxEyruQLIURkHnlzDqA21FlS2yWZcicKw0hgyQyqVNg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=18)

  

**示例：任务管理应用**

同样，当被要求创建一个任务管理应用程序时，如果没有技能，Claude 生成了一个功能齐全但非常简单的应用程序：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qMPjkMQYouDiaoX55qsBxVwC8QQxymKmFySrLP26PhSyF5zw2v4ZdKVA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=19)

  

有了技能，Claude 生成的应用程序开箱即用就具有更多功能。例如，Claude 包含了一个“创建新任务”表单组件，允许用户为任务设置关联的类别和截止日期：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qgRetmJmDBv3Lvibt9MgaPE4tGoEERVcDrzcsFkIiaxBJVlHqYLgBnEtQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=20)

  

要使用该技能，只需在 Claude.ai 中启用它，并在构建 artifact 时告诉 Claude “use the web-artifacts-builder skill”。

  

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/Noq6CbiaibsbdvhAQxXbbLrTam9f0D5N8qaBVGQPocHiaqUCRDPaI0thhWxXOe4FXOfMOOM8N0b0aglLxTfEKI0jg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=21)

  

## Optimizing Claude’s frontend design capabilities with Skills

## 用 Skills 优化 Claude 的前端设计能力

这个前端设计技能展示了语言模型能力的一个更普遍规律：模型往往比默认表现更强，但分布式收敛会掩盖这些能力。Claude 具备强设计理解，但没有引导时很难体现。

  

虽然你可以将这些指令加入系统提示词，但这样所有任务都会背负前端上下文，造成污染。使用 Skills 则能让 Claude 在需要时自动加载领域知识，让它从“需要你不断指导”变成“不管你做什么都带着领域专业性”的助手。

  

Skills 也高度可定制。你可以为团队创建自己的前端设计系统、组件模式、行业特定 UI 规范，并将其沉淀为技能。这会让组织内所有人共享一致的 UI 品质。

  

这种模式不仅应用于前端。任何 Claude 默认输出“太普通”，但其实具备更深入理解的领域，都适合做成技能。方法一致：找出收敛默认、提供清晰替代、在合适高度写提示、封装成可复用的 Skill。

  

对于前端来说，这意味着你无需每次 prompt 工程就能获得独特界面。你可以从我们的 frontend design cookbook 或 Claude Code 的新前端插件开始探索。

  

**如果你想自己创建前端技能，可以查看我们的** skill-creator **。**

## eBook 电子书

**Agent Skills**  
立即开始使用 Claude 的技能，构建更强大的应用程序。

🔗：https://www.claude.com/blog/skills

  

**更多资讯，**

**点击下方卡片关注赛凡智云协作平台**

  

**▲ 赛凡云盒，一款超好用的企业私有云盘**

继续滑动看下一个

赛凡智云

向上滑动看下一个