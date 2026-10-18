export type PageId =
  | 'home'
  | 'about'
  | 'work'
  | 'uses'
  | 'links'
  | 'writing'
  | 'archive'
  | 'article'
  | 'not-found'
  | `page:${string}`;
export type RouteHandle = { page: PageId; title: string; description?: string };
