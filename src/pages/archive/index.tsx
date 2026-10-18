import { getNavigationNumber } from '../../config/navigation.ts';
import { useRef } from 'react';
import { PageHeading } from '../../components/page-heading/index.tsx';
import { Icon } from '../../components/icon/index.tsx';
import { ArticleList, type ArticleSearchState } from '../../features/articles/index.ts';
import { SearchToolbar } from './components/search-toolbar/index.tsx';

export const ArchivePage = ({ search }: { search: ArticleSearchState }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const resetSearch = () => {
    search.resetSearch();
    inputRef.current?.focus();
  };
  return (
    <main id="main" className="content-page archive-page">
      <PageHeading number={getNavigationNumber('/writing')} title="All articles" />
      <div className="page-content">
        <p className="intro-copy">把经历变成文字，把想法留在这里。</p>
        <section aria-label="文章列表">
          <SearchToolbar search={search} inputRef={inputRef} />
          <output id="search-status" className="sr-only" aria-live="polite">
            找到 {search.filteredArticleList.length} 篇文章
          </output>
          <div id="article-results">
            {search.filteredArticleList.length ? (
              <ArticleList articleList={search.filteredArticleList} />
            ) : (
              <div className="empty-state">
                <h2>暂时没有找到这篇文字。</h2>
                <p>换个关键词，或者看看全部文章。</p>
                <button
                  type="button"
                  className="text-link"
                  data-action="reset-search"
                  onClick={resetSearch}
                >
                  清除筛选 <Icon name="external" />
                </button>
              </div>
            )}
          </div>
          <p className="collection-note">
            共 <span id="article-count">{search.filteredArticleList.length}</span> 篇文字{' '}
            <span>·</span> 持续记录中
          </p>
        </section>
      </div>
    </main>
  );
};
