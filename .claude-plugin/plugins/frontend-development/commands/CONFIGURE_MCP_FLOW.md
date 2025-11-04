# /configure-mcp Command Flow Diagram

This document visualizes the complete execution flow of the `/configure-mcp` command with validation-first approach.

## Complete Flow Chart

```
User runs: /configure-mcp apidog
           │
           ▼
┌──────────────────────────────────────────┐
│ STEP 0: PRE-FLIGHT CHECK                 │
│ Check if already configured              │
└──────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────┐
│ Check Environment Variables:             │
│ - $APIDOG_PROJECT_ID                     │
│ - $APIDOG_API_TOKEN                      │
│ - .claude/settings.json                  │
│ - Shell environment (env | grep APIDOG) │
└──────────────────────────────────────────┘
           │
           ├─────────────────┬────────────────┐
           ▼                 ▼                ▼
    Both Found      Only One Found    None Found
           │                 │                │
           ▼                 ▼                │
┌──────────────────┐  ┌────────────────┐    │
│ Variables Exist  │  │ Partial Config │    │
└──────────────────┘  └────────────────┘    │
           │                 │                │
           ▼                 ▼                │
┌──────────────────────────────────┐         │
│ STEP 0.1: VALIDATE CONNECTION    │         │
│ Test: npx @apidog/mcp-server     │         │
│   --project-id $ID               │         │
│   --token $TOKEN                 │         │
│   --test-connection              │         │
└──────────────────────────────────┘         │
           │                                  │
           ├─────────────────┐                │
           ▼                 ▼                │
    ✅ Valid          ❌ Invalid              │
           │                 │                │
           ▼                 ▼                │
┌─────────────────┐  ┌────────────────────┐ │
│ Already Working │  │ Config Invalid     │ │
│                 │  │                    │ │
│ Show:           │  │ Show Error:        │ │
│ ✅ Configured   │  │ ❌ Invalid ID/Token│ │
│                 │  │                    │ │
│ Options:        │  │ Options:           │ │
│ [1] Keep        │  │ [1] Reconfigure    │◄┼─┐
│ [2] Reconfigure │  │ [2] Keep anyway    │ │ │
│ [3] Test again  │  │ [3] Remove & exit  │ │ │
└─────────────────┘  └────────────────────┘ │ │
           │                 │                │ │
           └─────[1]─────────┘                │ │
                   │                          │ │
                   └────[2]───────────────────┼─┤
                                              │ │
                                              ▼ │
                        ┌─────────────────────────┐
                        │ STEP 1: CHOOSE SCOPE    │
                        │                         │
                        │ Where to save config?   │
                        │ [1] Project (.claude/)  │
                        │ [2] Global (~/.config)  │
                        └─────────────────────────┘
                                              │
                                              ▼
                        ┌─────────────────────────┐
                        │ STEP 2: COLLECT INFO    │
                        │                         │
                        │ Ask for:                │
                        │ - Apidog Project ID     │
                        │ - API Token             │
                        │ - (Optional) Team ID    │
                        │ - (Optional) Base URL   │
                        └─────────────────────────┘
                                              │
                                              ▼
                        ┌─────────────────────────┐
                        │ STEP 3: VALIDATE        │
                        │                         │
                        │ Test credentials:       │
                        │ npx @apidog/mcp-server  │
                        │   --project-id {ID}     │
                        │   --token {TOKEN}       │
                        │   --test-connection     │
                        └─────────────────────────┘
                                              │
                                    ├─────────┴─────────┐
                                    ▼                   ▼
                            ✅ Valid            ❌ Invalid
                                    │                   │
                                    │                   ▼
                                    │     ┌──────────────────────┐
                                    │     │ Show error message   │
                                    │     │ Options:             │
                                    │     │ [1] Retry with new   │
                                    │     │ [2] Cancel           │
                                    │     └──────────────────────┘
                                    │                   │
                                    │           [1]─────┘
                                    │            │
                                    ▼◄───────────┘
                        ┌─────────────────────────┐
                        │ STEP 4: WRITE CONFIG    │
                        │                         │
                        │ Update/Create:          │
                        │ .claude/settings.json   │
                        │                         │
                        │ {                       │
                        │   "env": {              │
                        │     "APIDOG_PROJECT_ID" │
                        │     "APIDOG_API_TOKEN"  │
                        │   }                     │
                        │ }                       │
                        └─────────────────────────┘
                                              │
                                              ▼
                        ┌─────────────────────────┐
                        │ STEP 5: VERIFY MCP      │
                        │                         │
                        │ Check MCP tools:        │
                        │ - apidog_get_project    │
                        │ - apidog_list_apis      │
                        │ - apidog_get_api_def    │
                        └─────────────────────────┘
                                              │
                                              ▼
                        ┌─────────────────────────┐
                        │ STEP 6: SUCCESS!        │
                        │                         │
                        │ ✅ Configuration saved  │
                        │ ✅ MCP server ready     │
                        │                         │
                        │ Show usage examples     │
                        └─────────────────────────┘
```

## Key Decision Points

### Decision 1: Config Already Exists?

**Location in flow:** After Step 0

**Options:**
1. **Both env vars exist** → Validate them
2. **Partial config** → Warn and offer to fix
3. **No config** → Proceed with setup

### Decision 2: Existing Config Valid?

**Location in flow:** After validation test

**If Valid (✅):**
```
User sees:
✅ Already configured!
[1] Keep (exits successfully)
[2] Reconfigure (goes to Step 2)
[3] Test again (re-runs validation)
```

**If Invalid (❌):**
```
User sees:
❌ Config found but broken
[1] Reconfigure (goes to Step 2)
[2] Keep anyway (exits, may not work)
[3] Remove (deletes config, exits)
```

### Decision 3: Where to Save?

**Location in flow:** Step 1

**Options:**
1. **Project-level** → `.claude/settings.json`
2. **Global** → `~/.config/claude/settings.json`

### Decision 4: Credentials Valid?

**Location in flow:** After Step 3 validation

**If Valid (✅):**
→ Proceed to Step 4 (write config)

**If Invalid (❌):**
```
User sees:
❌ Connection failed: Invalid project ID or token
[1] Retry (back to Step 2)
[2] Cancel (exit)
```

## Example Scenarios

### Scenario 1: Fresh Setup (No Existing Config)

```
User: /configure-mcp apidog

Step 0: Check env vars → None found
Step 1: Ask where to save → User chooses "Project"
Step 2: Collect info:
  - Project ID: 123456
  - API Token: abc...xyz
Step 3: Validate → ✅ Success
Step 4: Write to .claude/settings.json
Step 5: Verify MCP tools available
Step 6: ✅ Done!
```

### Scenario 2: Already Configured & Valid

```
User: /configure-mcp apidog

Step 0: Check env vars → Found!
  APIDOG_PROJECT_ID=123456
  APIDOG_API_TOKEN=abc...xyz
  Source: .claude/settings.json

Step 0.1: Validate → ✅ Success

✅ Apidog MCP Already Configured!

Configuration found:
- Project ID: 123***456
- API Token: abc*****xyz
- Source: .claude/settings.json

Connection test: ✅ Successful

Your Apidog MCP server is ready to use!

Options:
[1] Keep current configuration (recommended)
[2] Reconfigure with new credentials
[3] Test connection again

User chooses [1] → ✅ Exit successfully
```

### Scenario 3: Config Exists But Invalid

```
User: /configure-mcp apidog

Step 0: Check env vars → Found!
  APIDOG_PROJECT_ID=old_id
  APIDOG_API_TOKEN=expired_token
  Source: .claude/settings.json

Step 0.1: Validate → ❌ Failed

⚠️ Apidog MCP Configuration Found But Invalid

Existing configuration:
- Project ID: old***_id
- API Token: exp*******ken
- Source: .claude/settings.json

Connection test: ❌ Failed
Error: 401 Unauthorized - API token expired

Options:
[1] Reconfigure with new credentials (recommended)
[2] Keep existing configuration (may not work)
[3] Remove configuration and exit

User chooses [1] → Go to Step 2 (collect new credentials)
```

### Scenario 4: Partial Config (Only Project ID)

```
User: /configure-mcp apidog

Step 0: Check env vars → Partial found!
  APIDOG_PROJECT_ID=123456
  APIDOG_API_TOKEN=<not set>

⚠️ Incomplete Apidog Configuration

Found: APIDOG_PROJECT_ID=123***456
Missing: APIDOG_API_TOKEN

Options:
[1] Complete configuration (add missing token)
[2] Reconfigure from scratch
[3] Cancel

User chooses [1] → Go to Step 2 (ask only for token, keep project ID)
```

## Environment Variable Sources (Priority Order)

The command checks multiple sources in this order:

1. **Shell environment** (highest priority)
   ```bash
   export APIDOG_PROJECT_ID="123456"
   ```

2. **Project settings** `.claude/settings.json`
   ```json
   {
     "env": {
       "APIDOG_PROJECT_ID": "123456"
     }
   }
   ```

3. **Global settings** `~/.config/claude/settings.json`
   ```json
   {
     "env": {
       "APIDOG_PROJECT_ID": "123456"
     }
   }
   ```

## Smart Behaviors

### 1. Don't Ask What You Know

❌ **Bad:**
```
Command: What's your Apidog Project ID?
(Even though it's already in settings.json)
```

✅ **Good:**
```
Command: Found existing config! Testing connection...
```

### 2. Validate Before Using

❌ **Bad:**
```
Command: Config found! All set!
(Doesn't test if credentials actually work)
```

✅ **Good:**
```
Command: Config found! Testing connection...
✅ Connection successful - you're all set!
```

### 3. Offer Smart Defaults

❌ **Bad:**
```
Found config but it's broken. Starting from scratch.
```

✅ **Good:**
```
Found config but invalid.
Options:
[1] Reconfigure with new credentials
[2] Keep anyway (may not work)
[3] Remove and exit
```

### 4. Preserve User Choices

✅ **Good:**
```
User previously saved to project-level
→ Default to project-level again

User previously used global
→ Default to global again
```

## Error Handling

### Connection Test Failures

**401 Unauthorized:**
```
❌ Connection failed: API token is invalid or expired

Please:
1. Go to Apidog Settings → API Tokens
2. Generate a new token
3. Run /configure-mcp apidog again
```

**404 Not Found:**
```
❌ Connection failed: Project not found

Possible causes:
- Project ID is incorrect
- You don't have access to this project
- Project was deleted

Please verify your project ID in Apidog URL:
https://app.apidog.com/project/{YOUR_PROJECT_ID}
```

**Network Error:**
```
❌ Connection failed: Network error

Possible causes:
- No internet connection
- Firewall blocking api.apidog.com
- Apidog service temporarily down

Retry? [Y/n]
```

## Success Message

```
✅ Apidog MCP Configured Successfully!

Configuration saved to: .claude/settings.json

Environment variables set:
- APIDOG_PROJECT_ID: 123***456
- APIDOG_API_TOKEN: abc*****xyz

Available MCP tools:
- apidog_get_project - Get project information
- apidog_list_apis - List all APIs in project
- apidog_get_api_definition - Get endpoint definition
- apidog_import_endpoint - Import API endpoint
- apidog_search_endpoints - Search endpoints

Example usage:
"Get all endpoints from my Apidog project"
"Import the POST /api/users endpoint from Apidog"

Your Apidog MCP server is ready! 🚀
```

---

**Key Principle:** Always check if config exists and validate it works BEFORE asking the user for information!
