# tianzecn-plugins 安装使用指南

> 专业的 Claude Code 插件市场，包含前端开发、代码分析、后端开发等生产级工作流。

---

## 快速开始

### 系统要求

- Claude Code（支持插件系统的版本）
- Git
- Node.js v18+（可选，用于 Claudish）

### 一、添加插件市场（仅需一次）

```bash
/plugin marketplace add tianzecn/myclaudecode
```

### 二、启用插件

在项目根目录创建或编辑 `.claude/settings.json`：

```json
{
  "enabledPlugins": {
    "frontend@tianzecn-plugins": true,
    "code-analysis@tianzecn-plugins": true,
    "bun@tianzecn-plugins": true,
    "orchestration@tianzecn-plugins": true
  }
}
```

### 三、验证安装

```bash
# 检查安装状态
/doctor

# 查看已安装插件
/plugin list
```

---

## 可用插件

| 插件 | 版本 | 用途 |
|------|------|------|
| **frontend** | v3.13.0 | 前端开发（React/TypeScript/TanStack） |
| **code-analysis** | v2.6.0 | 代码分析与语义搜索 |
| **bun** | v1.5.2 | Bun 后端开发 |
| **orchestration** | v0.6.0 | 多代理协调模式 |
| **agentdev** | v1.1.0 | Claude Code 代理开发 |

---

## 常用命令

### 前端开发插件

```bash
# 全周期功能开发（8 阶段自动化）
/implement 创建用户资料页面，包含头像上传和简介编辑

# UI 实现（带任务分解）
/implement-ui 实现导航栏组件

# 导入 Figma 设计
/import-figma NavigationBar

# 多模型代码审查（并行执行，3-5倍加速）
/review

# UI 验证工作流
/validate-ui
```

### 代码分析插件

```bash
# 深度代码调查
/analyze 这个认证系统是如何工作的？
```

### 后端开发插件

```bash
# 全周期 API 实现
/implement-api 创建用户管理 API

# 初始化新项目
/setup-project

# 同步 API 文档到 Apidog
/apidog
```

---

## `/implement` 工作流详解

这是最强大的命令，自动检测任务类型并调整工作流：

### API 集成任务
```bash
/implement 集成用户管理 API
```
- 跳过设计验证
- 2 个代码审查者（手动 + AI）
- 专注 API 服务测试

### UI 实现任务
```bash
/implement 构建 UserProfile 组件
```
1. **架构规划** → 设计方案，获取批准
2. **代码实现** → 按项目模式生成代码
3. **设计验证** → CSS 感知验证（如有 Figma）
4. **三重审查** → 手动 + AI + 浏览器测试
5. **测试生成** → UI 测试套件
6. **用户批准** → 最终审查
7. **清理交付** → 生产就绪代码

### 混合任务
- 自动组合两种工作流
- 针对性审查和测试

---

## 环境变量配置

创建 `.env` 文件（不要提交到 Git）：

```bash
# Apidog API 令牌（后端开发）
APIDOG_API_TOKEN=your-token

# Figma 访问令牌（前端开发）
FIGMA_ACCESS_TOKEN=your-token

# OpenRouter API 密钥（多模型验证）
OPENROUTER_API_KEY=your-key
```

---

## Claudish - 多模型 CLI

使用其他 AI 模型运行 Claude Code：

```bash
# 安装
npm install -g claudish

# 交互模式（显示模型选择器）
claudish "实现用户认证"

# 指定模型
claudish --model x-ai/grok-code-fast-1 "添加测试"

# 列出所有模型
claudish --list-models
```

**推荐模型：**
- `x-ai/grok-code-fast-1` - 快速编码
- `openai/gpt-5-codex` - 高级推理
- `google/gemini-2.5-flash` - 平衡性能
- `minimax/minimax-m2` - 高性能

---

## 更新插件

```bash
/plugin marketplace update tianzecn-plugins
```

---

## 团队协作

1. 将 `.claude/settings.json` 提交到 Git
2. 团队成员只需添加市场（步骤一）
3. 拉取代码后自动获得相同插件配置

---

## 常见问题

### 插件未加载？
```bash
# 检查市场是否已添加
/plugin marketplace list

# 重新添加市场
/plugin marketplace add tianzecn/myclaudecode
```

### MCP 服务器错误？
检查 `.env` 中的 API 令牌是否正确配置。

### 需要帮助？
- [GitHub Issues](https://github.com/tianzecn/myclaudecode/issues)
- [完整文档](./docs/frontend.md)
- [原始项目](https://github.com/tianzecn/myclaudecode)

---

**基于 tianzecn/myclaudecode** | MIT License
