#!/usr/bin/env node
/**
 * Cross-platform installer for the Luckee Dev Hub desktop launcher.
 * macOS → Luckee Dev Hub.app on Desktop
 * Windows → Luckee Dev Hub.lnk on Desktop
 */

const { spawnSync } = require("node:child_process");
const path = require("node:path");

const scriptsDir = __dirname;
const platform = process.platform;

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (platform === "darwin") {
  run("zsh", [path.join(scriptsDir, "install-luckee-hub-dev-app.sh")]);
} else if (platform === "win32") {
  run("powershell.exe", [
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    path.join(scriptsDir, "install-luckee-hub-dev-app.ps1"),
  ]);
} else {
  console.error(
    `Desktop launcher install is only supported on macOS and Windows (got: ${platform}).`
  );
  process.exit(1);
}
