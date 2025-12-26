---
title: "Claude Code开始失忆了？两大记忆神器帮你选"
source: "https://mp.weixin.qq.com/s/icy5HN_soIPWaTTPTsjBzw"
author:
  - "[[金先森是朝鲜族阿]]"
published:
publist_time: "2025年12月9日 23:58"
created: 2025-12-10
description: "加我进AI讨论学习群，公众号右下角“联系方式”文末有老金的 开源知识库地址·全免费"
tags:
  - "#ClaudeCode #记忆工具 #编程助手 #AI开发 #claude-mem"
summary: "文章介绍了解决Claude Code失忆问题的工具claude-mem，详细说明了其功能、安装方法和使用建议。"
area: "北京"
site: "微信公众平台"
---
# 文章总结
文章介绍了解决Claude Code失忆问题的工具claude-mem，详细说明了其功能、安装方法和使用建议。
# 标签
#ClaudeCode #记忆工具 #编程助手 #AI开发 #claude-mem
# 正文内容
原创 金先森是朝鲜族阿 *2025年12月9日 23:58*

加我进AI讨论学习群，公众号右下角“联系方式”

文末有老金的 **开源知识库地址·全免费**

---

  

用Claude Code写代码爽不爽？

  

爽。

  

但有个烦人的问题让老金我每天都想骂街——

  

这货每次开新会话都失忆。

  

你昨天跟它聊了三小时，把项目架构、代码规范、踩过的坑全讲清楚了。

  

今天一开新会话？

  

"你好，请问你需要什么帮助？"

  

次奥，又要从头来一遍。

  

老金我用Claude Code半年了，每次开新会话都要重复一遍项目背景。

  

直到发现了这个神器—— C laude-mem 。

  

Github： https://github.com/thedotmack/claude-mem

  

---

  

## 30秒速读版（急着走的看这里）

核心结论 ：

Claude Code失忆问题有两个主流解决方案  

claude-mem 和 mcp-memory-service 。

  

谁该关注 ：

天天用Claude Code写代码的开发者。

项目周期超过一天的程序员。

受够了每次重复介绍项目背景的人。

  

两个方案怎么选 ：

  

- claude-mem ：专门为Claude Code设计，两行命令装完就用，简单省事
- mcp-memory-service ：通用MCP服务，支持13+个AI客户端，扩展性更强

老金建议 ：

只用Claude Code → 选claude-mem（本篇教你装）；

想跨多个AI工具用 → 选mcp-memory-service（下一篇详细讲）

  

---

  

以下是详细介绍（有时间再看）

  

## 方案一：claude-mem（轻量级选手）

### claude-mem是什么？

简单说，它是给Claude Code装的"记忆芯片"。

  

没有它，Claude Code就像一条金鱼，7秒钟就忘了你是谁。

  

有了它，Claude Code就像一头大象，永远记得你跟它说过什么。

  

技术上讲，claude-mem是一个 持久化记忆压缩系统 。

  

它会自动捕获你和Claude Code的对话，提取关键信息，存到本地数据库里。

  

下次开新会话，它自动把相关记忆注入进去。

  

你不用做任何事情，它全自动工作。

  

---

  

## 怎么安装？

老金我第一次看到安装命令的时候，都不敢相信这么简单。

  

需要先安装PM2：

```
npm install -g pm2
```

两行命令搞定 ：

```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

  

没了。

  

第一行是把插件添加到你的插件市场。

  

第二行是安装它。

安装完成后，它会自动启动一个后台服务。

  

你什么都不用管，它自己就开始工作了。

  

然后启动：

```
#安装依赖并启动 Worker

# 进入插件目录
cd ~/.claude/plugins/marketplaces/thedotmack

# 安装依赖
  npm install

# 启动 worker
  pm2 start ecosystem.config.cjs

#验证安装

# 检查 worker 状态
  pm2 list

# 检查健康状态
  curl http://127.0.0.1:37777/health

  成功返回：{"status":"ok","timestamp":...}

#设置 PM2 开机自启（可选）

  pm2 startup
  pm2 save
```

  

注意：在 Windows 上，~ 路径等同于 C:\\Users\\<用户名>\\，例如：

```
~/.claude/ = C:\Users\admin\.claude\
~/.claude-mem/ = C:\Users\admin\.claude-mem\
```

如果对你有帮助，记得关注一波~  

  

---

  

## 核心功能

### 1\. 自动记忆捕获

每次你和Claude Code对话，claude-mem都在后台默默记录。

  

它不是傻乎乎地全部存下来。

  

它会用AI提取关键信息——

  

项目架构？记住了。

代码规范？记住了。

你踩过的坑？记住了。

你骂它的话？......也记住了。

  

### 2\. 跨会话记忆注入

这是最牛的功能。

  

你今天开新会话，claude-mem会自动把相关记忆注入进去。

  

Claude Code一开口就知道你的项目是什么、用什么技术栈、有哪些坑。

  

不用你再重复介绍一遍。

  

### 3\. mem-search语义搜索

这个功能老金我用得特别爽。

  

你可以用自然语言查询你的记忆库：

  

```
mem-search: 我之前怎么解决那个数据库连接超时的问题？
```

  

它会从记忆库里找到相关内容，直接告诉你。

  

比你自己翻聊天记录快100倍。

  

### 4\. Web界面查看器

claude-mem还提供了一个网页界面。

  

安装后访问 http://localhost:37777 ，你就能看到所有记忆。

  

可以搜索、删除、编辑。

  

对于有隐私顾虑的同学，这个功能很实用。

  

---

  

## 使用建议

### 建议1：直接安装，不要犹豫

这东西真的好用。

  

安装只要两行命令，试试又不会怀孕。

  

### 建议2：让它自动工作

安装完就不用管了。

  

它会在后台默默捕获记忆，你完全感知不到。

  

等你某天开新会话，突然发现Claude Code"好像记得"你之前说的话。

  

那就是它在起作用了。

  

### 建议3：善用mem-search

遇到问题先搜一下记忆库。

  

很可能你之前已经解决过类似问题了。

  

### 建议4：定期清理敏感信息

如果你对话中涉及敏感信息（密码、密钥之类的）。

  

可以去Web界面删掉相关记忆。

  

---

  

## 最后说两句

Claude Code是老金我用过最好的AI编程助手。

  

但"每次都失忆"这个问题，确实让人抓狂。

  

只用Claude Code的同学，装claude-mem就够了。

  

想要更强扩展性的同学，等我下一篇。

  

---

  

## 下一篇预告

  

《mcp-memory-service完整安装教程》

  

这个工具比claude-mem复杂一点，但功能强太多了。

  

想看下一篇的，点个"在看"让我知道！

  

  

---

**往期推荐：**

[提示词工工程（Prompt Engineering）](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI0NzU2MDgyNA==&action=getalbum&album_id=4120385726238392327#wechat_redirect)

[LLMOPS(大语言模运维平台)](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI0NzU2MDgyNA==&action=getalbum&album_id=3171759118513111043#wechat_redirect)

[WX机器人教程列表](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI0NzU2MDgyNA==&action=getalbum&album_id=3502843007181520907#wechat_redirect)

[AI绘画教程列表](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI0NzU2MDgyNA==&action=getalbum&album_id=3192433076551843848#wechat_redirect)

[AI编程教程列表](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI0NzU2MDgyNA==&action=getalbum&album_id=3704202865347362819#wechat_redirect)

  

---

谢谢你读我的文章。

如果觉得不错，随手点个赞、在看、转发三连吧 🙂  

如果想第一时间收到推送，也可以给我个星标⭐～谢谢你看我的文章。

  

开源知识库地址：

https://tffyvtlai4.feishu.cn/wiki/OhQ8wqntFihcI1kWVDlcNdpznFf

  

扫码 **添加下方微信（备注AI）** ，拉你加入 **AI学习交流群** 。

![图片](https://mp.weixin.qq.com/s/www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg%20stroke='none'%20stroke-width='1'%20fill='none'%20fill-rule='evenodd'%20fill-opacity='0'%3E%3Cg%20transform='translate(-249.000000,%20-126.000000)'%20fill='%23FFFFFF'%3E%3Crect%20x='249'%20y='126'%20width='1'%20height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

  

  

继续滑动看下一个

老金带你玩AI

向上滑动看下一个