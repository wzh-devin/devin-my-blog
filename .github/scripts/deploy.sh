#!/usr/bin/env bash
set -euo pipefail

: "${DEPLOY_HOST:?Set DEPLOY_HOST}"
: "${DEPLOY_PORT:?Set DEPLOY_PORT}"
: "${DEPLOY_USER:?Set DEPLOY_USER}"
: "${DEPLOY_PATH:?Set DEPLOY_PATH}"
: "${DEPLOY_KNOWN_HOSTS:?Set DEPLOY_KNOWN_HOSTS}"
: "${DEPLOY_SSH_KEY:?Set DEPLOY_SSH_KEY}"
: "${GITHUB_RUN_ID:?Missing GITHUB_RUN_ID}"
: "${GITHUB_RUN_ATTEMPT:?Missing GITHUB_RUN_ATTEMPT}"

# 这些值会进入 SSH 目标及远端命令，只接受无 shell 元字符的明确参数。
[[ "$DEPLOY_HOST" =~ ^[A-Za-z0-9][A-Za-z0-9.:-]*$ ]] || { echo 'Invalid DEPLOY_HOST' >&2; exit 1; }
[[ "$DEPLOY_USER" =~ ^[a-z_][a-z0-9_-]*$ ]] || { echo 'Invalid DEPLOY_USER' >&2; exit 1; }
[[ "$DEPLOY_PORT" =~ ^[0-9]{1,5}$ ]] && (( 10#$DEPLOY_PORT >= 1 && 10#$DEPLOY_PORT <= 65535 )) || { echo 'Invalid DEPLOY_PORT' >&2; exit 1; }
[[ "$DEPLOY_PATH" =~ ^/[A-Za-z0-9_./-]+$ && "$DEPLOY_PATH" != *'//'* && "$DEPLOY_PATH" != *'/../'* && "$DEPLOY_PATH" != *'/./'* && "$DEPLOY_PATH" != */.. && "$DEPLOY_PATH" != */. ]] || { echo 'Invalid DEPLOY_PATH' >&2; exit 1; }
DEPLOY_PATH="${DEPLOY_PATH%/}"
[[ -n "$DEPLOY_PATH" && "$DEPLOY_PATH" != / ]] || { echo 'DEPLOY_PATH cannot be the filesystem root' >&2; exit 1; }
[[ "$GITHUB_RUN_ID" =~ ^[0-9]+$ && "$GITHUB_RUN_ATTEMPT" =~ ^[0-9]+$ ]] || { echo 'Invalid deployment run ID' >&2; exit 1; }
[[ -s dist/index.html ]] || { echo 'Missing dist/index.html' >&2; exit 1; }
[[ -z "$(find dist -type l -print -quit)" ]] || { echo 'dist must not contain symbolic links' >&2; exit 1; }

ssh_directory="$(mktemp -d /tmp/blog-deploy.XXXXXX)"
trap 'rm -rf -- "$ssh_directory"' EXIT
printf '%s\n' "$DEPLOY_SSH_KEY" | tr -d '\r' > "$ssh_directory/key"
printf '%s\n' "$DEPLOY_KNOWN_HOSTS" > "$ssh_directory/known_hosts"
chmod 600 "$ssh_directory/key" "$ssh_directory/known_hosts"
ssh_option_list=(-i "$ssh_directory/key" -p "$DEPLOY_PORT" -o BatchMode=yes -o IdentitiesOnly=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$ssh_directory/known_hosts" -o ConnectTimeout=20)
printf -v rsync_shell '%q ' ssh "${ssh_option_list[@]}"
remote_target="$DEPLOY_USER@$DEPLOY_HOST"
# rsync 的 IPv6 目标需要方括号，ssh 本身仍接收普通地址。
if [[ "$DEPLOY_HOST" == *:* ]]; then remote_target="$DEPLOY_USER@[$DEPLOY_HOST]"; fi
ssh "${ssh_option_list[@]}" -l "$DEPLOY_USER" "$DEPLOY_HOST" "mkdir -p -- '$DEPLOY_PATH'"
# shortcut: 保留旧摘要资源供已打开页面使用；空间成为问题时再按版本保留策略清理。
rsync -az --delay-updates --exclude=/index.html -e "$rsync_shell" -- dist/ "$remote_target:$DEPLOY_PATH/"
rsync -az -e "$rsync_shell" -- dist/index.html "$remote_target:$DEPLOY_PATH/.index-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT.html"
ssh "${ssh_option_list[@]}" -l "$DEPLOY_USER" "$DEPLOY_HOST" "mv -f -- '$DEPLOY_PATH/.index-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT.html' '$DEPLOY_PATH/index.html'"
