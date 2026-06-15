import {
  probeLocalDatabaseApi,
  setupLocalDatabaseApi,
} from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { LocalDatabaseProbesActions } from '@/store/dumps/localDatabaseProbes';

/**
 * Probe local database status for the current project.
 */
export const probeLocalDatabaseThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(ProjectsBuilderActions.setActiveLocalDatabaseProjectId(projectId));
    dispatch(ProjectsBuilderActions.setLocalDatabaseOperation('probe'));
    dispatch(ProjectsBuilderActions.setActiveLocalDatabaseStepId(null));
    dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setLocalDatabaseError(null));

    const result = await probeLocalDatabaseApi(projectId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('error'));
      dispatch(ProjectsBuilderActions.setLocalDatabaseOperation(null));
      dispatch(ProjectsBuilderActions.setLocalDatabaseError(result.error ?? 'Probe failed'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(
      LocalDatabaseProbesActions.upsertLocalDatabaseProbe({
        projectId,
        probe: result.data,
      }),
    );
    dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('loaded'));
    dispatch(ProjectsBuilderActions.setLocalDatabaseOperation(null));
    return 200;
  };

/**
 * Setup local database (createdb, migrations, .env) for a project.
 */
export const setupLocalDatabaseThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(ProjectsBuilderActions.setActiveLocalDatabaseProjectId(projectId));
    dispatch(ProjectsBuilderActions.setLocalDatabaseOperation('setup'));
    dispatch(ProjectsBuilderActions.setActiveLocalDatabaseStepId(null));
    dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setLocalDatabaseError(null));
    dispatch(ProjectsBuilderActions.setLocalDatabaseSetupMessage(null));

    const result = await setupLocalDatabaseApi(projectId);
    if (!result.success || !result.data) {
      dispatch(ProjectsBuilderActions.setLocalDatabaseLoadStatus('error'));
      dispatch(ProjectsBuilderActions.setLocalDatabaseOperation(null));
      dispatch(ProjectsBuilderActions.setLocalDatabaseError(result.error ?? 'Setup failed'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setLocalDatabaseSetupMessage(result.data.message));
    await dispatch(probeLocalDatabaseThunk(projectId));
    return 200;
  };
