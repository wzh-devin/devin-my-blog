import { Link } from 'react-router';
import { PageHeading } from '../../components/page-heading/index.tsx';
import { Icon } from '../../components/icon/index.tsx';
import { profile } from '../../config/site.ts';

export const WorkPage = () => (
  <main id="main" className="content-page">
    <PageHeading number="03" title="Work" />
    <div className="page-content">
      <p className="intro-copy">一些正在构建的东西，从想法开始，在细节里慢慢成形。</p>
      <section aria-labelledby="project-title">
        <h2 className="section-title" id="project-title">
          Current project
        </h2>
        <ul className="article-list">
          <li>
            <div className="article-row-heading flex items-baseline justify-between">
              <Link className="article-title" to="/writing/build-a-quiet-blog">
                {profile.siteName}
                <Icon name="external" />
              </Link>
              <span className="mono muted">2026</span>
            </div>
            <div className="article-row-body">
              <p>这个小站。用 Vite、TypeScript 与 Tailwind CSS 搭建，记录技术、设计与日常思考。</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </main>
);
