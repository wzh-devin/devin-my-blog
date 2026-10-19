import { useMemo, type ReactNode } from 'react';
import type { ArticleSummary } from '../../model/index.ts';
import { RadialTimeline } from '../../../../components/radial-timeline/index.tsx';
import { TextLink } from '../../../../components/text-link/index.tsx';
import { formatDate } from '../../../../lib/date.ts';
import { createArticleTimelineList } from './model.ts';

/** 用精选文章构成时间索引，发布新文章不会自动填满圆环。 */
export const ArticleTimeline = ({
  articleList,
  children,
}: {
  articleList: ArticleSummary[];
  children: ReactNode;
}) => {
  const itemList = useMemo(() => createArticleTimelineList(articleList), [articleList]);
  return (
    <RadialTimeline
      itemList={itemList}
      renderDetails={({ article }) => (
        <>
          <div className="article-timeline-meta">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span>
              {article.category} · {article.readingMinutes} 分钟
            </span>
          </div>
          <p>{article.description}</p>
          <TextLink to={`/writing/${article.slug}`}>阅读全文</TextLink>
        </>
      )}
    >
      {children}
    </RadialTimeline>
  );
};
