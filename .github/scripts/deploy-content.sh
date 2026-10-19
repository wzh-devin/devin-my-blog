#!/usr/bin/env bash
set -euo pipefail

[[ -s content-dist/content/index.json ]] || { echo 'Missing content index' >&2; exit 1; }
[[ -z "$(find content-dist -type l -print -quit)" ]] || { echo 'Content must not contain symbolic links' >&2; exit 1; }
source "$(dirname "$0")/ssh.sh"

ssh "${ssh_option_list[@]}" -l "$DEPLOY_USER" "$DEPLOY_HOST" "sudo -n mkdir -p -- '$DEPLOY_PATH/content'"
# shortcut: 保留旧摘要文件供已打开页面使用；实际容量不足时再按保留期清理。
rsync -az --delay-updates --rsync-path='sudo -n rsync' --exclude=/index.json -e "$rsync_shell" -- content-dist/content/ "$remote_target:$DEPLOY_PATH/content/"
rsync -az --rsync-path='sudo -n rsync' -e "$rsync_shell" -- content-dist/content/index.json "$remote_target:$DEPLOY_PATH/content/.index-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT.json"
ssh "${ssh_option_list[@]}" -l "$DEPLOY_USER" "$DEPLOY_HOST" "sudo -n mv -f -- '$DEPLOY_PATH/content/.index-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT.json' '$DEPLOY_PATH/content/index.json'"
