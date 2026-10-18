import type { Article } from '../../../../features/articles/index.ts';
import { createHeadingTreeList, type HeadingItem } from './model.ts';

// 用嵌套列表保留目录的真实层级和原始锚点。
const HeadingList = ({ headingList }: { headingList: HeadingItem[] }) => (
  <ol>
    {headingList.map((heading) => (
      <li key={heading.id}>
        <a href={`#${heading.id}`}>{heading.title}</a>
        {heading.childList.length > 0 && <HeadingList headingList={heading.childList} />}
      </li>
    ))}
  </ol>
);

/** 沿用原生目录展开交互，按正文标题层级展示嵌套导航。 */
export const TableOfContents = ({ headingList }: { headingList: Article['headingList'] }) => {
  if (headingList.length === 0) return null;
  return (
    <details className="table-of-contents">
      <summary>
        本文目录 <span>＋</span>
      </summary>
      <nav aria-label="文章目录">
        <HeadingList headingList={createHeadingTreeList(headingList)} />
      </nav>
    </details>
  );
};
