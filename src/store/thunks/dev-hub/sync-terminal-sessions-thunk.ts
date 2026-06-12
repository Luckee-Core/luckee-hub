import { syncTerminalSessionsApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';

/**
 * Restore terminal tabs from hub-express after a browser refresh.
 */
export const syncTerminalSessionsThunk =
  (): AppThunk<Promise<200 | 500>> =>
  async (dispatch) => {
    const result = await syncTerminalSessionsApi();
    if (!result.success || !result.data) {
      return 500;
    }

    if (result.data.length > 0) {
      dispatch(DevHubBuilderActions.setTerminalSessions(result.data));
      dispatch(DevHubBuilderActions.setTerminalDockOpen(true));
    }

    return 200;
  };
