# Team Configuration Architecture

## Philosophy: Shareable Config + Private Secrets

### Core Principle

**Shareable (committed to git):**
- Project IDs
- Figma URLs
- API base URLs
- Team IDs
- Non-sensitive configuration

**Private (environment variables):**
- API tokens
- Passwords
- Personal access tokens
- Any credentials

## Architecture

### Project Configuration (.claude/settings.json) - COMMITTED ✅

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "@apidog/mcp-server",
        "--project-id",
        "2847593"                           // ← Shareable project ID
      ],
      "env": {
        "APIDOG_API_TOKEN": "${APIDOG_API_TOKEN}"  // ← References secret
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
      }
    }
  },
  "projectConfig": {
    "figmaFileUrl": "https://www.figma.com/file/abc123/project-name",
    "apidogProjectId": "2847593",
    "apidogTeamId": "team-456",
    "apidogBaseUrl": "https://api.apidog.com"
  }
}
```

**✅ Safe to commit:**
- No secrets
- Team shares same config
- Project-specific IDs
- One source of truth

### Developer Environment Variables - NOT COMMITTED ❌

Each developer manages their own credentials:

**Option 1: Shell RC file (~/.bashrc, ~/.zshrc)**
```bash
# MCP Server Credentials
export APIDOG_API_TOKEN="personal-token-abc123xyz"
export FIGMA_ACCESS_TOKEN="personal-figma-token"
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_personal123"
export POSTGRES_CONNECTION_STRING="postgresql://user:pass@localhost/db"
```

**Option 2: .env file (git-ignored)**
```bash
# .env (add to .gitignore!)
APIDOG_API_TOKEN=personal-token-abc123xyz
FIGMA_ACCESS_TOKEN=personal-figma-token
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_personal123
POSTGRES_CONNECTION_STRING=postgresql://user:pass@localhost/db
```

**Option 3: direnv (.envrc)**
```bash
# .envrc (add to .gitignore!)
export APIDOG_API_TOKEN="personal-token-abc123xyz"
export FIGMA_ACCESS_TOKEN="personal-figma-token"
```

## Benefits

### ✅ For Teams

**One Source of Truth:**
```bash
# Everyone uses same project
git clone project
cat .claude/settings.json  # ← Same for everyone
# apidogProjectId: "2847593"
```

**No Config Drift:**
```bash
# Update shared config
git pull
# Everyone gets new Figma URL or project ID
```

**Onboarding:**
```bash
# New developer:
1. git clone project
2. Set their personal env vars
3. Done! ✅
```

### ✅ For Security

**Secrets Never in Git:**
```bash
# .claude/settings.json is committed
# But contains NO secrets
# Only references: ${APIDOG_API_TOKEN}
```

**Personal Credentials:**
```bash
# Each dev has their own token
# Revoke one dev's access → doesn't affect others
# Each dev can use different Apidog account
```

**Audit Trail:**
```bash
# API calls show who made them
# Each dev's personal token is tracked
# No shared credentials
```

### ✅ For Flexibility

**Different Environments:**
```bash
# Developer's local
export POSTGRES_CONNECTION_STRING="postgresql://localhost/dev"

# CI/CD
export POSTGRES_CONNECTION_STRING="postgresql://ci-server/test"

# Production (different dev)
export POSTGRES_CONNECTION_STRING="postgresql://prod-server/main"
```

**Override Project Config:**
```bash
# Project says: apidogProjectId="2847593"
# But you're testing another project:
export APIDOG_PROJECT_ID="test-project-999"
# Your env var takes precedence
```

## Implementation

### .gitignore Configuration

```bash
# .gitignore (project root)

# Committed (shared):
.claude/settings.json          # ✅ Team config (NO secrets)

# NOT committed (private):
.claude/settings.local.json    # ❌ Developer overrides
.env                          # ❌ Environment variables
.envrc                        # ❌ direnv config
**/*.secret.json              # ❌ Any secret files
```

### Project Setup (.claude/settings.json)

This file is maintained by the team and committed to git:

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": [
        "-y",
        "@apidog/mcp-server",
        "--project-id",
        "2847593",              // ← Actual project ID (shareable)
        "--team-id",
        "team-456"              // ← Team ID (shareable)
      ],
      "env": {
        "APIDOG_API_TOKEN": "${APIDOG_API_TOKEN}",       // ← Secret (from env)
        "APIDOG_BASE_URL": "${APIDOG_BASE_URL:-https://api.apidog.com}"  // ← With default
      }
    }
  },

  "projectConfig": {
    "name": "caremaster-tenant-frontend",
    "figmaFileUrl": "https://www.figma.com/file/abc123/caremaster",
    "apidogProjectId": "2847593",
    "apidogProjectName": "Caremaster API",
    "databaseName": "caremaster_dev"
  },

  "documentation": {
    "apidogUrl": "https://app.apidog.com/project/2847593",
    "figmaUrl": "https://www.figma.com/file/abc123/caremaster",
    "apiDocsUrl": "https://docs.caremaster.com/api"
  }
}
```

### Developer Environment Setup

**Step 1: Clone project**
```bash
git clone project-repo
cd project-repo
```

**Step 2: Review required secrets**
```bash
# Project should have a README or .env.example
cat .env.example

# Example .env.example:
# APIDOG_API_TOKEN=your-token-here
# FIGMA_ACCESS_TOKEN=your-token-here
# GITHUB_PERSONAL_ACCESS_TOKEN=your-token-here
```

**Step 3: Set environment variables**

**Option A: Shell RC file**
```bash
echo 'export APIDOG_API_TOKEN="your-token"' >> ~/.zshrc
source ~/.zshrc
```

**Option B: .env file**
```bash
cp .env.example .env
# Edit .env with your personal tokens
# Load with: source .env
```

**Option C: direnv**
```bash
cp .envrc.example .envrc
# Edit .envrc with your tokens
direnv allow
```

**Step 4: Verify**
```bash
# Check env vars are set
echo $APIDOG_API_TOKEN
# Should show your token

# Test MCP connection
npx -y @apidog/mcp-server \
  --project-id 2847593 \
  --token $APIDOG_API_TOKEN \
  --test-connection
```

## Updated /configure-mcp Command

The command now focuses on helping developers set environment variables:

```bash
/configure-mcp apidog
```

**New behavior:**

1. **Check project config:**
   ```bash
   # Read .claude/settings.json
   Project ID: 2847593 (from project config)
   Team ID: team-456 (from project config)
   ```

2. **Check environment variables:**
   ```bash
   APIDOG_API_TOKEN: ❌ Not set
   ```

3. **Help developer set env var:**
   ```
   Your project uses Apidog (Project ID: 2847593)

   You need to set your personal API token.

   Get your token:
   1. Go to https://app.apidog.com/settings/tokens
   2. Generate a new token
   3. Copy the token

   Set environment variable:

   Option 1: Add to ~/.zshrc (permanent)
   echo 'export APIDOG_API_TOKEN="your-token"' >> ~/.zshrc
   source ~/.zshrc

   Option 2: Set for this session
   export APIDOG_API_TOKEN="your-token"

   Option 3: Use .env file (add to .gitignore!)
   echo 'APIDOG_API_TOKEN=your-token' >> .env
   source .env

   Would you like me to help you set it now?
   [1] Yes, I'll paste my token
   [2] No, I'll set it manually
   ```

4. **Verify configuration:**
   ```bash
   Testing connection with:
   - Project ID: 2847593 (from project)
   - Token: abc***xyz (from your environment)

   ✅ Connection successful!
   ✅ MCP server ready!
   ```

## Team Workflow

### 1. Initial Project Setup (One-time)

**Team lead creates `.claude/settings.json`:**

```json
{
  "mcpServers": {
    "apidog": {
      "command": "npx",
      "args": ["-y", "@apidog/mcp-server", "--project-id", "2847593"],
      "env": {
        "APIDOG_API_TOKEN": "${APIDOG_API_TOKEN}"
      }
    }
  },
  "projectConfig": {
    "apidogProjectId": "2847593"
  }
}
```

**Team lead commits:**
```bash
git add .claude/settings.json
git commit -m "Add MCP server configuration (no secrets)"
git push
```

**Team lead creates `.env.example`:**
```bash
# .env.example - Template for required secrets
APIDOG_API_TOKEN=your-apidog-token-here
FIGMA_ACCESS_TOKEN=your-figma-token-here
GITHUB_PERSONAL_ACCESS_TOKEN=your-github-token-here
```

```bash
git add .env.example
git commit -m "Add environment variables template"
git push
```

**Team lead updates `.gitignore`:**
```bash
# .gitignore
.env
.claude/settings.local.json
**/*.secret.json
```

### 2. Developer Onboarding

**New developer joins:**

```bash
# 1. Clone project
git clone project-repo
cd project-repo

# 2. Copy template
cp .env.example .env

# 3. Get personal tokens
# - Go to Apidog → Generate token
# - Go to Figma → Generate token
# - etc.

# 4. Edit .env with personal tokens
nano .env

# 5. Load environment
source .env

# 6. Verify with /configure-mcp
/configure-mcp apidog
# ✅ Checks project config (committed)
# ✅ Checks your env vars (private)
# ✅ Tests connection
# ✅ You're ready!
```

**Time to onboard:** 5 minutes ✅

### 3. Updating Project Config

**Team changes Apidog project:**

```json
// .claude/settings.json
{
  "mcpServers": {
    "apidog": {
      "args": [
        "-y",
        "@apidog/mcp-server",
        "--project-id",
        "9999999"  // ← New project ID
      ]
    }
  }
}
```

```bash
git add .claude/settings.json
git commit -m "Switch to new Apidog project"
git push
```

**All developers:**
```bash
git pull  # ✅ Get new project ID
# That's it! Their tokens still work
```

### 4. Developer Leaves Team

**Revoke their access:**
```bash
# In Apidog admin panel:
# Delete their personal API token

# That's it! ✅
# Their token stops working
# But team's config unchanged
# Other devs unaffected
```

## Security Best Practices

### ✅ DO

1. **Commit project IDs, URLs, configuration**
   ```json
   "projectId": "2847593"  // ✅ Safe
   ```

2. **Use environment variables for secrets**
   ```json
   "env": {
     "API_TOKEN": "${API_TOKEN}"  // ✅ References env
   }
   ```

3. **Provide .env.example template**
   ```bash
   # .env.example
   APIDOG_API_TOKEN=your-token-here
   ```

4. **Add secrets to .gitignore**
   ```bash
   .env
   .claude/settings.local.json
   **/*.secret.json
   ```

5. **Use personal tokens**
   ```bash
   # Each dev has their own
   # Not shared team token
   ```

### ❌ DON'T

1. **Don't commit secrets**
   ```json
   "apiToken": "abc123xyz"  // ❌ Never!
   ```

2. **Don't share tokens**
   ```bash
   # ❌ Team Slack: "Here's our API token: abc123"
   # ✅ Each dev generates their own
   ```

3. **Don't use .claude/settings.local.json for sharing**
   ```json
   // settings.local.json - for personal overrides only
   // Never commit this file
   ```

4. **Don't hardcode credentials**
   ```bash
   npx @apidog/mcp-server --token abc123  // ❌
   npx @apidog/mcp-server --token $TOKEN  // ✅
   ```

## Examples

### Example 1: Multi-Environment Setup

**Project config (.claude/settings.json) - committed:**
```json
{
  "mcpServers": {
    "database": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
      }
    }
  },
  "projectConfig": {
    "databaseName": "caremaster"
  }
}
```

**Developer's environment (not committed):**
```bash
# Local development
export POSTGRES_CONNECTION_STRING="postgresql://localhost/caremaster_dev"

# Staging (different developer)
export POSTGRES_CONNECTION_STRING="postgresql://staging-db/caremaster_staging"
```

### Example 2: Figma URL Sharing

**Project config (.claude/settings.json) - committed:**
```json
{
  "projectConfig": {
    "figmaFileUrl": "https://www.figma.com/file/abc123/caremaster-design"
  },
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

**Each developer (not committed):**
```bash
# Their personal Figma token
export FIGMA_ACCESS_TOKEN="their-personal-token"
```

**Everyone uses same Figma file, but with their own credentials!**

---

**Key Principle:** Configuration is shareable. Credentials are personal. Separate the two.
