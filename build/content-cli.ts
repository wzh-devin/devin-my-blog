import { resolve } from 'node:path';
import { createContentOutput, writeContentOutput } from './content-output.ts';

const contentDirectory = resolve(process.env.BLOG_CONTENT_DIR ?? '../devin-blog-content');
const { index, assetList } = createContentOutput(contentDirectory);
writeContentOutput(resolve('content-dist'), assetList);
console.log(
  `已生成 ${index.content.articleList.length} 篇文章及站点配置，共 ${assetList.length} 个内容文件。`,
);
