---
title: "用Claude Skills做PPT，真实演示"
source: "https://mp.weixin.qq.com/s/Fp2y21F4a7UP1zwRfnsCtw"
author:
  - "[[刘小排]]"
published:
publist_time: "2025年10月20日 14:46"
created: 2025-11-16
description: "今天我要解决的一个真实问题： 本周末我要做两天一夜的线下课，要做PPT。正好用昨天提到的Claude Skll来帮助我"
tags:
  - "#PPT制作 #ClaudeSkills #AI设计工具 #效率提升 #内容创作"
summary: "本文介绍作者利用Claude Skills工具高效制作高质量PPT的方法。面对两天一夜课程需制作200多页PPT的挑战，作者通过制定风格、生成透明PNG卡片并封装成可复用的Skill，实现了风格统一、审美高级的PPT设计，极大提升了制作效率。"
area: "北京"
site: "微信公众平台"
---
# 文章总结
本文介绍作者利用Claude Skills工具高效制作高质量PPT的方法。面对两天一夜课程需制作200多页PPT的挑战，作者通过制定风格、生成透明PNG卡片并封装成可复用的Skill，实现了风格统一、审美高级的PPT设计，极大提升了制作效率。
# 标签
#PPT制作 #ClaudeSkills #AI设计工具 #效率提升 #内容创作
# 正文内容
![cover_image](https://mmbiz.qpic.cn/mmbiz_jpg/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9DN05icxOic6rUGe46fh3SQvRVKYLFxUq1PEXuImeU5hupwdJ4ibwHT3SQ/0?wx_fmt=jpeg)

原创 刘小排 [刘小排r](https://mp.weixin.qq.com/s/) *2025年10月20日 14:46*

大家好，我是小排。

今天我要解决的一个真实问题： 本周末我要做两天一夜的线下课，要做PPT。

面对的挑战

- 整整两天一夜啊！那就意味着，我需要做一个超越200页的PPT！
- 我已经有讲义的文字稿了，需要分段把讲义文字变成PPT设计。
- 每一页内容都需要自己打磨，无法靠gamma或者Manus等AI PPT工具一把梭。
- 每一页内容的风格要一致，审美要高级。
- PPT模板是给定的，必须要符合模板风格。

正好，现在有了Claude Skills，上述问题就简单了。还不知道什么是Claude Skill的同学，可以看上节课 [技术圈吹爆的Claude Skills，小白用起来比程序员还爽](https://mp.weixin.qq.com/s?__biz=MzI1MTUxNzgxMA==&mid=2247499243&idx=1&sn=f8750d2e3e47f51144cd695ac1337562&scene=21#wechat_redirect)

下面演示我的实际工作过程。

  

整体思路

1. 制定风格 ：在Claude里聊天，给出我的要求和PPT模板的风格，让Claude试出我满意的风格。
2. 解决粘贴到PPT模板问题 ：使用透明PNG。让Claude输出的卡片有“一键变成透明PNG”的功能，这样粘贴到PPT里，可以把背景透出来。
3. 解决稳定性问题 ：调试完成后，让Claude把刚才的所有要求封装为一个Skill。以后新开窗口，通知Claude用Skill来创建单页

  

制定风格

让我先选取了模板风格，纯粹文字和Claude对话

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9ic77dMBzVtCtnOLVfdib8TumgiahzaJXmgjeRyaqHT8yZa7uaLibuqqPfw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

刚出来的第一版，我不喜欢，如下图所示。

不过没关系，我可以继续和它聊天调整，直到满意为止。

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9eSuf0AIUxeUcc5VIxCfmm1vhc0Vnm5jic60QaaGHKSP0a3icOOWIJrbg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)

反复打磨后，看到这样的效果，我感觉可以接受了

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9KoFByH7opODqwV6VicWia7PEbcTickq0ibLln9rJzQ1mQoDDJgvufoeO9w/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2)

  

变成Skill

风格打磨完成后，告诉Claude：变成一个Skill。它会继续引导我们。

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9oh1MnonnlaTpx4OoFhvLYhhaE1RORnr72ib8kibzicQEpjeGHM44lED0Q/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9hxDLWpk4GB1Krc9RiaSOhWhq5ISORblj6aGLwHkZwvEH64N9J7SSaMA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4)

  

记得下载安装

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9Uia3JtEiagvyBK1rSeEDD1aRTaGSp7esSJgpDR0dc7DtNlDBcY9H8iaYw/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5)

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9byafJeAGEWsbwibWfpKHrrpfnjibRHluE2WntoBzwpFaQNs3fpicPUtVg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6)

  

不知道如何安装的同学，请继续复习上节课 [技术圈吹爆的Claude Skills，小白用起来比程序员还爽](https://mp.weixin.qq.com/s?__biz=MzI1MTUxNzgxMA==&mid=2247499243&idx=1&sn=f8750d2e3e47f51144cd695ac1337562&scene=21#wechat_redirect)

  

  

使用Skill

  

新开一个聊天窗口，告诉它，用Skill来设计。

  

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n954j0NfNiafpwcTyDNvfbrF7UkHbo3k6GswYX6nicWXSmzjvJNZB1Jt1A/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7)

  

它可以稳定发挥

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9NCcVJLibPDmJIQkMDWy3pwurOaVeE7Zjcicw12pjRWVNXHx2Aq6PaksA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=8) ![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9wUqRictkYHHibIUquAVIej3CdibJM2YvAbvJBiaDdScMCWUV9KVCc8l43Q/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=9)

  

怎么样？是不是既符合苹果的设计风格、又有我要求的主题颜色？

点击“复制透明PNG”

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9SUjA8n5nhmveAdDVsI1bV5EbxYIHHKhgcQYuDRicAF2QRwQzAnTUbQA/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=10) ![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9qaBVUvOg4oMicz3dZMSZdZkxFnoyicudZLN9xB1226a8OsVLMBLOclQg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=11)

把透明PNG粘贴到模板里，感觉挺合适的！

![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9fze4IJPXcosUuFgOlEuoDibuMsTW7ABibKeFPwYQ3QpHJ5qk1SVI8ObQ/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=12) ![图片](https://mmbiz.qpic.cn/mmbiz_png/607DKnuWzlGpF5d51UM7WN3YMibk9ib2n9GWHEtvxpa7kJsWzBaAMUR811JA9WDKBF7FmwArubM8Mp6cTlJkBIHg/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=13)

  

期待你的反馈！

下课！

  

![](https://mmbiz.qlogo.cn/sz_mmbiz_jpg/DhduwiaBa7ldgxWkOrnJibVtD0cKVoJBHEziaHTYfvCJyTic0ibGKbQrW7nAJibUosia6upxFMrXRcQ6pE/0?wx_fmt=jpeg)

我也喜欢你哦 (⑉• •⑉)‥♡

 [钟意作者](https://mp.weixin.qq.com/s/)

继续滑动看下一个

刘小排r

向上滑动看下一个

刘小排r