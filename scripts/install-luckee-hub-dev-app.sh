#!/bin/zsh
#
# Builds "Luckee Dev Hub.app" on the Desktop (double-click to start hub pair).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LAUNCHER_SH="${SCRIPT_DIR}/start-luckee-hub-dev.sh"
DESKTOP_APP="$HOME/Desktop/Luckee Dev Hub.app"
APPLESCRIPT="$(mktemp -t luckee-hub-dev).applescript"

chmod +x "$LAUNCHER_SH"
chmod +x "${SCRIPT_DIR}/install-luckee-hub-dev-app.sh"

cat >"$APPLESCRIPT" <<EOF
on run
  try
    set launcherCmd to "zsh " & quoted form of "${LAUNCHER_SH}" & " >>/tmp/luckee-hub-launcher.log 2>&1"
    do shell script launcherCmd
  on error errMsg number errNum
    if errNum = -128 then
      return
    end if
    display alert "Luckee Dev Hub" message ("Launcher failed: " & errMsg) as warning
  end try
end run
EOF

rm -rf "$DESKTOP_APP"
osacompile -o "$DESKTOP_APP" "$APPLESCRIPT"
rm -f "$APPLESCRIPT"

echo "Created: ${DESKTOP_APP}"
echo ""
echo "Double-click to start Express (:4110) and Web (:4100), then open http://localhost:4100"
echo "Log: /tmp/luckee-hub-launcher.log"
