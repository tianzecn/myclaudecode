---
title: "AutoGLM深夜开源，千千万万个手机Agent要站起来了。"
source: "https://mp.weixin.qq.com/s/6UNvm-QQVjA7Ctja2VOhzA"
author:
  - "[[数字生命卡兹克]]"
published:
publist_time: "2025年12月9日 09:19"
created: 2025-12-09
description: "种子已经撒遍天下了"
tags:
  - "#AutoGLM #手机Agent #开源技术 #隐私保护 #数字未来"
summary: "文章介绍了智谱开源手机Agent框架AutoGLM的意义，认为这是技术民主化的体现，并在豆包被封背景下探讨了开源Agent的未来前景。"
area: "北京"
site: "微信公众平台"
---
# 文章总结
文章介绍了智谱开源手机Agent框架AutoGLM的意义，认为这是技术民主化的体现，并在豆包被封背景下探讨了开源Agent的未来前景。
# 标签
#AutoGLM #手机Agent #开源技术 #隐私保护 #数字未来
# 正文内容
![cover_image](https://mmbiz.qpic.cn/mmbiz_jpg/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6KGqwKEdl2wYbpPyibgS2uBZFSicB9gHnhNLc3Z7WgldvT6EQNS82Cv7Q/0?wx_fmt=jpeg)

原创 数字生命卡兹克 [数字生命卡兹克](https://mp.weixin.qq.com/s/) *2025年12月9日 09:19*

昨天深夜12点多，智谱干了个挺有意思的事。

直接把他们的手机Agent，也就是AutoGLM开源了。

![图片](https://mmbiz.qpic.cn/mmbiz_png/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6fOzb0lA4uAjU1NSuTPRZYqNk3qRhx3DLyymz3ibmktwz6MlVovzghaA/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

开源链接在此： https://github.com/zai-org/Open-AutoGLM

挺感慨的，一年前的10月25号，AutoGLM在 CNCC上正式发布，那时候我也做了 [AutoGLM的全网首发的评测](https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=2647666141&idx=1&sn=3028e64fcb058b6e6d91b68e64a8f536&scene=21#wechat_redirect) ，虽然很坦诚的讲，那时候的AutoGLM，还不成熟，成功率也不算高，支持的APP也不算多。

但，那是 我们第一次见到了手机Agent的模样。

那个时候，真的就跟见到新世代的产物一样，疯狂卧槽。

![图片](https://mmbiz.qpic.cn/mmbiz_png/OjgKEXmLURrUEoRmLRKgWpACzCibibnfGKGTZO6xS7sALB5MKb7pVDONbFnA0TAbich2pbkUtCJgIHmljlW3T8W7Q/640?wx_fmt=png&from=appmsg&wxfrom=5&wx_lazy=1&tp=webp#imgIndex=1)

这是一年前第一次体验AutoGLM的时候，没忍住，给智谱的朋友发的聊天记录。。。

而现在，在豆包手机助手被全面封禁之际，这个手机Agent的鼻祖，选择用开源的方式，为这个技术世界，再添一把新的柴火。

从2023年启动研究开始，到今天，整整32个月，然后，把这个足以跟豆包掰掰手腕的模型和框架， 一把开源。

一个豆包倒下了，千千万万个AutoGLM站起来了。

不知道为什么，这个场景，让我想到了一部很经典的电影。

《V字仇杀队》。

![经典电影冷知识：10件关于《V字仇杀队》的秘密](https://mmbiz.qpic.cn/mmbiz_jpg/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6RT1fX9LTDIJUArFahVwOqJJhkjmaxD0ju3o4ic6EY9IfGnjFEP8CBAg/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=2)

经典电影冷知识：10件关于《V字仇杀队》的秘密

不过多解释这部电影了，看过的朋友肯定明白我在说什么。

V死了，但V，无处不在。

说回到智谱的这个开源版本的AutoGLM。

这次其实开源的是Phone Agent这个手机端智能助手框架，还有一个AutoGLM-Phone-9B的模型，共同组合成了这次开源的AutoGLM。

![图片](https://mmbiz.qpic.cn/mmbiz_png/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6GTmgyWSF9Thia6feAbm95RHJVzFX4ODx6G04Z6A8eibcOzstGghYhT0Q/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=3)

安装过程和使用过程我就不放了，感兴趣的朋友可以去Github上直接看操作教程，比较的麻烦，不是那种傻瓜一样的安装安装即用。

这就是专门给开发者使用的。

很多朋友在评价豆包的时候，都会提到隐私问题，这个确实是问题，但是在我也一直说，这个问题在我看来是有解的。

在昨天写豆包的文章中，我得原话是：

> “我们现在手机上的芯片算力是还差点意思，所以得联网跑模型。
> 
> 但你得信AI时代的摩尔定律啊，只要手机里芯片再迭代两代，视觉推理模型智力再提一提，尺寸再压一压，到时候就一个8B或者9B的端侧小模型在手机上本地跑，所有的隐私都不是啥问题。
> 
> 这个AI哪怕把你的聊天记录、支付密码背得滚瓜烂熟，它也只在你的本地跑，任何数据连哪怕一个比特都不传出你的手机。
> 
> 这就是端侧推理的终局。”
> 
> 数字生命卡兹克，公众号：数字生命卡兹克 [用豆包手机的这两周，我好像卷入了一场新与旧的战争。](http://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=2647677649&idx=1&sn=c8f08e0ec7ec477dfa0d22fb6b27d8bc&chksm=f0078686c7700f90b13acd60f15e36cef3560fc00daa96d526b384939d7a6a7ed15795f252b7#rd)

2年时间，这大概就是我的预期。

而这次智谱的AutoGLM，就给了一个中间态的解法。

就是现在来说，9B的模型在这个阶段，不是大部分手机上跑不动嘛，那咱们就不在手机上跑端侧模型，用你的本地电脑或者自己的云服务挂一层，给手机当云模型的服务器用，变相解决当前时间点，手机端算力不足但是又要跑端侧从而保护个人信息隐私的问题。

目前有3种部署模式。

**本地部署（模型+执行）：** 屏幕捕获、模型分析、操作执行均在本地设备完成，数据不离开设备，隐私性最高。

**云端部署（模型+执行）：** 屏幕内容需从操作环境（本机或云设备）传输到云端模型，模型分析后指令返回操作环境执行，开发者要自己确保传输和云端处理的安全性。

**混合部署（如本地执行+云端模型）：** 屏幕内容在本地捕获，传输到云端模型分析，分析结果返回本地执行。

我大概折腾了一下，把电脑跟手机连上了，给大家看一下大概的效果。

比如这个抽象的任务：

不过因为不是系统级别的手机助手，所以豆包那样的后台虚拟屏运行就别想了，这个确实没有办法。

还有这个差旅的任务。

而且因为本地模型的限制，速度慢一点点，也笨一点点。

目前大概支持50个应用。

![图片](https://mmbiz.qpic.cn/mmbiz_png/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6oIuDql7RWibdntBPBrlN0lrEicQZwbT9DIiaHSFnPs4AwxGD0eN1G1sUQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=4)

但是再怎么说，它也是现在为数不多的，完全开源的手机Agent方案了。

很多人都说手机厂商已经做了手机Agent，但是我想说，大家可能不知道，去年还挺火的荣耀的YOYO智能助手，用嘴点了2000杯咖啡，这背后，其实就是AutoGLM。

![图片](https://mmbiz.qpic.cn/mmbiz_png/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6TspVajNWVjsNqHqxrPuaRQcTtnvcpZs2tC5QAC04T5Ek0dIBgKwByw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=5)

现在，AutoGLM一开源，往后短短几个月，肯定不会只有它一个。

当年 Stable Diffusion 一开源，整条视觉生成路径就变了天，一个开源模型，最后变成了无数应用的底层基建，从画头像、做海报、做素材库，一路狂卷，至今精神续作Flux还是很多企业内部的核心基建。

还有虽然LLaMA现在已经式微了，但是你不可否认，当年那次模型的泄漏，本质上也是无数开源LLM的导火索，后来一堆变体大模型、LoRA等等，都是从那一阵大爆炸里长出来的。

在结合着豆包手机助手被封杀的背景，智谱这次开源AutoGLM，还是挺燃的。

有一句话说的好，开源精神，就是奔向共产主义的一把利剑。

这件事在技术史里出现过很多次。

Linux刚开源的时候，桌面体验烂得要死，装个驱动都能把人装自闭。

但你不能否认，是它把操作系统这件事从巨头手里一点点撬出来，以菩萨之威，送了无数人的机房、实验室、机顶盒、路由器、NAS、电视盒子里。

后来安卓也站在了同一条河流里，它不一定是最好用的，但它足够开放，足够多的人可以在上面建自己的东西，于是，诞生了那么多的魔改OS。

Arduino、树莓派、这些小板子也干过类似的事。

你给普通人一块可编程的硬件，他一开始只会拿来点个灯、连个温度计，用着用着，突然有人拿它做了空气监测、做了自动浇花、做了开源机器人。

这些玩具本身可能赚不到什么钱，但它们把我可以控制现实世界一点点这个种子，种进了很多人的脑子里。

豆包被封禁的这几天，很多人都在讨论“平台之争”“生态封锁”“注意力战争”，这些讨论我觉得都没有错，谁掌握入口，谁有用户心智，谁能从流量池里多扒一点钱出来。

而一个开源的手机Agent呢，如果入口这个东西，不再是某家公司的APP图标，而是我自己部署在家里的一个Agent呢，会怎么样？

这个问题听上去很乌托邦，但是当年互联网刚出来的时候，任何人都可以生产内容，在传统媒体眼里，可能也同样像疯话。

传统媒体会说，内容生产是专业机构的事，发行是专门渠道的事，你一个普通人，怎么可能有能力、也有资格来做这件事。

后来博客、论坛、自媒体、短视频、直播一波一波起来，今天你再看，任何人都可以发声，已经成了一个再普通不过的事实。

现在的AutoGLM，你当然可以说它跟真正的贾维斯相比还有距离，但你不能否认，那个我可以自己搞一个手机Agent手机助手的种子，已经从此以后不会再消失了。

每一个人，都可以魔改，都可以拥有，一个只在你本地设备上运行的，只为你服务的，真正的Agent。

这也是我为什么会想到《V字仇杀队》。

那里面V一直戴着面具，最后死在一辆装满炸药的列车上。

![图片](https://mmbiz.qpic.cn/mmbiz_png/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6j9QEAf1dvIhI9UkeYvRZ3Lx6I119T8l8Kd82v0xEsTK2hL5qdOwhCQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=6)

他死了，但他那张面具没有死。

面具被复制、被戴上街头，变成任何一个人都可以是V的象征。

技术的洪流，滚滚向前，没有任何人可以阻挡。

我们和Agent的关系，未来会变成什么样，我现在也给不出答案。

可能十年之后，大家已经习惯了身边有一两个长期伴随的AI助手，早上叫你起床，帮你安排行程，过滤掉大量垃圾信息。

你会像习惯Wi-Fi一样习惯它们的存在，只有在它们暂时宕机的那几分钟，才会想起来原来没有它们的生活这么麻烦。

也有可能，我们会在一路狂奔之后，猛然发现自己把太多东西外包了出去。

外包了记忆，外包了判断，外包了品味，外包了那一点点在信息面前先停下来再想一想的能力。

那时候，新的反思又会开始，新的“断舍离”和“数字极简主义”会被包装成潮流，告诉你要关掉一部分Agent，重新找回真实生活。

但我想说，技术从来不会替我们做最后的价值选择，它最多只是把更多可能性摆在我们面前。

这个人生要如何而活，只取决于我们自己。

豆包的封禁是一次选择，AutoGLM的开源是一次选择，我们用什么手机、部署什么Agent、愿不愿意自己折腾一套本地系统，也是一次选择。

这些选择拼在一起，才是这个时代真正的，集体意志。

这是一个，灿烂的时代的起点。

最后，我挺想用我很喜欢很喜欢的一本书，叫《悟空传》，里面的最后的一段话来给这篇文章，做一个结尾。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/OjgKEXmLURqDu4j78yd3iaoGE0dfhickia6fc3EeFLkluMTufD1s8jD6fDGDHiajjsZVtDfVOfIM8YibQY3SuSzNykQ/640?wx_fmt=jpeg&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7)

……

几个时辰后，这百万妖众象一块被风吹散的乌云，无影无踪了。

“花果山，什么时候才能重新长出花果来？不过，种子已经撒遍天下了。”他又抓了一把地上的黑土，脸上露出孩童般的笑来。

天边的雷鸣已然越来越近了。

孙悟空靠在一棵焦树上，静静的等着。

等到那一刹，黑暗的天空突然被一道巨大的闪电划开。

孙悟空一跃而起，将金箍棒直指向苍穹。

“来吧！”

那一刻被电光照亮的他的身姿，千万年后仍凝固在传说之中。

******以上，既然看到这里了，如果觉得不错，随手点个赞、在看、转发三连吧，如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章，我们，下次再见。******

\>/ 作者：卡兹克

\>/ 投稿或爆料，请联系邮箱： wzglyay@virxact.com

![](https://mmbiz.qlogo.cn/mmbiz_jpg/FpebDiaL1hZ6VyrXAqGwZibiaianZXowOzv3zDn2SP6DufLvxHkIjiaX8udYWqCml7QpA3TItQs0yo765TzTY383VZw/0?wx_fmt=jpeg)

谢谢你看我的文章

 [喜欢作者](https://mp.weixin.qq.com/s/)

继续滑动看下一个

数字生命卡兹克

向上滑动看下一个

数字生命卡兹克