import type { AnchorHTMLAttributes } from 'react';
import { astToJSX, RuleType } from 'markdown-to-jsx/react';
import { Link } from 'react-router';
import type {
  Article,
  ArticleCodeBlockNode,
  ArticleImageNode,
} from '../../../features/articles/index.ts';
import { CodeBlock } from '../code-block/index.tsx';
import { ArticleImage } from '../article-image/index.tsx';

/** Markdown 站内页面链接复用 React Router，锚点与外部链接保持原生行为。 */
const ArticleLink = ({ href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) =>
  href?.startsWith('/') && !href.startsWith('//') ? (
    <Link to={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );

/** 渲染构建阶段解析的 Markdown，避免拼接 HTML 或重新解析正文。 */
export const MarkdownBody = ({ content }: { content: Pick<Article, 'slug' | 'nodeList'> }) => (
  <div className="article-body">
    {astToJSX(content.nodeList, {
      disableParsingRawHTML: true,
      renderRule: (next, node, _renderChildren, state) => {
        if (node.type === RuleType.codeBlock) {
          return (
            <CodeBlock key={`${content.slug}:${state.key}`} node={node as ArticleCodeBlockNode} />
          );
        }
        if (
          node.type === RuleType.paragraph &&
          node.children.length === 1 &&
          node.children[0].type === RuleType.image
        ) {
          return <ArticleImage key={state.key} node={node.children[0] as ArticleImageNode} />;
        }
        return next();
      },
      overrides: {
        a: { component: ArticleLink },
        img: { props: { loading: 'lazy', decoding: 'async' } },
      },
    })}
  </div>
);
