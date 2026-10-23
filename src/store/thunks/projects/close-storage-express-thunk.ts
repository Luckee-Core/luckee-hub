import { closeStorageExpressApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { loadProjectsThunk } from './load-projects-thunk';
import { syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';

/**
 * Close Storage Express terminal for a project.
 */
export const closeStorageExpressThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(
      ProjectsBuilderActions.setStorageExpressInFlight({ projectId, action: 'close' }),
    );
    dispatch(
      ProjectsBuilderActions.setStorageExpressError({ projectId, error: null }),
    );
    dispatch(
      ProjectsBuilderActions.setStorageExpressMessage({ projectId, message: null }),
    );

    try {
      const result = await closeStorageExpressApi(projectId);
      if (!result.success) {
        const error = result.error ?? 'Failed to close storage';
        dispatch(ProjectsBuilderActions.setStorageExpressError({ projectId, error }));
        return result.httpStatus === 400 ? 400 : 500;
      }

      await dispatch(syncTerminalSessionsThunk());
      await dispatch(loadProjectsThunk({ live: true }));
      dispatch(
        ProjectsBuilderActions.setStorageExpressMessage({
          projectId,
          message: 'Storage terminal closed.',
        }),
      );
      return 200;
    } finally {
      dispatch(ProjectsBuilderActions.setStorageExpressInFlight(null));
    }
  };
