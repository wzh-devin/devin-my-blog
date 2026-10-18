import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, realpathSync, type Dirent } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { RuleType } from 'markdown-to-jsx/markdown';
import {
  fail,
  readJson,
  requireRecord,
  requireText,
  readMarkdown,
  visitNodeList,
  isWithinDirectory,
} from './content-utils.ts';
import type {
  Article,
  ArticleCodeBlockNode,
  ArticleImageNode,
  BlogContent,
} from '../src/features/articles/model/types.ts';
import { readSiteContent } from './site-content.ts';
import { renderCodeBlock } from './code-block.ts';

export type ContentAsset = { fileName: string; source: Buffer; mimeType: string };

const identifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imageMimeTypeMap = new Map([
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.gif', 'image/gif'],
  ['.avif', 'image/avif'],
]);

/** 分类与精选仍要求显式提供列表，避免缺失内容配置被静默掩盖。 */
const readJsonList = (filePath: string): unknown[] => {
  const value = readJson(filePath);
  if (!Array.isArray(value)) return fail(filePath, '需要一个 JSON 数组');
  return value;
};

/** 读取已发布内容；草稿不参与遍历、资源输出或浏览器数据。 */
export const readBlogContent = (
  contentDirectory: string,
  base = '/',
): { content: BlogContent; assetList: ContentAsset[] } => {
  const repositoryDirectory = resolve(contentDirectory);
  const categoriesPath = join(repositoryDirectory, 'config/categories.json');
  const featuredPath = join(repositoryDirectory, 'config/featured.json');
  const categoryIdSet = new Set<string>();
  const categoryLabelSet = new Set<string>();
  const categoryMap = new Map(
    readJsonList(categoriesPath).map((value) => {
      const record = requireRecord(value, categoriesPath);
      const id = requireText(record.id, categoriesPath, 'id');
      const label = requireText(record.label, categoriesPath, 'label');
      if (!identifierPattern.test(id) || id === 'all')
        return fail(categoriesPath, `无效分类 id：${id}`);
      if (categoryIdSet.has(id) || categoryLabelSet.has(label) || label === '全部') {
        return fail(categoriesPath, `分类 id 或名称重复、或使用了保留名称：${id} / ${label}`);
      }
      categoryIdSet.add(id);
      categoryLabelSet.add(label);
      return [id, label];
    }),
  );
  const postsPath = join(repositoryDirectory, 'posts');
  let categoryDirectoryList: Dirent[];
  try {
    categoryDirectoryList = readdirSync(postsPath, { withFileTypes: true });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      categoryDirectoryList = [];
    } else {
      return fail(postsPath, error instanceof Error ? error.message : '无法读取发布区');
    }
  }
  const articleMap = new Map<string, Article>();
  const articleFileMap = new Map<string, string>();
  for (const categoryDirectory of categoryDirectoryList) {
    if (categoryDirectory.name.startsWith('.')) continue;
    const categoryPath = join(postsPath, categoryDirectory.name);
    if (!categoryDirectory.isDirectory() || !categoryMap.has(categoryDirectory.name)) {
      return fail(categoryPath, '发布区需要已登记分类的真实目录');
    }
    for (const articleDirectory of readdirSync(categoryPath, { withFileTypes: true })) {
      if (articleDirectory.name.startsWith('.')) continue;
      const articlePath = join(categoryPath, articleDirectory.name);
      const slug = articleDirectory.name;
      if (!articleDirectory.isDirectory() || !identifierPattern.test(slug)) {
        return fail(articlePath, '文章需要小写字母、数字和短横线命名的真实目录');
      }
      if (articleMap.has(slug)) return fail(articlePath, `文章标识重复：${slug}`);
      const filePath = join(articlePath, 'index.md');
      const { metadata, body, nodeList, headingList } = readMarkdown(filePath);
      const title = requireText(metadata.title, filePath, 'title');
      const description = requireText(metadata.description, filePath, 'description');
      const date = requireText(metadata.date, filePath, 'date');
      const timestamp = Date.parse(`${date}T00:00:00.000Z`);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(timestamp) ||
        new Date(timestamp).toISOString().slice(0, 10) !== date
      ) {
        return fail(filePath, 'date 必须是有效的 YYYY-MM-DD 日期');
      }
      articleMap.set(slug, {
        slug,
        title,
        description,
        category: categoryMap.get(categoryDirectory.name)!,
        date,
        readingMinutes: Math.max(1, Math.ceil(body.replace(/\s/g, '').length / 500)),
        nodeList,
        headingList,
      });
      articleFileMap.set(filePath, slug);
    }
  }

  const { site, pageFileMap } = readSiteContent(repositoryDirectory, [...articleMap.keys()]);
  const documentMap = new Map<
    string,
    { document: Pick<Article, 'slug' | 'nodeList'>; assetSlug: string; href: string }
  >([
    ...[...articleFileMap].map(
      ([filePath, slug]) =>
        [
          filePath,
          { document: articleMap.get(slug)!, assetSlug: slug, href: `/writing/${slug}` },
        ] as const,
    ),
    ...[...pageFileMap].map(
      ([filePath, page]) =>
        [
          filePath,
          { document: page, assetSlug: `pages/${page.slug}`, href: `/${page.slug}` },
        ] as const,
    ),
  ]);
  const assetMap = new Map<string, ContentAsset>();
  /** 配图和生成图表共用内容摘要，开发预览与生产资源地址保持一致。 */
  const addAsset = (source: Buffer, name: string, slug: string, mimeType: string): string => {
    const digest = createHash('sha256').update(source).digest('hex').slice(0, 12);
    const fileName = `content/${slug}/${digest}-${name}`;
    assetMap.set(fileName, { fileName, source, mimeType });
    return `${base}${fileName.split('/').map(encodeURIComponent).join('/')}`;
  };
  for (const [filePath, { document, assetSlug: slug }] of documentMap) {
    const articleDirectory = realpathSync(dirname(filePath));
    // shortcut: 本地资源转换覆盖正文节点，出现脚注配图需求时再扩展脚注预处理。
    visitNodeList(document.nodeList, (node) => {
      if (node.type === RuleType.codeBlock) {
        const output = renderCodeBlock(node.text, node.lang);
        const codeNode = node as ArticleCodeBlockNode;
        codeNode.rendered =
          output?.kind === 'diagram'
            ? {
                kind: 'diagram',
                lightSrc: addAsset(
                  Buffer.from(output.lightSvg),
                  'diagram-light.svg',
                  slug,
                  'image/svg+xml',
                ),
                darkSrc: addAsset(
                  Buffer.from(output.darkSvg),
                  'diagram-dark.svg',
                  slug,
                  'image/svg+xml',
                ),
              }
            : output;
        return;
      }
      if (node.type !== RuleType.image && node.type !== RuleType.link) return;
      const target = node.target;
      if (target === null) return fail(filePath, '图片或链接使用了不安全的地址');
      if (/^https?:\/\//i.test(target)) {
        if (node.type === RuleType.image) {
          const imageNode = node as ArticleImageNode;
          try {
            imageNode.fileName =
              decodeURIComponent(new URL(target).pathname.split('/').pop() ?? '') || undefined;
          } catch {
            // 远程地址无法提取文件名时仍按原地址加载，不编造图注。
            imageNode.fileName = undefined;
          }
        }
        return;
      }
      if (
        node.type === RuleType.link &&
        (/^(mailto:|tel:)/i.test(target) || target.startsWith('#'))
      )
        return;
      if (node.type === RuleType.link && target.startsWith('/') && !target.startsWith('//')) return;
      if (node.type === RuleType.image && target.startsWith('/')) {
        return fail(filePath, `配图请使用文章内的相对路径或完整的 HTTP(S) 地址：${target}`);
      }
      if (/^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//') || target.includes('\\')) {
        return fail(filePath, `不支持的图片或链接地址：${target}`);
      }
      const suffixIndex = target.search(/[?#]/);
      const encodedPath = suffixIndex < 0 ? target : target.slice(0, suffixIndex);
      const suffix = suffixIndex < 0 ? '' : target.slice(suffixIndex);
      let targetPath: string;
      try {
        targetPath = resolve(dirname(filePath), decodeURIComponent(encodedPath));
      } catch {
        return fail(filePath, `无效的图片或链接路径：${target}`);
      }
      const targetDocument = documentMap.get(targetPath);
      if (node.type === RuleType.link && targetDocument) {
        node.target = `${targetDocument.href}${suffix}`;
        return;
      }
      let realTargetPath: string;
      try {
        realTargetPath = realpathSync(targetPath);
      } catch {
        return fail(filePath, `找不到图片或文章：${target}`);
      }
      const mimeType = imageMimeTypeMap.get(extname(realTargetPath).toLowerCase());
      if (!isWithinDirectory(articleDirectory, realTargetPath) || !mimeType) {
        return fail(filePath, `本地资源必须是文章自身目录内的图片或已发布文章链接：${target}`);
      }
      const source = readFileSync(realTargetPath);
      if (node.type === RuleType.image) (node as ArticleImageNode).fileName = basename(targetPath);
      node.target = `${addAsset(source, basename(realTargetPath), slug, mimeType)}${suffix}`;
    });
  }

  const featuredSlugSet = new Set<string>();
  const featuredArticleList = readJsonList(featuredPath).map((value) => {
    const record = requireRecord(value, featuredPath);
    const slug = requireText(record.slug, featuredPath, 'slug');
    const shortTitle = requireText(record.shortTitle, featuredPath, 'shortTitle');
    if (!articleMap.has(slug) || featuredSlugSet.has(slug)) {
      return fail(featuredPath, `精选文章不存在于发布区或重复：${slug}`);
    }
    featuredSlugSet.add(slug);
    return { slug, shortTitle };
  });
  if (featuredArticleList.length > 6) return fail(featuredPath, '首页圆环最多精选六篇文章');

  return {
    content: {
      ...site,
      articleList: [...articleMap.values()].sort(
        (a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug),
      ),
      categoryList: ['全部', ...categoryMap.values()],
      featuredArticleList,
    },
    assetList: [...assetMap.values()],
  };
};
