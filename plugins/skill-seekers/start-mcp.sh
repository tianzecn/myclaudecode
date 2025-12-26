#!/bin/bash
# Skill Seekers MCP Server Launcher
# Automatically finds the correct Python environment

# Try uv tool installation first
UV_PYTHON="$HOME/.local/share/uv/tools/skill-seekers/bin/python"
if [ -x "$UV_PYTHON" ]; then
    exec "$UV_PYTHON" -m skill_seekers.mcp.server_fastmcp "$@"
fi

# Try pipx installation
PIPX_PYTHON="$HOME/.local/pipx/venvs/skill-seekers/bin/python"
if [ -x "$PIPX_PYTHON" ]; then
    exec "$PIPX_PYTHON" -m skill_seekers.mcp.server_fastmcp "$@"
fi

# Try uv run as fallback (will install if needed)
if command -v uv &> /dev/null; then
    exec uv run --with skill-seekers python -m skill_seekers.mcp.server_fastmcp "$@"
fi

# Final fallback: system python (requires pip install skill-seekers)
exec python3 -m skill_seekers.mcp.server_fastmcp "$@"
