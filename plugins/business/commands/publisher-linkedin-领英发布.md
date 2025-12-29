---
allowed-tools: Read, Write, Bash, Glob, WebFetch
argument-hint: <input> [lang] [custom-file-path]
description: 从博客内容生成 LinkedIn 帖子,通过 LinkedIn API 自动附加媒体
---

# LinkedIn 帖子生成器

从任何内容源创建专业的 LinkedIn 帖子,可选媒体附件。

**用法:** `$ARGUMENTS`

**示例:**
```bash
/publisher:linkedin my-post                    # 自动检测并附加博客图表
/publisher:linkedin my-post en                 # 英文,带图表
/publisher:linkedin my-post en image.png       # 自定义图片附件
/publisher:linkedin my-post ja report.pdf      # 日文,带自定义 PDF
```

**处理流程:**

1. **解析输入参数**
   - 内容输入(slug、文件路径或 URL)
   - 可选语言参数(en/ja)
   - 可选附件自定义文件路径

2. **通用输入检测**
   - **文件路径**: 读取并解析(markdown、PDF、HTML、文本、JSON)
   - **URL**: 使用 WebFetch 获取内容
   - **Slug**: 在代码库中搜索匹配的博客文章

3. **生成专业 LinkedIn 帖子**
   - 英文使用思想领袖口吻
   - 日文使用专业商务语气(敬語)
   - 从实际内容中提取关键见解
   - 包含相关话题标签(最多2-4个)
   - 添加完整文章链接

4. **处理媒体附件**
   - **自定义文件**: 如果提供,使用指定的图片/PDF
   - **自动检测**: 如果可用,查找博客图表
   - 支持的格式: PNG、JPG、JPEG、PDF

5. **通过 LinkedIn API 发布**(使用 Bash + curl)
   - 检查 .env 文件中的凭据
   - 如需要,处理 OAuth 流程
   - **关键**: 转义 LinkedIn Little Text Format 保留字符: `| { } @ [ ] ( ) < > # * _ ~`
   - 上传媒体文件并获取资源 URN
   - 创建包含评论和媒体的草稿帖子
   - 在浏览器中打开 LinkedIn 进行审查

**LinkedIn API 认证:**
1. 在 https://www.linkedin.com/developers/apps 创建 LinkedIn 应用
2. 将凭据添加到 .env:
   ```
   LINKEDIN_CLIENT_ID=your_client_id
   LINKEDIN_CLIENT_SECRET=your_secret
   LINKEDIN_ACCESS_TOKEN=your_token (首次使用时自动生成)
   ```

**未设置 API 时**: 命令仍会生成帖子内容供手动复制粘贴。

**注意**: 适用于任何仓库类型(Python、Rust、Go 等) - 仅使用 bash 和 curl,无需 Node.js。
