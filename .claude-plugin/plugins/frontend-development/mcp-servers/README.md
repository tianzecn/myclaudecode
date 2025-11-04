# MCP Server Configuration for Frontend Development Plugin

This directory contains MCP server configurations that can be included in your plugin.

## Dynamic Configuration Patterns

### Approach 1: Environment Variables (Recommended)

Use environment variables that users set per-project in their `.claude/settings.json`:

**Plugin's mcp-config.json:**
```json
{
  "apidog": {
    "command": "npx",
    "args": [
      "-y",
      "@apidog/mcp-server",
      "--project-id",
      "${APIDOG_PROJECT_ID}",
      "--token",
      "${APIDOG_API_TOKEN}"
    ]
  }
}
```

**User's project `.claude/settings.json`:**
```json
{
  "env": {
    "APIDOG_PROJECT_ID": "your-actual-project-id",
    "APIDOG_API_TOKEN": "your-api-token"
  }
}
```

**Pros:**
- ✅ Clean separation of plugin and project config
- ✅ Easy to switch between projects
- ✅ Secrets stay in project-specific settings
- ✅ Works with any MCP server

### Approach 2: Plugin Configuration Override

Allow users to override MCP server config in their project settings:

**Plugin's mcp-config.json (provides defaults):**
```json
{
  "apidog": {
    "command": "npx",
    "args": ["-y", "@apidog/mcp-server"],
    "env": {
      "APIDOG_PROJECT_ID": "${APIDOG_PROJECT_ID}",
      "APIDOG_API_TOKEN": "${APIDOG_API_TOKEN}"
    }
  }
}
```

**User's project `.claude/settings.json` (overrides with specifics):**
```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "@apidog/mcp-server",
        "--project-id",
        "abc123xyz",
        "--token",
        "secret-token-here"
      ]
    }
  }
}
```

**Pros:**
- ✅ Plugin provides sensible defaults
- ✅ Full control for users to customize
- ✅ Can override any aspect of MCP config

### Approach 3: Config File Per Project

Use a project-specific config file that MCP server reads:

**Plugin's mcp-config.json:**
```json
{
  "apidog": {
    "command": "npx",
    "args": [
      "-y",
      "@apidog/mcp-server",
      "--config",
      "${PROJECT_ROOT}/.apidog/config.json"
    ]
  }
}
```

**User creates `.apidog/config.json` in their project:**
```json
{
  "projectId": "your-project-id",
  "apiToken": "your-token"
}
```

**Pros:**
- ✅ Config lives with project code
- ✅ Can be git-ignored for secrets
- ✅ Easy to version control non-secret config

### Approach 4: Interactive Setup (Advanced)

Create a custom command or skill that helps users configure the MCP server:

**Plugin command: `/setup-apidog`**

```markdown
---
description: Configure Apidog MCP server for this project
allowed-tools: AskUserQuestion, Read, Write, Edit
---

# Setup Apidog MCP Server

This command helps you configure the Apidog MCP server for your project.

## Workflow

1. **Ask for project details:**
   - Apidog Project ID
   - API Token (or prompt to create one)
   - Team ID (if applicable)

2. **Store configuration:**
   - Option A: Write to `.claude/settings.json` (env vars)
   - Option B: Create `.apidog/config.json` in project root
   - Option C: Update global MCP config with project-specific values

3. **Verify connection:**
   - Test MCP server connection
   - Verify project ID is valid
   - Confirm API access works

4. **Provide usage instructions:**
   - How to use Apidog tools in Claude Code
   - Common workflows (fetch API docs, import endpoints, etc.)
```

**Pros:**
- ✅ Guided setup for users
- ✅ Validates configuration
- ✅ Great UX for non-technical users

## Recommended Pattern: Environment Variables + Setup Command

**Best practice combines multiple approaches:**

1. **Plugin provides template** with environment variable placeholders
2. **Setup command** (`/setup-apidog`) guides users through configuration
3. **Setup command writes** to `.claude/settings.json`:

```json
{
  "env": {
    "APIDOG_PROJECT_ID": "user-provided-id",
    "APIDOG_API_TOKEN": "user-provided-token"
  }
}
```

4. **Plugin's MCP config** reads from environment:

```json
{
  "apidog": {
    "command": "npx",
    "args": [
      "-y",
      "@apidog/mcp-server",
      "--project-id",
      "${APIDOG_PROJECT_ID}",
      "--token",
      "${APIDOG_API_TOKEN}"
    ],
    "env": {
      "APIDOG_PROJECT_ID": "${APIDOG_PROJECT_ID}",
      "APIDOG_API_TOKEN": "${APIDOG_API_TOKEN}"
    }
  }
}
```

## Example: Complete Apidog MCP Integration

### Plugin Structure

```
frontend-development/
├── mcp-servers/
│   ├── mcp-config.json          # MCP server configurations
│   └── README.md                # This file
├── commands/
│   └── setup-apidog.md          # Setup command
└── plugin.json
```

### mcp-config.json

```json
{
  "apidog": {
    "command": "npx",
    "args": [
      "-y",
      "@apidog/mcp-server"
    ],
    "env": {
      "APIDOG_PROJECT_ID": "${APIDOG_PROJECT_ID}",
      "APIDOG_API_TOKEN": "${APIDOG_API_TOKEN}",
      "APIDOG_BASE_URL": "${APIDOG_BASE_URL:-https://api.apidog.com}"
    }
  }
}
```

**Note:** `${VAR:-default}` syntax provides default value if VAR is not set.

### User Setup Flow

**Step 1: Install plugin**
```bash
/plugin install frontend-development@mag-claude-plugins
```

**Step 2: Run setup**
```bash
/setup-apidog
```

**Step 3: Claude prompts for:**
- Apidog Project ID
- API Token
- (Optional) Team ID
- (Optional) Base URL for self-hosted

**Step 4: Setup command writes to `.claude/settings.json`:**
```json
{
  "env": {
    "APIDOG_PROJECT_ID": "abc123",
    "APIDOG_API_TOKEN": "secret-token",
    "APIDOG_TEAM_ID": "team-456"
  }
}
```

**Step 5: MCP server is ready**
```
✅ Apidog MCP server configured successfully!

Available tools:
- apidog_get_project
- apidog_list_apis
- apidog_get_api_definition
- apidog_import_endpoint

Try: "Fetch API documentation from Apidog for the User API"
```

## Security Best Practices

### DO ✅

- Store API tokens in environment variables
- Add `.claude/settings.local.json` to `.gitignore`
- Use project-specific `.claude/settings.json` for non-secret config
- Provide clear setup instructions
- Validate tokens before saving

### DON'T ❌

- Hard-code API tokens in plugin files
- Commit secrets to git
- Use global settings for project-specific IDs
- Skip token validation

## Testing Your MCP Server Configuration

1. **Test environment variable resolution:**
```bash
echo $APIDOG_PROJECT_ID
```

2. **Test MCP server directly:**
```bash
npx -y @apidog/mcp-server --project-id your-id --token your-token
```

3. **Verify in Claude Code:**
```
User: "List available MCP tools"
Claude should show apidog tools if configured correctly
```

## Troubleshooting

### Issue: Environment variables not resolving

**Solution:** Ensure variables are set in `.claude/settings.json`:
```json
{
  "env": {
    "APIDOG_PROJECT_ID": "your-id"
  }
}
```

### Issue: MCP server not starting

**Solution:** Check MCP server logs and verify:
- `npx` is available
- MCP server package installs correctly
- All required env vars are set

### Issue: Project ID not being passed

**Solution:** Verify command args in mcp-config.json:
```json
{
  "args": [
    "-y",
    "@apidog/mcp-server",
    "--project-id",
    "${APIDOG_PROJECT_ID}"  // ← Make sure this is here
  ]
}
```

## Additional Resources

- [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
- [MCP Server Protocol](https://modelcontextprotocol.io)
- [Environment Variables in Plugins](https://docs.claude.com/en/docs/claude-code/plugins-reference#environment-variables)
