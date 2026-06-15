import type {
  HubProject,
  LauncherJob,
  LocalDatabaseCleanupResult,
  LocalDatabaseProbe,
  LocalDatabaseSetupResult,
  LocalDatabaseStepResult,
  RunProjectResponse,
} from '@/model';
import { requestApi } from '@/api/_shared';
import type { ListProjectsResponse } from './types';
import { projectsApiBase } from './config';

type ListProjectsOptions = {
  /** When true, hub-express curls/lsof ports for running status (slower). */
  live?: boolean;
};

/**
 * Probe hub.local.json setup status for catalog projects from hub Express API.
 */
export const listProjectsApi = (options: ListProjectsOptions = {}) => {
  const query = options.live ? '?live=1' : '';
  return requestApi<ListProjectsResponse>(`${projectsApiBase}/api/projects${query}`);
};

/**
 * Start project dev servers (async job).
 */
export const runProjectApi = (projectId: string) =>
  requestApi<RunProjectResponse>(`${projectsApiBase}/api/launcher/projects/${projectId}/run`, {
    method: 'POST',
  });

/**
 * Open Cursor workspace for a project.
 */
export const openCursorApi = (projectId: string) =>
  requestApi<void>(`${projectsApiBase}/api/launcher/projects/${projectId}/open-cursor`, {
    method: 'POST',
  });

/**
 * Open Chrome for a project web URL.
 */
export const openChromeApi = (projectId: string) =>
  requestApi<void>(`${projectsApiBase}/api/launcher/projects/${projectId}/open-chrome`, {
    method: 'POST',
  });

/**
 * Poll async launcher job status.
 */
export const getJobApi = (jobId: string) =>
  requestApi<LauncherJob>(`${projectsApiBase}/api/launcher/jobs/${jobId}`);

/**
 * Probe local database status for a project.
 */
export const probeLocalDatabaseApi = (projectId: string) =>
  requestApi<LocalDatabaseProbe>(
    `${projectsApiBase}/api/projects/${projectId}/local-database`,
  );

/**
 * Setup local database for a project (createdb, migrations, .env).
 */
export const setupLocalDatabaseApi = (projectId: string) =>
  requestApi<LocalDatabaseSetupResult>(
    `${projectsApiBase}/api/projects/${projectId}/local-database/setup`,
    { method: 'POST' },
  );

/**
 * Run a single local database setup step for a project.
 */
export const runLocalDatabaseStepApi = (projectId: string, stepId: string) =>
  requestApi<LocalDatabaseStepResult>(
    `${projectsApiBase}/api/projects/${projectId}/local-database/steps/${encodeURIComponent(stepId)}/run`,
    { method: 'POST' },
  );

/**
 * Build cleanup URL for tab-close beacon requests.
 */
export const getLocalDatabaseCleanupUrl = (projectId: string): string =>
  `${projectsApiBase}/api/projects/${projectId}/local-database/cleanup`;

/**
 * Stop hub-managed Postgres for a project (tab close or manual cleanup).
 */
export const cleanupLocalDatabaseApi = (projectId: string) =>
  requestApi<LocalDatabaseCleanupResult>(
    getLocalDatabaseCleanupUrl(projectId),
    { method: 'POST' },
  );
