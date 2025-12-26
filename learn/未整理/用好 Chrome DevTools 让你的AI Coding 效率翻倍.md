---
title: "用好 Chrome DevTools 让你的AI Coding 效率翻倍"
source: "https://mp.weixin.qq.com/s/NljujaZCOkKWQ2mveEnVHA"
author:
  - "[[飞林沙]]"
published:
publist_time: "2025年11月5日 12:36"
created: 2025-11-28
description: "用好 Chrome DevTools 让你的AI Coding 效率翻倍"
tags:
  - "#AICoding #ChromeDevTools #前端自动化 #Debugging #测试工具"
summary: "Google推出的Chrome DevTools MCP让AI编程工具具备自动验证前端代码的能力，通过自然语言指令即可自动打开网页、调试样式、测试功能、分析报错及模拟不同设备，极大提升了开发效率。"
area: "上海"
site: "微信公众平台"
---
# 文章总结
Google推出的Chrome DevTools MCP让AI编程工具具备自动验证前端代码的能力，通过自然语言指令即可自动打开网页、调试样式、测试功能、分析报错及模拟不同设备，极大提升了开发效率。
# 标签
#AICoding #ChromeDevTools #前端自动化 #Debugging #测试工具
# 正文内容
![cover_image](https://mmbiz.qpic.cn/mmbiz_jpg/k2icW6T8wMFX7BFyMW9fyeF0ibibbXic8icTU7GzjKGuaVTZmICyUvLpRCDXTFQZicJnW4nzlx4GbibYkwP3XIovNbYdA/0?wx_fmt=jpeg)

原创 飞林沙 [模型之外](https://mp.weixin.qq.com/s/) *2025年11月5日 12:36*

相信你在使用 AI Coding，无论你是使用 Claude Code 还是 CodeX 在做网页应用时，最痛苦的事情就是：调样式、改 Bug。

写完一堆代码，AI 还得靠我手动打开网页、截图、描述「这个地方不对」「那个按钮偏了」，折磨程度真的是不如自动动手来的爽。

现在Google 官方亲自下场，推出了 Chrome DevTools MCP。在过去，我使用过 Browser Tools MCP，Chrome MCP，这些 MCP 都是社区开发的，配置起来很麻烦，而且功能也并不太好用。这次 Google 算是直接终结了浏览器自动化的比赛。

为什么需要 Chrome DevTools MCP，你不妨理解为之前的 AI Coding 都是瞎子，他无法知道他做出来的页面是什么样子的，能否正常工作，只能靠着感觉去写，现在你相当于给 Coding 工具装上了眼睛，现在它能自己打开浏览器，看页面、点按钮、测样式、跑测试，AI 真的可以自己 debug 了。

安装起来特别简单：

如果你用 Claude Code：

```nginx
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

用 CodeX 就是：

```nginx
codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest
```

  

使用起来就很简单了，其实所有的 AI 编程工具都是一样的，你可以让浏览器打开网页，然后进行测试：

```js
打开 localhost:3000 看是否正常工作，如果报错检查错误信息，并且修复问题
```

  

我来分享我自己常用的几个超爽用法 👇

  

用法 1：让 AI 自动验证修改是否生效

在过去AI 改完代码，会给我这样的提示：

```js
请您在前端再次点击“生成”确认已能看到新的接口请求及返回内容。
```

现在？你直接一句话告诉他：

```js
打开浏览器验证刚才的修改是否符合预期
```

AI 会自己开网页看、刷新、验证，再汇报结果。

对于复杂的应用修改，我建议你可以直接在提示词时就让浏览器做好验证：

```js
目前的页面布局整体是上下结构，我希望变成左右布局。然后在浏览器打开页面，查看样式确认修改是否生效。
```

  

用法 2：直接查看前端报错

在过去，我总是需要把一长串的错误信息都粘贴到对话框，然后再给出复杂的原因，例如我是如何如何操作才发生的这样的问题。AI 大概率可能还理解不了我的意思。

现在再也不用截图贴错误信息、解释半天。你只需要说：

```bash
在 localhost:3000/content，输入内容：“xxxxxx”，点击生成图片这时浏览器出现报错，是什么原因？
```

当然，你也可以让 MCP 找到前端样式的问题，对于我这种 CSS 小白来说简直不要太友好。

之前我遇到一个前端的问题，不知道为什么 header 无法吸顶，但是我描述后，AI 死活都改不对。现在就非常容易了。

  

用法 3：模拟各种屏幕尺寸

移动端 + PC 端适配一直是前端的梦魇。虽然现在的前端框架已经很成熟了，但是还是需要进行常用的验证。

现在只需要这样：

```js
请分别模拟PC端和移动端进行页面访问，并且模拟常见的屏幕宽度。在每种场景下确认页面是否出现样式错乱，内容溢出等情况，验证 CSS 规则如果出现问题请列出问题，然后进行修复，再重新进行验证。
```

AI 会模拟不同屏幕宽度，自动截图、分析样式问题，还能列出建议修改。

前端测试的效率，直接提升一个量级。

  

用法 4：爬虫解析的福音

以前写爬虫得手动打开浏览器、扒 HTML、查参数。

现在，你可以这样子：

```css
打开浏览器，分别访问 页面a, 页面b, 页面c，总结页面内容。在 parse 方法中补充解析规则，提取出 标题, 内容, 封面图
```

AI 就会自动爬取、自动解析，生成解析规则。

  

用法 5：自动化测试

这部分是我最看好的部分，也是我认为最大有可为的部分。

以前测试工程师要写脚本跑自动化测试，现在一句自然语言就能让 MCP 跑测试用例，真的彻底改变自动化测试的格局。

你完全可以在项目中编写一个测试用例：

```makefile
测试用例 1：step1: 打开登录页面step2: 输出邮箱 xxxx 和密码 xxxxstep3: 期望看到该用户已经被封禁
```

接下来就可以在每次需要测试时，让 MCP 自动来执行这些测试用例了。

真正做到自动化测试无测试脚本。

  

当然除了这些用法外，Chrome Dev Tools 还可以针对网页的性能进行测试分析等等。

Chrome DevTools MCP 让 AI Coding 的过程从 “帮我写代码” 变成 “帮我写完还能自己测”。

装上它，你的 AI Coding 体验会飞起来。

去试试吧。🔥

  

  

继续滑动看下一个

模型之外

向上滑动看下一个

模型之外