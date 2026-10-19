import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { blogContentPlugin } from './build/blog-content-plugin.ts';
import { preloadRouterPlugin } from './build/preload-router-plugin.ts';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectDirectory, 'BLOG_');
  const contentDirectory = resolve(
    projectDirectory,
    process.env.BLOG_CONTENT_DIR ?? env.BLOG_CONTENT_DIR ?? '../devin-blog-content',
  );
  return {
    plugins: [blogContentPlugin(contentDirectory), preloadRouterPlugin(), react(), tailwindcss()],
  };
});
