#!/bin/bash
# =============================================================================
# INTERCEPT GREP → REPLACE WITH CLAUDEMEM AST ANALYSIS (v0.3.0)
# =============================================================================
# This hook intercepts the Grep tool and replaces it with claudemem commands.
# When claudemem is indexed, Grep is blocked and AST results are returned.
# When claudemem is not indexed, Grep is allowed with a warning.
#
# v0.3.0 Update: Uses map/symbol commands for structural analysis
# =============================================================================

set -euo pipefail

# Read tool input from stdin
TOOL_INPUT=$(cat)
PATTERN=$(echo "$TOOL_INPUT" | jq -r '.pattern // empty')

# Skip if empty pattern
if [ -z "$PATTERN" ]; then
  exit 0
fi

# Check if claudemem is installed
if ! command -v claudemem &>/dev/null; then
  # Not installed - allow grep
  exit 0
fi

# Check if claudemem is indexed
STATUS_OUTPUT=$(claudemem status 2>/dev/null || echo "")
if ! echo "$STATUS_OUTPUT" | grep -qE "[0-9]+ (chunks|symbols)"; then
  # Not indexed - allow grep with warning
  cat << 'EOF' >&3
{
  "additionalContext": "⚠️ **claudemem not indexed** - Grep allowed as fallback.\n\nFor AST structural analysis, run:\n```bash\nclaudemem index\n```"
}
EOF
  exit 0
fi

# === CLAUDEMEM IS INDEXED - REPLACE GREP ===

# Determine best command based on pattern
# If pattern looks like a symbol name (CamelCase, snake_case), use symbol command
# Otherwise use map command

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

# Escape special characters for JSON
RESULTS_ESCAPED=$(echo "$RESULTS" | jq -Rs .)
PATTERN_ESCAPED=$(echo "$PATTERN" | jq -Rs .)

# Return results and block grep
cat << EOF >&3
{
  "additionalContext": "🔍 **CLAUDEMEM AST ANALYSIS** (Grep intercepted)\n\n**Query:** ${PATTERN_ESCAPED}\n**Command:** claudemem --nologo ${COMMAND_USED} \"$PATTERN\" --raw\n\n${RESULTS_ESCAPED}\n\n---\n✅ AST structural analysis complete.\n\n**v0.3.0 Commands (Available Now):**\n- \`claudemem --nologo symbol <name> --raw\` → Exact location\n- \`claudemem --nologo callers <name> --raw\` → What calls this?\n- \`claudemem --nologo callees <name> --raw\` → What does this call?\n- \`claudemem --nologo context <name> --raw\` → Full call chain\n\n**v0.4.0+ Commands (Check Version):**\n- \`claudemem --nologo dead-code --raw\` → Find unused symbols\n- \`claudemem --nologo test-gaps --raw\` → Find untested code\n- \`claudemem --nologo impact <name> --raw\` → Full impact analysis\n\n**Check version:** \`claudemem --version\`",
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Grep replaced with claudemem AST analysis. Results provided in context above. Use v0.3.0 commands (callers/callees/context) for navigation. Use v0.4.0+ commands (dead-code/test-gaps/impact) if available for code analysis."
  }
}
EOF

exit 0
