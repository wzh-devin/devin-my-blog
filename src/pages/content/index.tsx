import { PageHeading } from '../../components/page-heading/index.tsx';
import { TextLink } from '../../components/text-link/index.tsx';
import { getNavigationNumber } from '../../config/navigation.ts';
import { MarkdownBody } from '../../content/components/markdown-body/index.tsx';
import type { MarkdownPage } from '../../content/index.ts';
import './content.css';

/** 独立页面共享文章渲染能力，同时沿用原页面外框与过渡。 */
export const ContentPage = ({ page }: { page: MarkdownPage }) => (
  <main id="main" className="content-page">
    <PageHeading number={getNavigationNumber(`/${page.slug}`)} title={page.title} />
    <div className="page-content">
      <div className="page-markdown">
        <MarkdownBody content={page} />
        {page.notice && <p className="sample-notice">{page.notice}</p>}
        {page.linkList.length > 0 && (
          <div className="page-link-list flex flex-wrap gap-x-6 gap-y-3">
            {page.linkList.map(({ label, href }, index) => (
              <TextLink key={`${href}:${index}`} to={href}>
                {label}
              </TextLink>
            ))}
          </div>
        )}
      </div>
    </div>
  </main>
);
