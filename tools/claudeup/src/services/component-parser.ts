/**
 * Component Parser Service
 *
 * 解析插件内部的 agents/commands/skills 组件文件
 * 支持 Markdown frontmatter 和内容提取
 */

import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import type { ComponentType, ParsedComponent, PluginComponent } from '../types/index.js';

/** 组件类型目录映射 */
const COMPONENT_DIRS: Record<ComponentType, string> = {
  agent: 'agents',
  command: 'commands',
  skill: 'skills',
};

/** 组件类型显示名称 */
export const COMPONENT_TYPE_LABELS: Record<ComponentType | 'invalid', string> = {
  agent: 'Agents',
  command: 'Commands',
  skill: 'Skills',
  invalid: 'Invalid',
};

/** 组件类型图标 */
export const COMPONENT_ICONS: Record<ComponentType | 'invalid', string> = {
  agent: '🤖',
  command: '⌘',
  skill: '✨',
  invalid: '⚠️',
};

/**
 * 手动解析 frontmatter（当 gray-matter 失败时的备用方案）
 * @param content 文件内容
 * @returns 解析后的 metadata 和 body
 */
function manualParseFrontmatter(content: string): { metadata: Record<string, string>; body: string } {
  const metadata: Record<string, string> = {};

  // 检查是否以 --- 开头
  if (!content.startsWith('---')) {
    return { metadata, body: content };
  }

  // 找到结束的 ---
  const endIndex = content.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { metadata, body: content };
  }

  const frontmatterBlock = content.substring(4, endIndex);
  const body = content.substring(endIndex + 4).trim();

  // 逐行解析 frontmatter
  const lines = frontmatterBlock.split('\n');
  for (const line of lines) {
    // 匹配 key: value 格式
    const match = line.match(/^(\w+(?:-\w+)*):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      // 移除值两端的引号（如果有）
      metadata[key] = value.replace(/^["']|["']$/g, '').trim();
    }
  }

  return { metadata, body };
}

/**
 * 从内容中提取描述
 * @param body Markdown 内容（不含 frontmatter）
 * @returns 提取的描述
 */
function extractDescriptionFromBody(body: string): string {
  const lines = body.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // 跳过空行和标题行
    if (trimmed && !trimmed.startsWith('#')) {
      // 移除 Markdown 格式符号
      return trimmed
        .replace(/^\*+\s*/, '')  // 移除列表符号
        .replace(/^-\s*/, '')
        .replace(/\*\*/g, '')    // 移除加粗
        .replace(/\*/g, '')      // 移除斜体
        .substring(0, 120);      // 限制长度
    }
  }
  return '';
}

/**
 * 解析单个组件文件
 * @param filePath 文件绝对路径
 * @returns 解析后的组件信息
 */
export async function parseComponentFile(filePath: string): Promise<ParsedComponent> {
  const name = path.basename(filePath, path.extname(filePath));

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    let metadata: Record<string, unknown> = {};
    let body = '';

    // 首先尝试用 gray-matter 解析
    try {
      const parsed = matter(content);
      metadata = parsed.data;
      body = parsed.content;
    } catch {
      // gray-matter 失败，使用手动解析作为备用
      const manual = manualParseFrontmatter(content);
      metadata = manual.metadata;
      body = manual.body;
    }

    // 提取描述：优先从 frontmatter 获取，否则从首行非空内容提取
    let description = '';
    if (metadata.description) {
      description = String(metadata.description);
    } else {
      description = extractDescriptionFromBody(body);
    }

    // 如果还是没有描述，使用 frontmatter 的 name 或文件名
    if (!description) {
      description = metadata.name ? String(metadata.name) : name;
    }

    return {
      name,
      description,
      metadata,
      content: body,
      isValid: true,
    };
  } catch (error) {
    return {
      name,
      description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      metadata: {},
      content: '',
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 插件 JSON 配置接口
 */
interface PluginJson {
  name?: string;
  version?: string;
  agents?: string[];
  commands?: string[];
  skills?: string[];
}

/**
 * 加载插件的所有组件
 * @param pluginPath 插件根目录路径
 * @param pluginJson 插件配置（plugin.json 内容）
 * @returns 按类型分组的组件映射
 */
export async function loadPluginComponents(
  pluginPath: string,
  pluginJson: PluginJson
): Promise<Map<ComponentType | 'invalid', PluginComponent[]>> {
  const result = new Map<ComponentType | 'invalid', PluginComponent[]>();

  // 初始化所有类型的空数组
  result.set('agent', []);
  result.set('command', []);
  result.set('skill', []);
  result.set('invalid', []);

  // 遍历每种组件类型
  for (const [componentType, dirName] of Object.entries(COMPONENT_DIRS)) {
    const type = componentType as ComponentType;
    const componentDir = path.join(pluginPath, dirName);

    // 获取该类型在 plugin.json 中声明的组件列表
    const declaredComponents = pluginJson[`${type}s` as keyof PluginJson] as string[] | undefined;

    if (!declaredComponents || declaredComponents.length === 0) {
      continue;
    }

    // 检查目录是否存在
    if (!await fs.pathExists(componentDir)) {
      // 目录不存在，将所有声明的组件标记为无效
      for (const componentPath of declaredComponents) {
        const invalidComponent: PluginComponent = {
          name: path.basename(componentPath, path.extname(componentPath)),
          description: `Error: Directory "${dirName}" not found`,
          type,
          filePath: componentPath,
          absolutePath: path.join(pluginPath, componentPath),
          isValid: false,
          error: `Directory "${dirName}" not found`,
        };
        result.get('invalid')!.push(invalidComponent);
      }
      continue;
    }

    // 解析每个声明的组件
    for (const componentPath of declaredComponents) {
      const absolutePath = path.join(pluginPath, componentPath);
      const relativePath = componentPath;

      // 检查路径是否存在
      if (!await fs.pathExists(absolutePath)) {
        const invalidComponent: PluginComponent = {
          name: path.basename(componentPath, path.extname(componentPath)),
          description: `Error: File not found`,
          type,
          filePath: relativePath,
          absolutePath,
          isValid: false,
          error: 'File not found',
        };
        result.get('invalid')!.push(invalidComponent);
        continue;
      }

      // 检查是文件还是目录
      const stat = await fs.stat(absolutePath);

      if (stat.isDirectory()) {
        // 如果是目录，优先查找 SKILL.md 文件（标准 skill 目录结构）
        const skillMdPath = path.join(absolutePath, 'SKILL.md');
        const dirName = path.basename(componentPath);

        if (await fs.pathExists(skillMdPath)) {
          // 找到 SKILL.md，解析它并使用目录名作为组件名
          const parsed = await parseComponentFile(skillMdPath);

          const component: PluginComponent = {
            name: dirName,  // 使用目录名作为组件名
            description: parsed.description,
            type,
            filePath: path.join(relativePath, 'SKILL.md'),
            absolutePath: skillMdPath,
            isValid: parsed.isValid,
            metadata: parsed.metadata,
            error: parsed.error,
          };

          if (parsed.isValid) {
            result.get(type)!.push(component);
          } else {
            result.get('invalid')!.push(component);
          }
        } else {
          // 没有 SKILL.md，扫描目录中所有 .md 文件
          const files = await fs.readdir(absolutePath);
          const mdFiles = files.filter(f => f.endsWith('.md'));

          if (mdFiles.length === 0) {
            // 目录中没有 .md 文件
            const invalidComponent: PluginComponent = {
              name: dirName,
              description: `Error: No .md files in directory`,
              type,
              filePath: relativePath,
              absolutePath,
              isValid: false,
              error: 'No .md files in directory',
            };
            result.get('invalid')!.push(invalidComponent);
            continue;
          }

          // 解析目录中的每个 .md 文件
          for (const mdFile of mdFiles) {
            const fileAbsolutePath = path.join(absolutePath, mdFile);
            const fileRelativePath = path.join(relativePath, mdFile);

            const parsed = await parseComponentFile(fileAbsolutePath);

            const component: PluginComponent = {
              name: parsed.name,
              description: parsed.description,
              type,
              filePath: fileRelativePath,
              absolutePath: fileAbsolutePath,
              isValid: parsed.isValid,
              metadata: parsed.metadata,
              error: parsed.error,
            };

            if (parsed.isValid) {
              result.get(type)!.push(component);
            } else {
              result.get('invalid')!.push(component);
            }
          }
        }
      } else {
        // 如果是文件，直接解析
        const parsed = await parseComponentFile(absolutePath);

        const component: PluginComponent = {
          name: parsed.name,
          description: parsed.description,
          type,
          filePath: relativePath,
          absolutePath,
          isValid: parsed.isValid,
          metadata: parsed.metadata,
          error: parsed.error,
        };

        if (parsed.isValid) {
          result.get(type)!.push(component);
        } else {
          result.get('invalid')!.push(component);
        }
      }
    }
  }

  // 移除空的类型分组
  for (const [key, value] of result) {
    if (value.length === 0) {
      result.delete(key);
    }
  }

  return result;
}

/**
 * 获取组件的完整内容（延迟加载）
 * @param component 组件信息
 * @returns 带完整内容的组件
 */
export async function loadComponentFullContent(
  component: PluginComponent
): Promise<PluginComponent> {
  if (component.fullContent) {
    return component;
  }

  try {
    const content = await fs.readFile(component.absolutePath, 'utf-8');
    return {
      ...component,
      fullContent: content,
    };
  } catch (error) {
    return {
      ...component,
      fullContent: `Error loading content: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * 计算组件统计信息
 */
export interface ComponentStats {
  total: number;
  agents: number;
  commands: number;
  skills: number;
  invalid: number;
}

/**
 * 获取组件统计
 * @param components 组件映射
 * @returns 统计信息
 */
export function getComponentStats(
  components: Map<ComponentType | 'invalid', PluginComponent[]>
): ComponentStats {
  return {
    total:
      (components.get('agent')?.length || 0) +
      (components.get('command')?.length || 0) +
      (components.get('skill')?.length || 0),
    agents: components.get('agent')?.length || 0,
    commands: components.get('command')?.length || 0,
    skills: components.get('skill')?.length || 0,
    invalid: components.get('invalid')?.length || 0,
  };
}
