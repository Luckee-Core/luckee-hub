import { runProjectApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsActions } from '@/store/dumps/projects';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { addTerminalSessionsThunk } from './sync-terminal-sessions-thunk';
import { pollProjectJobThunk } from './poll-project-job-thunk';

/**
 * Run project dev servers and poll job until complete.
 */
export const runProjectThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const result = await runProjectApi(projectId);
    if (!result.success || !result.data?.jobId) {
      return result.httpStatus === 400 ? 400 : 500;
    }

    const { jobId, sessions = [] } = result.data;
    dispatch(RunningJobsActions.setRunningJob({ projectId, jobId }));
    if (sessions.length > 0) {
      await dispatch(addTerminalSessionsThunk(sessions));
    }

    const project = getState().projects[projectId];
    if (project?.localDatabaseSupported) {
      dispatch(
        ProjectsActions.upsertProject({
          ...project,
          postgresActiveConsumer: true,
        }),
      );
    }

    void dispatch(pollProjectJobThunk(projectId, jobId));
    return 200;
  };
