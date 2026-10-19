import type { ArticleSummary } from '../../model/index.ts';
import { featuredArticleList } from '../../data.ts';
import type { RadialTimelineItem } from '../../../../components/radial-timeline/index.tsx';

export interface ArticleTimelineItem extends RadialTimelineItem {
  article: ArticleSummary;
}

// 编辑排版保留一段无标签的弧线；角度不表示日期间距，最多展示六篇精选。
const curatedAngleList = [0, 54, 156, 237, 282, 321];

/** 将精选引用按发布日期顺时针排列，忽略已移除的文章。
 * @param articleList 已发布文章，日期格式为 YYYY-MM-DD。
 * @returns 复用文章内容、采用非等距排版的精选节点。
 */
export const createArticleTimelineList = (
  articleList: readonly ArticleSummary[],
): ArticleTimelineItem[] =>
  featuredArticleList
    .flatMap(({ slug, shortTitle }) => {
      const article = articleList.find((article) => article.slug === slug);
      return article ? [{ article, shortTitle }] : [];
    })
    .sort((a, b) => a.article.date.localeCompare(b.article.date))
    .slice(0, curatedAngleList.length)
    .map(({ article, shortTitle }, index) => ({
      id: article.slug,
      title: shortTitle,
      subtitle: article.date.slice(0, 7).replace('-', '.'),
      detailTitle: article.title,
      angle: curatedAngleList[index],
      article,
    }));
