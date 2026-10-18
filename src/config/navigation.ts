import { navigationList } from '../content/index.ts';
export { navigationList };

// 页面序号与可见菜单顺序一致，隐藏入口不影响路由。
export const getNavigationNumber = (href: string): string | undefined =>
  navigationList.find((item) => item.route === (href === '/' ? 'home' : href.slice(1)))?.number;
