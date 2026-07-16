import { getJobApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { refreshProjectsThunk } from './load-projects-thunk';

const POLL_MS = 2000;
const MAX_POLLS = 360;

const clearSetupOperation = (projectId: string): AppThunk => (dispatch) => {
  dispatch(RunningJobsActions.setRunningJob({ projectId, jobId: null }));
};

/**
 * Poll setup job until completed or failed; refresh project list on success.
 */
export const pollProjectSetupJobThunk =
  (projectId: string, jobId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    for (let i = 0; i < MAX_POLLS; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      const result = await getJobApi(jobId);
      if (!result.success || !result.data) {
        continue;
      }

      const { status, message, steps = [] } = result.data;
      const statusMessage = message ?? 'Working...';
      dispatch(ProjectsBuilderActions.setSetupModalMessage(statusMessage));
      if (steps.length > 0) {
        dispatch(ProjectsBuilderActions.setSetupModalSteps(steps));
      }

      if (status === 'running') {
        continue;
      }

      dispatch(clearSetupOperation(projectId));
      if (status === 'completed') {
        dispatch(
          ProjectsBuilderActions.setSetupModalStatus({
            status: 'completed',
            message: statusMessage,
          }),
        );
        if (steps.length > 0) {
          dispatch(ProjectsBuilderActions.setSetupModalSteps(steps));
        }
        await dispatch(refreshProjectsThunk());
        return 200;
      }
      if (status === 'failed') {
        dispatch(
          ProjectsBuilderActions.setSetupModalStatus({
            status: 'failed',
            message: statusMessage,
          }),
        );
        if (steps.length > 0) {
          dispatch(ProjectsBuilderActions.setSetupModalSteps(steps));
        }
        return 500;
      }
      dispatch(
        ProjectsBuilderActions.setSetupModalStatus({
          status: 'failed',
          message: 'Setup failed',
        }),
      );
      return 500;
    }

    dispatch(clearSetupOperation(projectId));
    dispatch(
      ProjectsBuilderActions.setSetupModalStatus({
        status: 'failed',
        message: 'Setup timed out — try again',
      }),
    );
    return 500;
  };
