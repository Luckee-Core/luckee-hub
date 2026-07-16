import { setupProjectApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { hasActiveRunOperation, hasActiveSetupOperation } from '@/utils/projects';
import { pollProjectSetupJobThunk } from './poll-project-setup-job-thunk';

/**
 * Clone project repos, npm install, and poll setup job until complete.
 */
export const setupProjectThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const state = getState();
    if (hasActiveSetupOperation(state) || hasActiveRunOperation(state)) {
      return 400;
    }

    if (!state.projectsBuilder.luckeeParent) {
      dispatch(ProjectsBuilderActions.setLuckeeParentModalOpen(true));
      return 400;
    }

    dispatch(
      ProjectsBuilderActions.openSetupModal({
        projectId,
        message: 'Starting setup...',
      }),
    );

    const result = await setupProjectApi(projectId);
    if (!result.success || !result.data?.jobId) {
      const message = result.error ?? 'Setup failed to start';
      dispatch(
        ProjectsBuilderActions.setSetupModalStatus({
          status: 'failed',
          message,
        }),
      );
      return result.httpStatus === 400 ? 400 : 500;
    }

    const { jobId } = result.data;
    dispatch(RunningJobsActions.setRunningJob({ projectId, jobId }));

    void dispatch(pollProjectSetupJobThunk(projectId, jobId));
    return 200;
  };
