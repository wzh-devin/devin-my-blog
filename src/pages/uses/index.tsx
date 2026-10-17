import { PageHeading } from '../../components/page-heading/index.tsx';

const toolList = [
  ['Vite', '开发服务与静态构建。'],
  ['TypeScript', '让内容、路由和交互有清楚的类型约定。'],
  ['Tailwind CSS', '布局工具类与主题样式。'],
  ['Geist', '自托管的 Sans 与 Mono 字体。'],
];

export const UsesPage = () => (
  <main id="main" className="content-page">
    <PageHeading number="04" title="Uses" />
    <div className="page-content">
      <p className="intro-copy">让这个小站运行起来的工具。保持简单，把精力留给内容。</p>
      <section aria-labelledby="stack-title">
        <h2 className="section-title" id="stack-title">
          Built with
        </h2>
        <ul className="article-list">
          {toolList.map(([name, description]) => (
            <li key={name}>
              <div className="article-row-heading">
                <h3>{name}</h3>
              </div>
              <div className="article-row-body">
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </main>
);
