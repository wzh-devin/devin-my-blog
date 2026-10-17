import { profile } from '../../config/site.ts';
import { TextLink } from '../../components/text-link/index.tsx';
import { ArticleList, ArticleTimeline, articleList } from '../../features/articles/index.ts';
import { LocalClock } from './components/local-clock/index.tsx';

export const HomePage = () => (
  <main id="main" className="home-main">
    <h1 className="home-intro" tabIndex={-1}>
      {profile.introLineList.map((line, index) => (
        <span className="intro-line" key={index}>
          <span className="intro-text">{line}</span>
        </span>
      ))}
    </h1>
    <div className="home-content">
      <section className="home-articles" aria-labelledby="home-articles-title">
        <div className="home-articles-header flex items-baseline justify-between">
          <h2 id="home-articles-title" className="section-title">
            最近文章
          </h2>
          <TextLink to="/archive">查看全部</TextLink>
        </div>
        <ArticleList articleList={articleList.slice(0, 3)} />
      </section>
      <div className="home-timeline">
        <ArticleTimeline articleList={articleList}>
          <div className="home-clock">
            <div className="small-label">(Local time)</div>
            <div className="location-clock">
              <LocalClock />
              <span>UTC+08:00</span>
            </div>
          </div>
        </ArticleTimeline>
      </div>
    </div>
  </main>
);
