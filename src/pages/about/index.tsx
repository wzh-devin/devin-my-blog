import { PageHeading } from '../../components/page-heading/index.tsx';
import { TextLink } from '../../components/text-link/index.tsx';

export const AboutPage = () => (
  <main id="main" className="content-page">
    <PageHeading number="02" title="About" />
    <div className="page-content">
      <div className="intro-copy">
        <p>写代码，也写一些文字。对如何把东西做好，始终保持好奇。</p>
        <p>
          这个博客用来记录开发中的思考、设计里的小细节，以及日常生活中偶然发现的美好。不追逐热点，也不急着给出标准答案。
        </p>
      </div>
      <section className="intro-copy">
        <h2 className="section-title">A little space on the internet</h2>
        <p>希望这里像一张靠窗的书桌：简单、安静，有一点阳光。打开一篇文章，就能安心读一会儿。</p>
        <p>
          比起完整的结论，更想保留探索的过程。那些想明白的、还没想明白的，都可以在这里慢慢展开。
        </p>
        <p className="sample-notice">这里使用示例署名和介绍，正式使用时请替换为你自己的故事。</p>
        <TextLink to="/writing">Explore my writing</TextLink>
      </section>
    </div>
  </main>
);
