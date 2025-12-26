#!/bin/bash
# Update notebooklm-skill plugin from upstream
# Source: https://github.com/PleasePrompto/notebooklm-skill
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
PLUGIN_DIR="${REPO_ROOT}/plugins/notebooklm-skill"
UPSTREAM_URL="https://github.com/PleasePrompto/notebooklm-skill.git"
TEMP_DIR=$(mktemp -d)

echo "🔄 Updating notebooklm-skill plugin..."
echo "   Upstream: ${UPSTREAM_URL}"
echo ""

# Clone upstream to temp directory
echo "📥 Cloning latest upstream..."
git clone --depth 1 "${UPSTREAM_URL}" "${TEMP_DIR}/notebooklm-skill" 2>/dev/null

# Get version from upstream (check CHANGELOG.md or README.md)
UPSTREAM_VERSION=""
if [[ -f "${TEMP_DIR}/notebooklm-skill/CHANGELOG.md" ]]; then
    # Try to extract version from CHANGELOG.md
    UPSTREAM_VERSION=$(grep -oE 'v[0-9]+\.[0-9]+\.[0-9]+' "${TEMP_DIR}/notebooklm-skill/CHANGELOG.md" | head -1 | sed 's/^v//')
fi

if [[ -z "${UPSTREAM_VERSION}" ]]; then
    # Fallback: use current date as version
    UPSTREAM_VERSION="1.0.$(date +%Y%m%d)"
fi

# Get current version from marketplace.json
CURRENT_VERSION=$(grep -A 20 '"name": "notebooklm-skill"' "${REPO_ROOT}/.claude-plugin/marketplace.json" | grep '"version"' | head -1 | sed 's/.*"version": "\([^"]*\)".*/\1/')

echo "   Current version: ${CURRENT_VERSION}"
echo "   Upstream version: ${UPSTREAM_VERSION}"

# Compare versions
if [[ "${CURRENT_VERSION}" == "${UPSTREAM_VERSION}" ]]; then
    echo ""
    echo "✅ Already up to date (v${CURRENT_VERSION})"
    rm -rf "${TEMP_DIR}"
    exit 0
fi

# Remove old plugin content (preserve .claude-plugin if we created it)
echo "🗑️  Removing old plugin content..."
find "${PLUGIN_DIR}" -mindepth 1 -maxdepth 1 ! -name '.claude-plugin' -exec rm -rf {} +

# Copy new content
echo "📦 Copying new content..."
rsync -a --exclude='.git' "${TEMP_DIR}/notebooklm-skill/" "${PLUGIN_DIR}/"

# Ensure .claude-plugin/plugin.json exists
if [[ ! -f "${PLUGIN_DIR}/.claude-plugin/plugin.json" ]]; then
    mkdir -p "${PLUGIN_DIR}/.claude-plugin"
    cat > "${PLUGIN_DIR}/.claude-plugin/plugin.json" << EOF
{
	"name": "notebooklm-skill",
	"version": "${UPSTREAM_VERSION}",
	"description": "Query Google NotebookLM notebooks directly from Claude Code for source-grounded, citation-backed answers from Gemini. Browser automation, library management, persistent auth. Drastically reduced hallucinations through document-only responses.",
	"author": {
		"name": "PleasePrompto",
		"email": "",
		"url": "https://github.com/PleasePrompto"
	},
	"homepage": "https://github.com/PleasePrompto/notebooklm-skill",
	"repository": "https://github.com/PleasePrompto/notebooklm-skill",
	"license": "MIT",
	"keywords": [
		"notebooklm",
		"google",
		"gemini",
		"research",
		"documentation",
		"browser-automation",
		"source-grounded",
		"citations"
	]
}
EOF
else
    # Update version in plugin.json
    sed -i '' "s/\"version\": \"[^\"]*\"/\"version\": \"${UPSTREAM_VERSION}\"/" "${PLUGIN_DIR}/.claude-plugin/plugin.json"
fi

# Update version in marketplace.json
echo "📝 Updating marketplace.json version..."
sed -i '' "/\"name\": \"notebooklm-skill\"/,/\"strict\": true/s/\"version\": \"[^\"]*\"/\"version\": \"${UPSTREAM_VERSION}\"/" "${REPO_ROOT}/.claude-plugin/marketplace.json"

# Cleanup
rm -rf "${TEMP_DIR}"

echo ""
echo "✅ Updated notebooklm-skill: v${CURRENT_VERSION} → v${UPSTREAM_VERSION}"
echo ""
echo "📋 Next steps:"
echo "   git add plugins/notebooklm-skill .claude-plugin/marketplace.json"
echo "   git commit -m \"chore: update notebooklm-skill to v${UPSTREAM_VERSION}\""
echo "   git push"
