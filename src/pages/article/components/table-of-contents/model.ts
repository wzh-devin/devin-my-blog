import type { Article } from '../../../../features/articles/index.ts';

export type HeadingItem = Article['headingList'][number] & { childList: HeadingItem[] };

/**
 * 将标题归入最近的较浅标题，跳级时不创建空父标题。
 * @param headingList 按正文顺序排列的标题。
 * @returns 按父子关系分组的根标题列表。
 */
export const createHeadingTreeList = (headingList: Article['headingList']): HeadingItem[] => {
  const rootList: HeadingItem[] = [];
  const ancestorList: HeadingItem[] = [];
  for (const heading of headingList) {
    const item: HeadingItem = { ...heading, childList: [] };
    while (ancestorList.length && ancestorList.at(-1)!.level >= item.level) ancestorList.pop();
    const parent = ancestorList.at(-1);
    (parent ? parent.childList : rootList).push(item);
    ancestorList.push(item);
  }
  return rootList;
};
