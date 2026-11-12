import { listProjectsApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { CurrentProjectActions } from '@/store/current/currentProject';
import { ProjectsActions } from '@/store/dumps/projects';
import { ProjectReposActions } from '@/store/dumps/projectRepos';
import { wait } from '@/utils/async';
import { syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';

/** First load keeps the loading state up at least this long so it doesn't flash. */
const MIN_INITIAL_LOAD_MS = 2000;

type LoadProjectsOptions = {
  /** Curl/lsof ports for Ready / API running / Web running badges. */
  live?: boolean;
  /** After a live list, reopen WebSockets for existing session ids. */
  reconnectTerminals?: boolean;
};

/**
 * Load the project catalog and hub.local.json setup status from hub Express.
 */
export const loadProjectsThunk =
  (options: LoadProjectsOptions = {}): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const live = options.live ?? false;
    const reconnectTerminals = options.reconnectTerminals ?? false;
    const hasProjects = Object.keys(getState().projects).length > 0;

    if (!hasProjects) {
      dispatch(ProjectsBuilderActions.setListLoadStatus('loading'));
      dispatch(ProjectsBuilderActions.setListError(null));
    }

    const [result] = await Promise.all([
      listProjectsApi({ live }),
      hasProjects ? Promise.resolve() : wait(MIN_INITIAL_LOAD_MS),
    ]);
    if (!result.success || !result.data) {
      if (!hasProjects) {
        dispatch(ProjectsBuilderActions.setListLoadStatus('error'));
        dispatch(ProjectsBuilderActions.setListError(result.error ?? 'Failed to load projects'));
      } else {
        dispatch(ProjectsBuilderActions.setListLoadStatus('loaded'));
        dispatch(ProjectsBuilderActions.setListError(result.error ?? 'Failed to load projects'));
      }
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsActions.setProjects(result.data.projects));
    dispatch(ProjectReposActions.setProjectRepos(result.data.repos));
    dispatch(ProjectsBuilderActions.setListLoadStatus('loaded'));

    const currentProject = getState().currentProject;
    const refreshedCurrent = getState().projects[currentProject.id];
    if (
      refreshedCurrent &&
      (refreshedCurrent.apiPort !== currentProject.apiPort ||
        refreshedCurrent.hookStatus !== currentProject.hookStatus ||
        refreshedCurrent.webUrl !== currentProject.webUrl ||
        refreshedCurrent.enabled !== currentProject.enabled ||
        refreshedCurrent.postgresActiveConsumer !== currentProject.postgresActiveConsumer ||
        refreshedCurrent.storageExpressSupported !== currentProject.storageExpressSupported ||
        refreshedCurrent.storageRunning !== currentProject.storageRunning ||
        refreshedCurrent.storagePort !== currentProject.storagePort)
    ) {
      dispatch(
        CurrentProjectActions.setCurrentProject({
          ...currentProject,
          apiPort: refreshedCurrent.apiPort,
          hookStatus: refreshedCurrent.hookStatus,
          webUrl: refreshedCurrent.webUrl,
          enabled: refreshedCurrent.enabled,
          postgresActiveConsumer: refreshedCurrent.postgresActiveConsumer,
          storageExpressSupported: refreshedCurrent.storageExpressSupported,
          storageRunning: refreshedCurrent.storageRunning,
          storagePort: refreshedCurrent.storagePort,
        }),
      );
    }

    if (live) {
      await dispatch(syncTerminalSessionsThunk());
      if (reconnectTerminals) {
        dispatch(ProjectsBuilderActions.incrementTerminalConnectionEpoch());
      }
    }

    return 200;
  };

type RefreshProjectsOptions = {
  reconnectTerminals?: boolean;
};

/**
 * Full refresh with live port probes (Refresh button).
 */
export const refreshProjectsThunk =
  (options: RefreshProjectsOptions = {}): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(ProjectsBuilderActions.setListLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setListError(null));
    return dispatch(
      loadProjectsThunk({
        live: true,
        reconnectTerminals: options.reconnectTerminals ?? false,
      }),
    );
  };
