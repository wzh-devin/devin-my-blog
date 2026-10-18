import { workContent } from '../../content/index.ts';
import { ListPage } from '../../content/components/list-page/index.tsx';

export const WorkPage = () => <ListPage content={workContent} href="/work" />;
