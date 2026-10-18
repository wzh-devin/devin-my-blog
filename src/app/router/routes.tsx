import {
  useLoaderData,
  useOutletContext,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router';
import { App, type AppOutletContext } from '../app.tsx';
import {
  pageList,
  workContent,
  usesContent,
  linksContent,
  type MarkdownPage,
} from '../../content/index.ts';
import { profile } from '../../config/site.ts';
import { HomePage } from '../../pages/home/index.tsx';
import { WorkPage } from '../../pages/work/index.tsx';
import { LinksPage } from '../../pages/links/index.tsx';
import { UsesPage } from '../../pages/uses/index.tsx';
import { WritingPage } from '../../pages/writing/index.tsx';
import { ArchivePage } from '../../pages/archive/index.tsx';
import { NotFoundPage } from '../../pages/not-found/index.tsx';
import { articleList, type Article } from '../../features/articles/index.ts';

const ArchiveRoute = () => <ArchivePage search={useOutletContext<AppOutletContext>().search} />;
/** 按文章路由加载 Markdown 渲染器，首页无需加载完整正文工具链。 */
const loadArticleRoute = async () => {
  const { ArticlePage } = await import('../../pages/article/index.tsx');
  const ArticleRoute = () => {
    const article = useLoaderData<Article | null>();
    return article ? <ArticlePage article={article} /> : <NotFoundPage />;
  };
  return { Component: ArticleRoute };
};
/** 独立 Markdown 页同样按需加载，首页不承担正文渲染器体积。 */
const loadContentRoute = async (page: MarkdownPage) => {
  const { ContentPage } = await import('../../pages/content/index.tsx');
  return { Component: () => <ContentPage page={page} /> };
};
const aboutPage = pageList.find((page) => page.slug === 'about')!;
const systemPageList = [
  { route: 'home', Component: HomePage, title: profile.siteName },
  { route: 'work', Component: WorkPage, title: workContent.title },
  { route: 'uses', Component: UsesPage, title: usesContent.title },
  { route: 'links', Component: LinksPage, title: linksContent.title },
  { route: 'writing', Component: WritingPage, title: 'Writing' },
];

/** 文章标识由 React Router 解码，缺失文章使用同一套 404 页面。 */
const loadArticle = ({ params }: LoaderFunctionArgs) =>
  articleList.find((article) => article.slug === params.slug) ?? null;

export const routeList: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    Component: App,
    // 首屏路由加载期间保留背景，正文仍由原有入场动画展示。
    HydrateFallback: () => null,
    children: [
      ...systemPageList.map(({ route, Component, title }) => ({
        id: route,
        path: route === 'home' ? '/' : route,
        Component,
        handle: { page: route, title },
      })),
      {
        id: 'about',
        path: 'about',
        lazy: async () => ({ Component: (await import('../../pages/about/index.tsx')).AboutPage }),
        handle: { page: 'about', title: aboutPage.title, description: aboutPage.description },
      },
      ...pageList
        .filter((page) => page.slug !== 'about')
        .map((page) => ({
          id: `page:${page.slug}`,
          path: page.slug,
          lazy: () => loadContentRoute(page),
          handle: { page: `page:${page.slug}`, title: page.title, description: page.description },
        })),
      {
        id: 'archive',
        path: 'archive',
        Component: ArchiveRoute,
        handle: { page: 'archive', title: 'All articles' },
      },
      {
        id: 'article',
        path: 'writing/:slug',
        loader: loadArticle,
        lazy: loadArticleRoute,
        handle: { page: 'article', title: '' },
      },
      {
        id: 'not-found',
        path: '*',
        Component: NotFoundPage,
        handle: { page: 'not-found', title: '404' },
      },
    ],
  },
];
