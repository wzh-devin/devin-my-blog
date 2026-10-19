import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { readBlogContent, type ContentAsset } from './blog-content.ts';
import type { ContentIndex } from '../src/content/types.ts';

/**
 * 复用内容校验和资源管线，输出独立索引与摘要正文。
 * @param contentDirectory 内容源码仓库。
 * @param base 资源 URL 的部署前缀。
 * @returns 内容索引和全部生成文件。
 */
export const createContentOutput = (contentDirectory: string, base = '/') => {
  const { content, assetList } = readBlogContent(contentDirectory, base);
  // 正文地址由内容决定，发布新版本无需使旧缓存失效。
  const addDocument = (document: unknown): string => {
    const source = Buffer.from(JSON.stringify(document));
    const digest = createHash('sha256').update(source).digest('hex');
    const fileName = `content/documents/${digest}.json`;
    assetList.push({ fileName, source, mimeType: 'application/json; charset=utf-8' });
    return `${base}${fileName}`;
  };
  const index: ContentIndex = {
    schemaVersion: 1,
    content: {
      ...content,
      articleList: content.articleList.map((article) => {
        const { nodeList: _nodeList, headingList: _headingList, ...summary } = article;
        return { ...summary, bodyUrl: addDocument(article) };
      }),
      pageList: content.pageList.map((page) => {
        const { nodeList: _nodeList, ...summary } = page;
        return { ...summary, bodyUrl: addDocument(page) };
      }),
    },
  };
  assetList.push({
    fileName: 'content/index.json',
    source: Buffer.from(JSON.stringify(index)),
    mimeType: 'application/json; charset=utf-8',
  });
  return { index, assetList };
};

/**
 * 内容全部校验成功后才写入生成目录，源码和草稿不会直接公开。
 * @param outputDirectory 生成目录。
 * @param assetList 已校验的内容文件。
 */
export const writeContentOutput = (outputDirectory: string, assetList: ContentAsset[]): void => {
  for (const { fileName, source } of assetList) {
    const filePath = join(outputDirectory, fileName);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, source);
  }
};
