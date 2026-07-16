# Starts luckee-hub-express-server (:3001) and luckee-hub (:3000), then opens the browser.

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$HubWebDir = if ($env:LUCKEE_HUB_WEB_DIR) { $env:LUCKEE_HUB_WEB_DIR } else { Split-Path -Parent $ScriptDir }
$HubExpressDir = if ($env:LUCKEE_HUB_EXPRESS_DIR) {
  $env:LUCKEE_HUB_EXPRESS_DIR
} else {
  Join-Path (Split-Path -Parent $HubWebDir) "luckee-hub-express-server"
}
$LauncherLog = Join-Path $env:TEMP "luckee-hub-launcher.log"

function Write-Log([string]$Message) {
  $line = "[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Message
  Add-Content -Path $LauncherLog -Value $line
}

if (-not (Test-Path $HubExpressDir)) {
  throw "Express repo not found at: $HubExpressDir (set LUCKEE_HUB_EXPRESS_DIR or clone as a sibling of luckee-hub)"
}

if (-not (Test-Path $HubWebDir)) {
  throw "Web repo not found at: $HubWebDir"
}

Write-Log "hub:express starting ($HubExpressDir)"
Start-Process -FilePath "powershell.exe" -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location -LiteralPath '$HubExpressDir'; Write-Host '>>> Luckee Hub Express (:3001)'; `$env:PORT='3001'; npm run dev"
)

Start-Sleep -Seconds 1

Write-Log "hub:web starting ($HubWebDir)"
Start-Process -FilePath "powershell.exe" -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location -LiteralPath '$HubWebDir'; Write-Host '>>> Luckee Hub Web (:3000)'; npm run dev"
)

Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host "Luckee Dev Hub starting — Express :3001, Web :3000"
Write-Host "Log: $LauncherLog"
