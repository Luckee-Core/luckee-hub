#!/usr/bin/env node
/**
 * Start `next dev` on the first free TCP port from 3000 through 3100.
 *
 * Hub project launches pin one port with WEB_DEV_PORT_START === WEB_DEV_PORT_END
 * (and ignore a `--port` argument). A direct `npm run dev` walks forward when
 * the preferred port is already listening.
 */

import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_START = 3000;
const DEFAULT_END = 3100;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Port file the desktop launcher reads before opening the browser.
 * macOS launcher uses `/tmp`; Windows uses the user temp directory.
 */
export const webPortFilePath = () =>
  process.platform === 'win32'
    ? path.join(process.env.TEMP ?? '/tmp', 'luckee-hub-web.port')
    : '/tmp/luckee-hub-web.port';

/**
 * @param {string | undefined} raw
 * @returns {number | null}
 */
const parsePort = (raw) => {
  if (!raw) {
    return null;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0 || value > 65535) {
    return null;
  }
  return value;
};

/**
 * @param {string[]} argv
 * @returns {{ port: number | null, rest: string[] }}
 */
const takePortArg = (argv) => {
  const rest = [];
  let port = null;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--port' || arg === '-p') {
      port = parsePort(argv[index + 1]);
      index += 1;
      continue;
    }
    if (arg.startsWith('--port=')) {
      port = parsePort(arg.slice('--port='.length));
      continue;
    }
    rest.push(arg);
  }
  return { port, rest };
};

/**
 * True when a process is listening on `port`.
 * `null` when `lsof` cannot answer.
 *
 * @param {number} port
 * @returns {boolean | null}
 */
const portIsTaken = (port) => {
  try {
    execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 1) {
      return false;
    }
    return null;
  }
};

/**
 * @param {number} port
 * @param {string} host
 * @returns {Promise<boolean>}
 */
const canBind = (port, host) =>
  new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen({ port, host }, () => {
      server.close(() => resolve(true));
    });
  });

/**
 * @param {number} port
 * @returns {Promise<boolean>}
 */
const portIsFree = async (port) => {
  const taken = portIsTaken(port);
  if (taken !== null) {
    return !taken;
  }
  const ipv4Free = await canBind(port, '0.0.0.0');
  const ipv6Free = await canBind(port, '::');
  return ipv4Free && ipv6Free;
};

/**
 * First free port in `[start, end]`, or the pinned port when start equals end.
 *
 * @param {{ start: number, end: number, pinned: boolean }} input
 * @returns {Promise<number | null>}
 */
export const findFreeDevPort = async (input) => {
  if (input.pinned) {
    return input.start;
  }
  for (let port = input.start; port <= input.end; port += 1) {
    if (await portIsFree(port)) {
      return port;
    }
  }
  return null;
};

/**
 * @param {string[]} argv
 * @returns {{ start: number, end: number, pinned: boolean, rest: string[] }}
 */
const resolveWalk = (argv) => {
  const envStart = parsePort(process.env.WEB_DEV_PORT_START);
  const envEnd = parsePort(process.env.WEB_DEV_PORT_END);
  const pinned = envStart !== null && envEnd !== null && envStart === envEnd;
  const { port: cliPort, rest } = takePortArg(argv);
  const start = pinned ? envStart : (cliPort ?? envStart ?? DEFAULT_START);
  const end = pinned ? envEnd : (envEnd ?? DEFAULT_END);
  return { start, end: Math.max(start, end), pinned, rest };
};

/**
 * @param {string[]} argv
 * @returns {Promise<number>}
 */
const main = async (argv) => {
  const walk = resolveWalk(argv);
  const port = await findFreeDevPort(walk);
  if (port === null) {
    console.error(
      `>>> No free Next.js port from ${walk.start} through ${walk.end}`,
    );
    process.exit(1);
  }

  if (port !== walk.start) {
    console.log(`>>> Port ${walk.start} is in use. Luckee Hub Web will use :${port}`);
  } else {
    console.log(`>>> Luckee Hub Web (:${port})`);
  }

  fs.writeFileSync(webPortFilePath(), `${port}\n`);

  const env = { ...process.env };
  if (port !== DEFAULT_START) {
    env.LUCKEE_HUB_SKIP_DIST_LOCK = '1';
  }

  const nextBin = path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next');
  const child = spawn(process.execPath, [nextBin, 'dev', '--port', String(port), ...walk.rest], {
    cwd: repoRoot,
    stdio: 'inherit',
    env,
  });

  const forward = (signal) => {
    child.kill(signal);
  };
  process.on('SIGINT', forward);
  process.on('SIGTERM', forward);

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });

  return port;
};

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
