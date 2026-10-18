import { Link } from 'react-router';
import { profile } from '../../config/site.ts';
import type { Article } from '../../features/articles/index.ts';
import { Icon } from '../../components/icon/index.tsx';
import { PageHeading } from '../../components/page-heading/index.tsx';
import { TextLink } from '../../components/text-link/index.tsx';
import { formatDate } from '../../lib/date.ts';
import { MarkdownBody } from '../../content/components/markdown-body/index.tsx';
import { TableOfContents } from './components/table-of-contents/index.tsx';

export const ArticlePage = ({ article }: { article: Article }) => (
  <main id="main" className="content-page detail-page">
    <Link className="back-link text-link" to="/archive">
      <Icon name="back" /> All articles
    </Link>
    <article>
      <header className="article-header">
        <div className="detail-meta">
          <span>{article.category}</span>
          <span>·</span>
          <time dateTime={article.date}>{formatDate(article.date)}</time>
          <span>·</span>
          <span>{article.readingMinutes} 分钟阅读</span>
        </div>
        <PageHeading title={article.title} />
      </header>
      <div className="page-content article-content">
        <p className="article-deck">{article.description}</p>
        <div className="byline">
          <span>{profile.name}</span>
        </div>
        <TableOfContents headingList={article.headingList} />
        <MarkdownBody content={article} />
        <div className="article-end">
          <p>感谢你读到这里。</p>
          <TextLink to="/archive">Read something else</TextLink>
        </div>
      </div>
    </article>
  </main>
);
