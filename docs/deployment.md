# 部署指南

[返回项目介绍](../README.md) · [内容与配置指南](content.md)

## 网站与内容独立发布

网站与内容分别发布：

| 仓库               | 发布触发与执行                             | 服务器变化                            |
| ------------------ | ------------------------------------------ | ------------------------------------- |
| devin-my-blog      | 推送 `vX.Y.Z` Tag，构建镜像并推送 GHCR     | Compose 更新网站容器；保留内容目录    |
| devin-blog-content | 校验文章、配置、页面，生成 JSON 与摘要资源 | 只更新 content/；不构建网站或重启容器 |

网站工作流为 [.github/workflows/deploy.yml](../.github/workflows/deploy.yml)，只在推送版本 Tag 时自动发布，推送 main 不发布。镜像推送到 `ghcr.io/wzh-devin/devin-my-blog:vX.Y.Z`，关联本仓库的 **Packages**；Actions 使用内置 `GITHUB_TOKEN` 和 `packages: write` 权限，无需新增 PAT。首次发布的 Package 默认私有，可按需要在 Package 设置中调整可见性。

内容工作流为内容仓库的 `.github/workflows/publish.yml`。手动运行默认 `deploy=false`，只生成产物；明确勾选才发布。网站手动运行同样必须选择版本 Tag，默认不推送 GHCR 或部署。内容发布不触发网站工作流，不需要 `CONTENT_READ_TOKEN` 或 `SITE_DISPATCH_TOKEN`。

### 源码、镜像与内容目录

配置、写作源文件、网站程序与生成产物分别维护。本项目保留既有内容仓库 `config/、posts/、pages/、drafts/`，生成的 JSON、SVG 与配图才会公开；源码、草稿、SSH 凭据不会直接上传。

网站程序与 [静态服务配置](../deploy/nginx.conf) 放在 [Docker 镜像](../Dockerfile) 内，服务器通过 [compose.yaml](../compose.yaml) 管理：

```text
/root/devin-my-blog/
├── compose.yaml         # 网站发布时更新
├── .env                 # 镜像版本与端口绑定，无密码/Token
└── content/             # 内容发布时更新，容器只读挂载到 /srv/content
    ├── index.json       # 最新配置、元数据、正文地址；no-store
    ├── documents/       # 摘要命名的正文 JSON；按路由加载
    └── ...              # 摘要命名的图片与图表
```

`content/index.json` 使用 `schemaVersion: 1`。每次打开或刷新网站读取新索引；已打开页面使用当前快照，刷新后获取更新。正文按内容摘要命名，可以长期缓存；更新或下架后旧摘要文件仍保留，避免已打开页面读不到正文。下架不提供对公开旧文件的保密撤回能力。

Nginx Proxy Manager 继续负责域名与 HTTPS，代理到独立静态容器；无需改动现有 NPM 的 Compose 或其他站点。现有域名为 `blog.devin.wang`，NPM 转发到博客容器端口。服务器 `.env` 保留绑定地址与端口，下面是仅供本机访问的示例：

```dotenv
BLOG_BIND_ADDRESS=127.0.0.1
BLOG_HTTP_PORT=16001
BLOG_IMAGE=devin-my-blog:v0.1.1 # 由网站发布脚本写入，与推送的 Git Tag 一致
```

默认只监听回环地址；NPM 在容器中运行时，应填写 NPM 能访问的主机私网地址，与已有上游规则保持一致。实际连接参数存 GitHub Variables 和服务器环境文件。不要直接把 /root 目录开放给部署用户；上传和 Docker 操作使用既有 `sudo -n` 权限。静态容器只挂载本项目内容目录。

### 两个仓库的 GitHub 配置

分别打开两个仓库的 **Settings → Secrets and variables → Actions**，填写相同的服务器 Variables：

| 名称               | 此项目设置                                                  |
| ------------------ | ----------------------------------------------------------- |
| DEPLOY_HOST        | 服务器 SSH IP 或域名                                        |
| DEPLOY_PORT        | 22                                                          |
| DEPLOY_USER        | ubuntu                                                      |
| DEPLOY_PATH        | /root/devin-my-blog                                         |
| DEPLOY_KNOWN_HOSTS | 已独立核对的 SSH 主机公钥记录；非默认端口使用 `[主机]:端口` |

两个仓库各配置 Secret `DEPLOY_SSH_KEY`：部署密钥的完整私钥；只存 GitHub Secrets，不进入文章、前端环境变量或产物。用户名、主机与目录为可见配置，密码不参与部署。

内容仓库另外保留 Variables：

| 名称               | 值                      |
| ------------------ | ----------------------- |
| WEBSITE_REPOSITORY | wzh-devin/devin-my-blog |
| WEBSITE_REF        | main                    |

这两个变量只用于取得公开网站仓库中的内容解析器与发布脚本，不触发网站发布。构建记录锁定取得的处理器提交，发布阶段使用同一提交的脚本。私有内容仓库用自身的 `GITHUB_TOKEN` 读取自身；不需授权其他私有仓库。

### 首次启用与手动验收

1. 确保两个仓库的 main 包含完整的网站、内容解析器和发布配置；网站工作流、Dockerfile 与 Compose 文件需一并就绪。
2. 配置上面的 Variables/Secret。服务器需已有 Docker、Compose、rsync、经确认的 SSH 主机身份，以及部署账号的既有非交互 sudo 权限。
3. 内容 Actions **Publish blog content** 默认只生成 `blog-content` 产物；确认后勾选 deploy 发布首份内容。
4. 网站代码合并到 main 后，手动创建并推送 `vX.Y.Z` Tag，自动发布镜像并部署。手动验收可执行 `gh workflow run deploy.yml --ref vX.Y.Z`，只生成 `blog-website-image`；加 `-F deploy=true` 才推送 GHCR 并部署。镜像只构建一次，同时标记 GHCR 名和服务器本地名；GHCR 推送成功后才交付部署产物，服务器加载同一镜像并运行 Compose，无需镜像仓库凭据或 Node 构建环境。
5. 检查仓库 Packages 中的版本、首页、文章直达、代码复制、图表和 `/content/index.json` 缓存头。以后文章/配置变化只推送内容仓库；网站代码合并 main 后再推送新版本 Tag。

发布版本完全由手动推送的 Git Tag 决定，镜像标签原样使用该 `vX.Y.Z` Tag。`package.json` 的 `version` 不参与发布版本校验，工作流不检查提交的 main 归属；只检查 Tag 为正式的 `vX.Y.Z` 格式，拒绝日期、提交 SHA、latest、预发布后缀及多余前导零。镜像的 OCI source、version、revision 标签记录关联仓库、版本与构建提交。文章和配置更新不需要改网站版本。

例如将 main 上的提交发布为 `v0.1.3`：

```bash
git switch main
git pull --ff-only origin main
git tag v0.1.3
git push origin v0.1.3
```

推送后生成 `ghcr.io/wzh-devin/devin-my-blog:v0.1.3`，部署使用同一镜像的 `devin-my-blog:v0.1.3` 本地标签。只创建本地 Tag 不会触发 Actions；无需另外创建 GitHub Release，也不要覆盖已发布的版本 Tag。

网站 Dockerfile 使用预先生成的 dist：本地先 `npm run build`，再按所选 Git Tag 构建；以下命令用于本地验证，正式发布通过 Actions 执行，例如 `docker build -t devin-my-blog:v0.1.3 .`。本地开发或预览直接使用 npm 命令；生产只由 Compose 运行镜像。

### 发布保障和边界

网站上传到本项目临时目录，加载镜像并校验 Nginx/Compose，使用健康检查启动后切换版本配置；启动失败时尝试恢复上一版 Compose 和镜像。镜像内负责 SPA 地址回退；图片/正文缺失返回真实 404。内容发布先上传摘要文件，最后原子切换索引；上传失败不替换旧索引。SSH 严格校验主机身份，临时私钥权限 600，结束删除；rsync 不使用 --delete。旧镜像与内容摘要文件按实际磁盘容量需要另行清理。

网站没有数据库、登录、在线编辑或评论。正文使用安全 AST；代码高亮和图表在内容发布时生成，不把构建引擎带入浏览器。HTML 初始元数据仍为网站外壳，内容加载后更新，面向爬虫的预渲染尚未实现。

本地测试沿用现有 Git 忽略策略：tests/ 和 _.test._ 不随 Git 上传，所以 CI 运行格式、Oxlint、类型与构建/内容校验；本地完整验收使用 npm run check。
