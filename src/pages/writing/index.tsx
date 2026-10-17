import { PageHeading } from '../../components/page-heading/index.tsx';
import { TextLink } from '../../components/text-link/index.tsx';
import { articleList, ArticleList } from '../../features/articles/index.ts';

export const WritingPage = () => (
  <main id="main" className="content-page">
    <PageHeading number="05" title="Writing" />
    <div className="page-content">
      <div className="intro-copy">
        <p>
          记录开发过程里的经验、设计中的观察，以及日常生活中值得留下的想法。关于技术，也关于技术之外。
        </p>
        <TextLink to="/archive">Read articles</TextLink>
      </div>
      <section aria-labelledby="recent-title">
        <h2 id="recent-title" className="section-title">
          Recent articles
        </h2>
        <ArticleList articleList={articleList.slice(0, 3)} />
      </section>
    </div>
  </main>
);
