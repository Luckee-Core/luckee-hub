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
    const result = await closeStorageExpressApi(projectId);
    if (!result.success) {
      dispatch(ProjectsBuilderActions.setListError(result.error ?? 'Failed to close storage'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    await dispatch(syncTerminalSessionsThunk());
    await dispatch(loadProjectsThunk({ live: true }));
    return 200;
  };
