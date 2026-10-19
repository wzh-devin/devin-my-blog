import { PageHeading } from '../../../components/page-heading/index.tsx';

export const ContentLoadError = () => (
  <main id="main" className="content-page">
    <PageHeading title="内容暂时无法加载" />
    <div className="page-content" role="alert">
      <p>请稍后重试。</p>
      <button className="text-link" type="button" onClick={() => window.location.reload()}>
        重新加载 ↗
      </button>
    </div>
  </main>
);
