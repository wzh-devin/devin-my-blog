import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-600.css';
import '@fontsource/geist-mono/latin-400.css';
import './styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { loadContentIndex } from './content/model/index.ts';
import { ContentLoadError } from './content/components/content-load-error/index.tsx';

const root = createRoot(document.querySelector('#app')!);
let router: ReturnType<typeof import('./app/router/index.ts').createAppRouter> | undefined;
let isDisposed = false;

/** 配置就绪后才创建页面路由，避免把某一版文章编译进网页程序。 */
const startApp = async () => {
  try {
    await loadContentIndex();
    const { createAppRouter } = await import('./app/router/index.ts');
    if (isDisposed) return;
    router = createAppRouter();
    root.render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    );
  } catch {
    if (!isDisposed) root.render(<ContentLoadError />);
  }
};
void startApp();
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    isDisposed = true;
    root.unmount();
    router?.dispose();
  });
