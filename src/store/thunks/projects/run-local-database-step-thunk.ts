import { runLocalDatabaseStepApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { probeLocalDatabaseThunk } from './local-database-thunk';

/**
 * Run a single local database setup step for a project.
 */
export const runLocalDatabaseStepThunk =
  (projectId: string, stepId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    if (stepId === 'refresh') {
      return dispatch(probeLocalDatabaseThunk(projectId));
    }

    dispatch(ProjectsBuilderActions.setActiveLocalDatabaseProjectId(projectId));
    dispatch(ProjectsBuilderActions.setLocalDatabaseOperation('step'));
    dispatch(ProjectsBuilderActions.setActiveLocalDatabaseStepId(stepId));
    dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setLocalDatabaseError(null));

    const result = await runLocalDatabaseStepApi(projectId, stepId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('error'));
      dispatch(ProjectsBuilderActions.setLocalDatabaseOperation(null));
      dispatch(ProjectsBuilderActions.setActiveLocalDatabaseStepId(null));
      dispatch(ProjectsBuilderActions.setLocalDatabaseError(result.error ?? 'Step failed'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    await dispatch(probeLocalDatabaseThunk(projectId));
    return 200;
  };
