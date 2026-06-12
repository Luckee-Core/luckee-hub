import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';

/**
 * Switch the active terminal tab in the bottom dock.
 */
export const setActiveTerminalTabThunk =
  (sessionId: string): AppThunk<Promise<200>> =>
  async (dispatch) => {
    dispatch(DevHubBuilderActions.setActiveTerminalSessionId(sessionId));
    return 200;
  };
