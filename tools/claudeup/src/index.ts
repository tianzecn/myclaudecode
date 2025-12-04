#!/usr/bin/env node

import { createApp, navigateTo, VERSION } from './ui/app.js';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Handle --version flag
  if (args.includes('--version') || args.includes('-v')) {
    console.log(VERSION);
    process.exit(0);
  }

  // Handle --help flag
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`claudeup v${VERSION}

TUI tool for managing Claude Code plugins, MCPs, and configuration.

Usage: claudeup [options]

Options:
  -v, --version  Show version number
  -h, --help     Show this help message

Navigation:
  [1] Plugins    Manage plugin marketplaces and installed plugins
  [2] MCP        Setup and manage MCP servers
  [3] Status     Configure status line display
  [4] Tools      Install and update AI coding CLI tools

Keys:
  g              Toggle global/project scope (in Plugins)
  r              Refresh current screen
  ?              Show help
  q / Escape     Back / Quit
`);
    process.exit(0);
  }

  const app = createApp();

  // Start with plugins screen (default)
  navigateTo(app, 'plugins');
}

main().catch((error) => {
  console.error('Error starting claudeup:', error);
  process.exit(1);
});
