import type { ContentIndex, DocumentReference, PublishedContent } from '../types.ts';
import type { Article } from '../../features/articles/model/types.ts';
import type { MarkdownPage } from '../types.ts';

const contentBase = `${import.meta.env?.BASE_URL ?? '/'}content/`;
let publishedContent: PublishedContent | undefined;

// 正文只允许请求当前部署路径内的摘要资源，拒绝任意 URL 或路径回退。
const isDocumentUrl = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.startsWith(`${contentBase}documents/`) &&
  /^[a-f0-9]{64}\.json$/.test(value.slice(`${contentBase}documents/`.length));

/** 初始化已发布索引；不完整或版本不匹配时保持原状态并明确失败。 */
export const initializeContent = (value: unknown): void => {
  const index = value as ContentIndex | null;
  const content = index?.content;
  if (
    index?.schemaVersion !== 1 ||
    !content ||
    typeof content.profile?.siteName !== 'string' ||
    typeof content.profile?.description !== 'string' ||
    !content.homeContent ||
    !content.menuContent ||
    !content.workContent ||
    !content.usesContent ||
    !content.linksContent ||
    !Array.isArray(content.navigationList) ||
    !Array.isArray(content.categoryList) ||
    !Array.isArray(content.featuredArticleList) ||
    !Array.isArray(content.articleList) ||
    !Array.isArray(content.pageList) ||
    !content.pageList.some((page) => page.slug === 'about') ||
    ![...content.articleList, ...content.pageList].every(
      (document) => typeof document.slug === 'string' && isDocumentUrl(document.bodyUrl),
    )
  )
    throw new Error('内容索引不完整或版本不受支持');
  publishedContent = content;
};

/** 同一页面只初始化一次，组件从同一个内容快照读取配置和列表。 */
export const getPublishedContent = (): PublishedContent => {
  if (!publishedContent) throw new Error('内容尚未加载');
  return publishedContent;
};

/** 在创建 Router 之前读取最新索引，缓存与认证信息均不参与请求。 */
export const loadContentIndex = async (): Promise<void> => {
  const response = await fetch(`${contentBase}index.json`, {
    cache: 'no-store',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`内容索引加载失败：${response.status}`);
  initializeContent(await response.json());
};

/**
 * 按路由读取不可变正文，拒绝错配的响应。
 * @template T 文章或独立页面的正文类型。
 * @param reference 索引中的正文引用。
 * @param signal 路由取消信号。
 * @returns 已校验的正文。
 */
export const loadDocument = async <T extends Article | MarkdownPage>(
  reference: DocumentReference,
  signal?: AbortSignal,
): Promise<T> => {
  if (!isDocumentUrl(reference.bodyUrl)) throw new Error('无效的正文地址');
  const response = await fetch(reference.bodyUrl, {
    cache: 'force-cache',
    credentials: 'omit',
    headers: { Accept: 'application/json' },
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(15000)])
      : AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`正文加载失败：${response.status}`);
  const document = await response.json();
  if (document?.slug !== reference.slug || !Array.isArray(document.nodeList))
    throw new Error('正文内容不匹配');
  return document as T;
};
