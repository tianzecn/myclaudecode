---
title: "Git Worktree 在 Vibe Coding 的妙用"
source: "https://mp.weixin.qq.com/s/wOTu4N8KBstYcbKMCftlmA"
author:
  - "[[随性的老胡]]"
published:
publist_time: "2025年11月28日 12:05"
created: 2025-12-10
description: "Git 有个屠龙技 —— worktree，这个功能在 vibe coding 场景下有奇效，本文分享我的一些实践经验。"
tags:
  - "#GitWorktree #VibeCoding #开发效率 #AI编程 #分支管理"
summary: "文章介绍了Git Worktree在Vibe Coding场景下的妙用，通过创建多个工作树实现分支并行开发，提高AI编程时的效率与准确性。"
area: "日本"
site: "微信公众平台"
---
# 文章总结
文章介绍了Git Worktree在Vibe Coding场景下的妙用，通过创建多个工作树实现分支并行开发，提高AI编程时的效率与准确性。
# 标签
#GitWorktree #VibeCoding #开发效率 #AI编程 #分支管理
# 正文内容
![cover_image](https://mmbiz.qpic.cn/sz_mmbiz_jpg/Kh4dSb0w5FWvfy5INo00cny21BhALYSibJ7CfQ6oIeuHiaiaZOWR9gUGvOUG8a0B2DvBDperbAGfyboYpTXrRYevQ/0?wx_fmt=jpeg)

原创 随性的老胡 [老胡闲话](https://mp.weixin.qq.com/s/) *2025年11月28日 12:05*

【注：本文由冯宇投稿】

Git Worktree 在 git 的使用中可以说是一门相当冷门的技能，平时很少会用，可能根本不会被想起来。但在 vibe coding 场景下，它却能发挥出意想不到的效果，极大提升我们的开发效率。本文就来分享一下我在这方面的一些实践经验。

## Git Worktree 的作用

git-worktree 官方描述可能很难理解。它的真实作用其实就是在单独的目录中创建一个分支，并允许多个分支同时存在。举个例子:

我们使用 `git clone` 克隆了一个仓库 `my-repo` ，当前处于 `main` 分支。但是还需要同时保留一个 `dev` 分支进行其他操作怎么办？

此时不需要使用 `git clone -b dev <repo-url>` 再次克隆一个仓库，而是可以使用 `git worktree` 来创建一个新的工作树：

```bash
git worktree add ../my-repo-dev dev
```

于是在 `../my-repo-dev` 目录下，就会创建一个新的工作树，并且切换到了 `dev` 分支。这样我们就可以同时在两个目录中进行不同分支的任务，而不需要频繁切换分支。

使用 `git worktree list` 可以查看当前所有的工作树：

```bash
$ git worktree list/path/to/my-repo     a1b2c3 [main]/path/to/my-repo-dev d4e5f6 [dev]
```

## Vibe Coding 场景下的妙用

在 Vibe Coding 场景下，我们在进行新功能的开发和重构的时候，通常为了避免代码雪崩，一般都会 checkout 一个新分支，在新分支进行工作，完事之后以 PR 形式合并到主干，对吧？有了 git worktree，我们就可以在不同的目录中让 AI 快速回溯和比对自己改动的内容，分析并完善代码。

需要注意的是，务必记得将 worktree 目录也加入 agent 的上下文中，否则 AI 是无法访问到这些目录的。各种 CLI 工具几乎都有一个 `--add-dir` 参数可以在运行的时候添加目录到上下文， `Claude Code` 还额外支持一个 `/add-dir` 指令，可以在对话中动态添加目录。

之后我们可以在提示词提醒它使用 worktree 目录，例如:

```bash
审核代码:
基座代码 (main 分支代码) 已经在 ../my-repo-main/ 目录下
请比对当前代码和基座代码，确认是否破坏原有的业务逻辑，并提供审核报告
```

于是 AI 在工作的过程中就会直接使用类似于 `Search Files` 的功能去在更大范围查找代码，而不是通过执行 `git diff` \+ `git show` 之类的命令逐条比对，例如:

```php
● Read(../my-repo-main/app/api/route.ts)  ⎿  Read 20 lines
● Search(pattern: "querySchema"", path: "../my-repo-main/app/api/route.ts", output_mode: "content")  ⎿  Found 0 lines
● Search(pattern: "const.*Schema"", path: "../my-repo-main/app/api/route.ts", output_mode: "content")  ⎿  Found 0 lines
● Search(pattern: "z.object"", path: "../my-repo-main/app/api/other/route.ts", output_mode: "content")  ⎿  Found 0 lines
● Read(../my-repo-main/app/api/other/route.ts)  ⎿  Read 30 lines
```

Claude Code 以直接文件和目录读取以及搜索的方式在阅读代码，不但效率更高，而且更省 token，事实证明代码分析的准确度也大大提高了。

## 小结

Git Worktree 这个平时开发很容易忽略的技能，但在 Vibe Coding 场景下却能大放异彩，带来意想不到的效果和体验，大大提升了开发效率。

作者提示: 个人观点，仅供参考

继续滑动看下一个

老胡闲话

向上滑动看下一个

老胡闲话