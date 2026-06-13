import { killTerminalSessionApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { TerminalSessionsActions } from '@/store/dumps/terminalSessions';

/**
 * Kill a PTY session on hub Express and remove its tab from the dock.
 */
export const closeTerminalSessionThunk =
  (sessionId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    await killTerminalSessionApi(sessionId);

    const { terminalSessionOrder, activeTerminalSessionId } = getState().projectsBuilder;
    const index = terminalSessionOrder.indexOf(sessionId);
    const nextOrder = terminalSessionOrder.filter((id) => id !== sessionId);

    dispatch(TerminalSessionsActions.removeTerminalSession(sessionId));
    dispatch(ProjectsBuilderActions.setTerminalSessionOrder(nextOrder));

    if (activeTerminalSessionId === sessionId) {
      const nextSessionId =
        nextOrder[index] ?? nextOrder[index - 1] ?? nextOrder[0] ?? null;
      dispatch(ProjectsBuilderActions.setActiveTerminalSessionId(nextSessionId));
    }

    if (nextOrder.length === 0) {
      dispatch(ProjectsBuilderActions.setTerminalDockOpen(false));
    }

    return 200;
  };
