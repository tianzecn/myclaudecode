import blessed from 'neo-blessed';
import type { AppState } from '../app.js';
import { navigateTo, createHeader, createFooter } from '../app.js';
import { hasClaudeDir } from '../../services/claude-settings.js';

interface MenuItem {
  label: string;
  screen: 'mcp' | 'plugins' | 'statusline' | 'cli-tools';
  description: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  {
    label: 'Plugins & Marketplaces',
    screen: 'plugins',
    description: 'Manage plugin marketplaces and installed plugins',
    icon: '📦',
  },
  {
    label: 'MCP Servers',
    screen: 'mcp',
    description: 'Setup and manage Model Context Protocol servers',
    icon: '🔌',
  },
  {
    label: 'Status Line',
    screen: 'statusline',
    description: 'Configure status line display format',
    icon: '📊',
  },
  {
    label: 'CLI Tools',
    screen: 'cli-tools',
    description: 'Install and update AI coding CLI tools',
    icon: '🛠️',
  },
];

export async function createMainMenu(state: AppState): Promise<void> {
  createHeader(state, 'Claude Code Configuration');

  // Project status
  const hasProject = await hasClaudeDir(state.projectPath);
  const statusText = hasProject
    ? '{green-fg}✓ Project configured{/green-fg}'
    : '{yellow-fg}○ New project{/yellow-fg}';

  blessed.box({
    parent: state.screen,
    top: 3,
    left: 2,
    width: '100%-4',
    height: 3,
    content: `Working directory: {bold}${state.projectPath}{/bold}\nStatus: ${statusText}`,
    tags: true,
  });

  // Menu list
  const list = blessed.list({
    parent: state.screen,
    top: 7,
    left: 2,
    width: '100%-4',
    height: menuItems.length + 2,
    items: menuItems.map((item) => `  ${item.icon}  ${item.label}`),
    keys: true,
    vi: true,
    mouse: true,
    border: {
      type: 'line',
    },
    style: {
      selected: {
        bg: 'blue',
        fg: 'white',
        bold: true,
      },
      border: {
        fg: 'cyan',
      },
    },
  });

  // Description box
  const descBox = blessed.box({
    parent: state.screen,
    top: 8 + menuItems.length + 2,
    left: 2,
    width: '100%-4',
    height: 3,
    content: '',
    tags: true,
    style: {
      fg: 'gray',
    },
  });

  // Update description on selection change
  const updateDescription = (): void => {
    const selected = list.selected as number;
    if (menuItems[selected]) {
      descBox.setContent(`  ${menuItems[selected].description}`);
      state.screen.render();
    }
  };

  list.on('select item', updateDescription);
  updateDescription();

  // Handle selection
  list.on('select', (_item: unknown, index: number) => {
    const menuItem = menuItems[index];
    if (menuItem) {
      navigateTo(state, menuItem.screen);
    }
  });

  // Number key shortcuts
  state.screen.key(['1'], () => navigateTo(state, 'plugins'));
  state.screen.key(['2'], () => navigateTo(state, 'mcp'));
  state.screen.key(['3'], () => navigateTo(state, 'statusline'));
  state.screen.key(['4'], () => navigateTo(state, 'cli-tools'));

  createFooter(state, '↑↓ Navigate | Enter Select | 1-4 Quick Jump | q Quit | ? Help');

  list.focus();
  state.screen.render();
}
