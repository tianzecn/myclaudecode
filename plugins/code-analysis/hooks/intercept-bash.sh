#!/bin/bash
# =============================================================================
# INTERCEPT BASH GREP/RG/FIND → REPLACE WITH CLAUDEMEM AST (v0.3.0)
# =============================================================================
# This hook intercepts Bash commands that run grep, rg, ripgrep, ag, ack,
# git grep, or find with grep. Replaces with claudemem AST analysis.
#
# v0.3.0 Update: Uses map/symbol commands for structural analysis
# =============================================================================

set -euo pipefail

# Read tool input from stdin
TOOL_INPUT=$(cat)
COMMAND=$(echo "$TOOL_INPUT" | jq -r '.command // empty')

# Skip if empty command
if [ -z "$COMMAND" ]; then
  exit 0
fi

# Detect search commands: grep, rg, ripgrep, ag, ack, git grep, find with grep
# Pattern matches: grep, rg, etc. as standalone commands or with paths
if ! echo "$COMMAND" | grep -qiE '(^|\s|/|;|&&|\|)(grep|rg|ripgrep|ag|ack)(\s|$)|git\s+grep|find\s+.*-exec.*grep'; then
  # Not a search command - allow
  exit 0
fi

# Check if claudemem is installed
if ! command -v claudemem &>/dev/null; then
  exit 0
fi

# Check if claudemem is indexed
STATUS_OUTPUT=$(claudemem status 2>/dev/null || echo "")
if ! echo "$STATUS_OUTPUT" | grep -qE "[0-9]+ (chunks|symbols)"; then
  # Not indexed - allow with warning
  cat << 'EOF' >&3
{
  "additionalContext": "⚠️ **claudemem not indexed** - Search command allowed as fallback.\n\nFor AST structural analysis, run:\n```bash\nclaudemem index\n```"
}
EOF
  exit 0
fi

# === CLAUDEMEM IS INDEXED - REPLACE BASH SEARCH ===

# Extract search pattern (best effort)
# Handles various patterns: grep "pattern", grep 'pattern', grep pattern, rg pattern
PATTERN=""

# Try to extract quoted pattern first
PATTERN=$(echo "$COMMAND" | grep -oE '"[^"]+"' | head -1 | tr -d '"')

# If no quoted pattern, try single quotes
if [ -z "$PATTERN" ]; then
  PATTERN=$(echo "$COMMAND" | grep -oE "'[^']+'" | head -1 | tr -d "'")
fi

# If still no pattern, try to get the argument after grep/rg
if [ -z "$PATTERN" ]; then
  PATTERN=$(echo "$COMMAND" | sed -E 's/.*(grep|rg|ag|ack)\s+(-[a-zA-Z]+\s+)*([^\s|>]+).*/\3/' | head -1)
fi

# Fallback
if [ -z "$PATTERN" ] || [ "$PATTERN" = "$COMMAND" ]; then
  PATTERN="code pattern"
fi

# Determine best command based on pattern
RESULTS=""
COMMAND_USED=""

# Check if pattern looks like a specific symbol name
if echo "$PATTERN" | grep -qE '^[A-Z][a-zA-Z0-9]*$|^[a-z][a-zA-Z0-9]*$|^[a-z_]+$'; then
  # Pattern looks like a symbol name - try symbol lookup first
  SYMBOL_RESULT=$(claudemem --nologo symbol "$PATTERN" --raw 2>/dev/null || echo "")

  if [ -n "$SYMBOL_RESULT" ] && [ "$SYMBOL_RESULT" != "No results found" ]; then
    RESULTS="$SYMBOL_RESULT"
    COMMAND_USED="symbol"
  fi
fi

# Fallback to map if symbol didn't find anything
if [ -z "$RESULTS" ]; then
  RESULTS=$(claudemem --nologo map "$PATTERN" --raw 2>/dev/null || echo "No results found")
  COMMAND_USED="map"
fi

# Escape for JSON
RESULTS_ESCAPED=$(echo "$RESULTS" | jq -Rs .)
COMMAND_ESCAPED=$(echo "$COMMAND" | jq -Rs .)
PATTERN_ESCAPED=$(echo "$PATTERN" | jq -Rs .)

# Return results and block
cat << EOF >&3
{
  "additionalContext": "🔍 **CLAUDEMEM AST ANALYSIS** (Bash search intercepted)\n\n**Blocked command:** ${COMMAND_ESCAPED}\n**Extracted query:** ${PATTERN_ESCAPED}\n**Command:** claudemem --nologo ${COMMAND_USED} \"$PATTERN\" --raw\n\n${RESULTS_ESCAPED}\n\n---\n✅ AST structural analysis complete.\n\n**v0.3.0 Commands (Available Now):**\n- \`claudemem --nologo symbol <name> --raw\` → Exact location\n- \`claudemem --nologo callers <name> --raw\` → What calls this?\n- \`claudemem --nologo callees <name> --raw\` → What does this call?\n- \`claudemem --nologo context <name> --raw\` → Full call chain\n\n**v0.4.0+ Commands (Check Version):**\n- \`claudemem --nologo dead-code --raw\` → Find unused symbols\n- \`claudemem --nologo test-gaps --raw\` → Find untested code\n- \`claudemem --nologo impact <name> --raw\` → Full impact analysis\n\n**Check version:** \`claudemem --version\`",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "grep/rg/find blocked. claudemem AST results provided in context above. Use v0.3.0 commands (callers/callees/context) for navigation. Use v0.4.0+ commands (dead-code/test-gaps/impact) if available for code analysis."
  }
}
EOF

exit 0
