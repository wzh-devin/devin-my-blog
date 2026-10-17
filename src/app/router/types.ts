import type { navigationList } from '../../config/navigation.ts';

export type PageId = (typeof navigationList)[number]['route'] | 'archive' | 'article' | 'not-found';
export type RouteHandle = { page: PageId; title: string };
