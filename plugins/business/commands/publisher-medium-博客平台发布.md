---
allowed-tools: Read, Write, Bash, Glob, WebFetch
argument-hint: <input> [lang]
description: 将博客文章转换为适合 Medium 的 HTML 格式,包含图片上传标记
---

# Medium 文章转换器

将博客文章转换为 Medium 就绪格式,具有适当的 HTML 结构和图片处理。

**用法:** `$ARGUMENTS`

**示例:**
```bash
/publisher:medium my-post           # 默认英文
/publisher:medium my-post ja        # 日文
/publisher:medium article.md        # 从文件路径
/publisher:medium https://blog.com/post  # 从 URL
```

**处理流程:**

1. **解析输入并检测源**
   - 文件路径、URL 或博客文章 slug
   - 可选语言参数(en/ja)

2. **通用输入检测**
   - **文件**: 读取 markdown、PDF、HTML 或文本
   - **URL**: 使用 WebFetch 获取内容
   - **Slug**: 在代码库中搜索博客文章

3. **转换为 Medium 格式**
   - 解析 markdown 并提取 frontmatter
   - 转换为适合 Medium 的干净 HTML
   - 保留标题、列表、代码块、引用
   - 为图表添加图片上传标记
   - 包含图片路径以便于上传参考

4. **创建 HTML 预览文件**
   - 生成 `medium-article-[LANG].html` 预览
   - 包含一键复制按钮
   - 添加带文件路径的图片上传说明
   - 使用 Medium 风格的格式和颜色

5. **在浏览器中打开**
   - 打开 HTML 预览文件
   - 打开 Medium 编辑器(https://medium.com/new-story)
   - 用户可以复制 HTML 并粘贴到 Medium
   - 按照图片标记上传图表

**输出:**
- 带复制按钮的 HTML 预览文件
- 清晰的图片上传标记
- 显示每张图片的文件路径
- 准备粘贴到 Medium 编辑器

**注意**: 通用兼容 - 无需依赖,只需 Read、Write 和 Bash 工具。
