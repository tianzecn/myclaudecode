/**
 * Editor Service
 *
 * 检测并打开编辑器（Cursor / VS Code / Windsurf）
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { EditorType, EditorInfo } from '../types/index.js';

const execAsync = promisify(exec);

/** 支持的编辑器列表（按优先级排序） */
const SUPPORTED_EDITORS: EditorInfo[] = [
  { type: 'cursor', command: 'cursor', name: 'Cursor' },
  { type: 'vscode', command: 'code', name: 'VS Code' },
  { type: 'windsurf', command: 'windsurf', name: 'Windsurf' },
];

/** 缓存检测结果 */
let cachedEditor: EditorInfo | null | undefined = undefined;

/**
 * 检查命令是否可用
 */
async function isCommandAvailable(command: string): Promise<boolean> {
  try {
    await execAsync(`which ${command}`);
    return true;
  } catch {
    return false;
  }
}

/**
 * 检测可用的编辑器
 * @returns 检测到的编辑器信息，或 null 如果没有可用编辑器
 */
export async function detectEditor(): Promise<EditorInfo | null> {
  // 使用缓存
  if (cachedEditor !== undefined) {
    return cachedEditor;
  }

  for (const editor of SUPPORTED_EDITORS) {
    if (await isCommandAvailable(editor.command)) {
      cachedEditor = editor;
      return editor;
    }
  }

  cachedEditor = null;
  return null;
}

/**
 * 清除编辑器缓存（用于测试或重新检测）
 */
export function clearEditorCache(): void {
  cachedEditor = undefined;
}

/**
 * 在编辑器中打开文件
 * @param filePath 文件绝对路径
 * @returns 操作结果
 */
export async function openInEditor(
  filePath: string
): Promise<{ success: boolean; error?: string; editor?: EditorInfo }> {
  const editor = await detectEditor();

  if (!editor) {
    return {
      success: false,
      error: 'No supported editor found (Cursor, VS Code, or Windsurf)',
    };
  }

  try {
    // 使用双引号包裹路径，处理空格
    await execAsync(`${editor.command} "${filePath}"`);
    return {
      success: true,
      editor,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to open editor',
      editor,
    };
  }
}

/**
 * 在编辑器中打开文件并定位到指定行
 * @param filePath 文件绝对路径
 * @param line 行号（1-based）
 */
export async function openInEditorAtLine(
  filePath: string,
  line: number
): Promise<{ success: boolean; error?: string; editor?: EditorInfo }> {
  const editor = await detectEditor();

  if (!editor) {
    return {
      success: false,
      error: 'No supported editor found (Cursor, VS Code, or Windsurf)',
    };
  }

  try {
    // VS Code 和 Cursor 都支持 --goto 语法
    // windsurf 也支持类似语法
    await execAsync(`${editor.command} --goto "${filePath}:${line}"`);
    return {
      success: true,
      editor,
    };
  } catch (error) {
    // 如果 --goto 失败，回退到普通打开
    return openInEditor(filePath);
  }
}

/**
 * 获取编辑器显示名称
 */
export function getEditorDisplayName(type: EditorType): string {
  switch (type) {
    case 'cursor':
      return 'Cursor';
    case 'vscode':
      return 'VS Code';
    case 'windsurf':
      return 'Windsurf';
    default:
      return 'Unknown';
  }
}
