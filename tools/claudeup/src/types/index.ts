export interface McpServer {
  name: string;
  description: string;
  // Command-based MCP server
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  // HTTP-based MCP server
  type?: 'http';
  url?: string;
  // Common fields
  category: 'browser' | 'ai' | 'design' | 'dev-tools' | 'cloud' | 'database' | 'productivity';
  requiresConfig?: boolean;
  configFields?: ConfigField[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: 'string' | 'path' | 'url' | 'boolean';
  required: boolean;
  default?: string;
  envVar?: string;
}

export interface Marketplace {
  name: string;
  displayName: string;
  source: {
    source: 'github';
    repo: string;
  };
  description: string;
  official?: boolean;
}

export interface DiscoveredMarketplace {
  name: string;
  source: 'default' | 'configured' | 'inferred';
  config?: MarketplaceSource;
}

export interface Plugin {
  name: string;
  version: string;
  description: string;
  marketplace: string;
  installed: boolean;
  availableVersion?: string;
  hasUpdate?: boolean;
}

export interface StatusLineConfig {
  name: string;
  description: string;
  template: string;
}

export interface MarketplaceSource {
  source: {
    source: 'github';
    repo: string;
  };
}

export interface ClaudeSettings {
  enabledMcpServers?: Record<string, boolean>;
  mcpServers?: Record<string, McpServerConfig>;
  enabledPlugins?: Record<string, boolean>;
  extraKnownMarketplaces?: Record<string, MarketplaceSource>;
  installedPluginVersions?: Record<string, string>;
  statusLine?: string;
}

export interface McpServerConfig {
  // Command-based
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  // HTTP-based
  type?: 'http';
  url?: string;
}

export interface ClaudeLocalSettings extends ClaudeSettings {
  allowMcp?: boolean;
  enabledMcpjsonServers?: string[];
  enableAllProjectMcpServers?: boolean;
  env?: Record<string, string>;
}

export type Screen = 'main' | 'mcp' | 'mcp-registry' | 'plugins' | 'statusline' | 'cli-tools' | 'env-vars';

// MCP Registry Types (registry.modelcontextprotocol.io)
export interface McpRegistryServer {
  name: string;
  url: string;
  short_description: string;
  version?: string;
  source_code_url?: string;
  package_registry?: string;
  published_at?: string;
}

export interface McpRegistryResponse {
  servers: McpRegistryServer[];
  next_cursor?: string;
}

// ============================================
// Component Hierarchy Types (Phase 1)
// ============================================

/** 组件类型：agent/command/skill */
export type ComponentType = 'agent' | 'command' | 'skill';

/** 列表项类型：4层结构 + empty占位 */
export type ListItemType = 'marketplace' | 'plugin' | 'type-header' | 'component' | 'empty';

/** 插件组件信息 */
export interface PluginComponent {
  /** 组件名称（不含扩展名） */
  name: string;
  /** 组件描述（从 frontmatter 或首行提取） */
  description: string;
  /** 组件类型 */
  type: ComponentType;
  /** 相对于插件根目录的路径 */
  filePath: string;
  /** 绝对路径 */
  absolutePath: string;
  /** 完整内容（延迟加载） */
  fullContent?: string;
  /** 是否有效（解析成功） */
  isValid: boolean;
  /** 解析错误信息 */
  error?: string;
  /** frontmatter 元数据 */
  metadata?: Record<string, unknown>;
}

/** 解析后的组件信息（内部使用） */
export interface ParsedComponent {
  name: string;
  description: string;
  metadata: Record<string, unknown>;
  content: string;
  isValid: boolean;
  error?: string;
}

/** 列表项（用于渲染） */
export interface ListItem {
  /** 显示标签 */
  label: string;
  /** 项目类型 */
  type: ListItemType;
  /** 层级深度：0=marketplace, 1=plugin, 2=type-header, 3=component */
  depth: number;
  /** 唯一标识符 */
  id: string;
  /** 是否可折叠 */
  collapsible: boolean;
  /** 是否已折叠 */
  collapsed: boolean;
  /** 关联数据 */
  data?: {
    marketplace?: string;
    pluginId?: string;
    componentType?: ComponentType | 'invalid';
    component?: PluginComponent;
  };
}

/** 折叠状态 */
export interface CollapseState {
  /** 已折叠的 marketplace 名称 */
  marketplaces: Set<string>;
  /** 已折叠的 pluginId */
  plugins: Set<string>;
  /** 已折叠的 "pluginId:componentType" */
  types: Set<string>;
}

/** 持久化状态格式 */
export interface PersistedState {
  version: 1;
  collapseState: {
    marketplaces: string[];
    plugins: string[];
    types: string[];
  };
  lastScope: 'project' | 'global';
}

/** 编辑器类型 */
export type EditorType = 'vscode' | 'cursor' | 'windsurf' | null;

/** 编辑器信息 */
export interface EditorInfo {
  type: EditorType;
  command: string;
  name: string;
}
