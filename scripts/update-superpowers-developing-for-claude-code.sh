#!/bin/bash
# 更新 Superpowers Developing for Claude Code 插件到最新版本（自动提交和推送）
# 用法: ./scripts/update-superpowers-developing-for-claude-code.sh

set -e

PLUGIN_DIR="plugins/superpowers-developing-for-claude-code"
UPSTREAM_URL="https://github.com/obra/superpowers-developing-for-claude-code.git"

echo "📚 正在更新 Superpowers Developing for Claude Code 插件..."

# 备份当前版本号
OLD_VERSION=$(cat "$PLUGIN_DIR/.claude-plugin/plugin.json" | grep '"version"' | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
echo "📌 当前版本: v$OLD_VERSION"

# 删除旧目录
rm -rf "$PLUGIN_DIR"

# 克隆最新版本（浅克隆）
git clone --depth 1 "$UPSTREAM_URL" "$PLUGIN_DIR"

# 删除 .git 目录（确保是普通目录）
rm -rf "$PLUGIN_DIR/.git"

# 获取新版本号
NEW_VERSION=$(cat "$PLUGIN_DIR/.claude-plugin/plugin.json" | grep '"version"' | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
echo "✨ 新版本: v$NEW_VERSION"

# 检查是否有更新
if [[ "$OLD_VERSION" == "$NEW_VERSION" ]]; then
    echo ""
    echo "ℹ️  版本未变化 (v$NEW_VERSION)，无需更新"
    exit 0
fi

# 更新 marketplace.json 中的版本号
sed -i '' "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/g" .claude-plugin/marketplace.json
echo "📝 已更新 marketplace.json 版本号"

# Git 提交和推送
echo ""
echo "📦 正在提交更改..."
git add "$PLUGIN_DIR/" .claude-plugin/marketplace.json
git commit -m "chore(superpowers-developing-for-claude-code): 更新至 v$NEW_VERSION"

echo ""
echo "🚀 正在推送到远程仓库..."
git push origin main

echo ""
echo "✅ Superpowers Developing for Claude Code 已成功更新至 v$NEW_VERSION 并推送到远程仓库！"
