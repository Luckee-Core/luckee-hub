import { getJobApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';
import { refreshDevHubStudiosThunk } from './refresh-dev-hub-studios-thunk';

const POLL_MS = 2000;
const MAX_POLLS = 90;

/**
 * Poll launcher job until completed or failed; refresh studio list on success.
 */
export const pollDevHubJobThunk =
  (studioId: string, jobId: string): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    for (let i = 0; i < MAX_POLLS; i += 1) {
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      const result = await getJobApi(jobId);
      if (!result.success || !result.data) {
        continue;
      }

      const { status, sessions = [] } = result.data;
      if (sessions.length > 0) {
        dispatch(DevHubBuilderActions.addTerminalSessions(sessions));
      }
      if (status === 'running') {
        continue;
      }

      dispatch(DevHubBuilderActions.setRunningJob({ studioId, jobId: null }));
      if (status === 'completed') {
        await dispatch(refreshDevHubStudiosThunk());
        return 200;
      }
      if (status === 'failed') {
        const message = result.data.message ?? 'Launcher failed';
        dispatch(DevHubBuilderActions.setListError(message));
        return 500;
      }
      return 500;
    }

    dispatch(DevHubBuilderActions.setRunningJob({ studioId, jobId: null }));
    return 500;
  };
