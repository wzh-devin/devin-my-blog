import type { RefObject } from 'react';
import { categoryList, type ArticleSearchState } from '../../../../features/articles/index.ts';
import { Icon } from '../../../../components/icon/index.tsx';

type SearchToolbarProps = {
  search: ArticleSearchState;
  inputRef: RefObject<HTMLInputElement | null>;
};
export const SearchToolbar = ({ search, inputRef }: SearchToolbarProps) => (
  <div className="writing-tools flex flex-wrap items-center justify-between">
    <fieldset className="category-tabs flex" aria-label="按文章分类筛选">
      {categoryList.map((value) => (
        <button
          type="button"
          key={value}
          data-category={value}
          aria-pressed={search.category === value}
          onClick={() => search.setCategory(value)}
        >
          {value}
        </button>
      ))}
    </fieldset>
    <label className="search-field flex items-center">
      <Icon name="search" />
      <span className="sr-only">搜索文章</span>
      <input
        ref={inputRef}
        id="article-search"
        type="search"
        placeholder="搜索文章…"
        value={search.query}
        onChange={(event) => search.setQuery(event.currentTarget.value)}
        autoComplete="off"
        maxLength={100}
      />
    </label>
  </div>
);
