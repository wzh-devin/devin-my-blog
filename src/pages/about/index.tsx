import { useLoaderData } from 'react-router';
import type { MarkdownPage } from '../../content/index.ts';
import { ContentPage } from '../content/index.tsx';

export const AboutPage = () => <ContentPage page={useLoaderData<MarkdownPage>()} />;
