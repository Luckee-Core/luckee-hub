import type { AppThunk } from '@/store/store';
import { CurrentProjectActions } from '@/store/current/currentProject';

/**
 * Hydrate `currentProject` from the projects dump before navigating to project detail.
 */
export const setCurrentProjectThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  (dispatch, getState) => {
    const project = getState().projects[projectId];
    if (!project) {
      return Promise.resolve(400);
    }
    dispatch(CurrentProjectActions.setCurrentProject(project));
    return Promise.resolve(200);
  };
