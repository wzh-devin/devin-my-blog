import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { useArticleSearch } from '../features/articles/index.ts';
import { useTheme } from '../features/theme/index.ts';
import { SiteHeader } from './layout/site-header/index.tsx';
import { SiteMenu, useSiteMenu } from './layout/site-menu/index.tsx';
import { AmbientLight } from './layout/ambient-light/index.tsx';
import { useRouteMetadata } from './router/use-route-metadata.ts';

export type AppOutletContext = {
  search: ReturnType<typeof useArticleSearch>;
};

/** 根布局保持共享状态，子页面由 React Router Outlet 渲染。 */
export const App = () => {
  const location = useLocation();
  const menu = useSiteMenu(location);
  const page = useRouteMetadata();
  const { theme, cycleTheme } = useTheme();
  const search = useArticleSearch();
  useEffect(() => {
    const timeout = setTimeout(() => document.body.classList.add('animate'), 500);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      <AmbientLight />
      <SiteHeader
        theme={theme}
        onCycleTheme={cycleTheme}
        menuOpen={menu.isOpen}
        onMenuOpen={menu.openMenu}
      />
      <Outlet context={{ search } satisfies AppOutletContext} />
      <SiteMenu page={page} menu={menu} />
      <ScrollRestoration />
    </>
  );
};
