import { useLayoutEffect, useRef } from 'react';
import { useLocation, useMatches } from 'react-router';
import { profile } from '../../config/site.ts';
import type { Article } from '../../features/articles/index.ts';
import type { RouteHandle } from './types.ts';

/** 路由元数据驱动标题与描述；切页后恢复主标题或搜索输入的焦点。 */
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
      const target = location.state?.focusSearch ? '#article-search' : 'h1';
      document.querySelector<HTMLElement>(target)?.focus({ preventScroll: true });
    }
    previousLocation.current = location;
  }, [location, title, article]);
  return page;
};
