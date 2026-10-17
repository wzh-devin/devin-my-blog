import { PageHeading } from '../../components/page-heading/index.tsx';
import { TextLink } from '../../components/text-link/index.tsx';

export const NotFoundPage = () => (
  <main id="main" className="content-page">
    <PageHeading number="404" title="A quiet dead end." />
    <div className="page-content">
      <p>这一页暂时不存在。回到熟悉的地方，再读点别的吧。</p>
      <TextLink to="/">Back home</TextLink>
    </div>
  </main>
);
