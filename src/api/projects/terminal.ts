import { requestApi } from '@/api/_shared';
import type { TerminalSession } from '@/model';
import { projectsApiBase } from './config';

/**
 * List active terminal sessions from hub Express.
 */
export const listTerminalSessionsApi = () =>
  requestApi<TerminalSession[]>(`${projectsApiBase}/api/terminals`);

/**
 * Sync terminal sessions — restore PTYs and detect running project ports.
 */
export const syncTerminalSessionsApi = () =>
  requestApi<TerminalSession[]>(`${projectsApiBase}/api/terminals/sync`, {
    method: 'POST',
  });

/**
 * Kill a terminal session.
 */
export const killTerminalSessionApi = (sessionId: string) =>
  requestApi<void>(`${projectsApiBase}/api/terminals/${sessionId}`, {
    method: 'DELETE',
  });

/**
 * Build WebSocket URL for a terminal session.
 */
export const getTerminalWebSocketUrl = (sessionId: string): string => {
  const wsBase = projectsApiBase.replace(/^http/, 'ws');
  return `${wsBase}/api/terminals/ws/${encodeURIComponent(sessionId)}`;
};
