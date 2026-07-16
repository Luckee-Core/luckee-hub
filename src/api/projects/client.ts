import type {
  HubProject,
  LauncherJob,
  LocalDatabaseCleanupResult,
  LocalDatabaseProbe,
  LocalDatabaseSetupResult,
  LocalDatabaseStepResult,
  CloseProjectResponse,
  RunProjectResponse,
} from '@/model';
import { requestApi } from '@/api/_shared';
import type { HubConfigData, ListProjectsResponse, SetupProjectResponse } from './types';
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
 * Close project dev servers and stop hub-managed Postgres when idle.
 */
export const closeProjectApi = (projectId: string) =>
  requestApi<CloseProjectResponse>(`${projectsApiBase}/api/launcher/projects/${projectId}/close`, {
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
 * Read hub machine config (luckeeParent, githubOrg).
 */
export const getHubConfigApi = () =>
  requestApi<HubConfigData>(`${projectsApiBase}/api/projects/hub-config`);

/**
 * Save luckeeParent in hub.local.json.
 */
export const putHubConfigApi = (luckeeParent: string) =>
  requestApi<{ luckeeParent: string }>(`${projectsApiBase}/api/projects/hub-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ luckeeParent }),
  });

/**
 * Open macOS Finder folder picker and save luckeeParent.
 */
export const pickHubConfigFolderApi = () =>
  requestApi<{ luckeeParent: string }>(`${projectsApiBase}/api/projects/hub-config/pick-folder`, {
    method: 'POST',
  });

/**
 * Clone repos and npm install for a catalog project (async job).
 */
export const setupProjectApi = (projectId: string) =>
  requestApi<SetupProjectResponse>(`${projectsApiBase}/api/launcher/projects/${projectId}/setup`, {
    method: 'POST',
  });

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
