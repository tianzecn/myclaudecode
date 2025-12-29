---
description: IDE 开发环境快速安装命令，支持一键安装或更新现有环境
---

# /ide-install 命令

IDE 开发环境快速安装命令，支持一键安装或更新现有环境。

## 当调用此命令时：

1. 检查是否已经安装过 BMad-Method
2. 如果未安装，执行：`npx bmad-method install`
3. 如果已安装，执行：`git pull && npm run install:bmad`
4. 显示安装状态和下一步指导

## 实现

```bash
#!/bin/bash

echo "🔧 IDE 开发环境快速安装工具"
echo "════════════════════════════════════════"

# 检查是否存在 BMad 安装标识
if [ -f ".bmad-core/install-manifest.yaml" ] || [ -d ".claude/commands/BMad" ]; then
    echo "📦 检测到现有安装，正在更新..."

    # 更新代码库
    if [ -d ".git" ]; then
        echo "🔄 正在拉取最新代码..."
        git pull || echo "⚠️  Git 拉取失败，继续安装流程"
    fi

    # 运行 BMad 安装更新
    if command -v npm &> /dev/null; then
        echo "🚀 正在更新 BMad 环境..."
        npm run install:bmad 2>/dev/null || {
            echo "📦 使用 npx 安装 BMad..."
            npx bmad-method install
        }
    else
        echo "📦 使用 npx 安装 BMad..."
        npx bmad-method install
    fi
else
    echo "🆕 首次安装，正在设置开发环境..."
    echo "📦 正在安装 BMad-Method..."
    npx bmad-method install
fi

echo ""
echo "✅ 安装完成！"
echo ""
echo "📋 下一步操作："
echo "   1️⃣  重启 Claude Code 以加载新命令"
echo "   2️⃣  使用 /bmad-init 初始化项目"
echo "   3️⃣  运行 /BMad:agents:bmad-orchestrator *help 开始工作流"
echo ""
echo "💡 提示：所有 BMad 命令已安装到 .claude/commands/BMad/ 目录"
```

## 用法

在 Claude Code 中直接输入：

```
/ide-install
```

此命令将：

- ✨ 自动检测现有安装状态
- 🔄 智能选择安装或更新模式
- 📦 安装所有必要的开发工具
- 🎯 提供清晰的下一步指导
- ⚡ 支持离线和在线环境

## 特性

- **智能检测**：自动识别是否为首次安装
- **增量更新**：已安装环境仅执行必要更新
- **容错处理**：网络或权限问题自动降级处理
- **清晰反馈**：详细的进度提示和结果说明
