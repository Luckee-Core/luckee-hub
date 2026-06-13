import { syncTerminalSessionsApi } from '@/api/projects';
import type { TerminalSession } from '@/model';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { TerminalSessionsActions } from '@/store/dumps/terminalSessions';

/**
 * Restore terminal tabs from hub-express after a browser refresh.
 */
export const syncTerminalSessionsThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const result = await syncTerminalSessionsApi();
    if (!result.success || !result.data) {
      return 500;
    }

    const sessions = result.data;
    dispatch(TerminalSessionsActions.replaceTerminalSessions(sessions));
    dispatch(
      ProjectsBuilderActions.setTerminalSessionOrder(sessions.map((s) => s.sessionId)),
    );

    if (sessions.length > 0) {
      const { activeTerminalSessionId } = getState().projectsBuilder;
      const activeStillExists = sessions.some((s) => s.sessionId === activeTerminalSessionId);
      if (!activeStillExists) {
        dispatch(ProjectsBuilderActions.setActiveTerminalSessionId(sessions[0]?.sessionId ?? null));
      }
      dispatch(ProjectsBuilderActions.setTerminalDockOpen(true));
    }

    return 200;
  };

/**
 * Upsert terminal sessions into the dump and append new ids to tab order.
 */
export const addTerminalSessionsThunk =
  (sessions: TerminalSession[]): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    if (sessions.length === 0) {
      return 200;
    }

    dispatch(TerminalSessionsActions.upsertTerminalSessions(sessions));

    const { terminalSessionOrder, activeTerminalSessionId } = getState().projectsBuilder;
    const existing = new Set(terminalSessionOrder);
    const newIds = sessions.map((s) => s.sessionId).filter((id) => !existing.has(id));
    dispatch(ProjectsBuilderActions.setTerminalSessionOrder([...terminalSessionOrder, ...newIds]));

    if (!activeTerminalSessionId) {
      dispatch(ProjectsBuilderActions.setActiveTerminalSessionId(sessions[0]?.sessionId ?? null));
    }

    dispatch(ProjectsBuilderActions.setTerminalDockOpen(true));
    return 200;
  };
