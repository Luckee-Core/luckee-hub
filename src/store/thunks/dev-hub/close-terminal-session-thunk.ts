import { killTerminalSessionApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';

/**
 * Kill a PTY session on hub Express and remove its tab from the dock.
 */
export const closeTerminalSessionThunk =
  (sessionId: string): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    await killTerminalSessionApi(sessionId);
    dispatch(DevHubBuilderActions.removeTerminalSession(sessionId));
    return 200;
  };
