import { linksContent } from '../../content/index.ts';
import { ListPage } from '../../content/components/list-page/index.tsx';

export const LinksPage = () => <ListPage content={linksContent} href="/links" />;
