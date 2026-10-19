import type { Plugin } from 'vite';

/** 预取首页必需的路由代码，仍在内容索引校验通过后才执行模块。 */
export const preloadRouterPlugin = (): Plugin => {
  let base = '/';
  return {
    name: 'preload-router',
    configResolved: (config) => {
      base = config.base;
    },
    transformIndexHtml: {
      order: 'post',
      handler: (_html, context) => {
        const routerChunk = Object.values(context.bundle ?? {}).find(
          (entry) =>
            entry.type === 'chunk' && entry.facadeModuleId?.endsWith('/src/app/router/index.ts'),
        );
        if (context.bundle && routerChunk?.type !== 'chunk') return [];
        const fileList =
          routerChunk?.type === 'chunk'
            ? [
                routerChunk.fileName,
                ...routerChunk.imports,
                ...(routerChunk.viteMetadata?.importedCss ?? []),
              ]
            : ['src/app/router/index.ts'];
        return fileList.map((fileName) => ({
          tag: 'link',
          attrs: {
            rel: fileName.endsWith('.css') ? 'stylesheet' : 'modulepreload',
            crossorigin: '',
            href: `${base}${fileName}`,
          },
          injectTo: 'head',
        }));
      },
    },
  };
};
