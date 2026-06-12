import { runStudioApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';
import { pollDevHubJobThunk } from './poll-dev-hub-job-thunk';

/**
 * Run studio dev servers and poll job until complete.
 */
export const runDevHubStudioThunk =
  (studioId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    const result = await runStudioApi(studioId);
    if (!result.success || !result.data?.jobId) {
      return result.httpStatus === 400 ? 400 : 500;
    }

    const { jobId, sessions = [] } = result.data;
    dispatch(DevHubBuilderActions.setRunningJob({ studioId, jobId }));
    if (sessions.length > 0) {
      dispatch(DevHubBuilderActions.addTerminalSessions(sessions));
      dispatch(DevHubBuilderActions.setTerminalDockOpen(true));
      dispatch(
        DevHubBuilderActions.setActiveTerminalSessionId(sessions[0]?.sessionId ?? null),
      );
    }
    void dispatch(pollDevHubJobThunk(studioId, jobId));
    return 200;
  };
