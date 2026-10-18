import { pageList } from '../../content/index.ts';
import { ContentPage } from '../content/index.tsx';

export const AboutPage = () => (
  <ContentPage page={pageList.find((page) => page.slug === 'about')!} />
);
