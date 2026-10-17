# Oh, my blog.

用 Vite + TypeScript + Tailwind CSS 实现的个人博客，按 [tomaszgil.me](https://tomaszgil.me/) 的 REA 解析重做：满屏首页、全屏菜单、循环主题、百叶窗与树影光效。

## 运行

需要 Node.js 22.18+。

```sh
npm ci
npm run dev      # http://127.0.0.1:5173
npm test         # 路由、筛选、主题和输入边界
npm run build    # 类型检查 + 生产构建
npm run preview
```

## 页面

- `/`：左上简介、满屏光影、时区时钟和快捷键提示。
- Menu 中的 About、Work、Uses、Writing 对应独立页面。
- `/writing`：原站式文字入口和最近三篇文章。
- `/archive`：全部文章、分类、搜索和空结果恢复。
- `/writing/:slug`：保留原有文章详情路径、目录和代码块。

点击主题按钮或按 T，依次循环 Dawn → Sunrise → Day → Sunset → Dusk → Night。主题会改变颜色与窗影几何，偏好保存在浏览器；旧版 morning 自动迁移为 sunrise。

按 C 显示控件旁的快捷键。H 首页、A 关于、W 项目、U 工具、B Writing、M 菜单、Escape 关闭、/ 搜索。输入状态下不会触发导航。菜单由原生 dialog 管理焦点，减少动态偏好会暂停 CSS 与 SVG 风动。

## 修改内容

`src/blog.ts` 保存 profile 和文章列表。修改 introLineList 更换首页两行简介，timeZone 控制时钟（默认 Asia/Shanghai）。署名和文章是示例，文章详情保留示例标记。未提供真实联系方式，因此没有生成虚构邮箱或社交账号。

`src/main.ts` 实现页面、菜单、主题与路由；`src/style.css` 管理排版和光影。树影资源来源记录于 `public/ASSETS.md`；字体为自托管的 Geist，不需要运行时远程字体服务。没有复制参考作者的 Logo 或文章。

## 后续开发

当前版本是后续开发的视觉基准，具体约定见 [DESIGN.md](DESIGN.md)；项目规则见 [AGENTS.md](AGENTS.md)。新增页面沿用现有字体、间距、内容外框、全屏菜单和六时段光影，优先复用现有样式与原生交互。

旧版备份、截图、检查脚本和设计记录已清理，当前光影资源、REA 参考证据及当前版本检查保留。项目内不再提供旧版归档恢复。

## 部署与边界

将 dist 部署到静态托管，并配置 SPA fallback，例如 Nginx 的 `try_files $uri $uri/ /index.html;`，才能直达文章等子页面。当前没有后端、登录、在线编辑和评论；需要时使用 Go + Redis + PostgreSQL。

内容由浏览器渲染，面向搜索/社交抓取的文章预览仍需要预渲染。未进行线上发布或 Git 提交。
