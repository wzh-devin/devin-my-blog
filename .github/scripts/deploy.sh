#!/usr/bin/env bash
set -euo pipefail

[[ -s deployment/image.tar.gz && -s deployment/compose.yaml ]] || { echo 'Missing image or Compose artifact' >&2; exit 1; }
[[ -z "$(find deployment -type l -print -quit)" ]] || { echo 'Deployment must not contain symbolic links' >&2; exit 1; }
[[ "${BLOG_IMAGE:-}" =~ ^devin-my-blog:v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] || { echo 'BLOG_IMAGE must be devin-my-blog:vX.Y.Z' >&2; exit 1; }
source "$(dirname "$0")/ssh.sh"

release_path="$DEPLOY_PATH/.deploy-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
ssh "${ssh_option_list[@]}" -l "$DEPLOY_USER" "$DEPLOY_HOST" "sudo -n mkdir -p -- '$DEPLOY_PATH/content' '$release_path'"
rsync -az --rsync-path='sudo -n rsync' -e "$rsync_shell" -- deployment/ "$remote_target:$release_path/"
ssh "${ssh_option_list[@]}" -l "$DEPLOY_USER" "$DEPLOY_HOST" bash -s -- "$DEPLOY_PATH" "$release_path" "$BLOG_IMAGE" <<'REMOTE'
set -euo pipefail
project_path="$1"
release_path="$2"
image="$3"
next_compose="$project_path/.compose.next.yaml"
next_env="$project_path/.env.next"
sudo -n test -s "$project_path/content/index.json" || { echo 'Publish the first content index before deploying the website' >&2; exit 1; }
sudo -n docker load --input "$release_path/image.tar.gz"
sudo -n docker run --rm --entrypoint nginx "$image" -t
sudo -n cp -- "$release_path/compose.yaml" "$next_compose"
# 保留服务器既有的绑定地址与端口，只替换镜像版本。
if sudo -n test -f "$project_path/.env"; then
  sudo -n awk '!/^BLOG_IMAGE=/' "$project_path/.env" | sudo -n tee "$next_env" >/dev/null
else
  printf '' | sudo -n tee "$next_env" >/dev/null
fi
printf 'BLOG_IMAGE=%s\n' "$image" | sudo -n tee -a "$next_env" >/dev/null
sudo -n chmod 600 "$next_env"
sudo -n docker compose --project-directory "$project_path" --env-file "$next_env" -f "$next_compose" config -q
if ! sudo -n docker compose --project-directory "$project_path" --env-file "$next_env" -f "$next_compose" up -d --wait --wait-timeout 60; then
  if sudo -n test -f "$project_path/compose.yaml" && sudo -n test -f "$project_path/.env"; then
    sudo -n docker compose --project-directory "$project_path" --env-file "$project_path/.env" -f "$project_path/compose.yaml" up -d --wait --wait-timeout 60
  fi
  exit 1
fi
sudo -n mv -f -- "$next_compose" "$project_path/compose.yaml"
sudo -n mv -f -- "$next_env" "$project_path/.env"
sudo -n rm -rf -- "$release_path"
# shortcut: 上一版镜像留作回退，磁盘容量需要时再增加明确的保留策略。
REMOTE
