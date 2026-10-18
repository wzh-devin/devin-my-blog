declare module 'virtual:blog-content' {
  export const profile: import('./content/types.ts').SiteProfile;
  export const homeContent: import('./content/types.ts').HomeContent;
  export const menuContent: import('./content/types.ts').MenuContent;
  export const navigationList: import('./content/types.ts').NavigationItem[];
  export const pageList: import('./content/types.ts').MarkdownPage[];
  export const workContent: import('./content/types.ts').ListPageContent;
  export const linksContent: import('./content/types.ts').ListPageContent;
  export const usesContent: import('./content/types.ts').ListPageContent;
  export const articleList: import('./features/articles/model/types.ts').Article[];
  export const categoryList: string[];
  export const featuredArticleList: import('./features/articles/model/types.ts').FeaturedArticle[];
}
