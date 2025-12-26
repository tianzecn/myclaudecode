#!/bin/bash
# 一键更新所有第三方插件
# 用法: ./scripts/update-all-third-party.sh
#
# 此脚本会依次更新以下插件：
#
# Jesse Vincent 全家桶:
# - superpowers (核心技能库)
# - superpowers-chrome (Chrome DevTools 自动化)
# - the-elements-of-style (写作风格指南)
# - episodic-memory (对话语义搜索)
# - superpowers-lab (实验性技能)
# - superpowers-developing-for-claude-code (插件开发指南)
# - double-shot-latte (自动继续工作流)
#
# 其他第三方:
# - notebooklm-skill (NotebookLM 集成 by PleasePrompto)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

echo "🚀 开始更新所有第三方插件..."
echo "================================================"
echo ""

# 记录更新结果
UPDATED=()
SKIPPED=()
FAILED=()

# 定义所有第三方插件更新脚本
PLUGINS=(
    "update-superpowers.sh:⚡ Superpowers"
    "update-superpowers-chrome.sh:🌐 Superpowers Chrome"
    "update-elements-of-style.sh:📝 Elements of Style"
    "update-episodic-memory.sh:🧠 Episodic Memory"
    "update-superpowers-lab.sh:🧪 Superpowers Lab"
    "update-superpowers-developing-for-claude-code.sh:📚 Developing for Claude Code"
    "update-double-shot-latte.sh:☕ Double Shot Latte"
    "update-notebooklm-skill.sh:📓 NotebookLM Skill"
)

for plugin in "${PLUGINS[@]}"; do
    script="${plugin%%:*}"
    name="${plugin##*:}"

    echo "------------------------------------------------"
    echo "$name"
    echo "------------------------------------------------"

    if [[ -f "$SCRIPT_DIR/$script" ]]; then
        # 执行更新脚本，捕获输出
        if output=$("$SCRIPT_DIR/$script" 2>&1); then
            # 检查是否有实际更新
            if echo "$output" | grep -q "版本未变化"; then
                SKIPPED+=("$name")
                echo "ℹ️  无需更新"
            else
                UPDATED+=("$name")
                echo "✅ 更新成功"
            fi
        else
            FAILED+=("$name")
            echo "❌ 更新失败"
            echo "$output"
        fi
    else
        FAILED+=("$name (脚本不存在)")
        echo "❌ 更新脚本不存在: $script"
    fi
    echo ""
done

# 打印总结
echo "================================================"
echo "📊 更新总结"
echo "================================================"
echo ""

if [[ ${#UPDATED[@]} -gt 0 ]]; then
    echo "✅ 已更新 (${#UPDATED[@]}):"
    for item in "${UPDATED[@]}"; do
        echo "   - $item"
    done
    echo ""
fi

if [[ ${#SKIPPED[@]} -gt 0 ]]; then
    echo "ℹ️  无需更新 (${#SKIPPED[@]}):"
    for item in "${SKIPPED[@]}"; do
        echo "   - $item"
    done
    echo ""
fi

if [[ ${#FAILED[@]} -gt 0 ]]; then
    echo "❌ 更新失败 (${#FAILED[@]}):"
    for item in "${FAILED[@]}"; do
        echo "   - $item"
    done
    echo ""
fi

echo "================================================"
if [[ ${#FAILED[@]} -eq 0 ]]; then
    echo "🎉 所有第三方插件更新完成！"
else
    echo "⚠️  部分插件更新失败，请检查上方日志"
    exit 1
fi
