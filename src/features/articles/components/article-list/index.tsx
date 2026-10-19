import { Link } from 'react-router';
import type { ArticleSummary } from '../../model/index.ts';
import { Icon } from '../../../../components/icon/index.tsx';
import { formatDate } from '../../../../lib/date.ts';

export const ArticleList = ({ articleList }: { articleList: ArticleSummary[] }) => (
  <ul className="article-list">
    {articleList.map((article) => (
      <li key={article.slug}>
        <div className="article-row-heading flex items-baseline justify-between">
          <Link className="article-title" to={`/writing/${article.slug}`}>
            {article.title}
            <Icon name="external" />
          </Link>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
        </div>
        <div className="article-row-body">
          <p>{article.description}</p>
        </div>
      </li>
    ))}
  </ul>
);
