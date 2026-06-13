import type {
  HubProject,
  LauncherJob,
  LocalDatabaseProbe,
  LocalDatabaseSetupResult,
  RunProjectResponse,
} from '@/model';
import { requestApi } from '@/api/_shared';
import { projectsApiBase } from './config';

type ListProjectsOptions = {
  /** When true, hub-express curls/lsof ports for running status (slower). */
  live?: boolean;
};

/**
 * List projects with hook status from hub Express API.
 */
export const listProjectsApi = (options: ListProjectsOptions = {}) => {
  const query = options.live ? '?live=1' : '';
  return requestApi<HubProject[]>(`${projectsApiBase}/api/projects${query}`);
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
