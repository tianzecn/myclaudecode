#!/bin/bash
# 更新 Superpowers 插件到最新版本
# 用法: ./scripts/update-superpowers.sh

set -e

PLUGIN_DIR="plugins/superpowers"
UPSTREAM_URL="https://github.com/obra/superpowers.git"

echo "🦸 正在更新 Superpowers 插件..."

# 备份当前版本号
OLD_VERSION=$(cat "$PLUGIN_DIR/.claude-plugin/plugin.json" | grep '"version"' | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
echo "📌 当前版本: v$OLD_VERSION"

# 删除旧目录
rm -rf "$PLUGIN_DIR"

# 克隆最新版本（浅克隆）
git clone --depth 1 "$UPSTREAM_URL" "$PLUGIN_DIR"

# 删除 .git 目录
rm -rf "$PLUGIN_DIR/.git"

# 获取新版本号
NEW_VERSION=$(cat "$PLUGIN_DIR/.claude-plugin/plugin.json" | grep '"version"' | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
echo "✨ 新版本: v$NEW_VERSION"

# 更新 marketplace.json 中的版本号
if [[ "$OLD_VERSION" != "$NEW_VERSION" ]]; then
    sed -i '' "s/\"version\": \"$OLD_VERSION\"/\"version\": \"$NEW_VERSION\"/" .claude-plugin/marketplace.json
    echo "📝 已更新 marketplace.json 版本号"
fi

echo ""
echo "✅ Superpowers 已更新至 v$NEW_VERSION"
echo ""
echo "下一步："
echo "  git add plugins/superpowers/ .claude-plugin/marketplace.json"
echo "  git commit -m \"chore(superpowers): 更新至 v$NEW_VERSION\""
echo "  git push"
