import blessed from 'neo-blessed';
import type { AppState } from '../app.js';
import {
  createHeader,
  createFooter,
  showMessage,
  showConfirm,
  showInput,
  showSelect,
} from '../app.js';
import {
  getMcpServersByCategory,
  getCategoryDisplayName,
  categoryOrder,
  getAllMcpServers,
} from '../../data/mcp-servers.js';
import { searchMcpServers } from '../../services/mcp-registry.js';
import {
  addMcpServer,
  removeMcpServer,
  getInstalledMcpServers,
  getEnabledMcpServers,
} from '../../services/claude-settings.js';
import type { McpServer, McpServerConfig, McpRegistryServer } from '../../types/index.js';

// Search results screen
export async function createMcpSearchScreen(state: AppState, query: string): Promise<void> {
  createHeader(state, 'MCP Servers');

  const installedServers = await getInstalledMcpServers(state.projectPath);
  const enabledServers = await getEnabledMcpServers(state.projectPath);
  const allServers = getAllMcpServers();

  // Search both local and remote sources
  const q = query.toLowerCase();

  // Search local curated servers
  const localFilteredServers = allServers.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    (s.category && s.category.toLowerCase().includes(q))
  );

  // Search remote MCP registry
  let remoteServers: McpRegistryServer[] = [];
  let remoteError = null;
  try {
    const response = await searchMcpServers({ query, limit: 50 });
    remoteServers = response.servers || [];
  } catch (err) {
    // Remote search failed, will show local results only
    remoteError = err;
    remoteServers = [];
  }

  // Combine and deduplicate results (prioritize local/curated)
  const allResults = new Map<string, { server: McpServer; source: 'local' | 'remote' }>();

  // Add local results first (they have more metadata)
  for (const server of localFilteredServers) {
    allResults.set(server.name, { server, source: 'local' });
  }

  // Add remote results, converting McpRegistryServer to McpServer format
  for (const remote of remoteServers) {
    if (!allResults.has(remote.name)) {
      // Convert remote server to our format
      const convertedServer: McpServer = {
        name: remote.name,
        description: remote.short_description || 'No description',
        type: 'http',
        url: remote.url,
        category: 'productivity', // Default category for remote servers
        requiresConfig: false,
      };
      allResults.set(remote.name, { server: convertedServer, source: 'remote' });
    }
  }

  const combinedResults = Array.from(allResults.values());

  const localCount = localFilteredServers.length;
  let searchInfo = `${combinedResults.length} found`;

  if (localCount > 0) {
    searchInfo += ` ({cyan-fg}${localCount} local{/cyan-fg})`;
  }

  if (remoteError) {
    searchInfo += ` | {red-fg}Remote search failed{/red-fg}`;
  }

  // Search header
  blessed.box({
    parent: state.screen,
    top: 3,
    left: 2,
    width: '50%-3',
    height: 3,
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'green' } },
    label: ' Search Results ',
    content: `{white-fg}${query}{/white-fg} {gray-fg}(${searchInfo}){/gray-fg}`,
  });

  // Build list items
  const listItems = combinedResults.map(({ server, source }) => {
    const isInstalled = installedServers[server.name] !== undefined;
    const isEnabled = enabledServers[server.name] === true;

    let status = '{gray-fg}○{/gray-fg}';
    if (isInstalled && isEnabled) {
      status = '{green-fg}●{/green-fg}';
    } else if (isInstalled) {
      status = '{yellow-fg}●{/yellow-fg}';
    }

    return {
      label: `${status} {bold}${server.name}{/bold}`,
      server,
      source,
    };
  });

  if (listItems.length === 0) {
    listItems.push({
      label: '{gray-fg}No servers match your search{/gray-fg}',
      server: undefined as unknown as McpServer,
      source: 'local' as const,
    });
  }

  const listLabels = listItems.map((item) => item.label);

  const list = blessed.list({
    parent: state.screen,
    top: 6,
    left: 2,
    width: '50%-3',
    height: '100%-9',
    items: listLabels,
    keys: true,
    mouse: true,
    tags: true,
    scrollable: true,
    border: { type: 'line' },
    style: {
      selected: { bg: 'green', fg: 'white' },
      border: { fg: 'gray' },
    },
  });

  // Detail panel
  const detailBox = blessed.box({
    parent: state.screen,
    top: 3,
    left: '50%',
    width: '50%-2',
    height: '100%-5',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'gray' } },
    label: ' Details ',
  });

  const updateDetail = (): void => {
    const selected = list.selected as number;
    const item = listItems[selected];

    if (!item?.server) {
      detailBox.setContent('{gray-fg}No server selected{/gray-fg}');
      state.screen.render();
      return;
    }

    const server = item.server;
    const isInstalled = installedServers[server.name] !== undefined;
    const sourceTag = item.source === 'remote' ? '\n{bold}Source:{/bold} {cyan-fg}MCP Registry{/cyan-fg}' : '';

    detailBox.setContent(`
{bold}{cyan-fg}${server.name}{/cyan-fg}{/bold}

${server.description}
${sourceTag}

${isInstalled
  ? '{red-fg}Press Enter to remove{/red-fg}'
  : '{green-fg}Press Enter to install{/green-fg}'}
    `.trim());
    state.screen.render();
  };

  list.on('select item', updateDetail);
  setTimeout(updateDetail, 0);

  // Handle selection
  list.on('select', async (_item: unknown, index: number) => {
    const item = listItems[index];
    if (!item?.server) return;

    const server = item.server;
    const isInstalled = installedServers[server.name] !== undefined;

    if (isInstalled) {
      const remove = await showConfirm(state, `Remove ${server.name}?`, 'Remove MCP server?');
      if (remove) {
        await removeMcpServer(server.name, state.projectPath);
        await showMessage(state, 'Removed', `${server.name} removed.`, 'success');
        createMcpSearchScreen(state, query);
      }
    } else {
      await installMcpServer(state, server);
      createMcpSearchScreen(state, query);
    }
  });

  // Back to main MCP screen
  list.key(['escape', 'q'], () => {
    createMcpScreen(state);
  });

  // New search
  list.key(['/'], async () => {
    const newQuery = await showInput(state, 'Search', 'Search MCP servers:', query);
    if (newQuery !== null && newQuery.trim()) {
      createMcpSearchScreen(state, newQuery);
    }
  });

  createFooter(state, '↑↓ Navigate │ Enter Install/Remove │ / New Search │ Esc Back');

  list.focus();
  state.screen.render();
}

// Main MCP screen (no search filtering)
export async function createMcpScreen(state: AppState): Promise<void> {
  createHeader(state, 'MCP Servers');

  const installedServers = await getInstalledMcpServers(state.projectPath);
  const enabledServers = await getEnabledMcpServers(state.projectPath);
  const serversByCategory = getMcpServersByCategory();

  // Search box - just shows hint
  blessed.box({
    parent: state.screen,
    top: 3,
    left: 2,
    width: '50%-3',
    height: 3,
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'cyan' } },
    label: ' Search ',
    content: '{gray-fg}Press / to search...{/gray-fg}',
  });

  // Build list items with categories
  type ListItem = { label: string; server?: McpServer; isCategory?: boolean };
  const listItems: ListItem[] = [];

  for (const category of categoryOrder) {
    const servers = serversByCategory[category];
    if (!servers || servers.length === 0) continue;

    listItems.push({
      label: `{bold}{cyan-fg}${getCategoryDisplayName(category)}{/cyan-fg}{/bold}`,
      isCategory: true,
    });

    for (const server of servers) {
      const isInstalled = installedServers[server.name] !== undefined;
      const isEnabled = enabledServers[server.name] === true;

      let status = '{gray-fg}○{/gray-fg}';
      if (isInstalled && isEnabled) {
        status = '{green-fg}●{/green-fg}';
      } else if (isInstalled) {
        status = '{yellow-fg}●{/yellow-fg}';
      }

      const configTag = server.requiresConfig ? ' {yellow-fg}*{/yellow-fg}' : '';

      listItems.push({
        label: `  ${status} {bold}${server.name}{/bold}${configTag}`,
        server,
      });
    }
  }

  const list = blessed.list({
    parent: state.screen,
    top: 6,
    left: 2,
    width: '50%-3',
    height: '100%-9',
    items: listItems.map((item) => item.label),
    keys: true,
    mouse: true,
    tags: true,
    scrollable: true,
    border: { type: 'line' },
    style: {
      selected: { bg: 'blue', fg: 'white' },
      border: { fg: 'gray' },
    },
    scrollbar: { ch: '|', style: { bg: 'gray' } },
  });

  // Detail panel on the right
  const detailBox = blessed.box({
    parent: state.screen,
    top: 3,
    left: '50%',
    width: '50%-2',
    height: '100%-5',
    content: '',
    tags: true,
    border: {
      type: 'line',
    },
    style: {
      border: {
        fg: 'gray',
      },
    },
    label: ' Details ',
  });

  // Update detail panel on selection change
  const updateDetail = (): void => {
    const selected = list.selected as number;
    const item = listItems[selected];

    if (!item || item.isCategory || !item.server) {
      detailBox.setContent('{gray-fg}Select a server to see details{/gray-fg}');
      state.screen.render();
      return;
    }

    const server = item.server;
    const isInstalled = installedServers[server.name] !== undefined;
    const isEnabled = enabledServers[server.name] === true;

    let statusText = '{gray-fg}Not installed{/gray-fg}';
    if (isInstalled && isEnabled) {
      statusText = '{green-fg}● Installed & Enabled{/green-fg}';
    } else if (isInstalled) {
      statusText = '{yellow-fg}● Installed (disabled){/yellow-fg}';
    }

    let typeInfo = '';
    if (server.type === 'http') {
      typeInfo = `{bold}URL:{/bold} {cyan-fg}${server.url}{/cyan-fg}`;
    } else {
      typeInfo = `{bold}Command:{/bold} {cyan-fg}${server.command} ${(server.args || []).join(' ')}{/cyan-fg}`;
    }

    let configInfo = '';
    if (isInstalled) {
      // Show current configuration for installed servers
      const currentConfig = installedServers[server.name];
      if (currentConfig?.env && Object.keys(currentConfig.env).length > 0) {
        configInfo = `\n\n{bold}Current Configuration:{/bold}\n`;
        for (const [varName, varValue] of Object.entries(currentConfig.env)) {
          const isReference = varValue.startsWith('${') && varValue.endsWith('}');
          if (isReference) {
            // Extract var name from ${VAR} and check if set in environment
            const refVarName = varValue.slice(2, -1);
            const envValue = process.env[refVarName];
            const envStatus = envValue ? '{green-fg}[SET]{/green-fg}' : '{yellow-fg}[NOT SET]{/yellow-fg}';
            configInfo += `  {cyan-fg}${varName}{/cyan-fg}: {gray-fg}${varValue}{/gray-fg} ${envStatus}\n`;
          } else {
            // Hardcoded value - show masked
            const masked = varValue.length > 8 ? varValue.slice(0, 8) + '...' : varValue;
            configInfo += `  {cyan-fg}${varName}{/cyan-fg}: {gray-fg}${masked}{/gray-fg} {blue-fg}[HARDCODED]{/blue-fg}\n`;
          }
        }
        configInfo += `\n{gray-fg}Press 'e' to edit configuration{/gray-fg}`;
      }
    } else if (server.requiresConfig && server.configFields) {
      // Show required env vars for servers not yet installed
      configInfo = `\n\n{bold}Required Environment Variables:{/bold}\n`;
      for (const field of server.configFields) {
        const envVarName = field.envVar || field.name;
        const envValue = process.env[envVarName];
        const isSet = envValue !== undefined && envValue !== '';
        const req = field.required ? '{red-fg}*{/red-fg}' : '';
        const status = isSet
          ? '{green-fg}[SET]{/green-fg}'
          : '{yellow-fg}[NOT SET]{/yellow-fg}';
        configInfo += `  ${req} ${envVarName} ${status}\n`;
        configInfo += `    {gray-fg}${field.label}{/gray-fg}\n`;
      }
    }

    const actionHint = isInstalled
      ? '{gray-fg}Enter: Remove │ e: Edit Config{/gray-fg}'
      : '{green-fg}Press Enter to install{/green-fg}';

    const content = `
{bold}{cyan-fg}${server.name}{/cyan-fg}{/bold}

${server.description}

{bold}Status:{/bold} ${statusText}

${typeInfo}${configInfo}

${actionHint}
    `.trim();

    detailBox.setContent(content);
    state.screen.render();
  };

  list.on('select item', updateDetail);

  // Initial update
  setTimeout(updateDetail, 0);

  // Handle selection
  list.on('select', async (_item: unknown, index: number) => {
    const selected = listItems[index];
    if (!selected || selected.isCategory || !selected.server) {
      return;
    }

    const server = selected.server;
    const isInstalled = installedServers[server.name] !== undefined;

    if (isInstalled) {
      const remove = await showConfirm(
        state,
        `Remove ${server.name}?`,
        'This will remove the MCP server configuration.'
      );

      if (remove) {
        await removeMcpServer(server.name, state.projectPath);
        await showMessage(state, 'Removed', `${server.name} has been removed.`, 'success');
        createMcpScreen(state);
      }
    } else {
      await installMcpServer(state, server);
    }
  });

  // Manual j/k navigation (since vi mode is disabled)
  list.key(['j'], () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (list as any).down();
    state.screen.render();
  });
  list.key(['k'], () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (list as any).up();
    state.screen.render();
  });

  // Edit configuration with 'e' key
  list.key(['e'], async () => {
    const selected = list.selected as number;
    const item = listItems[selected];
    if (!item || item.isCategory || !item.server) return;

    const server = item.server;
    const isInstalled = installedServers[server.name] !== undefined;

    if (isInstalled) {
      await editMcpServerConfig(state, server, installedServers[server.name]);
    } else {
      await showMessage(state, 'Not Installed', 'Install the server first to configure it.', 'info');
    }
  });

  // Search with / key - opens search screen
  list.key(['/'], async () => {
    const query = await showInput(state, 'Search', 'Search MCP servers:');
    if (query !== null && query.trim()) {
      createMcpSearchScreen(state, query);
    }
  });

  // Switch to registry search with r
  list.key(['r'], async () => {
    const { navigateTo } = await import('../app.js');
    navigateTo(state, 'mcp-registry');
  });

  createFooter(
    state,
    '↑↓ Navigate │ Enter Install/Remove │ e Edit │ / Search │ r Registry │ q Back'
  );

  list.focus();
  state.screen.render();
}

async function installMcpServer(state: AppState, server: McpServer): Promise<void> {
  let config: McpServerConfig;

  if (server.type === 'http') {
    // HTTP-based MCP server
    config = {
      type: 'http',
      url: server.url!,
    };
  } else {
    // Command-based MCP server
    config = {
      command: server.command!,
      args: server.args ? [...server.args] : undefined,
      env: server.env ? { ...server.env } : undefined,
    };
  }

  // Collect configuration if required
  if (server.requiresConfig && server.configFields) {
    // Check which env vars are already set
    const envStatus: { field: typeof server.configFields[0]; existingValue: string | undefined }[] = [];
    for (const field of server.configFields) {
      const envVarName = field.envVar || field.name;
      const existingValue = process.env[envVarName];
      envStatus.push({ field, existingValue });
    }

    // Check if all required env vars are set
    const missingRequired = envStatus.filter(
      (e) => e.field.required && (!e.existingValue || e.existingValue === '')
    );
    const hasExistingVars = envStatus.some(
      (e) => e.existingValue !== undefined && e.existingValue !== ''
    );

    // If some env vars exist, ask user if they want to use them
    if (hasExistingVars && missingRequired.length === 0) {
      const useExisting = await showConfirm(
        state,
        'Use Environment Variables?',
        'All required environment variables are already set.\nUse values from your environment?'
      );

      if (useExisting) {
        // Use existing env vars - reference them with ${VAR} syntax
        config.env = config.env || {};
        for (const { field } of envStatus) {
          const envVarName = field.envVar || field.name;
          config.env[envVarName] = `\${${envVarName}}`;
        }
      } else {
        // User wants to enter new values
        for (const { field, existingValue } of envStatus) {
          const envVarName = field.envVar || field.name;
          const hint = existingValue ? ` (current: ${existingValue.slice(0, 8)}...)` : '';
          const value = await showInput(
            state,
            `Configure ${server.name}`,
            `${field.label}${field.required ? ' (required)' : ''}${hint}:`,
            field.default
          );

          if (value === null) {
            return; // User cancelled
          }

          if (field.required && !value) {
            await showMessage(state, 'Required Field', `${field.label} is required.`, 'error');
            return;
          }

          if (value) {
            config.env = config.env || {};
            config.env[envVarName] = value;
          }
        }
      }
    } else {
      // Some required vars are missing - prompt for each
      if (missingRequired.length > 0) {
        const missingNames = missingRequired.map((e) => e.field.envVar || e.field.name).join(', ');
        await showMessage(
          state,
          'Missing Environment Variables',
          `The following required variables are not set:\n${missingNames}\n\nYou can set them in your shell or enter values now.`,
          'info'
        );
      }

      for (const { field, existingValue } of envStatus) {
        const envVarName = field.envVar || field.name;
        const isSet = existingValue !== undefined && existingValue !== '';

        let defaultValue = field.default;
        let prompt = `${field.label}${field.required ? ' (required)' : ''}:`;

        if (isSet) {
          // Env var is set, offer to use it
          const useIt = await showConfirm(
            state,
            `Use ${envVarName}?`,
            `${envVarName} is set in your environment.\nUse the existing value?`
          );

          if (useIt) {
            config.env = config.env || {};
            config.env[envVarName] = `\${${envVarName}}`;
            continue;
          }
          prompt = `${field.label} (override existing):`;
        }

        const value = await showInput(
          state,
          `Configure ${server.name}`,
          prompt,
          defaultValue
        );

        if (value === null) {
          return; // User cancelled
        }

        if (field.required && !value) {
          await showMessage(state, 'Required Field', `${field.label} is required.`, 'error');
          return;
        }

        if (value) {
          // Replace placeholder in args
          if (config.args) {
            config.args = config.args.map((arg) =>
              arg.replace(`\${${field.name}}`, value)
            );
          }
          config.env = config.env || {};
          config.env[envVarName] = value;
        }
      }
    }
  }

  // Add server to .mcp.json
  await addMcpServer(server.name, config, state.projectPath);

  await showMessage(
    state,
    'Installed',
    `${server.name} has been configured.\n\nRestart Claude Code to activate.`,
    'success'
  );

  createMcpScreen(state);
}

async function editMcpServerConfig(
  state: AppState,
  server: McpServer,
  currentConfig: McpServerConfig
): Promise<void> {
  // Get current env vars from config
  const currentEnv = currentConfig.env || {};
  const envVarNames = Object.keys(currentEnv);

  // Get configFields from curated server definition if available
  const allServers = getAllMcpServers();
  const curatedServer = allServers.find((s) => s.name === server.name);
  const configFields = curatedServer?.configFields || [];

  // Build list of all env vars (from current config + configFields)
  const allEnvVars = new Set<string>(envVarNames);
  for (const field of configFields) {
    const envVarName = field.envVar || field.name;
    allEnvVars.add(envVarName);
  }

  if (allEnvVars.size === 0) {
    // No env vars to edit, offer to add new ones
    const addNew = await showConfirm(
      state,
      'No Environment Variables',
      'This server has no environment variables configured.\nWould you like to add one?'
    );

    if (addNew) {
      await addNewEnvVar(state, server.name, currentConfig);
    }
    return;
  }

  // Let user choose what to do
  const action = await showSelect(state, `Configure ${server.name}`, 'What would you like to do?', [
    { label: 'Edit existing variables', value: 'edit' },
    { label: 'Add new variable', value: 'add' },
    { label: 'Cancel', value: 'cancel' },
  ]);

  if (action === null || action === 'cancel') {
    return;
  }

  if (action === 'add') {
    await addNewEnvVar(state, server.name, currentConfig);
    return;
  }

  // Edit existing variables
  const updatedEnv: Record<string, string> = { ...currentEnv };
  let modified = false;

  for (const envVarName of allEnvVars) {
    const currentValue = currentEnv[envVarName];
    const field = configFields.find((f) => (f.envVar || f.name) === envVarName);
    const fieldLabel = field?.label || envVarName;

    // Determine current value type
    const isReference = currentValue?.startsWith('${') && currentValue?.endsWith('}');
    const envValueFromShell = process.env[envVarName];
    const hasShellValue = envValueFromShell !== undefined && envValueFromShell !== '';

    // Build description of current state
    let currentDesc = 'Not configured';
    if (currentValue) {
      if (isReference) {
        const refStatus = hasShellValue ? 'set in environment' : 'NOT set in environment';
        currentDesc = `${currentValue} (${refStatus})`;
      } else {
        const masked = currentValue.length > 8 ? currentValue.slice(0, 8) + '...' : currentValue;
        currentDesc = `Hardcoded: ${masked}`;
      }
    }

    // Build options
    const options = [
      { label: `Keep current: ${currentDesc}`, value: 'keep' },
    ];

    if (hasShellValue) {
      options.push({
        label: `Use environment variable \${${envVarName}}`,
        value: 'env',
      });
    }

    options.push({ label: 'Enter new value', value: 'new' });

    if (currentValue) {
      options.push({ label: 'Remove this variable', value: 'remove' });
    }

    const choice = await showSelect(
      state,
      `Edit ${envVarName}`,
      `${fieldLabel}\n\nCurrent: ${currentDesc}`,
      options
    );

    if (choice === null) {
      // User cancelled - ask if they want to save partial changes
      if (modified) {
        const savePartial = await showConfirm(
          state,
          'Save Changes?',
          'You have unsaved changes. Save them?'
        );
        if (savePartial) {
          break;
        }
      }
      return;
    }

    if (choice === 'keep') {
      // Keep current value
      continue;
    } else if (choice === 'env') {
      // Use environment variable reference
      updatedEnv[envVarName] = `\${${envVarName}}`;
      modified = true;
    } else if (choice === 'new') {
      // Enter new value
      const newValue = await showInput(
        state,
        `Set ${envVarName}`,
        `${fieldLabel}:`,
        ''
      );

      if (newValue === null) {
        continue; // Skip this var
      }

      if (newValue) {
        updatedEnv[envVarName] = newValue;
        modified = true;
      }
    } else if (choice === 'remove') {
      delete updatedEnv[envVarName];
      modified = true;
    }
  }

  if (modified) {
    // Save updated config
    const newConfig: McpServerConfig = {
      ...currentConfig,
      env: Object.keys(updatedEnv).length > 0 ? updatedEnv : undefined,
    };

    await addMcpServer(server.name, newConfig, state.projectPath);

    await showMessage(
      state,
      'Configuration Updated',
      `${server.name} configuration has been updated.\n\nRestart Claude Code to apply changes.`,
      'success'
    );
  }

  createMcpScreen(state);
}

async function addNewEnvVar(
  state: AppState,
  serverName: string,
  currentConfig: McpServerConfig
): Promise<void> {
  // Get variable name
  const varName = await showInput(state, 'Add Environment Variable', 'Variable name (e.g., API_KEY):');

  if (varName === null || !varName.trim()) {
    return;
  }

  const cleanVarName = varName.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');

  // Check if var exists in environment
  const envValue = process.env[cleanVarName];
  const hasEnvValue = envValue !== undefined && envValue !== '';

  let value: string | null = null;

  if (hasEnvValue) {
    const useEnv = await showConfirm(
      state,
      `${cleanVarName} Found`,
      `${cleanVarName} is set in your environment.\nUse the environment variable reference?`
    );

    if (useEnv) {
      value = `\${${cleanVarName}}`;
    }
  }

  if (value === null) {
    value = await showInput(state, `Set ${cleanVarName}`, 'Enter value:');

    if (value === null || !value) {
      return;
    }
  }

  // Update config
  const updatedEnv = { ...currentConfig.env, [cleanVarName]: value };
  const newConfig: McpServerConfig = {
    ...currentConfig,
    env: updatedEnv,
  };

  await addMcpServer(serverName, newConfig, state.projectPath);

  await showMessage(
    state,
    'Variable Added',
    `${cleanVarName} has been added to ${serverName}.\n\nRestart Claude Code to apply changes.`,
    'success'
  );

  createMcpScreen(state);
}
