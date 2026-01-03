import blessed from 'neo-blessed';
import type { AppState } from '../app.js';
import { createHeader, createFooter, showMessage, showConfirm, showProgress, hideProgress, showInput, showLoading, navigateTo } from '../app.js';
import { getAllMarketplaces } from '../../data/marketplaces.js';
import {
  addMarketplace,
  removeMarketplace,
  getConfiguredMarketplaces,
  enablePlugin,
  addGlobalMarketplace,
  removeGlobalMarketplace,
  getGlobalConfiguredMarketplaces,
  enableGlobalPlugin,
  saveGlobalInstalledPluginVersion,
  removeGlobalInstalledPluginVersion,
} from '../../services/claude-settings.js';
import {
  saveInstalledPluginVersion,
  removeInstalledPluginVersion,
  getAvailablePlugins,
  getGlobalAvailablePlugins,
  getLocalMarketplacesInfo,
  refreshAllMarketplaces,
  clearMarketplaceCache,
  type PluginInfo,
} from '../../services/plugin-manager.js';
import { cloneMarketplace, deleteMarketplace, addToKnownMarketplaces, removeFromKnownMarketplaces } from '../../services/local-marketplace.js';
import {
  loadPluginComponents as loadComponents,
  loadComponentFullContent,
  COMPONENT_ICONS,
  COMPONENT_TYPE_LABELS,
} from '../../services/component-parser.js';
import { openInEditor } from '../../services/editor.js';
import {
  loadPersistedState,
  debouncedSaveState,
  collapseStateToPersistedState,
  persistedStateToCollapseState,
} from '../../services/state-persistence.js';

import type {
  Marketplace,
  ComponentType,
  ListItemType as _ListItemType, // Type reserved for future use
  PluginComponent,
  ListItem,
  CollapseState,
} from '../../types/index.js';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';

// ============================================
// State Management
// ============================================

/** 当前作用域 */
let currentScope: 'project' | 'global' = 'project';

/** 折叠状态 */
let collapseState: CollapseState = {
  marketplaces: new Set<string>(),
  plugins: new Set<string>(),
  types: new Set<string>(),
};

/** 当前选中项索引 */
let currentSelection = 0;

/** 搜索关键词 */
let searchQuery = '';

/** 是否显示组件完整内容 */
let showFullContent = false;

/** 状态是否已加载 */
let stateLoaded = false;

/** 组件缓存 */
const componentCache = new Map<string, Map<ComponentType | 'invalid', PluginComponent[]>>();

/** 已初始化折叠状态的 typeKey（防止重复设置默认值） */
const initializedTypeKeys = new Set<string>();

// ============================================
// Helper Functions
// ============================================

/**
 * 加载并初始化持久化状态
 */
async function initializeState(): Promise<void> {
  if (stateLoaded) return;

  const persisted = await loadPersistedState();
  collapseState = persistedStateToCollapseState(persisted);
  currentScope = persisted.lastScope;
  stateLoaded = true;
}

/**
 * 保存当前状态（防抖）
 */
function saveState(): void {
  debouncedSaveState(collapseStateToPersistedState(collapseState, currentScope));
}

/**
 * 加载插件组件（使用 component-parser 服务）
 */
async function loadPluginComponentsForPlugin(plugin: PluginInfo): Promise<Map<ComponentType | 'invalid', PluginComponent[]>> {
  // 检查缓存
  if (componentCache.has(plugin.id)) {
    return componentCache.get(plugin.id)!;
  }

  const result = new Map<ComponentType | 'invalid', PluginComponent[]>();
  result.set('agent', []);
  result.set('command', []);
  result.set('skill', []);
  result.set('invalid', []);

  try {
    // 构建插件路径
    const marketplacesPath = path.join(os.homedir(), '.claude', 'plugins', 'marketplaces');
    const pluginDir = path.join(marketplacesPath, plugin.marketplace, 'plugins', plugin.name);
    const pluginJsonPath = path.join(pluginDir, 'plugin.json');

    if (!await fs.pathExists(pluginJsonPath)) {
      componentCache.set(plugin.id, result);
      return result;
    }

    const pluginJson = await fs.readJson(pluginJsonPath);

    // 使用 component-parser 服务加载组件
    const components = await loadComponents(pluginDir, pluginJson);

    // 复制到结果
    for (const [type, comps] of components) {
      result.set(type, comps);
    }
  } catch (error) {
    // 静默失败
  }

  componentCache.set(plugin.id, result);
  return result;
}

/**
 * 搜索过滤：检查项目是否匹配搜索关键词
 */
function matchesSearch(item: ListItem, query: string): boolean {
  if (!query) return true;

  const lowerQuery = query.toLowerCase();
  const label = item.label.replace(/\{[^}]+\}/g, '').toLowerCase(); // 移除 blessed 标签

  // 检查标签
  if (label.includes(lowerQuery)) return true;

  // 检查关联数据
  if (item.data) {
    if (item.data.marketplace && item.data.marketplace.toLowerCase().includes(lowerQuery)) return true;
    if (item.data.pluginId && item.data.pluginId.toLowerCase().includes(lowerQuery)) return true;
    if (item.data.component) {
      if (item.data.component.name.toLowerCase().includes(lowerQuery)) return true;
      if (item.data.component.description.toLowerCase().includes(lowerQuery)) return true;
    }
  }

  return false;
}

/**
 * 过滤列表项（搜索模式）
 */
function filterItems(items: ListItem[], query: string): ListItem[] {
  if (!query) return items;

  const matchedIndices = new Set<number>();

  // 第一遍：标记匹配的项
  for (let i = 0; i < items.length; i++) {
    if (matchesSearch(items[i], query)) {
      matchedIndices.add(i);

      // 回溯标记父节点
      let parentDepth = items[i].depth - 1;
      for (let j = i - 1; j >= 0 && parentDepth >= 0; j--) {
        if (items[j].depth === parentDepth) {
          matchedIndices.add(j);
          parentDepth--;
        }
      }
    }
  }

  // 返回匹配的项
  return items.filter((_, i) => matchedIndices.has(i));
}

/**
 * 清理屏幕级快捷键绑定
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function cleanupPluginScreenKeys(screen: any): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scr = screen as any;
  if (scr.unkey && typeof scr.unkey === 'function') {
    try {
      // 基础操作键
      scr.unkey(['g', 'u', 'd', 'r', 'n']);
      // 导航键
      scr.unkey(['j', 'k']);
      // 类型跳转键
      scr.unkey(['a', 'c', 's']);
      // 搜索键
      scr.unkey(['/']);
      // 详情切换键
      scr.unkey(['tab']);
    } catch {
      // 静默忽略
    }
  }
}

/**
 * 构建层级图标
 */
function getCollapseIcon(collapsed: boolean): string {
  return collapsed ? '{gray-fg}▶{/gray-fg}' : '{gray-fg}▼{/gray-fg}';
}

// Note: getIndent function will be added in Phase 3 for search highlighting

export async function createPluginsScreen(state: AppState): Promise<void> {
  // 初始化持久化状态
  await initializeState();

  // 清理现有快捷键绑定
  cleanupPluginScreenKeys(state.screen);

  createHeader(state, 'Plugins');

  const isGlobal = currentScope === 'global';

  // Scope tabs - visible tab bar for switching between Project and Global
  const projectTab = isGlobal
    ? '{gray-fg}[ Project ]{/gray-fg}'
    : '{cyan-fg}{bold}[ Project ]{/bold}{/cyan-fg}';
  const globalTab = isGlobal
    ? '{magenta-fg}{bold}[ Global ]{/bold}{/magenta-fg}'
    : '{gray-fg}[ Global ]{/gray-fg}';

  blessed.box({
    parent: state.screen,
    top: 1,
    left: 2,
    width: '100%-4',
    height: 1,
    content: `${projectTab}  ${globalTab}  {gray-fg}(press g to switch){/gray-fg}`,
    tags: true,
    style: { fg: 'white' },
  });

  // Fetch configured marketplaces based on scope (for enabled status)
  const configuredMarketplaces = isGlobal
    ? await getGlobalConfiguredMarketplaces()
    : await getConfiguredMarketplaces(state.projectPath);

  // Get local marketplace cache (single source of truth)
  const localMarketplaces = await getLocalMarketplacesInfo();

  // Get all marketplaces from local cache + hardcoded defaults (deduped by repo)
  const allMarketplaces = getAllMarketplaces(localMarketplaces);

  // Fetch all available plugins based on scope
  let allPlugins: PluginInfo[] = [];
  try {
    allPlugins = isGlobal
      ? await getGlobalAvailablePlugins()
      : await getAvailablePlugins(state.projectPath);
  } catch {
    // Continue with empty plugins
  }

  // Group plugins by marketplace
  const pluginsByMarketplace = new Map<string, PluginInfo[]>();
  for (const plugin of allPlugins) {
    const existing = pluginsByMarketplace.get(plugin.marketplace) || [];
    existing.push(plugin);
    pluginsByMarketplace.set(plugin.marketplace, existing);
  }

  // Preload components for enabled plugins
  const pluginComponents = new Map<string, Map<ComponentType | 'invalid', PluginComponent[]>>();
  for (const plugin of allPlugins) {
    if (plugin.enabled || plugin.installedVersion) {
      const components = await loadPluginComponentsForPlugin(plugin);
      pluginComponents.set(plugin.id, components);
    }
  }

  // Build unified list with 4-level hierarchy
  const allListItems: ListItem[] = [];
  const INDENT = '  ';

  for (const marketplace of allMarketplaces) {
    // Marketplace is enabled if it's in local cache (actually cloned) or explicitly configured
    const isInLocalCache = localMarketplaces.has(marketplace.name);
    const isConfigured = configuredMarketplaces[marketplace.name] !== undefined;
    const isEnabled = isInLocalCache || isConfigured;
    const plugins = pluginsByMarketplace.get(marketplace.name) || [];
    const isMarketplaceCollapsed = collapseState.marketplaces.has(marketplace.name);

    // Marketplace header (depth=0)
    const expandIcon = isEnabled && plugins.length > 0
      ? getCollapseIcon(isMarketplaceCollapsed)
      : ' ';
    const enabledBadge = isEnabled ? '{green-fg}✓{/green-fg}' : '{gray-fg}○{/gray-fg}';
    const officialBadge = marketplace.official ? ' {cyan-fg}[Official]{/cyan-fg}' : '';
    const pluginCount = plugins.length > 0 ? ` {gray-fg}(${plugins.length}){/gray-fg}` : '';

    allListItems.push({
      label: `${expandIcon} ${enabledBadge} {bold}${marketplace.displayName}{/bold}${officialBadge}${pluginCount}`,
      type: 'marketplace',
      depth: 0,
      id: `mp:${marketplace.name}`,
      collapsible: isEnabled && plugins.length > 0,
      collapsed: isMarketplaceCollapsed,
      data: { marketplace: marketplace.name },
    });

    // Plugins under this marketplace (if enabled and not collapsed)
    if (isEnabled && plugins.length > 0 && !isMarketplaceCollapsed) {
      for (const plugin of plugins) {
        const isPluginCollapsed = collapseState.plugins.has(plugin.id);
        const components = pluginComponents.get(plugin.id);
        const hasComponents = components && (
          (components.get('agent')?.length || 0) +
          (components.get('command')?.length || 0) +
          (components.get('skill')?.length || 0) +
          (components.get('invalid')?.length || 0)
        ) > 0;

        // Status icon
        let status = '{gray-fg}○{/gray-fg}';
        if (plugin.enabled) {
          status = '{green-fg}●{/green-fg}';
        } else if (plugin.installedVersion) {
          status = '{yellow-fg}●{/yellow-fg}';
        }

        // Plugin expand/collapse icon (only if has components)
        const pluginExpandIcon = hasComponents
          ? getCollapseIcon(isPluginCollapsed)
          : ' ';

        // Version display
        let versionDisplay = `{gray-fg}v${plugin.version}{/gray-fg}`;
        if (plugin.hasUpdate) {
          versionDisplay = `{yellow-fg}v${plugin.installedVersion} → v${plugin.version}{/yellow-fg}`;
        } else if (plugin.installedVersion) {
          versionDisplay = `{green-fg}v${plugin.installedVersion}{/green-fg}`;
        }

        const updateBadge = plugin.hasUpdate ? ' {yellow-fg}⬆{/yellow-fg}' : '';

        allListItems.push({
          label: `${INDENT}${pluginExpandIcon} ${status} ${plugin.name} ${versionDisplay}${updateBadge}`,
          type: 'plugin',
          depth: 1,
          id: `pl:${plugin.id}`,
          collapsible: hasComponents || false,
          collapsed: isPluginCollapsed,
          data: { marketplace: marketplace.name, pluginId: plugin.id },
        });

        // Type headers and components (if plugin expanded and has components)
        if (!isPluginCollapsed && hasComponents && components) {
          const typeOrder: (ComponentType | 'invalid')[] = ['agent', 'command', 'skill', 'invalid'];

          for (const componentType of typeOrder) {
            const typeComponents = components.get(componentType) || [];
            if (typeComponents.length === 0) continue;

            const typeKey = `${plugin.id}:${componentType}`;
            // Default to collapsed for type headers (only on first encounter!)
            if (!initializedTypeKeys.has(typeKey)) {
              initializedTypeKeys.add(typeKey);
              collapseState.types.add(typeKey);  // Default collapsed
            }
            const isTypeCollapsed = collapseState.types.has(typeKey);

            // Type header (depth=2)
            const typeExpandIcon = getCollapseIcon(isTypeCollapsed);
            const typeIcon = COMPONENT_ICONS[componentType];
            const typeLabel = COMPONENT_TYPE_LABELS[componentType];
            const componentCount = typeComponents.length;

            allListItems.push({
              label: `${INDENT}${INDENT}${typeExpandIcon} ${typeIcon} ${typeLabel} {gray-fg}(${componentCount}){/gray-fg}`,
              type: 'type-header',
              depth: 2,
              id: `th:${typeKey}`,
              collapsible: true,
              collapsed: isTypeCollapsed,
              data: { marketplace: marketplace.name, pluginId: plugin.id, componentType },
            });

            // Components (if type expanded)
            if (!isTypeCollapsed) {
              for (const component of typeComponents) {
                const componentIcon = component.isValid ? '{gray-fg}•{/gray-fg}' : '{red-fg}✗{/red-fg}';
                const descPreview = component.description
                  ? ` {gray-fg}- ${component.description.substring(0, 30)}${component.description.length > 30 ? '...' : ''}{/gray-fg}`
                  : '';

                allListItems.push({
                  label: `${INDENT}${INDENT}${INDENT}${componentIcon} ${component.name}${descPreview}`,
                  type: 'component',
                  depth: 3,
                  id: `cp:${plugin.id}:${componentType}:${component.name}`,
                  collapsible: false,
                  collapsed: false,
                  data: { marketplace: marketplace.name, pluginId: plugin.id, componentType, component },
                });
              }
            }
          }
        }
      }
    } else if (isEnabled && !isMarketplaceCollapsed) {
      allListItems.push({
        label: `${INDENT}{gray-fg}No plugins available{/gray-fg}`,
        type: 'empty',
        depth: 1,
        id: `empty:${marketplace.name}`,
        collapsible: false,
        collapsed: false,
        data: { marketplace: marketplace.name },
      });
    }
  }

  // Apply search filter
  const listItems = filterItems(allListItems, searchQuery);

  // List label (simplified since we have tab bar)
  const scopeLabel = ' Marketplaces & Plugins ';

  // Ensure currentSelection is within bounds
  if (currentSelection >= listItems.length) {
    currentSelection = Math.max(0, listItems.length - 1);
  }

  // List
  const list = blessed.list({
    parent: state.screen,
    top: 4,
    left: 2,
    width: '50%-2',
    height: '100%-6',
    items: listItems.map((item) => item.label),
    keys: true,
    vi: false,
    mouse: true,
    tags: true,
    scrollable: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      selected: { bg: isGlobal ? 'magenta' : 'blue', fg: 'white' },
      border: { fg: isGlobal ? 'magenta' : 'gray' },
    },
    scrollbar: { ch: '│', style: { bg: 'gray' } },
    label: scopeLabel,
  });

  // Restore selection position
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listAny = list as any;
  if (currentSelection > 0 && currentSelection < listItems.length) {
    listAny.select(currentSelection);
    listAny.scrollTo(currentSelection);
  }

  // Detail panel
  const detailBox = blessed.box({
    parent: state.screen,
    top: 4,
    right: 2,
    width: '50%-2',
    height: '100%-6',
    content: '',
    tags: true,
    border: { type: 'line' },
    style: {
      fg: 'white',
      border: { fg: 'gray' },
    },
    label: ' {white-fg}Details{/white-fg} ',
  });

  // Update detail panel
  const updateDetail = (): void => {
    const selected = list.selected as number;
    const item = listItems[selected];

    if (!item || item.type === 'empty') {
      detailBox.setContent('{gray-fg}Select an item to see details{/gray-fg}');
      state.screen.render();
      return;
    }

    if (item.type === 'marketplace' && item.data?.marketplace) {
      const mp = allMarketplaces.find(m => m.name === item.data?.marketplace);
      if (!mp) {
        detailBox.setContent('{gray-fg}Marketplace not found{/gray-fg}');
        state.screen.render();
        return;
      }

      const isMarketplaceEnabled = localMarketplaces.has(mp.name) || configuredMarketplaces[mp.name] !== undefined;
      const statusText = isMarketplaceEnabled
        ? '{green-fg}● Enabled{/green-fg}'
        : '{gray-fg}○ Not added{/gray-fg}';

      const plugins = pluginsByMarketplace.get(mp.name) || [];
      const pluginInfo = plugins.length > 0
        ? `{bold}Plugins:{/bold} ${plugins.length} available`
        : '{gray-fg}Enable to see plugins{/gray-fg}';

      const actionText = isMarketplaceEnabled
        ? '{red-fg}Press Enter to remove{/red-fg}'
        : '{green-fg}Press Enter to add{/green-fg}';

      const scopeInfo = isGlobal
        ? '{magenta-fg}Scope: Global (~/.claude){/magenta-fg}'
        : `{cyan-fg}Scope: Project (${state.projectPath}){/cyan-fg}`;

      const sourceDisplay = mp.source.repo
        ? `{bold}Source:{/bold}\n{gray-fg}github.com/${mp.source.repo}{/gray-fg}`
        : `{bold}Source:{/bold}\n{gray-fg}Local cache{/gray-fg}`;

      const content = `
{bold}{cyan-fg}${mp.displayName}{/cyan-fg}{/bold}${mp.official ? ' {cyan-fg}[Official]{/cyan-fg}' : ''}

${mp.description}

{bold}Status:{/bold} ${statusText}
${pluginInfo}

${sourceDisplay}

${scopeInfo}

${actionText}
      `.trim();

      detailBox.setContent(content);
    } else if (item.type === 'plugin' && item.data?.pluginId) {
      const plugin = allPlugins.find(p => p.id === item.data?.pluginId);
      if (!plugin) {
        detailBox.setContent('{gray-fg}Plugin not found{/gray-fg}');
        state.screen.render();
        return;
      }

      let statusText = '{gray-fg}Not installed{/gray-fg}';
      if (plugin.enabled) {
        statusText = '{green-fg}● Enabled{/green-fg}';
      } else if (plugin.installedVersion) {
        statusText = '{yellow-fg}● Installed (disabled){/yellow-fg}';
      }

      let versionInfo = `{bold}Latest:{/bold} v${plugin.version}`;
      if (plugin.installedVersion) {
        versionInfo = `{bold}Installed:{/bold} v${plugin.installedVersion}\n{bold}Latest:{/bold} v${plugin.version}`;
        if (plugin.hasUpdate) {
          versionInfo += '\n{yellow-fg}⬆ Update available{/yellow-fg}';
        }
      }

      let actions = '';
      // Check both enabled and installedVersion - plugin can be enabled without version tracking
      const isInstalled = plugin.enabled || plugin.installedVersion;
      if (isInstalled) {
        actions = plugin.enabled
          ? '{cyan-fg}[Enter]{/cyan-fg} Disable'
          : '{cyan-fg}[Enter]{/cyan-fg} Enable';
        if (plugin.hasUpdate) {
          actions += '  {green-fg}[u]{/green-fg} Update';
        }
        actions += '  {red-fg}[d]{/red-fg} Uninstall';
      } else {
        actions = '{green-fg}[Enter]{/green-fg} Install & Enable';
      }

      const scopeInfo = isGlobal
        ? '{magenta-fg}Scope: Global{/magenta-fg}'
        : '{cyan-fg}Scope: Project{/cyan-fg}';

      // Component summary for plugins
      const components = pluginComponents.get(plugin.id);
      let componentSummary = '';
      if (components) {
        const agentCount = components.get('agent')?.length || 0;
        const commandCount = components.get('command')?.length || 0;
        const skillCount = components.get('skill')?.length || 0;
        if (agentCount + commandCount + skillCount > 0) {
          componentSummary = `\n{bold}Components:{/bold}`;
          if (agentCount > 0) componentSummary += ` 🤖 ${agentCount}`;
          if (commandCount > 0) componentSummary += ` ⌘ ${commandCount}`;
          if (skillCount > 0) componentSummary += ` ✨ ${skillCount}`;
        }
      }

      const content = `
{bold}{cyan-fg}${plugin.name}{/cyan-fg}{/bold}

${plugin.description}

{bold}Status:{/bold} ${statusText}

${versionInfo}
${componentSummary}

{bold}ID:{/bold} ${plugin.id}
${scopeInfo}

${actions}

{gray-fg}← / → to expand/collapse{/gray-fg}
      `.trim();

      detailBox.setContent(content);
    } else if (item.type === 'type-header' && item.data?.componentType && item.data?.pluginId) {
      // Type header detail
      const pluginId = item.data.pluginId;
      const componentType = item.data.componentType;
      const plugin = allPlugins.find(p => p.id === pluginId);
      const components = pluginComponents.get(pluginId);
      const typeComponents = components?.get(componentType) || [];

      const typeIcon = COMPONENT_ICONS[componentType];
      const typeLabel = COMPONENT_TYPE_LABELS[componentType];
      const typeKey = `${pluginId}:${componentType}`;
      const isCollapsed = collapseState.types.has(typeKey);

      const content = `
{bold}{cyan-fg}${typeIcon} ${typeLabel}{/cyan-fg}{/bold}

{bold}Plugin:{/bold} ${plugin?.name || pluginId}
{bold}Count:{/bold} ${typeComponents.length} ${componentType}s

{gray-fg}Components:{/gray-fg}
${typeComponents.slice(0, 5).map(c => `  • ${c.name}`).join('\n')}
${typeComponents.length > 5 ? `  {gray-fg}... and ${typeComponents.length - 5} more{/gray-fg}` : ''}

{gray-fg}${isCollapsed ? '→ to expand' : '← to collapse'}{/gray-fg}
      `.trim();

      detailBox.setContent(content);
    } else if (item.type === 'component' && item.data?.component) {
      // Component detail
      const comp = item.data.component;
      const pluginId = item.data.pluginId;
      const plugin = allPlugins.find(p => p.id === pluginId);

      const typeIcon = COMPONENT_ICONS[comp.type];
      const typeLabel = COMPONENT_TYPE_LABELS[comp.type];

      const validityStatus = comp.isValid
        ? '{green-fg}● Valid{/green-fg}'
        : '{red-fg}✗ File not found{/red-fg}';

      if (showFullContent && comp.isValid) {
        // Load and display full content asynchronously
        loadComponentFullContent(comp).then((compWithContent) => {
          const fullContent = compWithContent.fullContent || '{gray-fg}No content available{/gray-fg}';
          // Escape blessed tags in content and show raw markdown
          const escapedContent = fullContent
            .replace(/\{/g, '\\{')
            .replace(/\}/g, '\\}');

          const content = `
{bold}{cyan-fg}${typeIcon} ${comp.name}{/cyan-fg}{/bold} {yellow-fg}[Full Content]{/yellow-fg}

{gray-fg}─── File: ${comp.filePath} ───{/gray-fg}

${escapedContent}

{gray-fg}────────────────────────────────────{/gray-fg}
{cyan-fg}[Tab]{/cyan-fg} Hide content  {cyan-fg}[Enter]{/cyan-fg} Open in editor
          `.trim();

          detailBox.setContent(content);
          state.screen.render();
        });
        // Show loading while fetching
        detailBox.setContent(`{bold}{cyan-fg}${typeIcon} ${comp.name}{/cyan-fg}{/bold}\n\n{yellow-fg}Loading content...{/yellow-fg}`);
      } else {
        // Normal detail view
        const content = `
{bold}{cyan-fg}${typeIcon} ${comp.name}{/cyan-fg}{/bold}

${comp.description || '{gray-fg}No description{/gray-fg}'}

{bold}Type:{/bold} ${typeLabel}
{bold}Plugin:{/bold} ${plugin?.name || pluginId}
{bold}Status:{/bold} ${validityStatus}

{bold}Path:{/bold}
{gray-fg}${comp.filePath}{/gray-fg}

{cyan-fg}[Tab]{/cyan-fg} Show full content
{cyan-fg}[Enter]{/cyan-fg} Open in editor
        `.trim();

        detailBox.setContent(content);
      }
    }

    state.screen.render();
  };

  list.on('select item', () => {
    currentSelection = list.selected as number;
    showFullContent = false; // Reset full content view when selection changes
    updateDetail();
  });
  setTimeout(updateDetail, 0);

  // Handle selection (Enter)
  list.on('select', async (_item: unknown, index: number) => {
    const selected = listItems[index];
    if (!selected || selected.type === 'empty') return;

    if (selected.type === 'marketplace' && selected.data?.marketplace) {
      const mp = allMarketplaces.find(m => m.name === selected.data?.marketplace);
      if (!mp) return;

      const isMarketplaceEnabled = localMarketplaces.has(mp.name) || configuredMarketplaces[mp.name] !== undefined;

      if (isMarketplaceEnabled) {
        // Remove marketplace with confirmation
        const confirm = await showConfirm(
          state,
          `Remove ${mp.displayName}?`,
          `Plugins from this marketplace will no longer be available.\n(${isGlobal ? 'Global' : 'Project'} scope)`
        );

        if (confirm) {
          const loading = showLoading(state, `Removing ${mp.displayName}...`);
          try {
            // Step 1: Remove from settings
            if (isGlobal) {
              await removeGlobalMarketplace(mp.name);
            } else {
              await removeMarketplace(mp.name, state.projectPath);
            }

            // Step 2: Delete directory
            await deleteMarketplace(mp.name);

            // Step 3: Remove from Claude's known_marketplaces.json
            await removeFromKnownMarketplaces(mp.name);

            // Step 4: Clear cache
            clearMarketplaceCache();

            await showMessage(state, 'Removed', `${mp.displayName} removed.`, 'success');
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            await showMessage(
              state,
              'Removal Failed',
              `Failed to remove ${mp.displayName}: ${errorMsg}`,
              'error'
            );
          } finally {
            loading.stop();
          }
          await navigateTo(state, 'plugins');
        }
      } else {
        // Add marketplace - immediate, no confirmation
        const loading = showLoading(state, `Adding ${mp.displayName}...`);
        try {
          if (isGlobal) {
            await addGlobalMarketplace(mp);
          } else {
            await addMarketplace(mp, state.projectPath);
          }
        } finally {
          loading.stop();
        }
        await navigateTo(state, 'plugins');
      }
    } else if (selected.type === 'plugin' && selected.data?.pluginId) {
      const plugin = allPlugins.find(p => p.id === selected.data?.pluginId);
      if (!plugin) return;

      const isInstalled = plugin.enabled || plugin.installedVersion;

      if (plugin.hasUpdate) {
        // Update plugin - immediate when update available
        const loading = showLoading(state, `Updating ${plugin.name}...`);
        try {
          if (isGlobal) {
            await saveGlobalInstalledPluginVersion(plugin.id, plugin.version);
          } else {
            await saveInstalledPluginVersion(plugin.id, plugin.version, state.projectPath);
          }
        } finally {
          loading.stop();
        }
        await navigateTo(state, 'plugins');
      } else if (isInstalled) {
        // Toggle enabled/disabled - immediate
        const newState = !plugin.enabled;
        const loading = showLoading(state, `${newState ? 'Enabling' : 'Disabling'} ${plugin.name}...`);
        try {
          if (isGlobal) {
            await enableGlobalPlugin(plugin.id, newState);
          } else {
            await enablePlugin(plugin.id, newState, state.projectPath);
          }
        } finally {
          loading.stop();
        }
        await navigateTo(state, 'plugins');
      } else {
        // Install plugin - immediate
        const loading = showLoading(state, `Installing ${plugin.name}...`);
        try {
          if (isGlobal) {
            await enableGlobalPlugin(plugin.id, true);
            await saveGlobalInstalledPluginVersion(plugin.id, plugin.version);
          } else {
            await enablePlugin(plugin.id, true, state.projectPath);
            await saveInstalledPluginVersion(plugin.id, plugin.version, state.projectPath);
          }
        } finally {
          loading.stop();
        }
        await navigateTo(state, 'plugins');
      }
    } else if (selected.type === 'type-header' && selected.data?.pluginId && selected.data?.componentType) {
      // Toggle expand/collapse for type header
      const typeKey = `${selected.data.pluginId}:${selected.data.componentType}`;
      if (collapseState.types.has(typeKey)) {
        collapseState.types.delete(typeKey);
      } else {
        collapseState.types.add(typeKey);
      }
      saveState();
      createPluginsScreen(state);
    } else if (selected.type === 'component' && selected.data?.component) {
      // Open component file in editor using editor service
      const result = await openInEditor(selected.data.component.absolutePath);
      if (!result.success) {
        await showMessage(
          state,
          'No Editor Found',
          result.error || 'Could not open file in editor.',
          'error'
        );
      }
    }
  });

  // Toggle scope (g key) - don't clear cache, just switch view
  list.key(['g'], async () => {
    if (state.isSearching) return;
    currentScope = currentScope === 'project' ? 'global' : 'project';
    currentSelection = 0; // Reset selection when scope changes
    saveState(); // Persist the scope change
    await navigateTo(state, 'plugins');
  });

  // Update plugin (u key) - immediate, no confirmation
  list.key(['u'], async () => {
    if (state.isSearching) return;
    const selected = list.selected as number;
    const item = listItems[selected];
    if (!item || item.type !== 'plugin' || !item.data?.pluginId) return;

    const plugin = allPlugins.find(p => p.id === item.data?.pluginId);
    if (!plugin || !plugin.hasUpdate) {
      return; // Silent no-op if no update available
    }

    const loading = showLoading(state, `Updating ${plugin.name}...`);
    try {
      if (isGlobal) {
        await saveGlobalInstalledPluginVersion(plugin.id, plugin.version);
      } else {
        await saveInstalledPluginVersion(plugin.id, plugin.version, state.projectPath);
      }
    } finally {
      loading.stop();
    }
    await navigateTo(state, 'plugins');
  });

  // Uninstall plugin (d key) - immediate, no confirmation
  list.key(['d'], async () => {
    if (state.isSearching) return;
    const selected = list.selected as number;
    const item = listItems[selected];
    if (!item || item.type !== 'plugin' || !item.data?.pluginId) return;

    const plugin = allPlugins.find(p => p.id === item.data?.pluginId);
    if (!plugin) return;

    const isInstalled = plugin.enabled || plugin.installedVersion;
    if (!isInstalled) {
      await showMessage(state, 'Not Installed', `${plugin.name} is not installed.`, 'info');
      return;
    }

    const loading = showLoading(state, `Uninstalling ${plugin.name}...`);
    try {
      if (isGlobal) {
        await enableGlobalPlugin(plugin.id, false);
        await removeGlobalInstalledPluginVersion(plugin.id);
      } else {
        await enablePlugin(plugin.id, false, state.projectPath);
        await removeInstalledPluginVersion(plugin.id, state.projectPath);
      }
    } finally {
      loading.stop();
    }
    await navigateTo(state, 'plugins');
  });

  // Refresh (r key) - git pull all marketplaces and clear cache
  state.screen.key(['r'], async () => {
    if (state.isSearching || state.isRefreshing) return;

    // Show progress bar
    showProgress(state, 'Refreshing marketplaces...');

    // Git pull all local marketplaces and clear cache with progress updates
    const results = await refreshAllMarketplaces((progress) => {
      showProgress(state, `Refreshing ${progress.name}...`, progress.current, progress.total);
    });

    // Hide progress bar
    hideProgress(state);

    // Build summary message
    const updated = results.filter((r) => r.updated);
    const failed = results.filter((r) => !r.success);

    let message = '';
    if (updated.length > 0) {
      message += `Updated: ${updated.map((r) => r.name).join(', ')}\n`;
    }
    if (failed.length > 0) {
      message += `Failed: ${failed.map((r) => r.name).join(', ')}\n`;
    }
    if (updated.length === 0 && failed.length === 0) {
      message = 'All marketplaces up to date.';
    }

    await showMessage(state, 'Refreshed', message.trim(), updated.length > 0 ? 'success' : 'info');
    await navigateTo(state, 'plugins');
  });

  // Update all plugins (A key - Shift+A) - immediate, no confirmation
  list.key(['S-a'], async () => {
    if (state.isSearching) return;
    const updatable = allPlugins.filter((p) => p.hasUpdate);
    if (updatable.length === 0) {
      return; // Silent no-op if all up-to-date
    }

    const loading = showLoading(state, `Updating ${updatable.length} plugin(s)...`);
    try {
      for (const plugin of updatable) {
        if (isGlobal) {
          await saveGlobalInstalledPluginVersion(plugin.id, plugin.version);
        } else {
          await saveInstalledPluginVersion(plugin.id, plugin.version, state.projectPath);
        }
      }
    } finally {
      loading.stop();
    }
    await navigateTo(state, 'plugins');
  });

  // Type jump: a → next Agent, c → next Command, s → next Skill
  const jumpToNextType = (targetType: ComponentType) => {
    if (state.isSearching) return;
    const currentIdx = list.selected as number;

    // Find next item of target type (wrapping around)
    for (let offset = 1; offset <= listItems.length; offset++) {
      const nextIdx = (currentIdx + offset) % listItems.length;
      const item = listItems[nextIdx];

      // Match component of target type or type-header of target type
      if (item.type === 'component' && item.data?.component?.type === targetType) {
        // neo-blessed's select method exists but isn't typed properly
        (list as any).select(nextIdx);
        state.screen.render();
        return;
      }
      if (item.type === 'type-header' && item.data?.componentType === targetType) {
        (list as any).select(nextIdx);
        state.screen.render();
        return;
      }
    }
  };

  list.key(['a'], () => jumpToNextType('agent'));
  list.key(['c'], () => jumpToNextType('command'));
  list.key(['s'], () => jumpToNextType('skill'));

  // Toggle full content display (Tab key)
  list.key(['tab'], () => {
    const selected = list.selected as number;
    const item = listItems[selected];

    // Only toggle for component items
    if (item?.type === 'component' && item.data?.component?.isValid) {
      showFullContent = !showFullContent;
      updateDetail();
    }
  });

  // Add new marketplace (n key)
  state.screen.key(['n'], async () => {
    if (state.isSearching) return;

    const repo = await showInput(state, 'Add Marketplace', 'GitHub repo (owner/repo):');
    if (!repo || !repo.trim()) return;

    showProgress(state, 'Cloning marketplace...');
    const result = await cloneMarketplace(repo.trim());
    hideProgress(state);

    if (result.success) {
      try {
        // Add to settings and Claude's known_marketplaces.json
        const normalizedRepo = repo.trim().replace(/^https:\/\/github\.com\//, '').replace(/\.git$/, '');
        const marketplace: Marketplace = {
          name: result.name,
          displayName: result.name,
          source: { source: 'github', repo: normalizedRepo },
          description: '',
          official: false,
        };

        // Step 1: Add to settings
        if (isGlobal) {
          await addGlobalMarketplace(marketplace);
        } else {
          await addMarketplace(marketplace, state.projectPath);
        }

        // Step 2: Add to known marketplaces
        await addToKnownMarketplaces(result.name, normalizedRepo);

        // Step 3: Clear cache
        clearMarketplaceCache();

        await showMessage(state, 'Added', `${result.name} marketplace added.\nPlugins are now available.`, 'success');
      } catch (error) {
        // Rollback: delete cloned directory on failure
        await deleteMarketplace(result.name).catch(() => {});

        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        await showMessage(state, 'Add Failed', `Failed to add marketplace: ${errorMsg}`, 'error');
      }
      createPluginsScreen(state);
    } else {
      await showMessage(state, 'Failed', result.error || 'Clone failed', 'error');
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

  // Expand/collapse for all levels (left/right arrows or h/l vim keys)
  const toggleCollapse = (collapse: boolean) => {
    const selected = list.selected as number;
    const item = listItems[selected];
    if (!item) return;

    let needRefresh = false;

    switch (item.type) {
      case 'marketplace':
        if (item.data?.marketplace) {
          if (collapse) {
            collapseState.marketplaces.add(item.data.marketplace);
          } else {
            collapseState.marketplaces.delete(item.data.marketplace);
          }
          needRefresh = true;
        }
        break;

      case 'plugin':
        if (item.data?.pluginId) {
          if (collapse) {
            collapseState.plugins.add(item.data.pluginId);
          } else {
            collapseState.plugins.delete(item.data.pluginId);
          }
          needRefresh = true;
        }
        break;

      case 'type-header':
        if (item.data?.pluginId && item.data?.componentType) {
          const typeKey = `${item.data.pluginId}:${item.data.componentType}`;
          if (collapse) {
            collapseState.types.add(typeKey);
          } else {
            collapseState.types.delete(typeKey);
          }
          needRefresh = true;
        }
        break;

      case 'component':
        // For components, toggle parent type header
        if (item.data?.pluginId && item.data?.component) {
          const typeKey = `${item.data.pluginId}:${item.data.component.type}`;
          if (collapse) {
            collapseState.types.add(typeKey);
          } else {
            collapseState.types.delete(typeKey);
          }
          needRefresh = true;
        }
        break;
    }

    if (needRefresh) {
      saveState();
      createPluginsScreen(state);
    }
  };

  list.key(['left', 'h'], () => toggleCollapse(true));
  list.key(['right', 'l'], () => toggleCollapse(false));

  // Search mode (/ key)
  list.key(['/'], async () => {
    if (state.isSearching) return;

    const query = await showInput(state, 'Search', 'Filter by name:');
    if (query === null || query === undefined) {
      // User cancelled
      return;
    }

    searchQuery = query.trim();
    currentSelection = 0;
    await navigateTo(state, 'plugins');
  });

  // Clear search (Escape key - only when search is active)
  list.key(['escape'], async () => {
    if (searchQuery) {
      searchQuery = '';
      currentSelection = 0;
      await navigateTo(state, 'plugins');
    }
  });

  // Legend (scope now visible in tab bar)
  blessed.box({
    parent: state.screen,
    bottom: 1,
    right: 2,
    width: 50,
    height: 1,
    content: `{green-fg}●{/green-fg} Enabled  {yellow-fg}●{/yellow-fg} Disabled  {gray-fg}○{/gray-fg} Not installed`,
    tags: true,
    style: { fg: 'white' },
  });

  // Show search query in footer if active
  const footerBase = '↑↓ Navigate │ ←→ Collapse │ Tab Content │ / Search │ a/c/s Type │ n New │ g Scope │ u/d Plugin │ r Refresh';
  const footerText = searchQuery
    ? `{yellow-fg}[Search: ${searchQuery}]{/yellow-fg} │ Esc Clear │ ${footerBase}`
    : footerBase;
  createFooter(state, footerText);

  list.focus();
  state.screen.render();
}
