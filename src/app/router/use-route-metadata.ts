import { useLayoutEffect, useRef } from 'react';
import { useLocation, useMatches } from 'react-router';
import { profile } from '../../config/site.ts';
import type { Article } from '../../features/articles/index.ts';
import type { RouteHandle } from './types.ts';

/** 路由元数据驱动标题与描述，切页后将焦点移至主标题。 */
export const useRouteMetadata = () => {
  const location = useLocation();
  const match = useMatches().at(-1)!;
  const handle = match.handle as RouteHandle;
  const article = handle.page === 'article' ? (match.loaderData as Article | null) : null;
  const page = handle.page === 'article' && !article ? 'not-found' : handle.page;
  const title = page === 'not-found' ? '404' : (article?.title ?? handle.title);
  const previousLocation = useRef(location);
  useLayoutEffect(() => {
    document.title = `${title} — ${profile.name}`;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content =
      article?.description ?? profile.description;
    if (previousLocation.current !== location) {
      document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    }
    previousLocation.current = location;
  }, [location, title, article]);
  return page;
};
