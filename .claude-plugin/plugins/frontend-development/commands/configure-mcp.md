---
description: Configure Apidog MCP server for this project interactively
allowed-tools: AskUserQuestion, Read, Write, Edit, Bash
---

# Setup Apidog MCP Server

This command helps you configure the Apidog MCP server for your project, enabling Claude Code to fetch API documentation, import endpoints, and work with your Apidog project.

## What This Command Does

1. Collects your Apidog project credentials
2. Validates the connection
3. Configures environment variables in `.claude/settings.json`
4. Tests that the MCP server works correctly
5. Provides usage instructions

## Prerequisites

- Apidog account with a project
- API token from Apidog (Settings → API Tokens)
- Project ID from Apidog (visible in project URL)

## Execution Flow

### Step 0: Pre-Flight Check (CRITICAL FIRST STEP)

**Before asking the user anything**, check if configuration already exists:

1. **Check environment variables:**
   ```bash
   # Check if variables are set
   echo $APIDOG_PROJECT_ID
   echo $APIDOG_API_TOKEN
   ```

2. **Check .claude/settings.json:**
   ```bash
   # Read project settings
   cat .claude/settings.json

   # Look for env vars:
   # - APIDOG_PROJECT_ID
   # - APIDOG_API_TOKEN
   ```

3. **Check global environment:**
   ```bash
   # Check if set in shell environment
   env | grep APIDOG
   ```

4. **Determine configuration state:**
   - **Both variables exist** → Proceed to validation (Step 0.1)
   - **Variables missing** → Proceed to collection (Step 2)
   - **Partial config** → Report issue and offer to reconfigure

### Step 0.1: Validate Existing Configuration (If Variables Found)

If environment variables are already set, validate they work:

```bash
# Test with existing credentials
npx -y @apidog/mcp-server \
  --project-id $APIDOG_PROJECT_ID \
  --token $APIDOG_API_TOKEN \
  --test-connection
```

**If validation succeeds:**
```
✅ Apidog MCP Already Configured!

Configuration found:
- Project ID: abc***123 (masked)
- API Token: sec*******ken (masked)
- Source: .claude/settings.json

Connection test: ✅ Successful

Available tools:
- apidog_get_project
- apidog_list_apis
- apidog_get_api_definition

Your Apidog MCP server is ready to use!

Options:
[1] Keep current configuration (recommended)
[2] Reconfigure with new credentials
[3] Test connection again

Your choice [1-3]:
```

**If validation fails:**
```
⚠️ Apidog MCP Configuration Found But Invalid

Existing configuration:
- Project ID: abc***123 (from .claude/settings.json)
- API Token: sec*******ken (from .claude/settings.json)

Connection test: ❌ Failed
Error: Invalid project ID or expired token

Options:
[1] Reconfigure with new credentials (recommended)
[2] Keep existing configuration (may not work)
[3] Remove configuration and exit

Your choice [1-3]:
```

### Step 1: Determine Configuration Source

If no existing config or user chose to reconfigure, determine where to save:

1. **Project-level** (recommended): `.claude/settings.json`
   - Pros: Project-specific, git-ignorable, team can have different configs
   - Cons: Need to configure per project

2. **Global**: Ask if user wants to use same credentials across all projects
   - Pros: Configure once
   - Cons: All projects use same Apidog project

### Step 2: Collect Credentials

Use `AskUserQuestion` to collect (or use direct user input):

**Required Information:**
- **Apidog Project ID**: The unique identifier for your project
  - Found in: Apidog project URL → `https://app.apidog.com/project/{project-id}`
  - Example: `2847593`
- **API Token**: Your personal Apidog API token
  - Found in: Apidog Settings → API Tokens → Generate Token
  - Format: Long alphanumeric string

**Optional Information:**
- **Team ID**: If using team workspaces (optional)
- **Base URL**: For self-hosted Apidog instances (default: `https://api.apidog.com`)

### Step 3: Validate Configuration

Before saving, validate the credentials:

```bash
# Test MCP server with provided credentials
npx -y @apidog/mcp-server --project-id {PROJECT_ID} --token {TOKEN} --test-connection
```

If validation fails:
- Provide clear error message
- Ask user to verify credentials
- Offer to retry or cancel

### Step 4: Write Configuration

Update or create `.claude/settings.json`:

**If file exists:**
- Read current settings
- Merge new Apidog env vars
- Preserve all other settings
- Write back to file

**If file doesn't exist:**
- Create new settings file
- Add Apidog configuration
- Set proper file permissions

**Configuration format:**

```json
{
  "env": {
    "APIDOG_PROJECT_ID": "user-provided-id",
    "APIDOG_API_TOKEN": "user-provided-token",
    "APIDOG_TEAM_ID": "optional-team-id",
    "APIDOG_BASE_URL": "https://api.apidog.com"
  }
}
```

### Step 5: Verify MCP Server

After configuration, verify the MCP server is working:

```bash
# Check if MCP tools are available
# This should list apidog-related tools
```

### Step 6: Provide Usage Instructions

Present to user:

```markdown
✅ Apidog MCP Server Configured Successfully!

## Configuration Saved
- Project ID: {masked-project-id}
- API Token: {masked-token}
- Config Location: .claude/settings.json

## Available Tools
The following Apidog tools are now available:
- `apidog_get_project` - Get project information
- `apidog_list_apis` - List all APIs in project
- `apidog_get_api_definition` - Get API endpoint definition
- `apidog_import_endpoint` - Import API endpoint into codebase
- `apidog_search_endpoints` - Search for specific endpoints

## Example Usage

**Fetch API documentation:**
"Get the API documentation for the User Management endpoints from Apidog"

**Import an endpoint:**
"Import the POST /api/users endpoint from Apidog and create a TypeScript client"

**Search endpoints:**
"Find all authentication-related endpoints in my Apidog project"

## Next Steps
1. Try asking Claude to fetch your API documentation
2. Use `/import-figma` for UI components + Apidog for API endpoints
3. Build features faster with auto-generated API clients!

## Troubleshooting
If you encounter issues:
- Run `/setup-apidog` again to reconfigure
- Check Apidog API token is still valid
- Verify project ID is correct
- Contact: i@madappgang.com
```

## Error Handling

### Invalid Project ID
```
❌ Invalid Apidog Project ID

The project ID you provided could not be found or you don't have access.

Please verify:
1. Project ID is correct (check Apidog URL)
2. You have access to this project
3. Your API token has the right permissions

Try again? [Yes / No]
```

### Invalid API Token
```
❌ Invalid API Token

The API token could not be authenticated.

Please:
1. Go to Apidog Settings → API Tokens
2. Generate a new token if needed
3. Copy the token carefully (no extra spaces)
4. Run /setup-apidog again

Need help? Contact: i@madappgang.com
```

### Connection Failed
```
❌ Connection Failed

Could not connect to Apidog API.

Possible causes:
- Network connectivity issues
- Firewall blocking access to api.apidog.com
- Apidog service is temporarily unavailable

Retry? [Yes / No / Use Custom Base URL]
```

### File Permission Error
```
❌ Permission Denied

Cannot write to .claude/settings.json

Please check:
- You have write permissions in this directory
- .claude directory exists
- File is not read-only

Try: chmod +w .claude/settings.json
```

## Security Considerations

**DO:**
- ✅ Store tokens in `.claude/settings.json`
- ✅ Add `.claude/settings.local.json` to `.gitignore`
- ✅ Mask tokens in output (show only first/last 4 chars)
- ✅ Validate tokens before saving
- ✅ Clear tokens from memory after use

**DON'T:**
- ❌ Log full tokens to console
- ❌ Commit tokens to git
- ❌ Share tokens in error messages
- ❌ Store tokens in plain text elsewhere

## Advanced: Multiple Projects

For teams working with multiple Apidog projects:

**Approach 1: Project-specific settings**
Each project has its own `.claude/settings.json` with different project IDs.

**Approach 2: Environment-based switching**
Use shell environment to override:
```bash
export APIDOG_PROJECT_ID="project-1"
# Work on project 1

export APIDOG_PROJECT_ID="project-2"
# Work on project 2
```

**Approach 3: Interactive project selection**
Extend this command to:
1. Fetch list of accessible projects from Apidog
2. Let user select which project to configure
3. Save selected project ID

## Testing

To test this setup command:

1. **Clean state test:**
   ```bash
   rm .claude/settings.json
   # Run /setup-apidog
   # Verify file is created correctly
   ```

2. **Reconfigure test:**
   ```bash
   # Run /setup-apidog with existing config
   # Verify it asks to reconfigure
   # Verify old config is preserved
   ```

3. **Invalid credentials test:**
   ```bash
   # Run /setup-apidog with wrong project ID
   # Verify error handling works
   # Verify config is not saved
   ```

## Implementation Notes

- Use `AskUserQuestion` for better UX when collecting credentials
- Use `Read` tool to check existing configuration
- Use `Edit` tool to update existing settings (preserves formatting)
- Use `Write` tool only for new settings files
- Use `Bash` tool to validate MCP server connection
- Provide clear, actionable error messages at every step
- Always mask sensitive information in output

---

**Command Author:** Jack Rudenko (i@madappgang.com)
**Plugin:** frontend-development@mag-claude-plugins
**Version:** 1.0.0
