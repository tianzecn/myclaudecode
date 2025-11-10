#!/usr/bin/env bun

import { checkClaudeInstalled, runClaudeWithProxy } from "./claude-runner.js";
import { parseArgs } from "./cli.js";
import { DEFAULT_PORT_RANGE } from "./config.js";
import { selectModelInteractively } from "./interactive-cli.js";
import { findAvailablePort } from "./port-manager.js";
import { createProxyServer } from "./proxy-server.js";

async function main() {
  try {
    // Parse CLI arguments
    const config = parseArgs(process.argv.slice(2));

    // Check if Claude Code is installed
    if (!(await checkClaudeInstalled())) {
      console.error("Error: Claude Code CLI is not installed");
      console.error("Install it from: https://claude.com/claude-code");
      process.exit(1);
    }

    // Warn if ANTHROPIC_API_KEY is not set
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("\n⚠️  ANTHROPIC_API_KEY not found in environment");
      console.log("To skip Claude Code's API key prompt, set a placeholder key:");
      console.log("");
      console.log("  export ANTHROPIC_API_KEY='sk-ant-api03-placeholder'");
      console.log("");
      console.log("(This key is not used - claudish uses OPENROUTER_API_KEY for auth)");
      console.log("Continuing anyway - select 'Yes' if prompted...\n");
    }

    // If model not specified, show interactive selector
    if (!config.model) {
      console.log(""); // Empty line for better UI
      config.model = await selectModelInteractively();
      console.log(""); // Empty line after selection
    }

    // Find available port
    const port =
      config.port || (await findAvailablePort(DEFAULT_PORT_RANGE.start, DEFAULT_PORT_RANGE.end));

    // Start proxy server
    const proxy = await createProxyServer(port, config.openrouterApiKey, config.model!);

    // Run Claude Code with proxy
    let exitCode = 0;
    try {
      exitCode = await runClaudeWithProxy(config, proxy.url);
    } finally {
      // Always cleanup proxy
      console.log("\n[claudish] Shutting down proxy server...");
      await proxy.shutdown();
    }

    console.log("[claudish] Done\n");
    process.exit(exitCode);
  } catch (error) {
    console.error("[claudish] Fatal error:", error);
    process.exit(1);
  }
}

// Run main
main();
