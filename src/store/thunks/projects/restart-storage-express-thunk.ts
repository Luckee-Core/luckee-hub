import { restartStorageExpressApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { focusProjectTerminalThunk } from '@/store/thunks/terminal-sidebar/focus-project-terminal-thunk';
import { syncTerminalSessionsThunk } from '@/store/thunks/terminal-sidebar/sync-terminal-sessions-thunk';
import { loadProjectsThunk } from './load-projects-thunk';

/**
 * Stop and start Storage Express from the repo header, then focus its new terminal.
 */
export const restartStorageExpressThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(
      ProjectsBuilderActions.setStorageExpressInFlight({ projectId, action: 'restart' }),
    );
    dispatch(ProjectsBuilderActions.setStorageExpressError({ projectId, error: null }));
    dispatch(ProjectsBuilderActions.setStorageExpressMessage({ projectId, message: null }));

    try {
      const result = await restartStorageExpressApi(projectId);
      if (!result.success || !result.data) {
        const error = result.error ?? 'Failed to restart storage';
        dispatch(ProjectsBuilderActions.setStorageExpressError({ projectId, error }));
        return result.httpStatus === 400 ? 400 : 500;
      }

      await dispatch(syncTerminalSessionsThunk({ mode: 'sync' }));
      await dispatch(focusProjectTerminalThunk(projectId, 'storage-express'));
      dispatch(
        ProjectsBuilderActions.setStorageExpressMessage({
          projectId,
          message: result.data.wasRunning ? 'Storage restarted.' : 'Storage started.',
        }),
      );

      await dispatch(loadProjectsThunk({ live: true, syncTerminals: false }));
      return 200;
    } finally {
      dispatch(ProjectsBuilderActions.setStorageExpressInFlight(null));
    }
  };
