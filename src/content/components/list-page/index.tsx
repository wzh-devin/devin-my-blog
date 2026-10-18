import { PageHeading } from '../../../components/page-heading/index.tsx';
import { getNavigationNumber } from '../../../config/navigation.ts';
import type { ListPageContent } from '../../types.ts';
import { EntryList } from '../entry-list/index.tsx';

/** 三个列表页面共享外框、分组和条目，只有配置内容不同。 */
export const ListPage = ({ content, href }: { content: ListPageContent; href: string }) => (
  <main id="main" className="content-page">
    <PageHeading number={getNavigationNumber(href)} title={content.title} />
    <div className="page-content">
      {content.introduction && <p className="intro-copy">{content.introduction}</p>}
      {content.sectionList.map(({ title, entryList }, index) => (
        <section key={`${title}:${index}`} aria-labelledby={`list-section-${index}`}>
          <h2 className="section-title" id={`list-section-${index}`}>
            {title}
          </h2>
          <EntryList entryList={entryList} />
        </section>
      ))}
    </div>
  </main>
);
