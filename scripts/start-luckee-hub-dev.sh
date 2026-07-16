#!/bin/zsh
#
# Starts luckee-hub-express-server (:3001) and luckee-hub (:3000), then opens the browser.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HUB_WEB_DIR="${LUCKEE_HUB_WEB_DIR:-$(dirname "$SCRIPT_DIR")}"
HUB_EXPRESS_DIR="${LUCKEE_HUB_EXPRESS_DIR:-$(dirname "$HUB_WEB_DIR")/luckee-hub-express-server}"
LAUNCHER_LOG="/tmp/luckee-hub-launcher.log"

# Prefer Homebrew nvm, then the standard ~/.nvm install. Override with NVM_SH.
if [[ -z "${NVM_SH:-}" ]]; then
  if [[ -s /opt/homebrew/opt/nvm/nvm.sh ]]; then
    NVM_SH="/opt/homebrew/opt/nvm/nvm.sh"
  elif [[ -s "$HOME/.nvm/nvm.sh" ]]; then
    NVM_SH="$HOME/.nvm/nvm.sh"
  else
    NVM_SH=""
  fi
fi

if [[ ! -d "$HUB_EXPRESS_DIR" ]]; then
  echo "Express repo not found at: $HUB_EXPRESS_DIR" >&2
  echo "Clone luckee-hub-express-server as a sibling, or set LUCKEE_HUB_EXPRESS_DIR." >&2
  exit 1
fi

if [[ ! -d "$HUB_WEB_DIR" ]]; then
  echo "Web repo not found at: $HUB_WEB_DIR" >&2
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
if [[ -n "$NVM_SH" && -s "$NVM_SH" ]]; then
  # shellcheck source=/dev/null
  source "$NVM_SH"
fi

escape_for_applescript() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  echo "$value"
}

# Optional nvm load so a missing/wrong path never blocks npm run dev.
nvm_prefix_cmd() {
  if [[ -n "$NVM_SH" && -s "$NVM_SH" ]]; then
    echo "export NVM_DIR=\"\$HOME/.nvm\" && . '${NVM_SH}' && "
  else
    echo ""
  fi
}

# Install deps when node_modules is missing (first launch / fresh clone).
ensure_deps_cmd() {
  echo "[ -d node_modules ] || npm install && "
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

NVM_PREFIX="$(nvm_prefix_cmd)"
DEPS_PREFIX="$(ensure_deps_cmd)"

EXPRESS_CMD="$(escape_for_applescript "cd '${HUB_EXPRESS_DIR}' && ${NVM_PREFIX}${DEPS_PREFIX}echo '>>> Luckee Hub Express (:3001)' && PORT=3001 npm run dev")"

WEB_CMD="$(escape_for_applescript "cd '${HUB_WEB_DIR}' && ${NVM_PREFIX}${DEPS_PREFIX}echo '>>> Luckee Hub Web (:3000)' && npm run dev")"

open_terminal_window "express" "$EXPRESS_CMD"
sleep 1
open_terminal_window "web" "$WEB_CMD"
sleep 2
open "http://localhost:3000"

echo "Luckee Dev Hub starting — Express :3001, Web :3000"
