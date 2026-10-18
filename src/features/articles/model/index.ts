import { articleList } from '../data.ts';

import type { Article, Category } from './types.ts';

export { articleList, categoryList } from '../data.ts';
export type { Article, ArticleCodeBlockNode, ArticleImageNode, Category } from './types.ts';

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
