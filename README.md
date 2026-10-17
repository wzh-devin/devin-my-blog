# devin-my-blog

站点标题为 `devin, my blog.`。用 Vite + React + TypeScript + Tailwind CSS 实现的个人博客，使用 React Router 管理路由。视觉参考 [tomaszgil.me](https://tomaszgil.me/) 的 REA 解析：满屏首页、全屏菜单、循环主题、百叶窗与树影光效。

## 运行

需要 Node.js 22.22+。

```sh
npm ci
npm run dev      # http://127.0.0.1:5173
npm test         # 路由、筛选、主题和输入边界
npm run build    # 类型检查 + 生产构建
npm run preview
npm run format       # Prettier 格式化
npm run format:check # 格式检查
npm run lint         # Oxlint 静态检查
npm run lint:fix     # 修复支持自动修复的问题
npm run check        # 格式、静态检查、测试与生产构建
```

## 页面

- `/`：左上简介；桌面左侧最近三篇文章、右侧精选文章时间索引，窄屏依次排列；时区时钟位于圆环中心，展开详情时隐藏，返回时恢复；保留查看全部入口与满屏光影。
- Menu 中的 About、Work、Uses、Writing 对应独立页面。
- `/writing`：原站式文字入口和最近三篇文章。
- `/archive`：全部文章、分类、搜索和空结果恢复。
- `/writing/:slug`：保留原有文章详情路径、目录和代码块。

点击主题按钮，依次循环 Dawn → Sunrise → Day → Sunset → Dusk → Night。主题会改变颜色与窗影几何，偏好保存在浏览器；旧版 morning 自动迁移为 sunrise。

通过可见链接与按钮操作，无全局字母或斜杠快捷键。保留 Tab 导航与 Escape 关闭菜单；菜单由原生 dialog 管理焦点，减少动态偏好会暂停 CSS 与 SVG 风动。

首页时间环复用用户提供的 Radial Timeline 动画，定位为精选文章的时间索引。当前展示四篇代表文章的短标题与年月，按发布日期顺时针排列，以非等距编辑排版保留疏密和留白；角度不表示真实日期间隔。点击节点展开原文标题、日期、分类、阅读时长与摘要，通过“阅读全文”进入正文；返回收回圆环并恢复时钟、焦点与转动。圆心保留时钟，去掉月份统计与年份切换。圆环初始对齐真实秒数，以每秒 6° 匀速顺时针转动，一分钟一圈；标签保持正向、数字时钟固定。悬浮文章标题时暂停，移开后从暂停角度继续；展开预览时暂停，返回通常对齐当前秒数后恢复。触摸不会触发悬浮暂停，减少动态模式保持静止。发布新文章只更新最近文章与 Archive，精选内容需手动调整，不会自动填满圆环。圆环最大 680px，桌面在顶栏下方的可视区域垂直居中，左侧文章列表的中心与圆心对齐；简介独立位于左上。滚轮和触摸滑动正常滚动页面。Framer Motion 使用来源版本 12.36.0，减少动态时立即切换。接入范围见 [SOURCE.md](src/components/radial-timeline/SOURCE.md)。

## 修改内容

`src/config/site.ts` 保存 profile，siteName 统一控制品牌文字与路由标题；首页初始 HTML 标题在 index.html 中同步维护。修改 introLineList 更换首页两行简介，timeZone 控制时钟（默认 Asia/Shanghai）。文章内容在 `src/features/articles/data.ts`，类型、分类与筛选在同目录的 `model/index.ts`。署名和文章是示例，文章详情保留示例标记。未提供真实联系方式，因此没有生成虚构邮箱或社交账号。

树影资源来源记录于 `public/ASSETS.md`；字体为自托管的 Geist，不需要运行时远程字体服务。没有复制参考作者的 Logo 或文章。

## 项目结构

```text
src/
├── main.tsx                    # React 与 RouterProvider 入口
├── app/
│   ├── app.tsx                 # 根布局、Outlet 与共享状态
│   ├── router/                 # React Router 配置、文章 loader、页面元数据
│   └── layout/                 # site-header、site-menu、ambient-light
├── pages/                      # home、about、work、uses、writing、archive、article、not-found
│   └── archive/
│       ├── index.tsx
│       ├── archive.css
│       └── components/search-toolbar/index.tsx
├── features/
│   ├── articles/               # 内容、模型、筛选 Hook、共享文章列表和精选时间索引
│   └── theme/                  # 六主题模型、主题 Hook、切换按钮
├── components/                 # icon、brand、text-link、page-heading、radial-timeline
├── hooks/                      # 跨模块共享的浏览器能力 Hook
├── config/                     # 网站资料与导航配置
├── lib/                        # 公共日期格式化
└── styles/                     # 全局样式入口、主题变量、基础样式及公共响应式规则
```

组件和页面各自建立目录，以 `index.tsx` 公开；业务模块以 `index.ts` 显式导出。小组件直接在入口实现，复杂模块将内部逻辑放在同目录。模块内部直接引用实现，外部使用公开入口，避免从全局桶文件导入所有组件。

页面专用组件放在页面的 `components/` 中，例如首页时钟与归档搜索栏。跨页面业务组件放在所属 `features/` 中，例如 Home、Writing 与 Archive 共用文章列表。无业务含义的基础组件放在 `src/components/`，新增代码先检查已有实现。

`components/radial-timeline/` 通过 `index.tsx` 公开圆环，节点、圆心内容与详情由调用方传入，内部维护坐标、容器测量与展开动画。精选引用与预览展示位于 `features/articles/components/article-timeline/`，复用 TextLink、日期格式化、主题变量、Icon 和 useReducedMotion。修改该目录 `model.ts` 中的 `curatedArticleList` 更换精选 slug 与短标题，最多六篇；标题、摘要、首次发布日期和阅读时长继续从现有文章数据读取。节点按 `date` 排序，排版位置单独维护，不增加重复正文数据。

React Router 的 `createBrowserRouter` 集中维护路由，`Outlet` 渲染页面，`Link` 处理站内跳转，`ScrollRestoration` 恢复历史滚动。导航和菜单编号共用 `src/config/navigation.ts`。根布局保留筛选状态，页面切换不会清空条件。React 负责文本转义，避免拼接 HTML。

专有 CSS 与页面或组件就近存放，由 `src/styles/global.css` 统一装配，按“变量、基础、专有、公共响应式”的顺序保持覆盖关系。公共颜色、字体、排版和列表规则仅维护一份。

## 代码约束

Prettier 配置在 `.prettierrc.json`，Oxlint 配置在 `.oxlintrc.json`。Prettier 负责格式，Oxlint 检查 TypeScript、React、Hooks 与可访问性问题；`npm run check` 是交付前检查入口。生成产物、静态资源及本地知识库不参与格式化。

## 后续开发

当前版本是后续开发的视觉基准，具体约定见 [DESIGN.md](DESIGN.md)；项目规则见 [AGENTS.md](AGENTS.md)。新增页面沿用现有字体、间距、内容外框、全屏菜单和六时段光影，优先复用现有样式与原生交互。

旧版备份、截图、检查脚本和设计记录已清理，当前光影资源、REA 参考证据及当前版本检查保留。项目内不再提供旧版归档恢复。

## 部署与边界

将 dist 部署到静态托管，并配置 SPA fallback，例如 Nginx 的 `try_files $uri $uri/ /index.html;`，才能直达文章等子页面。当前没有后端、登录、在线编辑和评论；需要时使用 Go + Redis + PostgreSQL。

内容由浏览器渲染，面向搜索/社交抓取的文章预览仍需要预渲染。未进行线上发布或 Git 提交。
