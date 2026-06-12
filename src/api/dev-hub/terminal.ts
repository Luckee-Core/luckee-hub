import { requestApi } from '@/api/_shared';
import type { TerminalSession } from '@/model';
import { devHubApiBase } from './config';

/**
 * List active terminal sessions from hub Express.
 */
export const listTerminalSessionsApi = () =>
  requestApi<TerminalSession[]>(`${devHubApiBase}/api/terminals`);

/**
 * Sync terminal sessions — restore PTYs and detect running studio ports.
 */
export const syncTerminalSessionsApi = () =>
  requestApi<TerminalSession[]>(`${devHubApiBase}/api/terminals/sync`, {
    method: 'POST',
  });

/**
 * Kill a terminal session.
 */
export const killTerminalSessionApi = (sessionId: string) =>
  requestApi<void>(`${devHubApiBase}/api/terminals/${sessionId}`, {
    method: 'DELETE',
  });

/**
 * Build WebSocket URL for a terminal session.
 */
export const getTerminalWebSocketUrl = (sessionId: string): string => {
  const wsBase = devHubApiBase.replace(/^http/, 'ws');
  return `${wsBase}/api/terminals/ws/${encodeURIComponent(sessionId)}`;
};
