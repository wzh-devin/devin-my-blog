export type ArticleSection = {
  heading: string;
  paragraphs: string[];
  code?: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: '开发' | '设计' | '随想';
  date: string;
  readingMinutes: number;
  sections: ArticleSection[];
};

export const profile = {
  name: 'Devin',
  siteName: 'oh, my blog.',
  description: '关于开发、设计，以及生活里那些微小的发现。',
  introLineList: ['开发者。记录关于代码、设计与生活的思考，', '把一路上的探索，慢慢写下来。'],
  timeZone: 'Asia/Shanghai',
};

// 示例内容集中维护；发布真实文章时替换此列表和页面上的示例提示。
export const articleList: Article[] = [
  {
    slug: 'a-place-to-write',
    title: '在互联网的角落，留一小块自己的地方',
    description: '不追赶信息流，也不急着给出答案。只是想有一个地方，慢慢记录自己的观察与思考。',
    category: '随想',
    date: '2026-10-16',
    readingMinutes: 3,
    sections: [
      { heading: '从一个很小的念头开始', paragraphs: ['我们每天都在浏览别人的想法。打开一个标签页，读到一段很好的文字，然后关掉，再打开下一个。信息不断流过，真正留下来的却不多。', '于是，想给自己留一个小小的地方。不需要时时更新，也不需要让每个人都喜欢。能放下一些尚未成形的想法、做过的小东西，以及生活里值得回头看一眼的瞬间，就已经很好。'] },
      { heading: '写下来，是另一种理解', paragraphs: ['一个想法在脑海里总是显得很清楚，直到尝试把它写成句子。哪里有跳跃，哪里还没想明白，文字会诚实地告诉你。', '记录的意义不一定是教会别人什么。有时只是为未来的自己留下一条线索：当时为什么这样选择，又在哪里改变了看法。'] },
      { heading: '让它慢慢生长', paragraphs: ['这个小站选择了一个很简单的开始：文字、留白，还有一点像午后窗边的光。把复杂的事情留给内容，让阅读本身轻一点。', '不急着把这里填满。今天写下一段，明天修正一个观点。等过一阵子回头看，也许这些细小的记录，会慢慢长成自己的样子。'] },
    ],
  },
  {
    slug: 'less-but-better',
    title: '好的界面，往往从做减法开始',
    description: '当每个元素都在争取注意力，真正重要的东西反而消失了。一些关于留白与克制的思考。',
    category: '设计',
    date: '2026-10-12',
    readingMinutes: 4,
    sections: [
      { heading: '先问：读者来这里做什么', paragraphs: ['打开一个博客，读者通常只想做两件事：找到一篇感兴趣的文章，然后读完它。页面的每个决定，都可以回到这个简单的问题。', '一张漂亮的卡片、一段滚动动画，都可能让设计更丰富。但如果它们打断了寻找与阅读，就值得重新考虑。'] },
      { heading: '留白也在组织信息', paragraphs: ['空白并不是剩下来的空间。标题与正文之间的距离，文章与文章之间的间隔，都在告诉读者：哪些内容属于一组，哪些可以稍后再看。', '与其为每一组内容加一个边框，不如先试试拉开它们的距离。层级有时只需要字号、颜色和间距就能建立。'] },
      { heading: '减少选择，不减少能力', paragraphs: ['克制不是让功能难以找到，而是让重要的动作自然出现。把搜索放在文章列表，把目录放在阅读页，把不常用的主题收进一个小面板。', '当界面退后一步，内容就能走到前面。让读者不必研究页面，也能找到想去的地方，这样的简单才有意义。'] },
    ],
  },
  {
    slug: 'typescript-at-the-boundary',
    title: 'TypeScript 的安全感，应该从边界开始',
    description: '类型可以帮我们表达约定，但无法替运行时做保证。从一个小例子聊聊数据校验。',
    category: '开发',
    date: '2026-10-08',
    readingMinutes: 5,
    sections: [
      { heading: '类型断言不是校验', paragraphs: ['从接口拿到一段 JSON，给它写上类型，并不会改变数据本身。类型检查发生在构建时，而网络响应、地址参数和浏览器存储，发生在运行时。', '当数据跨过这些边界，先把它看作 unknown，通常比直接断言为某个业务类型更诚实。'] },
      { heading: '让入口承担校验', paragraphs: ['如果允许的值只有几种，就从这几种值中查找，而不是把任何字符串都当成合法选项。这样校验和业务规则能放在同一个地方。'], code: "const themes = ['day', 'sunset', 'night'] as const;\ntype Theme = (typeof themes)[number];\n\nconst isTheme = (value: unknown): value is Theme =>\n  themes.some(theme => theme === value);" },
      { heading: '在内部保持简单', paragraphs: ['边界完成校验后，内部代码就可以信任明确的类型，不必在每个调用方重复检查。同一个约定，应该有一个清楚的来源。', '校验的复杂度跟着数据的复杂度走。小型枚举可以直接判断；嵌套的外部协议，才可能需要专门的校验工具。先解决眼前真实存在的问题。'] },
    ],
  },
  {
    slug: 'small-tools',
    title: '小工具，大多数时候已经足够',
    description: '比起构建一套完美系统，我更喜欢先做一个刚好解决眼前问题的小工具。',
    category: '开发',
    date: '2026-09-26',
    readingMinutes: 3,
    sections: [
      { heading: '从具体的问题出发', paragraphs: ['当我们反复做一件小事时，很容易开始想象一套完整的系统。但真正让人省下时间的，可能只是一段脚本、一个快捷键，或一个足够清楚的页面。', '先写下问题发生的场景，再找最短的路径。具体到“每周整理一次文件”，比“做一个知识管理平台”更容易开始，也更容易判断有没有用。'] },
      { heading: '复杂度也是成本', paragraphs: ['工具越大，需要维护的东西越多。依赖升级、配置、异常状态，都会消耗原本想要省下的时间。', '功能少一些，只要能可靠完成核心任务，就值得保留。等新的需求真正出现，再决定是否需要增加复杂度。'] },
      { heading: '完成比完美更有反馈', paragraphs: ['一个可以运行的小工具，会告诉你接下来该做什么。哪些操作经常发生，哪些设想从未用到，都可以在真实使用里看见。', '把东西做小，是为了更快遇到真实的问题。'] },
    ],
  },
  {
    slug: 'walk-without-headphones',
    title: '偶尔，散步的时候不戴耳机',
    description: '给输入按一个暂停键，让注意力回到正在经过的街道。',
    category: '随想',
    date: '2026-09-18',
    readingMinutes: 2,
    sections: [
      { heading: '把输入关小一点', paragraphs: ['播客、音乐、消息，几乎填满了所有空隙。等电梯的时候，走向地铁的时候，连一段很短的路，也习惯找些内容陪着。', '有时可以试着把耳机放回口袋。刚开始会觉得安静得有些不习惯，后来会听见脚步、树叶，还有不远处一间店铺开门的声音。'] },
      { heading: '不必每一分钟都有收获', paragraphs: ['散步可以没有目的，空闲也不必马上被填满。注意到今天的光和昨天有一点不同，就已经是一件足够具体的事。', '暂时没有输入的时候，之前读过、想过的东西，反而有了慢慢连接起来的空间。'] },
    ],
  },
  {
    slug: 'build-a-quiet-blog',
    title: '用简单的技术，搭一个安静的博客',
    description: '从静态内容开始，把精力留给排版、阅读体验和真正想写下来的东西。',
    category: '开发',
    date: '2026-09-06',
    readingMinutes: 4,
    sections: [
      { heading: '先让一篇文章可以被阅读', paragraphs: ['一个个人博客的最小版本，需要一篇文章、一张列表，以及可以从列表走进文章的链接。先把这条路径做好，再讨论更多能力。', '静态内容很适合作为开始。文章随代码管理，部署时生成资源，读者不需要等待数据库响应。'] },
      { heading: '用原生能力解决小问题', paragraphs: ['浏览器已经提供了许多可以直接使用的能力：History API 管理地址，dialog 管理对话框，CSS 变量管理主题。', '对于一个规模很小的博客，不必在每个问题面前都先引入一个库。清楚的结构和稳定的约定，往往比抽象层更有帮助。'] },
      { heading: '把时间留给内容', paragraphs: ['技术选择的目的，是让记录这件事持续下去。当需要在线编辑、多人协作或评论审核时，再引入服务端，也来得及。', '在那之前，选择自己理解、能够维护的工具，然后开始写第一篇。'] },
    ],
  },
];

export const categoryList = ['全部', '开发', '设计', '随想'] as const;
export type Category = (typeof categoryList)[number];

/** 按分类与关键词筛选文章；关键词只匹配标题、摘要和分类，避免正文噪声。 */
export const filterArticles = (query: string, category: Category): Article[] => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return articleList.filter(article =>
    (category === '全部' || article.category === category) &&
    `${article.title} ${article.description} ${article.category}`.toLocaleLowerCase().includes(normalizedQuery),
  );
};

export type Route = { page: 'home' | 'writing' | 'archive' | 'about' | 'work' | 'uses' | 'not-found' } | { page: 'article'; article: Article };

/** URL 只解析已知路由与文章，未知或损坏的地址进入 404。 */
export const resolveRoute = (pathname: string): Route => {
  let path: string;
  try { path = decodeURIComponent(pathname).replace(/\/+$/, '') || '/'; }
  catch { return { page: 'not-found' }; }
  if (path === '/') return { page: 'home' };
  if (path === '/writing') return { page: 'writing' };
  if (path === '/about') return { page: 'about' };
  if (path === '/archive') return { page: 'archive' };
  if (path === '/work') return { page: 'work' };
  if (path === '/uses') return { page: 'uses' };
  const article = articleList.find(article => path === `/writing/${article.slug}`);
  return article ? { page: 'article', article } : { page: 'not-found' };
};

/** 所有内容在插入 HTML 前转义，避免文章或搜索输入变成可执行标记。 */
export const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!));

export const themeList = [
  { id: 'dawn', name: 'Dawn', color: '#64687f', dark: true },
  { id: 'sunrise', name: 'Sunrise', color: '#afb4c3', dark: false },
  { id: 'day', name: 'Day', color: '#fffdfa', dark: false },
  { id: 'sunset', name: 'Sunset', color: '#f3c692', dark: false },
  { id: 'dusk', name: 'Dusk', color: '#e2893f', dark: true },
  { id: 'night', name: 'Night', color: '#0f131c', dark: true },
] as const;
export type ThemeId = (typeof themeList)[number]['id'];

export const isTheme = (value: unknown): value is ThemeId => themeList.some(theme => theme.id === value);

/** 用同一个顺序驱动按钮与 T 快捷键，保证六个时段循环后回到起点。 */
export const nextTheme = (theme: ThemeId): ThemeId => themeList[(themeList.findIndex(value => value.id === theme) + 1) % themeList.length].id;
