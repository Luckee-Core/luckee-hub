import { listTerminalSessionsApi } from '@/api/projects';
import type { TerminalSession } from '@/model';
import type { AppThunk } from '@/store/store';
import { closeTerminalSessionThunk } from './close-terminal-session-thunk';

/**
 * Kill all hub terminal sessions (express + web) for a project.
 */
export const closeProjectTerminalsThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const listResult = await listTerminalSessionsApi();

    let sessions: TerminalSession[] = [];
    if (listResult.success && listResult.data) {
      sessions = listResult.data.filter((session) => session.projectId === projectId);
    } else {
      sessions = Object.values(getState().terminalSessions).filter(
        (session) => session.projectId === projectId,
      );
    }

    if (sessions.length === 0) {
      return 400;
    }

    for (const session of sessions) {
      await dispatch(closeTerminalSessionThunk(session.sessionId));
    }

    return 200;
  };
