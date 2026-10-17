import { articleList } from '../data.ts';

export { articleList } from '../data.ts';

export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  code?: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: '开发' | '设计' | '随想';
  date: string;
  readingMinutes: number;
  sections: ArticleSection[];
};

export const categoryList = ['全部', '开发', '设计', '随想'] as const;
export type Category = (typeof categoryList)[number];

/** 按分类与关键词筛选文章；关键词只匹配标题、摘要和分类，避免正文噪声。 */
export const filterArticles = (query: string, category: Category): Article[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return articleList.filter(
    (article) =>
      (category === '全部' || article.category === category) &&
      `${article.title} ${article.description} ${article.category}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
  );
};
