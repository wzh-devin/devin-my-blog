import { createBrowserRouter } from 'react-router';
import { routeList } from './routes.tsx';

export { routeList } from './routes.tsx';
export type { PageId } from './types.ts';
export const createAppRouter = () => createBrowserRouter(routeList);
