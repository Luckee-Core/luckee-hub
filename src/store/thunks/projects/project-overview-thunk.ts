import { getProjectOverviewApi } from '@/api/projects/client';
import type { AppThunk } from '@/store/store';
import { ProjectOverviewsActions } from '@/store/dumps/projectOverviews';

/**
 * Load the hand-written overview for a project (Overview tab). Stores `null` when none exists.
 */
export const loadProjectOverviewThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    const result = await getProjectOverviewApi(projectId);
    if (!result.success) {
      dispatch(ProjectOverviewsActions.setOverview({ projectId, overview: null }));
      return result.httpStatus === 400 ? 400 : 500;
    }
    dispatch(ProjectOverviewsActions.setOverview({ projectId, overview: result.data ?? null }));
    return 200;
  };
