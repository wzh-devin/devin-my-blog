import { Link } from 'react-router';
import { profile } from '../../config/site.ts';
import type { Article } from '../../features/articles/index.ts';
import { Icon } from '../../components/icon/index.tsx';
import { TextLink } from '../../components/text-link/index.tsx';
import { formatDate } from '../../lib/date.ts';

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
        <h1 tabIndex={-1}>{article.title}</h1>
        <p className="article-deck">{article.description}</p>
        <div className="byline">
          <span>{profile.name}</span>
          <span>示例文章</span>
        </div>
      </header>
      <details className="table-of-contents">
        <summary>
          本文目录 <span>＋</span>
        </summary>
        <nav aria-label="文章目录">
          <ol>
            {article.sections.map((section, index) => (
              <li key={index}>
                <a href={`#section-${index}`}>{section.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
      <div className="article-body">
        {article.sections.map((section, index) => (
          <section key={index} aria-labelledby={`section-${index}`}>
            <h2 id={`section-${index}`}>{section.heading}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}>{paragraph}</p>
            ))}
            {section.code && (
              <pre>
                <code>{section.code}</code>
              </pre>
            )}
          </section>
        ))}
      </div>
      <div className="article-end">
        <p>感谢你读到这里。</p>
        <TextLink to="/archive">Read something else</TextLink>
      </div>
    </article>
  </main>
);
