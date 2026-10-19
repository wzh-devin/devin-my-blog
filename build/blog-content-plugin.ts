import type { IncomingMessage, ServerResponse } from 'node:http';
import { isAbsolute, join, relative, sep } from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { createContentOutput } from './content-output.ts';

/** 仅在开发时提供独立内容端点；生产网站构建不读取内容仓库。 */
export const blogContentPlugin = (contentDirectory: string): Plugin => {
  let config: ResolvedConfig;
  let snapshot: ReturnType<typeof createContentOutput> | undefined;
  const getSnapshot = () => (snapshot ??= createContentOutput(contentDirectory, config.base));
  /** 开发和本地预览共用内容端点，不把内容编入网站产物。 */
  const serveContent = (
    request: IncomingMessage,
    response: ServerResponse,
    next: (error?: unknown) => void,
  ) => {
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
  };
  return {
    name: 'blog-content',
    apply: 'serve',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveContent);
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
          server.ws.send({ type: 'full-reload' });
        }, 100);
      };
      server.watcher.on('all', handleContentChange);
      server.httpServer?.once('close', () => {
        clearTimeout(reloadTimer);
        server.watcher.off('all', handleContentChange);
      });
      server.middlewares.use(serveContent);
    },
  };
};
