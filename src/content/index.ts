import { getPublishedContent } from './model/index.ts';

export const {
  profile,
  homeContent,
  menuContent,
  navigationList,
  pageList,
  workContent,
  usesContent,
  linksContent,
} = getPublishedContent();
export type { MarkdownPage, ListPageContent, PageReference } from './types.ts';
