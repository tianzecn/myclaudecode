# ZCF 安装与使用说明

## 什么是 ZCF

ZCF (Zero-Config Claude-Code Flow) 是一个零配置的 Claude Code 安装和配置工具,一键完成所有环境配置。

**GitHub**: https://github.com/UfoMiao/zcf

## 快速安装

### 前置要求
- Node.js >= 18.0

检查版本:
```bash
node --version
```

如果版本过低,去 https://nodejs.org 下载安装最新 LTS 版本。

### 一键安装

```bash
# 完整初始化(首次使用)
npx zcf i

# 交互式菜单
npx zcf
```

## 安装内容

ZCF 会自动配置:
- ✅ Claude Code 主程序
- ✅ API 密钥或代理
- ✅ 中英双语支持
- ✅ MCP 服务(浏览器控制、文档查询等)
- ✅ 工作流和 Git 命令
- ✅ AI 个性化设置

## 核心功能

### 1. 开发工作流命令

```bash
/zcf:workflow        # 六段式开发流程(研究→构思→计划→执行→优化→评审)
/zcf:feat           # 新功能开发(含UI/UX设计)
/zcf:init-project   # 初始化项目AI上下文
/bmad-init          # 企业级敏捷开发工作流
```

### 2. Git 自动化命令

```bash
/zcf:git-commit          # 智能提交(自动生成符合规范的commit信息)
/zcf:git-rollback        # 交互式代码回滚
/zcf:git-cleanBranches   # 清理已合并或过期分支
/zcf:git-worktree        # Git工作树管理
```

### 3. MCP 服务

| 服务 | 功能 |
|------|------|
| Context7 | 查询最新技术文档(React/Next.js/Vue等) |
| DeepWiki | GitHub仓库文档查询 |
| Open WebSearch | 多引擎网页搜索(无需API key) |
| Playwright | 浏览器自动化控制 |
| Exa AI | 智能网页搜索 |
| Spec Workflow | 需求到实现完整流程 |

### 4. CCR 路由管理

```bash
npx zcf ccr  # CCR管理菜单
```

功能:
- 🆓 接入免费模型(Gemini、DeepSeek等)
- 💰 成本优化
- 🎛️ Web界面管理

### 5. AI 输出风格

```bash
/output-style  # 切换AI风格
```

可选风格:
- 专业工程师(默认)
- 猫娘工程师(萌萌哒+严谨)
- 老王风格(暴躁老哥)
- 傲娇大小姐(傲娇+专业)

## 快速开始

### 步骤 1: 安装配置

```bash
# 运行安装
npx zcf i

# 按提示选择:
# 1. 配置语言: 中文/英文
# 2. API配置: Auth Token / API Key / CCR代理
# 3. MCP服务: 全选或按需选择
# 4. AI风格: 选择喜欢的风格
```

### 步骤 2: 初始化项目

```bash
cd your-project
claude
/zcf:init-project
```

这会生成 `CLAUDE.md` 文件,让AI理解你的项目架构。

### 步骤 3: 开始开发

```bash
# 新功能开发
/zcf:feat 实现用户登录功能

# 完整工作流
/zcf:workflow 开发电商系统

# Git提交
/zcf:git-commit
```

## 常用操作

### 更新工作流

```bash
npx zcf u  # 仅更新工作流,保留现有配置
```

### 重新配置

```bash
npx zcf  # 进入交互式菜单
```

菜单选项:
1. 完整初始化
2. 导入工作流
3. 配置 API
4. 配置 MCP
5. 配置默认模型
6. 配置 Claude 全局记忆
7. 导入环境变量
R. CCR 管理
U. 使用量分析

### 使用量分析

```bash
npx zcf ccu          # 今日用量
npx zcf ccu monthly  # 月度统计
npx zcf ccu session  # 会话统计
```

## 常见问题

### 1. Node.js 版本过低

```bash
# 检查版本
node --version

# 升级Node.js: 下载最新LTS版本
# https://nodejs.org
```

### 2. Windows MCP 连接失败

```bash
# 使用ZCF自动修复
npx zcf
# 选择 "4. 配置 MCP"
```

### 3. API 配置错误

```bash
# 重新配置
npx zcf
# 选择 "3. 配置 API"
```

### 4. 权限问题 (Linux/macOS)

```bash
# 方案1: 使用sudo
sudo npm install -g zcf

# 方案2: 配置npm全局目录
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### 5. 重置配置

```bash
# 删除配置(谨慎操作)
rm -rf ~/.claude

# 重新初始化
npx zcf i
```

## 配置文件位置

- 全局配置: `~/.claude/`
- 项目配置: `<项目根目录>/.claude/`
- 备份目录: `~/.claude/backup/`

## API 配置方式

### 方式 1: Auth Token (OAuth认证)
从浏览器开发者工具获取token

### 方式 2: API Key
从 https://console.anthropic.com 获取

### 方式 3: CCR 代理(推荐)
免费模型接入,降低成本

### 方式 4: 第三方代理
支持 302.AI、智谱GLM、MiniMax、Kimi 等

## 最佳实践

### 1. 项目首次使用
```bash
cd your-project
claude
/zcf:init-project
```

### 2. 功能开发
```bash
# 使用Plan Mode: Shift + Tab (Windows: Alt + M)
/zcf:feat 功能描述
```

### 3. Git 操作
```bash
# 自动生成规范的commit信息
/zcf:git-commit

# 安全回滚
/zcf:git-rollback

# 清理分支
/zcf:git-cleanBranches
```

### 4. 任务分解
使用 Plan Mode 让AI先规划再执行,避免直接写代码。

## 升级 ZCF

```bash
# 检查版本
npx zcf --version

# 升级到最新版
npm update -g zcf
# 或
pnpm update -g zcf

# 更新配置
npx zcf u
```

## 技术支持

- **GitHub Issues**: https://github.com/UfoMiao/zcf/issues
- **社区讨论**: https://linux.do/
- **查看帮助**: `npx zcf --help`

## 核心优势

1. **零配置**: 3分钟完成全部配置
2. **中文友好**: 完整中文界面和文档
3. **开箱即用**: 预置专业工作流
4. **跨平台**: Windows/macOS/Linux/Android Termux
5. **成本优化**: CCR路由降低API成本
6. **持续更新**: 活跃的社区和开发团队

---

**提示**: 首次使用建议运行 `npx zcf i` 完整初始化,后续使用 `npx zcf` 进入交互式菜单即可。
