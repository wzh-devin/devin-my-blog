FROM nginx@sha256:fb01117203ff38c2f9af91db1a7409459182a37c87cced5cb442d1d8fcc66d19

COPY dist/ /usr/share/nginx/html/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail --silent http://127.0.0.1/content/index.json >/dev/null || exit 1
