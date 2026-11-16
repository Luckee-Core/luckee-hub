import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';

/**
 * Switch the active terminal tab.
 */
export const setActiveTerminalSessionThunk =
  (sessionId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    if (!getState().terminalSessions[sessionId]) {
      return 400;
    }
    dispatch(TerminalSidebarBuilderActions.setActiveTerminalSessionId(sessionId));
    return 200;
  };
