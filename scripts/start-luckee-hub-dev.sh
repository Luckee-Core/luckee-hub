#!/bin/zsh
#
# Starts luckee-hub-express-server (:4110) and luckee-hub (:4100), then opens the browser.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HUB_WEB_DIR="${LUCKEE_HUB_WEB_DIR:-$(dirname "$SCRIPT_DIR")}"
HUB_EXPRESS_DIR="${LUCKEE_HUB_EXPRESS_DIR:-$(dirname "$HUB_WEB_DIR")/luckee-hub-express-server}"
NVM_SH="${NVM_SH:-/opt/homebrew/opt/nvm/nvm.sh}"
LAUNCHER_LOG="/tmp/luckee-hub-launcher.log"

export NVM_DIR="$HOME/.nvm"
if [[ -s "$NVM_SH" ]]; then
  # shellcheck source=/dev/null
  source "$NVM_SH"
fi

escape_for_applescript() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  echo "$value"
}

open_terminal_window() {
  local step_name="$1"
  local full_cmd="$2"

  echo "[$(date '+%H:%M:%S')] hub:${step_name}" >>"$LAUNCHER_LOG"
  /usr/bin/osascript >>"$LAUNCHER_LOG" 2>&1 <<APPLESCRIPT
tell application "Terminal"
  activate
  do script "${full_cmd}"
end tell
APPLESCRIPT
}

EXPRESS_CMD="$(escape_for_applescript "cd '${HUB_EXPRESS_DIR}' && export NVM_DIR=\"\$HOME/.nvm\" && [ -s '${NVM_SH}' ] && . '${NVM_SH}' && echo '>>> Luckee Hub Express (:4110)' && PORT=4110 npm run dev")"

WEB_CMD="$(escape_for_applescript "cd '${HUB_WEB_DIR}' && export NVM_DIR=\"\$HOME/.nvm\" && [ -s '${NVM_SH}' ] && . '${NVM_SH}' && echo '>>> Luckee Hub Web (:4100)' && npm run dev")"

open_terminal_window "express" "$EXPRESS_CMD"
sleep 1
open_terminal_window "web" "$WEB_CMD"
sleep 2
open "http://localhost:4100"

echo "Luckee Dev Hub starting — Express :4110, Web :4100"
