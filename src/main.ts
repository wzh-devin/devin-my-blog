import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-600.css';
import '@fontsource/geist-mono/latin-400.css';
import './style.css';
import { articleList, categoryList, escapeHtml, filterArticles, isTheme, nextTheme, profile, resolveRoute, themeList, type Article, type Category, type ThemeId } from './blog.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const pathMap: Record<string, string> = { h: '/', a: '/about', w: '/work', u: '/uses', b: '/writing' };
let category: Category = '全部';
let query = '';
let showShortcuts = false;

const icon = (name: 'sun' | 'moon' | 'menu' | 'close' | 'external' | 'back' | 'search') => {
  const pathMap = {
    sun: '<circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon: '<path d="M19.8 14.2A8 8 0 0 1 9.8 4.1a8 8 0 1 0 10 10.1Z"/><path d="M17 3v4m-2-2h4"/>',
    menu: '<path d="M5 7h14M5 12h14M5 17h14"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    external: '<path d="M6 18 18 6M6 6h12v12"/>',
    back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  };
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${pathMap[name]}</svg>`;
};
const currentTheme = (): ThemeId => isTheme(document.documentElement.dataset.theme) ? document.documentElement.dataset.theme : 'day';
const shortcut = (key: string, side = 'left') => `<kbd class="shortcut-label shortcut-${side}" aria-hidden="true">${key}</kbd>`;
const brand = () => `<span class="shortcut-anchor brand-anchor"><a class="wordmark" href="/" data-nav aria-label="${escapeHtml(profile.siteName)} 首页">${escapeHtml(profile.siteName)}</a>${shortcut('H', 'right')}</span>`;
const textLink = (href: string, label: string) => `<a class="text-link" href="${href}" data-nav>${label}${icon('external')}</a>`;
const pageHeading = (number: string, title: string) => `<div class="page-heading"><span class="small-label">(${number})</span><div class="title-clip"><h1 tabindex="-1">${title}</h1></div></div>`;
const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: profile.timeZone }).format(new Date(`${date}T00:00:00+08:00`));

const header = () => {
  const theme = themeList.find(theme => theme.id === currentTheme())!;
  return `<header class="site-header flex items-center justify-between">${brand()}<div class="header-controls flex items-center"><span class="shortcut-anchor"><button class="utility-button theme-button" type="button" data-action="theme" aria-label="切换主题，当前 ${theme.name}" title="切换光影主题 (T)"><span id="theme-icon">${icon(theme.dark ? 'moon' : 'sun')}</span><span id="theme-label">${theme.name}</span></button>${shortcut('T')}</span><span class="shortcut-anchor"><button class="utility-button menu-trigger" type="button" data-action="menu-open" aria-haspopup="dialog" aria-controls="site-menu" aria-expanded="false">${icon('menu')}<span>Menu</span></button>${shortcut('M')}</span></div></header>`;
};
const home = () => `<main id="main" class="home-main"><h1 class="home-intro" tabindex="-1">${profile.introLineList.map(line => `<span class="intro-line"><span class="intro-text">${escapeHtml(line)}</span></span>`).join('')}</h1></main><footer class="home-footer flex flex-wrap items-end justify-between"><div><div class="small-label">(Local time)</div><div class="location-clock flex items-center"><span>UTC+08:00</span><span class="clock-rule" aria-hidden="true"></span><time class="local-clock" aria-live="off"></time></div></div><div><div class="small-label">(Keyboard navigation)</div><div class="keyboard-description">Press <button type="button" class="keyboard-toggle" data-action="shortcuts" aria-label="显示键盘快捷键" aria-pressed="${showShortcuts}"><kbd>C</kbd></button> for keyboard shortcuts</div></div></footer>`;
const articleRows = (articles: Article[]) => `<ul class="article-list">${articles.map(article => `<li><div class="article-row-heading flex items-baseline justify-between"><a class="article-title" href="/writing/${article.slug}" data-nav>${escapeHtml(article.title)}${icon('external')}</a><time datetime="${article.date}">${formatDate(article.date)}</time></div><div class="article-row-body"><p>${escapeHtml(article.description)}</p></div></li>`).join('')}</ul>`;
const writing = () => `<main id="main" class="content-page">${pageHeading('05', 'Writing')}<div class="page-content"><div class="intro-copy"><p>记录开发过程里的经验、设计中的观察，以及日常生活中值得留下的想法。关于技术，也关于技术之外。</p>${textLink('/archive', 'Read articles')}</div><section aria-labelledby="recent-title"><h2 id="recent-title" class="section-title">Recent articles</h2>${articleRows(articleList.slice(0, 3))}</section></div></main>`;
const archive = () => `<main id="main" class="content-page archive-page">${pageHeading('05', 'All articles')}<div class="page-content"><p class="intro-copy">把经历变成文字，把想法留在这里。</p><section aria-label="文章列表"><div class="writing-tools flex flex-wrap items-center justify-between"><div class="category-tabs flex" role="group" aria-label="按文章分类筛选">${categoryList.map(value => `<button type="button" data-category="${value}" aria-pressed="${category === value}">${value}</button>`).join('')}</div><label class="search-field flex items-center">${icon('search')}<span class="sr-only">搜索文章</span><input id="article-search" type="search" placeholder="搜索文章…" value="${escapeHtml(query)}" autocomplete="off" maxlength="100"><kbd>/</kbd></label></div><p id="search-status" class="sr-only" role="status" aria-live="polite"></p><div id="article-results"></div><p class="collection-note">共 <span id="article-count">0</span> 篇文字 <span>·</span> 持续记录中</p></section></div></main>`;
const about = () => `<main id="main" class="content-page">${pageHeading('02', 'About')}<div class="page-content"><div class="intro-copy"><p>写代码，也写一些文字。对如何把东西做好，始终保持好奇。</p><p>这个博客用来记录开发中的思考、设计里的小细节，以及日常生活中偶然发现的美好。不追逐热点，也不急着给出标准答案。</p></div><section class="intro-copy"><h2 class="section-title">A little space on the internet</h2><p>希望这里像一张靠窗的书桌：简单、安静，有一点阳光。打开一篇文章，就能安心读一会儿。</p><p>比起完整的结论，更想保留探索的过程。那些想明白的、还没想明白的，都可以在这里慢慢展开。</p><p class="sample-notice">这里使用示例署名和介绍，正式使用时请替换为你自己的故事。</p>${textLink('/writing', 'Explore my writing')}</section></div></main>`;
const work = () => `<main id="main" class="content-page">${pageHeading('03', 'Work')}<div class="page-content"><p class="intro-copy">一些正在构建的东西，从想法开始，在细节里慢慢成形。</p><section aria-labelledby="project-title"><h2 class="section-title" id="project-title">Current project</h2><ul class="article-list"><li><div class="article-row-heading flex items-baseline justify-between"><a class="article-title" href="/writing/build-a-quiet-blog" data-nav>Oh, my blog.${icon('external')}</a><span class="mono muted">2026</span></div><div class="article-row-body"><p>这个小站。用 Vite、TypeScript 与 Tailwind CSS 搭建，记录技术、设计与日常思考。</p></div></li></ul></section></div></main>`;
const uses = () => `<main id="main" class="content-page">${pageHeading('04', 'Uses')}<div class="page-content"><p class="intro-copy">让这个小站运行起来的工具。保持简单，把精力留给内容。</p><section aria-labelledby="stack-title"><h2 class="section-title" id="stack-title">Built with</h2><ul class="article-list">${[['Vite', '开发服务与静态构建。'], ['TypeScript', '让内容、路由和交互有清楚的类型约定。'], ['Tailwind CSS', '布局工具类与主题样式。'], ['Geist', '自托管的 Sans 与 Mono 字体。']].map(([name, description]) => `<li><div class="article-row-heading"><h3>${name}</h3></div><div class="article-row-body"><p>${description}</p></div></li>`).join('')}</ul></section></div></main>`;
const articlePage = (article: Article) => `<main id="main" class="content-page detail-page"><a class="back-link text-link" href="/archive" data-nav>${icon('back')} All articles</a><article><header class="article-header"><div class="detail-meta"><span>${article.category}</span><span>·</span><time datetime="${article.date}">${formatDate(article.date)}</time><span>·</span><span>${article.readingMinutes} 分钟阅读</span></div><h1 tabindex="-1">${escapeHtml(article.title)}</h1><p class="article-deck">${escapeHtml(article.description)}</p><div class="byline"><span>${profile.name}</span><span>示例文章</span></div></header><details class="table-of-contents"><summary>本文目录 <span>＋</span></summary><nav aria-label="文章目录"><ol>${article.sections.map((section, index) => `<li><a href="#section-${index}">${escapeHtml(section.heading)}</a></li>`).join('')}</ol></nav></details><div class="article-body">${article.sections.map((section, index) => `<section aria-labelledby="section-${index}"><h2 id="section-${index}">${escapeHtml(section.heading)}</h2>${section.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}${section.code ? `<pre><code>${escapeHtml(section.code)}</code></pre>` : ''}</section>`).join('')}</div><div class="article-end"><p>感谢你读到这里。</p>${textLink('/archive', 'Read something else')}</div></article></main>`;
const notFound = () => `<main id="main" class="content-page">${pageHeading('404', 'A quiet dead end.')}<div class="page-content"><p>这一页暂时不存在。回到熟悉的地方，再读点别的吧。</p>${textLink('/', 'Back home')}</div></main>`;
const menu = (page: string) => `<dialog id="site-menu" class="menu-overlay" aria-label="网站导航"><div class="menu-layout"><div class="menu-header flex items-center justify-between">${brand()}<span class="shortcut-anchor"><button class="utility-button" type="button" data-action="menu-close" aria-label="关闭菜单">${icon('close')}<span>Close</span></button>${shortcut('M')}</span></div><div class="menu-content"><div class="menu-grid"><nav aria-label="主要导航">${[['01', 'Home', '/', 'H', 'home'], ['02', 'About', '/about', 'A', 'about'], ['03', 'Work', '/work', 'W', 'work'], ['04', 'Uses', '/uses', 'U', 'uses'], ['05', 'Writing', '/writing', 'B', 'writing']].map(([number, label, href, key, route]) => `<div class="shortcut-anchor"><a class="menu-link" href="${href}" data-nav ${page === route || (route === 'writing' && ['archive', 'article'].includes(page)) ? 'aria-current="page"' : ''}><span class="small-label">(${number})</span><span class="menu-link-title">${label}</span></a>${shortcut(key)}</div>`).join('')}</nav><section class="menu-contact"><span class="small-label">(A little hello)</span><h2>Keep in touch</h2><p>这个小站记录关于开发、设计与日常的想法。你可以从一篇文字开始，慢慢认识这里。</p><div class="contact-links flex flex-wrap">${textLink('/writing', 'Writing')}${textLink('/about', 'About')}</div></section></div></div><footer class="menu-footer"><span class="small-label">(Last updated)</span><span class="mono muted">Copyright / ${new Date().getFullYear()}</span></footer></div></dialog>`;

/** 关闭与滚动锁同步收尾，避免延迟 close 事件影响快速再次打开。 */
const finishMenuClose = (dialog: HTMLDialogElement) => {
  dialog.classList.remove('is-closing');
  dialog.close();
  document.body.classList.remove('menu-is-open');
  document.querySelector('.menu-trigger')?.setAttribute('aria-expanded', 'false');
};

/** 原生 dialog 管理背景隔离与焦点；退出动画完成后再关闭。 */
const setMenu = (open: boolean) => {
  const dialog = document.querySelector<HTMLDialogElement>('#site-menu')!;
  if (open) {
    dialog.classList.remove('is-closing');
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('menu-is-open');
  } else if (dialog.open) {
    if (motionPreference.matches) finishMenuClose(dialog);
    else dialog.classList.add('is-closing');
  }
  document.querySelector('.menu-trigger')?.setAttribute('aria-expanded', String(open));
};
/** 只更新时钟文本，不重绘页面或打断当前焦点。 */
const updateClock = () => {
  const now = new Date();
  document.querySelectorAll<HTMLTimeElement>('.local-clock').forEach(clock => {
    clock.textContent = new Intl.DateTimeFormat('en-US', { timeZone: profile.timeZone, hour: 'numeric', minute: '2-digit', second: '2-digit' }).format(now);
    clock.dateTime = now.toISOString();
  });
};
/** 列表独立更新，保留搜索输入的焦点与光标。 */
const updateResults = () => {
  const results = document.querySelector('#article-results');
  if (!results) return;
  const articles = filterArticles(query, category);
  results.innerHTML = articles.length ? articleRows(articles) : `<div class="empty-state"><h2>暂时没有找到这篇文字。</h2><p>换个关键词，或者看看全部文章。</p><button type="button" class="text-link" data-action="reset-search">清除筛选 ${icon('external')}</button></div>`;
  document.querySelector('#article-count')!.textContent = String(articles.length);
  document.querySelector('#search-status')!.textContent = `找到 ${articles.length} 篇文章`;
  document.querySelectorAll<HTMLButtonElement>('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
};
/** 本地文章与页面共用原站式外框，导航后同步标题、滚动与焦点。 */
const render = (focus = false) => {
  const route = resolveRoute(location.pathname);
  const page = route.page;
  const content = page === 'home' ? home() : page === 'writing' ? writing() : page === 'archive' ? archive() : page === 'about' ? about() : page === 'work' ? work() : page === 'uses' ? uses() : page === 'article' ? articlePage(route.article) : notFound();
  document.body.classList.remove('menu-is-open');
  app.innerHTML = `${header()}${content}${menu(page)}`;
  const title = page === 'article' ? route.article.title : { home: '构建，思考，然后写下来。', writing: 'Writing', archive: 'All articles', about: 'About', work: 'Work', uses: 'Uses', 'not-found': '404' }[page];
  document.title = `${title} — ${profile.name}`;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = page === 'article' ? route.article.description : profile.description;
  updateClock();
  updateResults();
  if (focus) document.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
};
/** 保存历史滚动位置；直接访问旧文章链接保持兼容。 */
const navigate = (path: string) => {
  history.replaceState({ scrollY: window.scrollY }, '');
  history.pushState({ scrollY: 0 }, '', path);
  render(true);
  window.scrollTo({ top: 0, behavior: 'instant' });
};
/** 主题同时驱动文字、底色和光影；禁用存储时仍在当前会话生效。 */
const setTheme = (themeId: ThemeId) => {
  const theme = themeList.find(theme => theme.id === themeId)!;
  document.documentElement.dataset.theme = themeId;
  document.documentElement.classList.toggle('dark', theme.dark);
  try { localStorage.setItem('blog-theme', themeId); } catch { /* 保留当前会话的主题。 */ }
  document.querySelector('#theme-label')!.textContent = theme.name;
  document.querySelector('#theme-icon')!.innerHTML = icon(theme.dark ? 'moon' : 'sun');
  document.querySelector('.theme-button')!.setAttribute('aria-label', `切换主题，当前 ${theme.name}`);
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content = theme.color;
};
/** 显示原位快捷键标记，避免用说明弹窗打断页面。 */
const toggleShortcuts = () => {
  showShortcuts = !showShortcuts;
  document.documentElement.classList.toggle('show-shortcuts', showShortcuts);
  document.querySelector('[data-action="shortcuts"]')?.setAttribute('aria-pressed', String(showShortcuts));
};
/** 委托点击处理，让页面重绘后仍保持单份监听。 */
const handleClick = (event: MouseEvent) => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[data-nav]');
  if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) {
    event.preventDefault(); navigate(link.pathname); return;
  }
  const action = event.target.closest<HTMLElement>('[data-action]')?.dataset.action;
  if (action === 'theme') setTheme(nextTheme(currentTheme()));
  if (action === 'menu-open') setMenu(true);
  if (action === 'menu-close') setMenu(false);
  if (action === 'shortcuts') toggleShortcuts();
  const selected = event.target.closest<HTMLElement>('[data-category]')?.dataset.category;
  if (categoryList.some(value => value === selected)) { category = selected as Category; updateResults(); }
  if (action === 'reset-search') {
    query = ''; category = '全部';
    const input = document.querySelector<HTMLInputElement>('#article-search')!;
    input.value = ''; updateResults(); input.focus();
  }
};
/** 输入时不触发导航，保留浏览器组合键；M、Escape 可关闭菜单。 */
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat || event.isComposing) return;
  if (event.key === 'Escape') { setMenu(false); return; }
  if (event.target instanceof HTMLElement && (event.target.matches('input, textarea, select') || event.target.isContentEditable)) return;
  const key = event.key.toLowerCase();
  if (['h', 'a', 'w', 'u', 'b', 'm', 't', 'c', '/'].includes(key)) event.preventDefault();
  if (pathMap[key]) navigate(pathMap[key]);
  if (key === 'm') setMenu(!document.querySelector<HTMLDialogElement>('#site-menu')!.open);
  if (key === 't') setTheme(nextTheme(currentTheme()));
  if (key === 'c') toggleShortcuts();
  if (key === '/') {
    if (resolveRoute(location.pathname).page !== 'archive') navigate('/archive');
    document.querySelector<HTMLInputElement>('#article-search')?.focus();
  }
};
/** 减少动态时同时暂停 SVG SMIL 与 CSS 动画。 */
const updateMotionPreference = () => {
  const svg = document.querySelector<SVGSVGElement>('#wind-animation')!;
  if (motionPreference.matches) {
    svg.pauseAnimations();
    const closingMenu = document.querySelector<HTMLDialogElement>('.is-closing');
    if (closingMenu) finishMenuClose(closingMenu);
  } else svg.unpauseAnimations();
};

history.scrollRestoration = 'manual';
document.addEventListener('click', handleClick);
document.addEventListener('keydown', handleKeydown);
document.addEventListener('input', event => {
  if (event.target instanceof HTMLInputElement && event.target.id === 'article-search') { query = event.target.value; updateResults(); }
});
document.addEventListener('cancel', event => {
  if (event.target instanceof HTMLDialogElement) { event.preventDefault(); setMenu(false); }
}, true);
document.addEventListener('animationend', event => {
  if (event.target instanceof HTMLDialogElement && event.animationName === 'menu-collapse') finishMenuClose(event.target);
});
window.addEventListener('popstate', () => {
  render(true);
  requestAnimationFrame(() => window.scrollTo({ top: history.state?.scrollY ?? 0, behavior: 'instant' }));
});
motionPreference.addEventListener('change', updateMotionPreference);
render(); updateMotionPreference();
setInterval(updateClock, 1000);
setTimeout(() => document.body.classList.add('animate'), 500);
