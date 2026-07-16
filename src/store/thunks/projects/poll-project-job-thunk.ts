import { getJobApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { addTerminalSessionsThunk, syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';
import { refreshProjectsThunk } from './load-projects-thunk';

const POLL_MS = 2000;
const MAX_POLLS = 90;

const clearRunOperation = (projectId: string): AppThunk => (dispatch) => {
  dispatch(RunningJobsActions.setRunningJob({ projectId, jobId: null }));
  dispatch(ProjectsBuilderActions.setRunInFlightProjectId(null));
};

/**
 * Poll launcher job until completed or failed; refresh project list on success.
 */
export const pollProjectJobThunk =
  (projectId: string, jobId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    for (let i = 0; i < MAX_POLLS; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      const result = await getJobApi(jobId);
      if (!result.success || !result.data) {
        continue;
      }

      const { status, sessions = [] } = result.data;
      if (sessions.length > 0) {
        await dispatch(addTerminalSessionsThunk(sessions));
      }
      if (status === 'running') {
        continue;
      }

      dispatch(clearRunOperation(projectId));
      if (status === 'completed') {
        await dispatch(syncTerminalSessionsThunk());
        await dispatch(refreshProjectsThunk());
        return 200;
      }
      if (status === 'failed') {
        const message = result.data.message ?? 'Launcher failed';
        dispatch(ProjectsBuilderActions.setListError(message));
        return 500;
      }
      return 500;
    }

    dispatch(clearRunOperation(projectId));
    return 500;
  };
