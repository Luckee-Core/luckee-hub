import type { DevHubStudio, LauncherJob, RunStudioResponse } from '@/model';
import { requestApi } from '@/api/_shared';
import { devHubApiBase } from './config';

type ListStudiosOptions = {
  /** When true, hub-express curls/lsof ports for running status (slower). */
  live?: boolean;
};

/**
 * List studios with hook status from hub Express API.
 */
export const listStudiosApi = (options: ListStudiosOptions = {}) => {
  const query = options.live ? '?live=1' : '';
  return requestApi<DevHubStudio[]>(`${devHubApiBase}/api/studios${query}`);
};

/**
 * Start studio dev servers (async job).
 */
export const runStudioApi = (studioId: string) =>
  requestApi<RunStudioResponse>(`${devHubApiBase}/api/launcher/studios/${studioId}/run`, {
    method: 'POST',
  });

/**
 * Open Cursor workspace for a studio.
 */
export const openCursorApi = (studioId: string) =>
  requestApi<void>(`${devHubApiBase}/api/launcher/studios/${studioId}/open-cursor`, {
    method: 'POST',
  });

/**
 * Open Chrome for a studio web URL.
 */
export const openChromeApi = (studioId: string) =>
  requestApi<void>(`${devHubApiBase}/api/launcher/studios/${studioId}/open-chrome`, {
    method: 'POST',
  });

/**
 * Poll async launcher job status.
 */
export const getJobApi = (jobId: string) =>
  requestApi<LauncherJob>(`${devHubApiBase}/api/launcher/jobs/${jobId}`);
