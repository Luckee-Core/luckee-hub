import type { TerminalSession } from '@/model';
import type { AppThunk, RootState } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { orderTerminalSessions } from '@/utils/terminals';
import { setTerminalSidebarOpenThunk } from './set-terminal-sidebar-open-thunk';
import { syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';

const findSessionId = (
  state: RootState,
  projectId: string,
  role?: TerminalSession['role'],
): string | null =>
  orderTerminalSessions(state.terminalSessions, state.projects).find(
    (session) => session.projectId === projectId && (role === undefined || session.role === role),
  )?.sessionId ?? null;

/**
 * Opens the sidebar and focuses a project's terminal for `role` (or its first terminal).
 * Syncs once when the session is not known yet.
 */
export const focusProjectTerminalThunk =
  (projectId: string, role?: TerminalSession['role']): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    await dispatch(setTerminalSidebarOpenThunk(true));
    let sessionId = findSessionId(getState(), projectId, role);
    if (!sessionId) {
      await dispatch(syncTerminalSessionsThunk());
      sessionId = findSessionId(getState(), projectId, role);
    }
    if (!sessionId) {
      return 400;
    }
    dispatch(TerminalSidebarBuilderActions.setActiveTerminalSessionId(sessionId));
    return 200;
  };
