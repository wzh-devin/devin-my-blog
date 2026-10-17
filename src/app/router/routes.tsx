import {
  useLoaderData,
  useOutletContext,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router';
import { App, type AppOutletContext } from '../app.tsx';
import { navigationList } from '../../config/navigation.ts';
import { profile } from '../../config/site.ts';
import { HomePage } from '../../pages/home/index.tsx';
import { AboutPage } from '../../pages/about/index.tsx';
import { WorkPage } from '../../pages/work/index.tsx';
import { UsesPage } from '../../pages/uses/index.tsx';
import { WritingPage } from '../../pages/writing/index.tsx';
import { ArchivePage } from '../../pages/archive/index.tsx';
import { ArticlePage } from '../../pages/article/index.tsx';
import { NotFoundPage } from '../../pages/not-found/index.tsx';
import { articleList, type Article } from '../../features/articles/index.ts';

const ArchiveRoute = () => <ArchivePage search={useOutletContext<AppOutletContext>().search} />;
const ArticleRoute = () => {
  const article = useLoaderData<Article | null>();
  return article ? <ArticlePage article={article} /> : <NotFoundPage />;
};
const pageComponentMap = {
  home: HomePage,
  about: AboutPage,
  work: WorkPage,
  uses: UsesPage,
  writing: WritingPage,
};

/** 文章标识由 React Router 解码，缺失文章使用同一套 404 页面。 */
const loadArticle = ({ params }: LoaderFunctionArgs) =>
  articleList.find((article) => article.slug === params.slug) ?? null;

export const routeList: RouteObject[] = [
  {
    id: 'root',
    path: '/',
    Component: App,
    children: [
      ...navigationList.map(({ href, route, label }) => ({
        id: route,
        path: href,
        Component: pageComponentMap[route],
        handle: {
          page: route,
          title: route === 'home' ? profile.siteName : label,
        },
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
        Component: ArticleRoute,
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
