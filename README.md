# devin-my-blog

一个记录代码、设计与生活的个人博客。

[访问博客](https://blog.devin.wang) · [内容仓库](https://github.com/wzh-devin/devin-blog-content) · [内容与配置指南](docs/content.md) · [部署指南](docs/deployment.md)

## 项目背景

Devin, my blog. 是一个长期积累文章、项目和日常发现的个人空间。写下技术探索中的思考，整理设计中的细节，也留下生活里的观察，让这些内容有一个持续更新、方便查阅的地方。

网站围绕写作与阅读组织：首页呈现最近更新与代表文章，归档提供分类和搜索，独立页面介绍个人、项目、工具与收藏。文章和配置以文件形式保存在独立内容仓库中，日常写作可以单独发布，界面也能持续迭代。

## 项目方向

- **以内容为中心**：让读者容易找到文章，专注于阅读，并通过稳定的链接再次访问。
- **保持统一的视觉表达**：沿用留白、细线、自托管字体与自然光影，以现有排版和交互承接新增内容。
- **让写作与网站维护各自独立**：Markdown 与 JSON 管理文章、页面和配置，内容更新无需重新构建网站程序。
- **持续改善使用体验**：关注首次加载、不同屏幕的布局、键盘操作和减少动态偏好。
- **保持实现清晰**：复用已有 React 组件、主题和路由，在明确需求下逐步扩展。

具体视觉约定见 [DESIGN.md](DESIGN.md)。

## 主要能力

| 能力       | 说明                                                             |
| ---------- | ---------------------------------------------------------------- |
| 文章阅读   | Markdown 正文、层级目录、代码高亮与复制、配图和静态 Mermaid 图表 |
| 内容发现   | 最近文章、分类筛选、文章标题与摘要搜索，以及精选文章时间环       |
| 个人展示   | About、Work、Uses、Links，以及通过内容目录增加的独立页面         |
| 主题与交互 | 六时段主题、百叶窗与树影、访客本地时钟、响应式布局与键盘导航     |
| 独立发布   | 网站按版本 Tag 发布 Docker 镜像，文章与配置通过内容仓库单独更新  |

## 整体架构

网站程序与写作内容分别维护，通过发布后的内容索引和正文资源连接：

```text
devin-my-blog       → Vite 构建 → Docker 镜像 → Nginx 提供网站程序
devin-blog-content → 内容校验与导出          → 独立 content/ 目录
                                               ↓
                                 浏览器读取索引，按路由加载正文
```

前端使用 **React、TypeScript、React Router 与 Tailwind CSS**，由 **Vite** 提供开发服务与生产构建。文章与配置在内容导出时完成校验，代码高亮和图表也在导出阶段生成；浏览器负责内容展示与交互。

部署采用 **GitHub Actions、Docker Compose 与 Nginx**。网站版本由手动推送的 `vX.Y.Z` Tag 发布；内容仓库的发布流程更新 JSON、配图和图表，网站容器继续运行。

## 快速开始

需要 **Node.js 22.22+**，以及配套内容仓库的访问权限。在同一父目录中克隆两个仓库：

```sh
git clone https://github.com/wzh-devin/devin-my-blog.git
git clone https://github.com/wzh-devin/devin-blog-content.git
cd devin-my-blog
npm ci
npm run dev
```

打开 [本地开发站点](http://127.0.0.1:5173)。默认内容目录为 `../devin-blog-content`；修改内容后，开发预览会自动刷新。其他目录通过 `.env.local` 中的 `BLOG_CONTENT_DIR` 配置，详见[内容指南](docs/content.md#使用其他内容目录)。

| 命令                    | 用途                                           |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | 启动本地开发与内容预览                         |
| `npm run build`         | 类型检查并构建网站程序，不读取内容仓库         |
| `npm run preview`       | 预览网站生产构建，本地内容端点仍由内容仓库提供 |
| `npm run content:build` | 校验并导出内容至 `content-dist/content/`       |

## 项目文档

| 文档                                                                   | 内容                                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| [内容与配置指南](docs/content.md)                                      | 配置来源、页面模板、Markdown 能力及完整初始化示例     |
| [内容仓库说明](https://github.com/wzh-devin/devin-blog-content#readme) | 写作目录、分类、精选、草稿和文章发布                  |
| [部署指南](docs/deployment.md)                                         | 两个仓库的 Actions 配置、网站版本发布与服务器运行方式 |
| [视觉规范](DESIGN.md)                                                  | 排版、主题、光影、响应式与交互基准                    |
| [开发约定](AGENTS.md)                                                  | 组件组织、路由、代码风格与检查要求                    |

## 维护与参考

由 [Devin](https://github.com/wzh-devin) 维护。问题与建议可通过[项目 Issues](https://github.com/wzh-devin/devin-my-blog/issues)反馈。

视觉参考 [Tomasz Gil](https://tomaszgil.me/)，静态资源来源记录于[资源说明](public/ASSETS.md)；时间环的来源与使用范围见 [SOURCE.md](src/components/radial-timeline/SOURCE.md)。
