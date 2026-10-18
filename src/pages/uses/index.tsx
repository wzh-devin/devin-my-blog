import { usesContent } from '../../content/index.ts';
import { ListPage } from '../../content/components/list-page/index.tsx';

export const UsesPage = () => <ListPage content={usesContent} href="/uses" />;
