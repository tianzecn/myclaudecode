# Feiskyer Plugin

> feiskyer 的 Claude Code 技能集合 - 6 个专业开发技能

[![Stars](https://img.shields.io/badge/GitHub_Stars-967-yellow.svg)](https://github.com/feiskyer/claude-code-settings)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 概述

这个插件包含 feiskyer 精选的 6 个专业技能，涵盖自主代码执行、长期任务管理、图像生成、视频处理和结构化开发工作流。

**原始项目**: [feiskyer/claude-code-settings](https://github.com/feiskyer/claude-code-settings)

## 包含的技能 (6 个)

### 1. codex-skill - OpenAI Codex 自主执行

**功能**: 使用 OpenAI 模型进行免交互的自主代码实现

**触发词**: "codex", "use gpt", "full-auto"

**三种操作模式**:
- **只读模式** (默认): 分析代码、搜索文件、阅读文档
- **工作区写入模式** (`--full-auto`): 允许项目内文件编辑
- **完全访问模式**: 授予网络和系统级操作权限

**命令示例**:
```bash
codex exec -s read-only [task]      # 只分析不修改
codex exec --full-auto [task]       # 编程任务（可编辑）
codex exec -m gpt-5.2 [task]        # 指定模型版本
```

---

### 2. autonomous-skill - 长期复杂任务自动化

**功能**: 双代理模式执行跨多个会话的复杂长期任务

**核心特性**:
- 自动任务分解和进度跟踪
- 跨会话继续执行
- 基于复选框的任务列表管理

**文件结构**:
```
.autonomous/<task-name>/
├── task_list.md    # 主任务列表
└── progress.md     # 逐会话工作记录
```

---

### 3. nanobanana-skill - 图像生成/编辑

**功能**: 通过 Google Gemini API 生成和编辑图像

**依赖**:
- `~/.nanobanana.env` 中配置 GEMINI_API_KEY
- Python3 + google-genai, Pillow

**能力**:
- 从文本描述创建图像
- 使用 AI 指令修改现有图像
- 支持多种宽高比和分辨率

---

### 4. youtube-transcribe-skill - YouTube 字幕提取

**功能**: 从 YouTube 视频提取字幕/转录文本

**触发词**: "youtube transcript", "extract subtitles", "视频字幕"

**两种方法**:
1. **CLI 方式** (优先): 使用 `yt-dlp` + 浏览器 cookie 认证
2. **浏览器自动化** (备用): 通过 Chrome DevTools 自动化

**依赖**: `yt-dlp` 或 `chrome-devtools-mcp`

---

### 5. kiro-skill - 交互式功能开发

**功能**: 引导用户完成四阶段交互式功能开发

**四阶段工作流**:
1. **需求阶段**: 将想法转化为 EARS 格式的验收标准
2. **设计阶段**: 全面设计文档（架构、组件、数据模型）
3. **任务阶段**: 测试驱动的实现任务
4. **执行阶段**: 一次实现一个任务

**文件结构**:
```
.kiro/specs/{feature-name}/
├── requirements.md
├── design.md
└── tasks.md
```

---

### 6. spec-kit-skill - 规范驱动开发

**功能**: 基于宪法的 7 阶段结构化功能开发

**七阶段工作流**:
1. Constitution (宪法) - 建立治理原则
2. Specify (规范) - 定义功能需求
3. Clarify (澄清) - 解决歧义
4. Plan (计划) - 创建技术策略
5. Tasks (任务) - 生成可执行任务
6. Analyze (分析) - 验证一致性
7. Implement (实现) - 系统化执行

**依赖**: Python 3.11+, uv, spec-kit CLI

**触发词**: "spec-kit", "specify", "constitution"

## 安装

```bash
/plugin install feiskyer@tianzecn-plugins
```

## 相关链接

- **GitHub**: https://github.com/feiskyer/claude-code-settings
- **作者**: feiskyer

## 许可证

MIT License
