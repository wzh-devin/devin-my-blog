FROM nginx@sha256:441b69e13e79b436f9b617910633b6b6adce314c3788c3238dcd8e03b4cb512e

COPY dist/ /usr/share/nginx/html/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/content/index.json || exit 1
