import { readFileSync, realpathSync } from 'node:fs';
import { isAbsolute, relative, sep, dirname } from 'node:path';
import { parser, RuleType, type MarkdownToJSX } from 'markdown-to-jsx/markdown';
import { parse } from 'yaml';
import type { Article } from '../src/features/articles/model/types.ts';

// 错误始终包含内容文件位置，便于在另一个仓库直接定位。
export const fail = (filePath: string, message: string): never => {
  throw new Error(`[博客内容] ${filePath}: ${message}`);
};

/** 读取内容文件，保留底层错误原因。 */
export const readText = (filePath: string): string => {
  try {
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    return fail(filePath, error instanceof Error ? error.message : '无法读取文件');
  }
};

/** 将未知配置收敛为对象，避免类型断言掩盖无效输入。 */
export const requireRecord = (value: unknown, filePath: string): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return fail(filePath, '需要一个对象');
  }
  return value as Record<string, unknown>;
};

/** 读取必填文本，配置与文章元数据共用相同校验。 */
export const requireText = (value: unknown, filePath: string, field: string): string => {
  if (typeof value !== 'string' || !value.trim()) return fail(filePath, `${field} 必须是非空文字`);
  return value.trim();
};

/** JSON 错误保留对应文件路径。 */
export const readJson = (filePath: string): unknown => {
  try {
    return JSON.parse(readText(filePath));
  } catch (error) {
    return fail(filePath, error instanceof Error ? error.message : '无效 JSON');
  }
};

/** 同时检查路径边界，避免符号链接指向相邻目录。 */
export const isWithinDirectory = (directoryPath: string, filePath: string): boolean => {
  const relativePath = relative(directoryPath, filePath);
  return relativePath !== '..' && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath);
};

/** 读取 YAML 元数据与正文；文章和独立页面使用同一解析规则。 */
export const readMarkdown = (filePath: string) => {
  const source = readText(filePath)
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n');
  if (!isWithinDirectory(realpathSync(dirname(filePath)), realpathSync(filePath))) {
    return fail(filePath, '正文不能指向自身目录之外');
  }
  const match = /^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/.exec(source);
  if (!match) return fail(filePath, '缺少 YAML frontmatter：请使用 --- 包围元数据');
  let metadata: Record<string, unknown>;
  try {
    metadata = requireRecord(parse(match[1], { maxAliasCount: 50, uniqueKeys: true }), filePath);
  } catch (error) {
    return fail(filePath, error instanceof Error ? error.message : '无效 YAML');
  }
  const body = requireText(match[2], filePath, '正文');
  const nodeList = parser(body, {
    disableParsingRawHTML: true,
    slugify: (heading) =>
      heading
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s_-]/gu, '')
        .trim()
        .replace(/\s+/g, '-'),
  });
  const headingList: Article['headingList'] = [];
  const headingIdSet = new Set<string>();
  visitNodeList(nodeList, (node) => {
    if (node.type !== RuleType.heading) return;
    const baseId = node.id || `section-${headingList.length}`;
    let id = baseId;
    let suffix = 1;
    while (headingIdSet.has(id)) id = `${baseId}-${suffix++}`;
    headingIdSet.add(id);
    node.id = id;
    headingList.push({ id, title: getNodeText(node.children), level: node.level });
  });
  return { metadata, body, nodeList, headingList };
};

/** 遍历 Markdown 的嵌套正文、列表及表格，统一处理标题与资源。 */
export const visitNodeList = (
  nodeList: MarkdownToJSX.ASTNode[],
  visit: (node: MarkdownToJSX.ASTNode) => void,
): void => {
  for (const node of nodeList) {
    visit(node);
    if ('children' in node && node.children) visitNodeList(node.children, visit);
    if ('items' in node) node.items.forEach((itemNodeList) => visitNodeList(itemNodeList, visit));
    if (node.type === RuleType.table) {
      node.header.forEach((cellNodeList) => visitNodeList(cellNodeList, visit));
      node.cells.forEach((rowList) =>
        rowList.forEach((cellNodeList) => visitNodeList(cellNodeList, visit)),
      );
    }
  }
};

/** 提取标题的可见文本，保留强调和行内代码的文字。 */
const getNodeText = (nodeList: MarkdownToJSX.ASTNode[]): string =>
  nodeList
    .map((node) => {
      if ('text' in node) return node.text;
      if ('children' in node && node.children) return getNodeText(node.children);
      return node.type === RuleType.image ? (node.alt ?? '') : '';
    })
    .join('');
