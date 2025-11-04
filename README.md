# MAG Claude Plugins

> **Curated collection of Claude Code plugins for modern frontend development**

A comprehensive plugin marketplace created and maintained by [MadAppGang](https://madappgang.com) to supercharge your development workflow with Claude Code.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Maintained by MadAppGang](https://img.shields.io/badge/Maintained%20by-MadAppGang-blue)](https://madappgang.com)

---

## 📦 Quick Start

Add this marketplace to your Claude Code instance and start using our curated plugins:

```bash
# Add the marketplace (use your GitHub URL once pushed)
/plugin marketplace add madappgang/claude-plugins

# Install a plugin
/plugin install frontend-development@mag-claude-plugins
```

---

## 🎯 What's Inside

This repository contains production-ready plugins designed for modern web development teams. Each plugin includes specialized agents, custom slash commands, and workflow skills to streamline your development process.

### Available Plugins

#### 🎨 [Frontend Development](/.claude-plugin/plugins/frontend-development)

**Version:** 1.0.0
**Category:** Development

Comprehensive toolkit for TypeScript/React development with Vite, TanStack Router, and TanStack Query.

**Includes:**
- **8 Specialized Agents**
  - `typescript-frontend-dev` - Expert TypeScript/React implementation agent
  - `frontend-architect-planner` - Architecture planning and system design
  - `ui-manual-tester` - Browser-based UI testing with Chrome DevTools
  - `vitest-test-architect` - Comprehensive testing strategy and implementation
  - `api-documentation-analyzer` - API documentation analysis and integration
  - `project-cleaner` - Clean up temporary artifacts and development files
  - `senior-code-reviewer` - Comprehensive code review with best practices
  - `senior-code-reviewer-codex` - Automated AI code review using Codex

- **5 Slash Commands**
  - `/implement` - Full-cycle feature implementation orchestrator with multi-agent workflow
  - `/import-figma` - Import Figma components into your React project
  - `/configure-mcp` - Configure MCP servers (Apidog, Figma, etc.) for your project
  - `/api-docs` - Analyze and work with API documentation
  - `/cleanup-artifacts` - Clean up temporary development artifacts

- **2 Skills**
  - `browser-debugger` - Systematic UI testing and debugging using Chrome DevTools
  - `api-spec-analyzer` - Analyze OpenAPI/Swagger specifications and generate clients

- **MCP Servers**
  - Apidog integration (with dynamic project configuration)
  - Figma integration
  - GitHub integration
  - Database tools (PostgreSQL)

**Best for:** React/TypeScript projects, TanStack ecosystem, frontend teams

---

## 🚀 Installation

### Prerequisites

- Claude Code installed and configured
- Git access (for adding marketplace)

### Option A: Global Installation (All Projects)

Install plugins globally to use across all your projects:

**Step 1: Add Marketplace Globally**
```bash
# GitHub (recommended)
/plugin marketplace add madappgang/claude-plugins

# Local path (for development/testing)
/plugin marketplace add /path/to/claude-code

# GitLab or other Git hosting
/plugin marketplace add https://gitlab.com/your-org/claude-plugins.git
```

**Step 2: Install Plugin Globally**
```bash
# Install a specific plugin
/plugin install frontend-development@mag-claude-plugins

# Check installed plugins
/plugin list
```

**Result:** Plugin available in all your projects ✅

---

### Option B: Project-Specific Installation (Recommended for Teams)

Install plugins only for a specific project/folder. Perfect for teams!

**Step 1: Add to Project Settings**

Create or edit `.claude/settings.json` in your project root:

```json
{
  "extraKnownMarketplaces": {
    "mag-claude-plugins": {
      "source": {
        "source": "github",
        "repo": "madappgang/claude-plugins"
      }
    }
  },
  "enabledPlugins": [
    "frontend-development@mag-claude-plugins"
  ]
}
```

**Step 2: Trust the Folder**

When Claude Code prompts to trust the folder, accept:
```
🔒 Trust this folder?
   Folder: /path/to/your/project
   Plugins: frontend-development@mag-claude-plugins

   [Trust] [Don't Trust]
```

**Step 3: Verify**
```bash
# Check plugins enabled for this project
/plugin list

# Should show: frontend-development@mag-claude-plugins (project)
```

**Result:** Plugin only available in this project ✅

**Benefits:**
- ✅ Team members auto-install when they trust the folder
- ✅ Consistent setup across team
- ✅ No manual installation steps
- ✅ Project-specific plugins don't affect other projects

---

### Option C: Local Marketplace (Development)

For testing plugins locally before publishing:

**Step 1: Add Local Marketplace**
```bash
/plugin marketplace add /Users/jack/mag/claude-code
```

**Step 2: Install from Local**
```bash
/plugin install frontend-development@mag-claude-plugins
```

**Result:** Test changes immediately without git push ✅

---

## 📚 Usage Guide

### Using Agents

Once a plugin is installed, its agents are available via the Task tool or proactively invoked by Claude:

**Example: Planning a new feature**
```
User: "I need to build a user management dashboard with CRUD operations"

Claude automatically invokes the frontend-architect-planner agent to:
1. Perform gap analysis
2. Ask clarifying questions
3. Design architecture
4. Create implementation plan in AI-DOCS/
5. Get user approval before proceeding
```

**Example: Implementing a feature**
```
User: "Implement the user management feature following the plan"

Claude uses the typescript-frontend-dev agent to:
1. Create todo list for tracking
2. Implement features following project patterns
3. Run quality checks (Biome, TypeScript, tests)
4. Present completed implementation
```

### Using Slash Commands

Slash commands provide powerful workflows:

**`/implement` - Full-cycle implementation**
```bash
/implement Create a user profile card component with avatar, name, and bio fields
```

This orchestrates a complete workflow:
1. Architecture planning (frontend-architect-planner)
2. User approval gate
3. Implementation (typescript-frontend-dev)
4. Triple review (code review + automated analysis + UI testing)
5. Test creation (vitest-test-architect)
6. User final approval
7. Project cleanup

**`/import-figma` - Import Figma components**
```bash
/import-figma UserCard
```

Automatically imports a Figma component with:
- Code adaptation for your project structure
- Dependency installation
- Test route creation
- Browser validation
- CLAUDE.md documentation

**`/configure-mcp` - Configure MCP servers**
```bash
/configure-mcp apidog
```

Smart interactive setup for MCP servers:
- **Checks existing config first** - won't ask if already configured
- **Validates credentials** - tests connection before and after saving
- Collects credentials (project ID, API tokens)
- Writes to `.claude/settings.json`
- Tests MCP server availability
- Offers reconfiguration if config invalid
- Supports: Apidog, Figma, GitHub, Database tools

**Smart behavior:**
```bash
# If already configured:
✅ Already configured! Connection test: Successful
   [1] Keep [2] Reconfigure [3] Test again

# If config broken:
⚠️ Config found but invalid (expired token)
   [1] Reconfigure [2] Keep anyway [3] Remove

# If no config:
📝 Let's set up Apidog MCP...
```

### Using Skills

Skills provide specialized capabilities that Claude invokes automatically:

**`browser-debugger` skill**

Automatically invoked when you:
- Implement UI features
- Report console errors
- Need to test forms or interactions

Claude will launch the ui-manual-tester agent to:
- Navigate to your app
- Test interactions
- Monitor console and network
- Report issues with reproduction steps

**`api-spec-analyzer` skill**

Automatically invoked when you:
- Work with OpenAPI/Swagger specifications
- Need to generate API clients
- Analyze API endpoints
- Validate API schemas

Claude will:
- Parse OpenAPI/Swagger specs
- Generate TypeScript clients
- Create type definitions
- Validate endpoint schemas

---

## 🛠️ Development Guide

### Creating a New Plugin

1. **Create plugin directory structure:**

```bash
mkdir -p .claude-plugin/plugins/your-plugin-name/{agents,commands,skills,mcp-servers}
```

2. **Add your artifacts:**

```
your-plugin-name/
├── plugin.json              # Plugin manifest
├── agents/                  # Specialized agents
│   └── your-agent.md
├── commands/                # Slash commands
│   └── your-command.md
├── skills/                  # Workflow skills
│   └── your-skill/
│       └── SKILL.md
└── mcp-servers/            # MCP server configurations
    └── mcp-config.json
```

3. **Create plugin.json manifest:**

```json
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "Brief description of your plugin",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "company": "Your Company"
  },
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "category": "development",
  "agents": ["./agents/your-agent.md"],
  "commands": ["./commands/your-command.md"],
  "skills": ["./skills/your-skill"],
  "mcpServers": "./mcp-servers/mcp-config.json"
}
```

4. **Add to marketplace.json:**

```json
{
  "plugins": [
    {
      "name": "your-plugin-name",
      "source": "./plugins/your-plugin-name",
      "description": "Brief description",
      "version": "1.0.0",
      "author": {
        "name": "Your Name",
        "email": "you@example.com"
      },
      "category": "development",
      "keywords": ["keyword1", "keyword2"],
      "strict": true
    }
  ]
}
```

5. **Test locally:**

```bash
/plugin marketplace add /path/to/claude-code
/plugin install your-plugin-name@mag-claude-plugins
```

### Plugin Development Best Practices

#### Agents

- **Clear descriptions**: Use the `description` frontmatter field to explain when the agent should be used
- **Include examples**: Provide concrete usage examples in descriptions
- **Define tools**: Specify required tools in frontmatter `tools` field
- **Use TodoWrite**: All agents should use TodoWrite for task tracking
- **Set appropriate model**: Use `haiku` for quick tasks, `sonnet` for complex work

#### Commands

- **Single responsibility**: Each command should do one thing well
- **Allowed tools**: Specify exactly which tools the command can use
- **Clear arguments**: Document expected input format
- **Error handling**: Include comprehensive error handling
- **User feedback**: Provide clear progress updates

#### Skills

- **Proactive invocation**: Define when Claude should automatically use the skill
- **Comprehensive instructions**: Include detailed step-by-step workflows
- **Agent delegation**: Skills should primarily invoke agents via Task tool
- **Clear output format**: Specify expected report structures

#### MCP Servers

- **Environment variables**: Use `${CLAUDE_PLUGIN_ROOT}` for plugin-relative paths
- **Clear purpose**: Each MCP server should provide specific, well-defined functionality
- **Configuration**: Document required environment variables and setup steps
- **Dependencies**: List any system dependencies or prerequisites
- **Error handling**: Provide clear error messages for configuration issues

**Example MCP Server Configuration:**

```json
{
  "database-tools": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost/db"
    }
  },
  "custom-server": {
    "command": "${CLAUDE_PLUGIN_ROOT}/bin/custom-mcp-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config/server.json"],
    "env": {
      "CUSTOM_API_KEY": "${CUSTOM_API_KEY}"
    }
  }
}
```

**MCP Server Best Practices:**

1. **Use plugin-relative paths**: Always use `${CLAUDE_PLUGIN_ROOT}` for files within the plugin
2. **Document environment variables**: Clearly list all required env vars in plugin README
3. **Provide setup instructions**: Include step-by-step setup in plugin documentation
4. **Handle missing dependencies**: Check for required tools (npx, node, etc.) and provide helpful error messages
5. **Test thoroughly**: Verify MCP servers work across different environments
6. **Include examples**: Provide example configurations and usage scenarios

**Common MCP Server Use Cases:**

- **Database Access**: PostgreSQL, MySQL, MongoDB, Redis connections
- **API Integration**: Custom API clients, third-party service integrations
- **File System Operations**: Advanced file operations, project scaffolding
- **Development Tools**: Linters, formatters, code generators
- **Cloud Services**: AWS, Azure, GCP integrations
- **Custom Tooling**: Project-specific automation and utilities

### Quality Standards

All contributions must meet these standards:

- ✅ **Documented**: Clear README and inline documentation
- ✅ **Tested**: Verified in real-world projects
- ✅ **Focused**: Single, well-defined purpose
- ✅ **Reusable**: Works across different projects
- ✅ **Maintained**: Kept up-to-date with Claude Code changes

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to contribute:

### Contribution Process

1. **Fork this repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-plugin-name
   ```

3. **Develop your plugin**
   - Follow the development guide above
   - Test thoroughly in real projects
   - Document everything

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add your-plugin-name plugin"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-plugin-name
   ```

6. **Create Pull Request**
   - Describe what your plugin does
   - Include usage examples
   - Note any dependencies or requirements

### Contribution Guidelines

- **Be specific**: Plugins should solve specific, well-defined problems
- **Be compatible**: Work with standard Claude Code installations
- **Be documented**: Include comprehensive README and examples
- **Be tested**: Verify functionality before submitting
- **Be collaborative**: Respond to feedback and iterate

### Plugin Ideas We're Looking For

- **Code Quality Tools**: Linting, formatting, security scanning
- **API Development**: REST API, GraphQL, OpenAPI tooling
- **Database Tools**: Migration helpers, query builders, ORM utilities
- **DevOps Automation**: CI/CD, deployment, infrastructure
- **Documentation Generators**: API docs, component docs, guides
- **Performance Tools**: Profiling, optimization, monitoring
- **Security Tools**: Vulnerability scanning, auth helpers

---

## 📖 Plugin Marketplace Reference

### Marketplace Structure

```
.claude-plugin/
├── marketplace.json                    # Marketplace configuration
└── plugins/
    ├── frontend-development/          # Plugin directory
    │   ├── plugin.json               # Plugin manifest
    │   ├── agents/                   # Specialized agents
    │   ├── commands/                 # Slash commands
    │   ├── skills/                   # Workflow skills
    │   └── mcp-servers/              # MCP server configurations
    │       └── mcp-config.json
    └── your-plugin/
        └── ...
```

### Marketplace Schema

**marketplace.json**

```json
{
  "name": "marketplace-name",
  "owner": {
    "name": "Owner Name",
    "email": "owner@example.com",
    "company": "Company Name"
  },
  "metadata": {
    "description": "Marketplace description",
    "version": "1.0.0",
    "pluginRoot": "./plugins"
  },
  "plugins": [
    {
      "name": "plugin-name",
      "source": "./plugins/plugin-name",
      "description": "Plugin description",
      "version": "1.0.0",
      "author": {
        "name": "Author Name",
        "email": "author@example.com"
      },
      "category": "development",
      "keywords": ["keyword1", "keyword2"],
      "strict": true
    }
  ]
}
```

### Plugin Schema

**plugin.json**

```json
{
  "name": "plugin-name",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": {
    "name": "Author Name",
    "email": "author@example.com",
    "company": "Company Name"
  },
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "category": "development",
  "agents": ["./agents/agent-name.md"],
  "commands": ["./commands/command-name.md"],
  "skills": ["./skills/skill-name"],
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "API_KEY": "${API_KEY}"
      }
    }
  }
}
```

**Alternative: External MCP Config File**

You can also reference an external MCP configuration file:

```json
{
  "name": "plugin-name",
  "mcpServers": "./mcp-servers/mcp-config.json"
}
```

**mcp-servers/mcp-config.json:**

```json
{
  "database-server": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "${POSTGRES_CONNECTION_STRING}"
    }
  },
  "custom-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/bin/custom-mcp",
    "args": ["--plugin-root", "${CLAUDE_PLUGIN_ROOT}"]
  }
}
```

---

## 🔧 Advanced Usage

### Team Distribution

**Option 1: GitHub/GitLab Distribution**

1. Push this repository to GitHub/GitLab
2. Team members add the marketplace:
   ```bash
   /plugin marketplace add your-org/claude-plugins
   ```

**Option 2: Project-Level Auto-Install**

In your project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "mag-claude-plugins": {
      "source": {
        "source": "github",
        "repo": "madappgang/claude-plugins"
      }
    }
  },
  "enabledPlugins": ["frontend-development@mag-claude-plugins"]
}
```

When team members trust the folder, plugins auto-install.

### Version Management

**Specify versions in marketplace.json:**

```json
{
  "plugins": [
    {
      "name": "frontend-development",
      "version": "1.0.0",
      "source": "./plugins/frontend-development"
    }
  ]
}
```

**Install specific versions:**

```bash
/plugin install frontend-development@mag-claude-plugins@1.0.0
```

### Plugin Updates

**Update marketplace metadata:**

```bash
/plugin marketplace update mag-claude-plugins
```

**Reinstall plugin to get latest:**

```bash
/plugin remove frontend-development@mag-claude-plugins
/plugin install frontend-development@mag-claude-plugins
```

---

## 📋 Roadmap

### Current Focus

- ✅ Frontend Development plugin (complete)
- 🚧 Code Quality plugin (in progress)
- 🚧 API Development plugin (planned)

### Future Plugins

- **Testing Tools**: E2E testing, visual regression, performance testing
- **UI Components**: Design system tools, component generators
- **Backend Development**: Node.js, API design, database tools
- **DevOps**: Docker, Kubernetes, CI/CD automation
- **Documentation**: Auto-generate docs, API reference, guides

### Community Requests

Have a plugin idea? [Open an issue](https://github.com/madappgang/claude-plugins/issues) with the `plugin-request` label.

---

## 🐛 Troubleshooting

### Marketplace Not Loading

**Issue**: Can't add marketplace or see plugins

**Solutions**:
- Verify the marketplace URL/path is correct
- Check that `.claude-plugin/marketplace.json` exists
- Validate JSON syntax: `claude plugin validate`
- For private repos, confirm you have access permissions

### Plugin Installation Fails

**Issue**: Plugin installation fails or plugin not working

**Solutions**:
- Verify plugin source URLs are accessible
- Check that plugin directories contain required files (`plugin.json`)
- For GitHub sources, ensure repositories are public or you have access
- Test plugin sources manually by cloning/downloading

### Agents Not Available

**Issue**: Installed plugin agents don't appear in Claude Code

**Solutions**:
- Confirm plugin installation: `/plugin list`
- Check agent markdown files have proper frontmatter
- Verify agent paths in `plugin.json` are correct
- Restart Claude Code session

### Getting Help

1. Check the [documentation](https://docs.claude.com/en/docs/claude-code/plugins)
2. Review [plugin examples](./.claude-plugin/plugins)
3. Check [ai-docs](./ai-docs/) for detailed guides
4. [Open an issue](https://github.com/madappgang/claude-plugins/issues)
5. Contact: [i@madappgang.com](mailto:i@madappgang.com)

---

## 📖 Detailed Documentation

For comprehensive guides and technical details, see the **[ai-docs](./ai-docs/)** directory:

### Architecture & Configuration
- **[TEAM_CONFIG_ARCHITECTURE.md](./ai-docs/TEAM_CONFIG_ARCHITECTURE.md)** - Team-first configuration, shareable config vs private secrets
- **[DYNAMIC_MCP_GUIDE.md](./ai-docs/DYNAMIC_MCP_GUIDE.md)** - Dynamic MCP server configuration patterns
- **[IMPROVEMENTS_SUMMARY.md](./ai-docs/IMPROVEMENTS_SUMMARY.md)** - Configuration command design decisions

### Reference
- **[COMPLETE_PLUGIN_SUMMARY.md](./ai-docs/COMPLETE_PLUGIN_SUMMARY.md)** - Complete plugin inventory (8 agents, 5 commands, 2 skills)
- **[FINAL_SUMMARY.md](./ai-docs/FINAL_SUMMARY.md)** - Project overview and statistics

### Plugin-Specific Docs
- **[DEPENDENCIES.md](./.claude-plugin/plugins/frontend-development/DEPENDENCIES.md)** - All dependencies and environment variables
- **[CONFIGURE_MCP_FLOW.md](./.claude-plugin/plugins/frontend-development/commands/CONFIGURE_MCP_FLOW.md)** - Configuration flow diagram

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Individual plugins may have their own licenses specified in their `plugin.json` files.

---

## 👥 Maintainers

**Jack Rudenko**
Email: [i@madappgang.com](mailto:i@madappgang.com)
Company: [MadAppGang](https://madappgang.com)

---

## 🙏 Acknowledgments

- Built for [Claude Code](https://docs.claude.com/en/docs/claude-code) by Anthropic
- Inspired by the amazing Claude Code community
- Special thanks to all contributors

---

## 📞 Contact & Support

- **Email**: [i@madappgang.com](mailto:i@madappgang.com)
- **Issues**: [GitHub Issues](https://github.com/madappgang/claude-plugins/issues)
- **Discussions**: [GitHub Discussions](https://github.com/madappgang/claude-plugins/discussions)
- **Website**: [madappgang.com](https://madappgang.com)

---

**Made with ❤️ by MadAppGang**
