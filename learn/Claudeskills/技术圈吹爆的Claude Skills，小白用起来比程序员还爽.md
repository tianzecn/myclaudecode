---
title: "技术圈吹爆的Claude Skills，小白用起来比程序员还爽"
source: "https://mp.weixin.qq.com/s/L5_LSgYfr98buRSYE7gC9g"
author:
  - "[[刘小排]]"
published:
publist_time: "2025年10月18日 19:40"
created: 2025-11-16
description: "尝试一文跟小白讲清楚Claude Agent Skills，让你马上就用起来！"
tags:
  - "#AI技能 #Claude #AgentSkills #文档自动化 #Python编程"
summary: "本文介绍了Claude Agent Skills的功能和使用方法。该功能通过给AI配备技能描述、虚拟机、代码执行环境等，解决了纯提示词AI在处理复杂任务时的不稳定问题。文章详细演示了如何启用和使用官方技能，特别是文档操作类技能，并展示了创建自定义技能的方法。"
area: "北京"
site: "微信公众平台"
---
# 文章总结
本文介绍了Claude Agent Skills的功能和使用方法。该功能通过给AI配备技能描述、虚拟机、代码执行环境等，解决了纯提示词AI在处理复杂任务时的不稳定问题。文章详细演示了如何启用和使用官方技能，特别是文档操作类技能，并展示了创建自定义技能的方法。
# 标签
#AI技能 #Claude #AgentSkills #文档自动化 #Python编程
# 正文内容
原创 刘小排 *2025年10月18日 19:40*

大家好，我是刘小排。

上周一直忙于自己的事情，没有更新公众号。不过这两天一直有粉丝催，让我讲一讲刚刚发布的Claude Agent Skills。

Claude Agent Skills这个东西有两个奇怪的现象：

1\. 技术圈很火，但是小白完全看不懂

2\. 已经发布两天了，也没见几个人真正用起来

  

我试试跟小白讲清楚它到底是什么吧。

  

Claude Agent Skills 解决什么问题？

  

我们可以这样来简单理解。

在以前， 用Claude做Agent， 几乎只靠提示词，Agent的发挥不稳定、过程不可控。

这正是Claude Agent Skills 解决的核心问题是：稳定性与可控性 。对于复杂任务（如生成含公式的 Excel、 标准化 PPT、 ） 用可执行代码替代“纯提示词” ，输出更可预测、更稳定、可复用。

  

Claude Agent Skills的 原理

从原理层面，

Claude Agent Skills ，就是给Claude做的Agent，配上了技能描述、电脑（云端的虚拟机）、文件系统、代码、执行代码的环境。

每个Skill在一个独立的文件中，我们可以称之为“技能文件夹”，里面放你给 Claude 的专用指令、脚本和资源。 Claude 在处理任务时会自动扫描可用技能，匹配到就按需加载最少的信息与代码，保证专项任务执行的稳定性。

看这张图吧。

![Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dZY6EqdVzePxSrlYSO1Tib5fA5sDJ9usg2F1tYzwjBRymElyxuv50CsA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

Agent Skills Architecture - showing how Skills integrate with the agent's configuration and virtual machine

  

小白怎么用Claude Agent Skills

  

  

一、打开功能

  

小白就先用官方的Agent Skills，已经足够折腾好一阵了。

  

首先，你需要有Claude Pro/Max/Team 账号，然后到这个网址

https://claude.ai/settings/capabilities

找到Skills，勾选它们。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dKXL4a4FjrrEZBx0ibibN1eKEyics36NyHS4gdm2hSAZxwqc5Ontxvoe8g/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)

  

接下来，你只需要在正常Claude中，就能使用了。 网页版Claude或客户端版Claude均可。

  

二、使用第一个Skill

  

例如，我们可以试试用canvas-design这个Skill来画图。

  

- 在以前，如果我们用Claude画图，实际上Claude是写了一个HTML，详见这里 [用Claude制作风格稳定的知识卡片](https://mp.weixin.qq.com/s?__biz=MzI1MTUxNzgxMA==&mid=2247497954&idx=1&sn=adeb06ee844109578fd0c5702b55a487&scene=21#wechat_redirect)
- 现在，如果你启用canvas-design，Claude会调用代码来画图，做出来的不是HTML，而是PNG。

  

  

我让Claude对“大学之道，在明明德，在亲民，在止于至善”这句话做一个知识卡片。

  

我的Prompt是

> 使用canvas-design这个skill做一个适合全屏放映的知识卡片，苹果公司的设计风格，以白色为背景色，语言用中文，你可以搜索合适的漂亮的中文字体。
> 
>   
> 
> 主题是：大学之道 在明明德 在亲民 在止于至善

  

我们看看它的工作过程。

  

首先，它仔细输出了自己的设计哲学。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72deIw0hFrYGf1dDLGSBKOxvpnETmj1f8iadcZkKiak0no3StJGOWF52sZw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2)

  

再仔细看，Claude有在写Python代码、执行Python代码来完成图片，而不是做一个HTML页面。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72du0QdQtd2EHDpIZRBrVNG4a0NmhtjiaWBPvnDuahibWic7AXmu19PnfUOg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)

  

这是成品。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dDtQnWdHxvyFBABjHDvenhrK82voMjLicfFLtdp8WbYW2F03X3ucfIsg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4)

  

  

如果我们去掉“使用canvas-design”，让Claude以“以前”的方式，用HTML来做知识卡片，出来的是这样的

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dJsZhyibrg1YuCOibG7Tm20QGicCUeVibwict8wr30joJ0LicSqibUP4Jia486w/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5)

  

  

要说哪个版本好看？这个可能见仁见智了。 Skills不是胜在好看，而是胜在稳定性。

  

查看官方说明书，发现canvas-design这个Skill的适合的场景是 —— “视觉哲学 \+ 单页画布”的作品适合高端品牌、展览、出版与研究语境。它更像一件可进入博物馆的“系统化艺术文献”，适合需要以视觉而非文字来传达抽象理念与质感的场景 —— 强调秩序、留白、精密与“看起来耗费无数小时”的大师级工艺。

  

https://github.com/anthropics/skills/blob/main/canvas-design/SKILL.md

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dJ7J7X5HodCJ9p1wurzxjrqRJ7tHDThcYkibhAskBbcDtiaLAj021BO2w/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6)

  

三、使用其他的官方Skill

  

  

请打开这个地址

https://github.com/anthropics/skills/tree/main

  

我们可以使用AI浏览器辅助，以此研究这些Skill分别是干什么的

  

下面是我的Dia浏览器截图

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72daH8hE0GoTb8wicwC3aWiapYKic5G91Z5vxOE5mCtcFRu2JndIMNOXwnBw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7)

  

  

它们都很好玩！ 值得你玩一整天。

  

如果要让我推荐一个最好玩的，我会推荐 document-skills/ 目录下的技能。

  

因为它们可以让Claude，直接操作 docs/pdf/pptx/xlsx 文件！

  

- docx： **Word** 文档创建 / 编辑 / 审阅（含修订、批注、格式保留、文本抽取），适合 **合规文档、合同流转** 。
- pdf： **PDF** 文本 / 表格抽取、合并拆分、表单处理，适合 **票据归档、数据抽取、批量处理** 。
- **pptx: PPT** 布局 / 模板 / 图表 / 自动生成，适合 **销售演示、周会汇报** 。
- xlsx： **Excel** 公式 / 格式 / 分析 / 可视化，适合 **报表、指标盘、数据管控** 。

  

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dv4dMZg2yHMI4fVfZavZOaCxhca54Yia9ctv1kYLncnpTrOE7Cbuk2oA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=8)

  

  

我直接把我一个PDF格式发票发给Claude，让它修改。

  

可以看到，Claude认真的研究了“PDF技能”的文档，然后开始规划方案，接着再写代码、执行代码。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dW2j4AXlhxJlFMRowYHsHGcyV6Cgepbf0ibNzo5kZ0TxOfJbtLyWa4icA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=9)

  

  

完成得非常好！ 我再也不想给WPS充值了！！（是的，在以前，修改PDF，是我给WPS充值的最重要理由）

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dLLWXnJlVibub3mZ6Os1MjFASqqkBic3BTRZI1YdYYl07FicSNExftpGwA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=10)

  

  

其他文档类技能，包括pptx、pdf、docx同理。下图是我正在让Claude把我的PPT草稿改成苹果公司风格。同样，它会理解需求后、写代码来执行任务。而不是现在很多AI PPT公司那样，其实做的是个网页。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dia6Yeibro2NLGfwYFAQFDqMvN2qibbE8dL7icbA6cSyWsQA8Nau73WmsSQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=11)

  

  

想看看它直接操作pptx文件的能力如何？下周你就看到了！下周末我的线下活动，我会用Claude来直接做pptx。

  

赶快去玩起来吧！

  

官方Skill玩腻了，快速创建自己的Claude Agent Skills

  

记住，你可以自行创建Skill，无论你是不是程序员！

  

我已经创建并正在使用的有：查询域名是否可用的Skill、通过火山引擎Seedream-4 API画图的Skill、DevOps服务器运维相关的Skill、API调试Skill、数据库Schema生成Skill、通过API阅读和回复邮件、批量处理某种视频素材文件（给我的某个项目专用的）等等。

  

以后如果有机会，我再展开讲讲我自己的流程。现在我建议你先摸索一下。

  

对了，如果你还不习惯自己写Skill、也不是程序员，我再告诉你一个简单办法。

  

最简单的创建Skill方法是—— 告诉 Claude，我要创建skill，引导我

  

> 我要创建skill,引导我

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dW7nQUeGfokBcoeGtTSdeZPCv7xLs5jsicuAODETrpAPVV6kyZRlIh3w/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=12)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dp4PgP6SUiawhaxia01rKvBo4XZbsBpv0yxcadXmUy3FzKaL9pBzG8NpA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=13)

  

创建完后直接下载即可，是一个zip包。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72d4hbZd5Osee0Bn4nnCTM6lAsWEg7kbR5WZbic5pxBs8280NOib05zw1Xw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=14)

  

  

在 Skills里点击上传，就能安装了。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72doMIykQLmYcUYr1RicQIo0Hq4bnBzJxJnRFYfsprKdqoSvic8NNmTbibxQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=15)

  

安装完成后，正常使用。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dT5Ma3wlcSqic2zXfWAhwiaJNv5QXkwiap9ibtm9iala1iaV2tE181UkNIvSA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=16)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dtgB6oxHu9ktqc2EphYpww4J261EmcU8cVxkzCvdw3zS8mSSictg55WA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=17)

  

  

  

为什么创建Skill这么方便、这么神奇？

  

这是因为，我们刚才已经打开了系统自带的、一个专门引导我们创建Skill的Skill

  

你还记得吗？它在这里

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dT6V0Peyo18wkuyPfrplphWAyvibD95S3SU7L95wDiaW35k0uGCicWGhlA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=18)

  

  

  

  

程序员怎么用Claude Agent Skills

  

  

对于程序员，我就简单说1条吧。

  

你可以在Claude Code里使用Claude Agent Skills

  

请在Claude Code里输入 /plugins 研究一下。可以结合官方文档

https://docs.claude.com/en/docs/claude-code/plugins

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dCZElOXzicjzGQ2TncrR1mqNHngibeh6icD4tlwCqMHpHyzW6zK8nSGr3g/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=19)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dPg1cPJEh88wPc0qLUYsTofaZ8BbZH4zEBok1hP8bZ0XeVW41ljyUsA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=20)

  

![Anthropic Agent Skills](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dQ8hFMEPSZgg3GCSgbdmqDw8YDf5heKETCGBR4hXVPeMXHKbqP3Oufg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=21)

Anthropic Agent Skills

  

![using claude skills in claude code](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGvuso2u0xQwq1CLyLJp72dAicpZcxgaW2Ls7DIic7VQdkz0sShxsgP4u2USkWm6ibicfnadQRe4NG2ng/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=22)

using claude skills in claude code

  

  

当然，作为程序员，对于你自己创建的Skill（例如上面提到的ZIP包）你可以不用安装，放到本地文件夹里，让Claude Code来使用。

  

  

---

  

期待你的反馈！

  

我也喜欢你哦 (⑉• •⑉)‥♡

继续滑动看下一个

刘小排r

向上滑动看下一个