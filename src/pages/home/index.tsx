import { profile, homeContent } from '../../content/index.ts';
import { TextLink } from '../../components/text-link/index.tsx';
import { ArticleList, ArticleTimeline, articleList } from '../../features/articles/index.ts';
import { LocalClock } from './components/local-clock/index.tsx';
import { VisitorLocation } from './components/visitor-location/index.tsx';

export const HomePage = () => (
  <main id="main" className="home-main">
    <h1 className={profile.introLineList.length ? 'home-intro' : 'sr-only'} tabIndex={-1}>
      {profile.introLineList.length === 0 && profile.siteName}
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
            {homeContent.recentTitle}
          </h2>
          <TextLink to="/archive">{homeContent.viewAllLabel}</TextLink>
        </div>
        <ArticleList articleList={articleList.slice(0, 3)} />
      </section>
      <div className="home-timeline">
        <ArticleTimeline articleList={articleList}>
          <div className="home-clock">
            <div className="location-clock">
              <LocalClock />
              <VisitorLocation />
            </div>
          </div>
        </ArticleTimeline>
      </div>
    </div>
  </main>
);
