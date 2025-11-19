#!/usr/bin/env bun

/**
 * Sync Shared Resources to Plugins
 *
 * This script copies shared resources (like recommended-models.md and skills)
 * from the central `shared/` directory to all plugin directories.
 *
 * Usage:
 *   bun run sync-shared
 *
 * What it does:
 * 1. Recursively reads all files from shared/ directory
 * 2. Copies each file to all plugin directories (preserving structure)
 * 3. Creates subdirectories if they don't exist
 * 4. Reports what was synced and any errors
 */

import { readdir, copyFile, mkdir, stat } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { existsSync } from 'node:fs';

// Configuration
const SHARED_DIR = resolve(__dirname, '../shared');
const PLUGINS_DIR = resolve(__dirname, '../plugins');
const PLUGIN_NAMES = ['frontend', 'bun', 'code-analysis'];

interface SyncResult {
  file: string;
  destinations: string[];
  errors: Array<{ plugin: string; error: string }>;
}

async function ensureDirectoryExists(dir: string): Promise<void> {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

/**
 * Recursively find all files in a directory
 * Returns paths relative to the base directory
 */
async function findAllFiles(dir: string, baseDir: string = dir): Promise<string[]> {
  const files: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    // Skip hidden files and directories
    if (entry.name.startsWith('.')) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively search subdirectories
      const subFiles = await findAllFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else if (entry.isFile()) {
      // Add relative path from base directory
      const relativePath = relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

async function syncFileToPlugins(relativePath: string): Promise<SyncResult> {
  const result: SyncResult = {
    file: relativePath,
    destinations: [],
    errors: [],
  };

  const sourcePath = join(SHARED_DIR, relativePath);

  for (const pluginName of PLUGIN_NAMES) {
    const pluginDir = join(PLUGINS_DIR, pluginName);
    const destPath = join(pluginDir, relativePath);

    try {
      // Ensure parent directory exists (handles subdirectories)
      const destDir = join(destPath, '..');
      await ensureDirectoryExists(destDir);

      // Copy file
      await copyFile(sourcePath, destPath);

      result.destinations.push(destPath);
      console.log(`  ✓ ${pluginName}/${relativePath}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.errors.push({ plugin: pluginName, error: errorMessage });
      console.error(`  ✗ ${pluginName}/${relativePath} - ${errorMessage}`);
    }
  }

  return result;
}

async function syncAllSharedFiles(): Promise<void> {
  console.log('🔄 Syncing shared resources to plugins...\n');

  // Check if shared directory exists
  if (!existsSync(SHARED_DIR)) {
    console.error(`❌ Shared directory not found: ${SHARED_DIR}`);
    process.exit(1);
  }

  // Recursively find all files in shared directory
  const sharedFiles = await findAllFiles(SHARED_DIR);

  if (sharedFiles.length === 0) {
    console.log('⚠️  No files found in shared/ directory');
    return;
  }

  console.log(`📦 Found ${sharedFiles.length} file(s) to sync:\n`);

  // Sync each file
  const results: SyncResult[] = [];
  for (const fileName of sharedFiles) {
    console.log(`Syncing ${fileName}:`);
    const result = await syncFileToPlugins(fileName);
    results.push(result);
    console.log();
  }

  // Summary
  console.log('━'.repeat(60));
  console.log('Summary:\n');

  const totalSuccesses = results.reduce((sum, r) => sum + r.destinations.length, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

  console.log(`✓ Successfully synced: ${totalSuccesses} file(s)`);
  if (totalErrors > 0) {
    console.log(`✗ Failed: ${totalErrors} file(s)`);
  }

  // List all synced files
  console.log('\nSynced files:');
  for (const result of results) {
    console.log(`  ${result.file} → ${result.destinations.length} plugin(s)`);
  }

  if (totalErrors > 0) {
    console.log('\n⚠️  Some files failed to sync. Check errors above.');
    process.exit(1);
  } else {
    console.log('\n✅ All shared resources synced successfully!');
  }
}

// Run the sync
syncAllSharedFiles().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
