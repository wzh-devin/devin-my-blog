import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ContentLink, MarkdownPage, SiteContent } from '../src/content/types.ts';
import { fail, readJson, readMarkdown, requireRecord, requireText } from './content-utils.ts';

const reservedSlugSet = new Set([
  'home',
  'work',
  'uses',
  'writing',
  'archive',
  'content',
  'assets',
]);

/** 字段拼错时明确报错，避免误以为配置已生效。 */
const readRecord = (value: unknown, filePath: string, fieldList: string[]) => {
  const record = requireRecord(value, filePath);
  for (const field of Object.keys(record)) {
    if (!fieldList.includes(field)) fail(filePath, `未知字段：${field}`);
  }
  return record;
};

// 允许提示文字显式清空，必填标题等仍要求非空。
const readTextField = (
  record: Record<string, unknown>,
  field: string,
  filePath: string,
  allowEmpty = false,
): string => {
  if (allowEmpty && typeof record[field] === 'string') return record[field].trim();
  return requireText(record[field], filePath, field);
};

/** 配置数组直接来自内容仓库，显式 [] 表示清空。 */
const readList = (value: unknown, filePath: string): unknown[] => {
  if (!Array.isArray(value)) return fail(filePath, '需要一个数组');
  return value;
};

/** 校验配置链接；站内路径须对应本次构建中实际存在的页面或文章。 */
const readHref = (value: unknown, filePath: string, routeSet: ReadonlySet<string>): string => {
  const href = requireText(value, filePath, 'href');
  // eslint-disable-next-line no-control-regex -- 配置地址拒绝控制字符及空白，防止 URL 解析器静默归一化。
  if (/[\u0000-\u0020\u007f\\]/u.test(href) || href.startsWith('//'))
    return fail(filePath, `无效链接：${href}`);
  if (href.startsWith('/')) {
    let pathname: string;
    try {
      pathname =
        decodeURIComponent(new URL(href, 'https://blog.invalid').pathname).replace(/\/$/, '') ||
        '/';
    } catch {
      return fail(filePath, `无效链接：${href}`);
    }
    if (!routeSet.has(pathname)) return fail(filePath, `站内链接没有对应页面：${href}`);
    return href;
  }
  if (/^https?:\/\//i.test(href)) {
    try {
      new URL(href);
      return href;
    } catch {
      return fail(filePath, `无效链接：${href}`);
    }
  }
  if (/^(mailto:|tel:)\S+$/i.test(href)) return href;
  return fail(filePath, `仅支持站内绝对路径、HTTP(S)、mailto 或 tel 链接：${href}`);
};

/** 链接列表共用于菜单介绍和 Markdown 页面操作。 */
const readLinkList = (
  value: unknown,
  filePath: string,
  routeSet: ReadonlySet<string>,
): ContentLink[] =>
  readList(value, filePath).map((entry) => {
    const record = readRecord(entry, filePath, ['label', 'href']);
    return {
      label: requireText(record.label, filePath, 'label'),
      href: readHref(record.href, filePath, routeSet),
    };
  });

/** 加载站点与页面；正文资源随后由文章管线统一处理。 */
export const readSiteContent = (
  repositoryDirectory: string,
  articleSlugList: string[],
): {
  site: SiteContent;
  pageFileMap: Map<string, MarkdownPage>;
} => {
  const sitePath = join(repositoryDirectory, 'config/site.json');
  const siteRecord = readRecord(readJson(sitePath), sitePath, [
    'name',
    'siteName',
    'description',
    'introLineList',
    'timeZone',
    'home',
  ]);
  const homeRecord = readRecord(siteRecord.home, sitePath, ['recentTitle', 'viewAllLabel']);
  const profile = {
    name: readTextField(siteRecord, 'name', sitePath),
    siteName: readTextField(siteRecord, 'siteName', sitePath),
    description: readTextField(siteRecord, 'description', sitePath),
    introLineList: readList(siteRecord.introLineList, sitePath).map((line) =>
      requireText(line, sitePath, 'introLineList'),
    ),
    timeZone: readTextField(siteRecord, 'timeZone', sitePath),
  };
  try {
    new Intl.DateTimeFormat('en', { timeZone: profile.timeZone });
  } catch {
    return fail(sitePath, `无效 timeZone：${profile.timeZone}`);
  }

  const pageFileMap = new Map<string, MarkdownPage>();
  const pagesPath = join(repositoryDirectory, 'pages');
  const pageSlugSet = new Set(['about']);
  if (existsSync(pagesPath)) {
    for (const directory of readdirSync(pagesPath, { withFileTypes: true })) {
      if (directory.name.startsWith('.')) continue;
      const pagePath = join(pagesPath, directory.name);
      if (!directory.isDirectory() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(directory.name))
        return fail(pagePath, '页面必须使用小写字母、数字和短横线命名的真实目录');
      if (['work', 'uses', 'links'].includes(directory.name)) {
        if (existsSync(join(pagePath, 'index.md')))
          return fail(pagePath, 'Work、Uses 和 Links 页面使用 index.json，请勿创建 index.md');
        continue;
      }
      if (reservedSlugSet.has(directory.name))
        return fail(pagePath, `页面标识与系统路由冲突：${directory.name}`);
      pageSlugSet.add(directory.name);
    }
  }
  const routeSet = new Set([
    '/',
    '/about',
    '/work',
    '/uses',
    '/links',
    '/writing',
    '/archive',
    ...[...pageSlugSet].map((slug) => `/${slug}`),
    ...articleSlugList.map((slug) => `/writing/${slug}`),
  ]);
  for (const slug of pageSlugSet) {
    const filePath = join(pagesPath, slug, 'index.md');
    const { metadata, nodeList } = readMarkdown(filePath);
    const record = readRecord(metadata, filePath, ['title', 'description', 'notice', 'linkList']);
    pageFileMap.set(filePath, {
      slug,
      nodeList,
      title: readTextField(record, 'title', filePath),
      description:
        record.description === undefined
          ? profile.description
          : readTextField(record, 'description', filePath),
      notice: record.notice === undefined ? '' : readTextField(record, 'notice', filePath, true),
      linkList: readLinkList(
        record.linkList === undefined ? [] : record.linkList,
        filePath,
        routeSet,
      ),
    });
  }

  /** 三种列表模板复用条目与链接规则。 */
  const readEntryList = (value: unknown, filePath: string) =>
    readList(value, filePath).map((entry) => {
      const record = readRecord(entry, filePath, ['name', 'description', 'year', 'linkList']);
      return {
        name: readTextField(record, 'name', filePath),
        description: readTextField(record, 'description', filePath),
        year: record.year === undefined ? undefined : readTextField(record, 'year', filePath, true),
        linkList: readLinkList(
          record.linkList === undefined ? [] : record.linkList,
          filePath,
          routeSet,
        ),
      };
    });
  /** Work、Uses、Links 使用同一份 JSON 契约，不按页面维护分支。 */
  const readListPage = (slug: string) => {
    const filePath = join(pagesPath, slug, 'index.json');
    const record = readRecord(readJson(filePath), filePath, [
      'title',
      'introduction',
      'sectionList',
    ]);
    return {
      title: readTextField(record, 'title', filePath),
      introduction: readTextField(record, 'introduction', filePath, true),
      sectionList: readList(record.sectionList, filePath).map((entry) => {
        const section = readRecord(entry, filePath, ['title', 'entryList']);
        return {
          title: readTextField(section, 'title', filePath),
          entryList: readEntryList(section.entryList, filePath),
        };
      }),
    };
  };
  const workContent = readListPage('work');
  const usesContent = readListPage('uses');
  const linksContent = readListPage('links');

  const menuPath = join(repositoryDirectory, 'config/menu.json');
  const menuRecord = readRecord(readJson(menuPath), menuPath, [
    'eyebrow',
    'title',
    'description',
    'linkList',
    'footer',
  ]);
  const footerRecord = readRecord(menuRecord.footer, menuPath, ['label', 'text']);
  const menuContent = {
    eyebrow: readTextField(menuRecord, 'eyebrow', menuPath, true),
    title: readTextField(menuRecord, 'title', menuPath),
    description: readTextField(menuRecord, 'description', menuPath, true),
    linkList: readLinkList(menuRecord.linkList, menuPath, routeSet),
    footer: {
      label: readTextField(footerRecord, 'label', menuPath, true),
      text: readTextField(footerRecord, 'text', menuPath, true),
    },
  };
  const navigationPath = join(repositoryDirectory, 'config/navigation.json');
  const navigationHrefSet = new Set<string>();
  const navigationList = readList(readJson(navigationPath), navigationPath)
    .flatMap((entry) => {
      const record = readRecord(entry, navigationPath, ['label', 'href', 'visible']);
      const label = readTextField(record, 'label', navigationPath);
      const href = readHref(record.href, navigationPath, routeSet);
      if (record.visible !== undefined && typeof record.visible !== 'boolean')
        return fail(navigationPath, 'visible 必须是布尔值');
      const pathname = href.startsWith('/')
        ? decodeURIComponent(new URL(href, 'https://blog.invalid').pathname).replace(/\/$/, '') ||
          '/'
        : href;
      if (navigationHrefSet.has(pathname)) return fail(navigationPath, `菜单链接重复：${href}`);
      navigationHrefSet.add(pathname);
      if (record.visible === false) return [];
      const route = pathname === '/' ? 'home' : pathname.replace(/^\//, '');
      return [{ label, href, route }];
    })
    .map((entry, index) => ({ ...entry, number: String(index + 1).padStart(2, '0') }));

  return {
    site: {
      profile,
      homeContent: {
        recentTitle: readTextField(homeRecord, 'recentTitle', sitePath),
        viewAllLabel: readTextField(homeRecord, 'viewAllLabel', sitePath),
      },
      menuContent,
      navigationList,
      pageList: [...pageFileMap.values()],
      workContent,
      usesContent,
      linksContent,
    },
    pageFileMap,
  };
};
