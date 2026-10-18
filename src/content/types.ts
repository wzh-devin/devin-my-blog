import type { Article } from '../features/articles/model/types.ts';

export type ContentLink = { label: string; href: string };
export type NavigationItem = ContentLink & { number: string; route: string };
export type SiteProfile = {
  name: string;
  siteName: string;
  description: string;
  introLineList: string[];
  timeZone: string;
};
export type HomeContent = { recentTitle: string; viewAllLabel: string };
export type MenuContent = {
  eyebrow: string;
  title: string;
  description: string;
  linkList: ContentLink[];
  footer: { label: string; text: string };
};
export type MarkdownPage = Pick<Article, 'slug' | 'title' | 'description' | 'nodeList'> & {
  notice: string;
  linkList: ContentLink[];
};
export type ContentEntry = {
  name: string;
  description: string;
  year?: string;
  linkList: ContentLink[];
};
export type ListPageContent = {
  title: string;
  introduction: string;
  sectionList: { title: string; entryList: ContentEntry[] }[];
};
export type SiteContent = {
  profile: SiteProfile;
  homeContent: HomeContent;
  menuContent: MenuContent;
  navigationList: NavigationItem[];
  pageList: MarkdownPage[];
  workContent: ListPageContent;
  usesContent: ListPageContent;
  linksContent: ListPageContent;
};
