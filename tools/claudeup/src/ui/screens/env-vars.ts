import blessed from 'neo-blessed';
import type { AppState } from '../app.js';
import {
  createHeader,
  createFooter,
  showMessage,
  showConfirm,
  showInput,
} from '../app.js';
import {
  getMcpEnvVars,
  setMcpEnvVar,
  removeMcpEnvVar,
} from '../../services/claude-settings.js';

export async function createEnvVarsScreen(state: AppState): Promise<void> {
  createHeader(state, 'Environment Variables');

  const envVars = await getMcpEnvVars(state.projectPath);
  const envVarNames = Object.keys(envVars);

  // Info box
  blessed.box({
    parent: state.screen,
    top: 3,
    left: 2,
    width: '100%-4',
    height: 3,
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'gray' } },
    content: '{gray-fg}Environment variables stored in .claude/settings.local.json{/gray-fg}',
  });

  // Build list items
  type ListItem = { label: string; varName?: string };
  const listItems: ListItem[] = [];

  if (envVarNames.length === 0) {
    listItems.push({
      label: '{gray-fg}No environment variables configured{/gray-fg}',
    });
  } else {
    for (const varName of envVarNames) {
      const value = envVars[varName];
      const masked = value.length > 30 ? value.slice(0, 30) + '...' : value;
      listItems.push({
        label: `{cyan-fg}${varName}{/cyan-fg} = {gray-fg}"${masked}"{/gray-fg}`,
        varName,
      });
    }
  }

  const list = blessed.list({
    parent: state.screen,
    top: 6,
    left: 2,
    width: '100%-4',
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

  // Add new variable with 'a' key
  list.key(['a'], async () => {
    const varName = await showInput(state, 'Add Variable', 'Variable name:');
    if (varName === null || !varName.trim()) return;

    const cleanName = varName.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');

    // Check if already exists
    if (envVars[cleanName]) {
      const overwrite = await showConfirm(
        state,
        `${cleanName} exists`,
        'Overwrite existing value?'
      );
      if (!overwrite) return;
    }

    const value = await showInput(state, `Set ${cleanName}`, 'Value:');
    if (value === null) return;

    await setMcpEnvVar(cleanName, value, state.projectPath);
    await showMessage(state, 'Added', `${cleanName} added.\nRestart Claude Code to apply.`, 'success');
    createEnvVarsScreen(state);
  });

  // Edit selected variable with Enter or 'e'
  const editSelected = async (): Promise<void> => {
    const selected = list.selected as number;
    const item = listItems[selected];
    if (!item?.varName) return;

    const varName = item.varName;
    const currentValue = envVars[varName];

    const newValue = await showInput(state, `Edit ${varName}`, 'New value:', currentValue);
    if (newValue === null) return;

    await setMcpEnvVar(varName, newValue, state.projectPath);
    await showMessage(state, 'Updated', `${varName} updated.\nRestart Claude Code to apply.`, 'success');
    createEnvVarsScreen(state);
  };

  list.on('select', editSelected);
  list.key(['e'], editSelected);

  // Delete with 'd' key
  list.key(['d'], async () => {
    const selected = list.selected as number;
    const item = listItems[selected];
    if (!item?.varName) return;

    const varName = item.varName;
    const confirmDelete = await showConfirm(
      state,
      `Delete ${varName}?`,
      'This will remove the variable from configuration.'
    );

    if (confirmDelete) {
      await removeMcpEnvVar(varName, state.projectPath);
      await showMessage(state, 'Deleted', `${varName} removed.`, 'success');
      createEnvVarsScreen(state);
    }
  });

  // Navigation
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

  createFooter(
    state,
    '↑↓ Navigate │ Enter/e Edit │ a Add │ d Delete │ q Back'
  );

  list.focus();
  state.screen.render();
}
