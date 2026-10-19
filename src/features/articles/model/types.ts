import type { SiteContent } from '../../../content/types.ts';
import type { MarkdownToJSX } from 'markdown-to-jsx/react';

export type ArticleImageNode = MarkdownToJSX.ImageNode & { fileName?: string };

export type ArticleCodeBlockNode = MarkdownToJSX.CodeBlockNode & {
  rendered?:
    | { kind: 'highlight'; html: string }
    | { kind: 'diagram'; lightSrc: string; darkSrc: string }
    | { kind: 'error'; message: string };
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingMinutes: number;
  nodeList: MarkdownToJSX.ASTNode[];
  headingList: { id: string; title: string; level: number }[];
};

export type ArticleSummary = Omit<Article, 'nodeList' | 'headingList'>;

export type FeaturedArticle = { slug: string; shortTitle: string };
export type Category = string;

export type BlogContent = SiteContent & {
  articleList: Article[];
  categoryList: Category[];
  featuredArticleList: FeaturedArticle[];
};
