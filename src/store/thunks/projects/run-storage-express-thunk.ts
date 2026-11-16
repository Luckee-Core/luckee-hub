import { runStorageExpressApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { focusProjectTerminalThunk } from '@/store/thunks/terminal-sidebar/focus-project-terminal-thunk';
import { syncTerminalSessionsThunk } from '@/store/thunks/terminal-sidebar/sync-terminal-sessions-thunk';
import { loadProjectsThunk } from './load-projects-thunk';

/**
 * Start Storage Express from project detail (not list Run), then focus its terminal in the sidebar.
 */
export const runStorageExpressThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(
      ProjectsBuilderActions.setStorageExpressInFlight({ projectId, action: 'start' }),
    );
    dispatch(
      ProjectsBuilderActions.setStorageExpressError({ projectId, error: null }),
    );
    dispatch(
      ProjectsBuilderActions.setStorageExpressMessage({ projectId, message: null }),
    );

    try {
      const result = await runStorageExpressApi(projectId);
      if (!result.success || !result.data) {
        const error = result.error ?? 'Failed to start storage';
        dispatch(ProjectsBuilderActions.setStorageExpressError({ projectId, error }));
        return result.httpStatus === 400 ? 400 : 500;
      }

      const { sessions = [] } = result.data;
      await dispatch(syncTerminalSessionsThunk({ mode: 'sync' }));
      const focused = await dispatch(focusProjectTerminalThunk(projectId, 'storage-express'));

      dispatch(
        ProjectsBuilderActions.setStorageExpressMessage({
          projectId,
          message:
            sessions.length > 0
              ? 'Storage terminal opened in the terminal sidebar.'
              : focused === 200
                ? 'Storage was already running — its terminal is focused in the sidebar.'
                : 'Storage was already running.',
        }),
      );

      await dispatch(loadProjectsThunk({ live: true, syncTerminals: false }));
      return 200;
    } finally {
      dispatch(ProjectsBuilderActions.setStorageExpressInFlight(null));
    }
  };
