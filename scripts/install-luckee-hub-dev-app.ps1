# Builds a Desktop shortcut "Luckee Dev Hub" that starts the hub pair.

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$LauncherPs1 = Join-Path $ScriptDir "start-luckee-hub-dev.ps1"
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "Luckee Dev Hub.lnk"

if (-not (Test-Path $LauncherPs1)) {
  throw "Missing launcher: $LauncherPs1"
}

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -File `"$LauncherPs1`""
$Shortcut.WorkingDirectory = Split-Path -Parent $ScriptDir
$Shortcut.WindowStyle = 7
$Shortcut.Description = "Start Luckee Dev Hub (Express :3001 + Web :3000)"
$Shortcut.Save()

Write-Host "Created: $ShortcutPath"
Write-Host ""
Write-Host "Double-click to start Express (:3001) and Web (:3000), then open http://localhost:3000"
Write-Host "Log: $env:TEMP\luckee-hub-launcher.log"
