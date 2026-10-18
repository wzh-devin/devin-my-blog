import type { ArticleImageNode } from '../../../features/articles/index.ts';

/** 独立配图使用原始文件名作为图注，保留替代文字和懒加载。 */
export const ArticleImage = ({ node }: { node: ArticleImageNode }) => (
  <figure className="article-image">
    <img
      src={node.target ?? undefined}
      alt={node.alt ?? ''}
      title={node.title}
      loading="lazy"
      decoding="async"
    />
    {node.fileName && <figcaption>{node.fileName}</figcaption>}
  </figure>
);
