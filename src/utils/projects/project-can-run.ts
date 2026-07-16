import type { HookStatus } from '@/model';

/**
 * True when a project can be prepared via hub Setup (clone + install).
 */
export const projectNeedsSetup = (hookStatus: HookStatus): boolean =>
  hookStatus === 'catalog' || hookStatus === 'missing' || hookStatus === 'cloned';

/**
 * True when dependencies are installed and Run / dev actions are allowed.
 */
export const projectCanRun = (hookStatus: HookStatus): boolean =>
  hookStatus === 'configured' ||
  hookStatus === 'api_running' ||
  hookStatus === 'web_running' ||
  hookStatus === 'ready';
