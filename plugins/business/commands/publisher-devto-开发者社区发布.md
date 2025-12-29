---
allowed-tools: Read, Write, Bash, Glob
argument-hint:
description: 从所有博客文章生成 Dev.to RSS 订阅源,实现自动联合发布
---

# Dev.to RSS 订阅源生成器

从你的所有博客文章生成完整的 RSS 订阅源,用于自动导入到 Dev.to。

**用法:** `/publisher:devto` (无需参数)

**功能说明:**
- 扫描代码库中的所有博客文章
- 将 markdown 转换为 HTML
- 生成符合 RSS 2.0 标准的订阅源,带有正确编码
- 创建 `public/rss-devto.xml` 文件
- 提供 Dev.to 设置说明

**处理流程:**

1. **扫描博客文章**
   - 在代码库中搜索 markdown 文件
   - 常见模式:
     - `src/content/blog/**/*.md`
     - `content/blog/**/*.md`
     - `posts/**/*.md`
     - `blog/**/*.md`

2. **解析博客文章**
   - 提取 frontmatter(标题、日期、描述、标签)
   - 将 markdown 正文转换为 HTML
   - 为 RSS 正确编码 HTML(CDATA 部分)
   - 提取发布日期

3. **生成 RSS 订阅源**
   - 创建有效的 RSS 2.0 XML 结构
   - 将所有博客文章作为条目包含
   - 添加正确的频道元数据
   - HTML 编码内容以兼容 Dev.to

4. **保存订阅源文件**
   - 写入 `public/rss-devto.xml`
   - 确保正确的 XML 格式
   - 验证 RSS 结构

5. **显示设置说明**
   - 展示如何将 RSS 添加到 Dev.to
   - 说明部署要求
   - 指导用户完成配置

**一次性设置:**
1. 运行此命令生成 RSS 订阅源
2. 部署你的站点(使 RSS 可公开访问)
3. 访问 https://dev.to/settings/extensions
4. 添加你的 RSS URL(例如: `https://yoursite.com/rss-devto.xml`)
5. Dev.to 将自动导入所有未来的文章

**优势:**
- 自动同步到 Dev.to
- 所有未来的文章自动同步
- 无需手动复制
- 保持原始格式
