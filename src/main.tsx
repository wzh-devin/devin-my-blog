import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-600.css';
import '@fontsource/geist-mono/latin-400.css';
import './styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { createAppRouter } from './app/router/index.ts';

const router = createAppRouter();
const root = createRoot(document.querySelector('#app')!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    root.unmount();
    router.dispose();
  });
