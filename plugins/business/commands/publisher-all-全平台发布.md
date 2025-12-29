---
allowed-tools: Read, Write, Bash, Glob, WebFetch
argument-hint: <input> [lang]
description: 一次性为所有平台生成内容(X、LinkedIn、Medium、Dev.to)
---

# 全平台内容生成器

一次性为 X/Twitter、LinkedIn、Medium 和 Dev.to 生成内容。

**用法:** `$ARGUMENTS`

**示例:**
```bash
/publisher:all my-post              # 所有平台,英文
/publisher:all my-post ja           # 所有平台,日文
/publisher:all article.md           # 从文件路径
```

**功能说明:**
按顺序运行所有发布器命令:
1. `/publisher:x` - X/Twitter 推文串(3个版本:串联、长文、短文)
2. `/publisher:linkedin` - LinkedIn 帖子,包含媒体附件
3. `/publisher:medium` - Medium 就绪的 HTML 文章
4. `/publisher:devto` - Dev.to RSS 订阅源(如果尚未生成)

**处理流程:**

对于每个平台:
1. 解析相同的输入(slug、文件或 URL)
2. 生成平台专属内容
3. 创建 HTML 预览
4. 在浏览器标签页中打开所有预览

**输出:**
- `x-thread-[LANG].html` - X 推文串,包含3种格式标签页
- LinkedIn 草稿帖子(通过 API)或 HTML 预览
- `medium-article-[LANG].html` - Medium 就绪内容
- `rss-devto.xml` - 完整的 RSS 订阅源

**节省时间:**
无需运行4个独立命令并花费约2小时手动调整内容,本命令一次性生成所有内容。

**后续步骤:**
1. 浏览器标签页自动打开
2. 查看每个平台的内容
3. 复制粘贴或通过 API 发布
4. 根据目标受众需要进行调整

**注意**: 每个平台的内容都经过独特优化 - 不是简单的跨渠道复制粘贴。
