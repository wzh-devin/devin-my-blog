import { useState } from 'react';
import { filterArticles, type Category } from './model/index.ts';

/** 由应用持有筛选条件，页面切换后保留搜索，列表由条件直接派生。 */
export const useArticleSearch = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('全部');
  const filteredArticleList = filterArticles(query, category);
  const resetSearch = () => {
    setQuery('');
    setCategory('全部');
  };
  return {
    query,
    category,
    setQuery,
    setCategory,
    filteredArticleList,
    resetSearch,
  };
};

export type ArticleSearchState = ReturnType<typeof useArticleSearch>;
