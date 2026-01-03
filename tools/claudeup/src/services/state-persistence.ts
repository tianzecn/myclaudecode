/**
 * State Persistence Service
 *
 * 持久化折叠状态到 ~/.claude/claudeup/collapse-state.json
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import type { CollapseState, PersistedState } from '../types/index.js';

/** 状态文件路径 */
const STATE_DIR = path.join(os.homedir(), '.claude', 'claudeup');
const STATE_FILE = path.join(STATE_DIR, 'collapse-state.json');

/** 当前版本 */
const CURRENT_VERSION = 1;

/** 默认状态 */
const DEFAULT_STATE: PersistedState = {
  version: 1,
  collapseState: {
    marketplaces: [],
    plugins: [],
    types: [],
  },
  lastScope: 'project',
};

/** 防抖定时器 */
let saveTimer: NodeJS.Timeout | null = null;

/** 防抖延迟（毫秒） */
const DEBOUNCE_DELAY = 500;

/**
 * 确保状态目录存在
 */
async function ensureStateDir(): Promise<void> {
  await fs.ensureDir(STATE_DIR);
}

/**
 * 加载持久化状态
 * @returns 持久化状态对象
 */
export async function loadPersistedState(): Promise<PersistedState> {
  try {
    await ensureStateDir();

    if (!await fs.pathExists(STATE_FILE)) {
      return { ...DEFAULT_STATE };
    }

    const content = await fs.readJson(STATE_FILE);

    // 版本检查
    if (content.version !== CURRENT_VERSION) {
      // 未来可以在这里添加迁移逻辑
      return { ...DEFAULT_STATE };
    }

    return {
      version: content.version,
      collapseState: {
        marketplaces: content.collapseState?.marketplaces || [],
        plugins: content.collapseState?.plugins || [],
        types: content.collapseState?.types || [],
      },
      lastScope: content.lastScope || 'project',
    };
  } catch (error) {
    // 如果读取失败，返回默认状态
    return { ...DEFAULT_STATE };
  }
}

/**
 * 保存持久化状态
 * @param state 要保存的状态
 */
export async function savePersistedState(state: PersistedState): Promise<void> {
  try {
    await ensureStateDir();
    await fs.writeJson(STATE_FILE, state, { spaces: 2 });
  } catch (error) {
    // 静默失败，不影响主流程
    console.error('Failed to save state:', error);
  }
}

/**
 * 防抖保存状态
 * @param state 要保存的状态
 */
export function debouncedSaveState(state: PersistedState): void {
  if (saveTimer) {
    clearTimeout(saveTimer);
  }

  saveTimer = setTimeout(() => {
    savePersistedState(state);
    saveTimer = null;
  }, DEBOUNCE_DELAY);
}

/**
 * 将 CollapseState（使用 Set）转换为 PersistedState（使用数组）
 */
export function collapseStateToPersistedState(
  collapseState: CollapseState,
  lastScope: 'project' | 'global'
): PersistedState {
  return {
    version: CURRENT_VERSION,
    collapseState: {
      marketplaces: Array.from(collapseState.marketplaces),
      plugins: Array.from(collapseState.plugins),
      types: Array.from(collapseState.types),
    },
    lastScope,
  };
}

/**
 * 将 PersistedState（使用数组）转换为 CollapseState（使用 Set）
 */
export function persistedStateToCollapseState(persistedState: PersistedState): CollapseState {
  return {
    marketplaces: new Set(persistedState.collapseState.marketplaces),
    plugins: new Set(persistedState.collapseState.plugins),
    types: new Set(persistedState.collapseState.types),
  };
}

/**
 * 获取上次的 scope
 */
export async function getLastScope(): Promise<'project' | 'global'> {
  const state = await loadPersistedState();
  return state.lastScope;
}

/**
 * 保存当前 scope
 */
export async function saveLastScope(scope: 'project' | 'global'): Promise<void> {
  const state = await loadPersistedState();
  state.lastScope = scope;
  await savePersistedState(state);
}

/**
 * 清除状态文件（用于测试）
 */
export async function clearPersistedState(): Promise<void> {
  try {
    await fs.remove(STATE_FILE);
  } catch {
    // 静默失败
  }
}
