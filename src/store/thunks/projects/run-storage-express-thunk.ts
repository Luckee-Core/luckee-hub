import { runStorageExpressApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { addTerminalSessionsThunk } from './sync-terminal-sessions-thunk';
import { loadProjectsThunk } from './load-projects-thunk';

/**
 * Start Storage Express from project detail (not list Run).
 */
export const runStorageExpressThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(ProjectsBuilderActions.setListError(null));

    const result = await runStorageExpressApi(projectId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setListError(result.error ?? 'Failed to start storage'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    const { sessions = [] } = result.data;
    if (sessions.length > 0) {
      await dispatch(addTerminalSessionsThunk(sessions));
    }

    await dispatch(loadProjectsThunk({ live: true }));
    return 200;
  };
