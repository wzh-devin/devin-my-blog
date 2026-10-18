import { isAbsolute, join, relative, sep } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { readBlogContent } from './blog-content.ts';

const moduleId = 'virtual:blog-content';
const resolvedModuleId = `\0${moduleId}`;

/** 将本地内容仓库提供为 Vite 模块，并复用同一批图片供开发与构建使用。 */
export const blogContentPlugin = (contentDirectory: string): Plugin => {
  let config: ResolvedConfig;
  let snapshot: ReturnType<typeof readBlogContent> | undefined;
  const getSnapshot = () => (snapshot ??= readBlogContent(contentDirectory, config.base));
  return {
    name: 'blog-content',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      snapshot = undefined;
      const { assetList } = getSnapshot();
      if (config.command === 'build') {
        for (const asset of assetList) {
          this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source });
        }
      }
    },
    resolveId(id) {
      if (id === moduleId) return resolvedModuleId;
    },
    load(id) {
      if (id !== resolvedModuleId) return;
      return `const content = ${JSON.stringify(getSnapshot().content)};
        export const articleList = content.articleList;
        export const categoryList = content.categoryList;
        export const featuredArticleList = content.featuredArticleList;
        export const profile = content.profile;
        export const homeContent = content.homeContent;
        export const menuContent = content.menuContent;
        export const navigationList = content.navigationList;
        export const pageList = content.pageList;
        export const workContent = content.workContent;
        export const usesContent = content.usesContent;
        export const linksContent = content.linksContent;`;
    },
    transformIndexHtml(html) {
      const { profile } = getSnapshot().content;
      const escape = (value: string) =>
        value.replace(
          /[&<>"']/g,
          (character) =>
            ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
        );
      return html
        .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${escape(profile.siteName)}</title>`)
        .replace(
          /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?\s*>)/,
          (_match, start, end) => `${start}${escape(profile.description)}${end}`,
        );
    },
    configureServer(server) {
      const watchedDirectoryList = [
        join(contentDirectory, 'posts'),
        join(contentDirectory, 'config'),
        join(contentDirectory, 'pages'),
      ];
      // 从仓库根目录监听，确保启动后新建 pages 等目录也能被递归发现。
      server.watcher.add(contentDirectory);
      let reloadTimer: ReturnType<typeof setTimeout> | undefined;
      /** 合并正文、配置和配图的连续保存事件，再刷新共享内容模块。 */
      const handleContentChange = (_event: string, filePath: string) => {
        if (
          !watchedDirectoryList.some((directory) => {
            const relativePath = relative(directory, filePath);
            return (
              !isAbsolute(relativePath) &&
              relativePath !== '..' &&
              !relativePath.startsWith(`..${sep}`)
            );
          })
        )
          return;
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(() => {
          snapshot = undefined;
          const contentModule = server.moduleGraph.getModuleById(resolvedModuleId);
          if (contentModule) server.moduleGraph.invalidateModule(contentModule);
          server.ws.send({ type: 'full-reload' });
        }, 100);
      };
      server.watcher.on('all', handleContentChange);
      server.httpServer?.once('close', () => {
        clearTimeout(reloadTimer);
        server.watcher.off('all', handleContentChange);
      });
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith(`${config.base}content/`)) return next();
        try {
          const path = decodeURIComponent(request.url.split(/[?#]/)[0]).slice(config.base.length);
          const asset = getSnapshot().assetList.find((entry) => entry.fileName === path);
          if (!asset) {
            response.statusCode = 404;
            response.end('Not found');
            return;
          }
          response.setHeader('Content-Type', asset.mimeType);
          response.setHeader('Content-Length', asset.source.length);
          response.setHeader('Cache-Control', 'no-cache');
          response.setHeader('X-Content-Type-Options', 'nosniff');
          response.end(request.method === 'HEAD' ? undefined : asset.source);
        } catch (error) {
          next(error);
        }
      });
    },
  };
};
