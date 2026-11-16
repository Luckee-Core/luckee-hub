import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';

/**
 * After a PTY socket exhausts its retries: re-sync; reconnect sockets if the session is still live (G8).
 */
export const reconnectTerminalSessionThunk =
  (sessionId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const status = await dispatch(syncTerminalSessionsThunk());
    if (status === 200 && getState().terminalSessions[sessionId]) {
      dispatch(TerminalSidebarBuilderActions.bumpConnectionEpoch());
    }
    return status;
  };
