import type { AppThunk } from '@/store/store';
import { CurrentProjectDetailActions } from '@/store/current/projectDetail';

/**
 * Set current project id for the detail page (caller navigates to /projects/detail).
 */
export const setCurrentProjectDetailThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(CurrentProjectDetailActions.setProjectId(projectId));
    return 200;
  };
