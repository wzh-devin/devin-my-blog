import { useEffect, useState } from 'react';
import type { ArticleCodeBlockNode } from '../../../features/articles/index.ts';

/** 展示构建结果并支持复制代码原文，SVG 作为图片隔离加载。 */
export const CodeBlock = ({ node }: { node: ArticleCodeBlockNode }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  useEffect(() => {
    if (copyStatus !== 'copied' && copyStatus !== 'error') return;
    const timeoutId = window.setTimeout(() => setCopyStatus('idle'), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  /** 仅在用户点击时写入原文，失败后保留重试入口。 */
  const handleCopy = async () => {
    if (copyStatus === 'copying') return;
    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(node.text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  };

  const copyLabel = {
    idle: '复制',
    copying: '复制中',
    copied: '已复制',
    error: '复制失败',
  }[copyStatus];
  const output = node.rendered;
  const codeToolbar = (
    <div className="code-toolbar">
      <span className="code-language">{node.lang?.trim().toLowerCase() || 'text'}</span>
      <button
        type="button"
        className="code-copy"
        aria-label={output?.kind === 'diagram' ? '复制图表源码' : '复制代码'}
        onClick={handleCopy}
        disabled={copyStatus === 'copying'}
        title={copyStatus === 'error' ? '复制失败，请重试' : undefined}
      >
        <output aria-live="polite">{copyLabel}</output>
      </button>
    </div>
  );
  if (output?.kind === 'diagram') {
    return (
      <figure className="article-diagram">
        {codeToolbar}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- 键盘用户需要聚焦并横向滚动图表。 */}
        <section tabIndex={0} className="diagram-canvas" aria-label="文章图表，可横向滚动">
          <img className="diagram-light" src={output.lightSrc} alt="文章图表" decoding="async" />
          <img className="diagram-dark" src={output.darkSrc} alt="文章图表" decoding="async" />
        </section>
      </figure>
    );
  }
  return (
    <>
      {output?.kind === 'error' && <p className="diagram-error">{output.message}</p>}
      <div className="article-code-block">
        {codeToolbar}
        <pre>
          {output?.kind === 'highlight' ? (
            // HTML 仅由构建端 highlight.js 转义生成，原始 Markdown HTML 仍被禁用。
            <code className="hljs" dangerouslySetInnerHTML={{ __html: output.html }} />
          ) : (
            <code>{node.text}</code>
          )}
        </pre>
      </div>
    </>
  );
};
