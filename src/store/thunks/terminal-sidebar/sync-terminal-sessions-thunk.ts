import { listTerminalSessionsApi, syncTerminalSessionsApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { TerminalSessionsActions } from '@/store/dumps/terminalSessions';
import { orderTerminalSessions, resolveNextActiveTerminalId } from '@/utils/terminals';
import { runExclusive } from './run-exclusive';

type SyncTerminalSessionsOptions = {
  /**
   * `list` (default) reads hub Express's live sessions and spawns nothing — used by the 5s poll.
   * `sync` also restores PTYs and attaches status tabs for projects already on their ports.
   */
  mode?: 'list' | 'sync';
};

/**
 * Single writer of `terminalSessions` (ADR 025 G1/G2): full replace from hub Express. On failure the
 * last known sessions stay and the failure is recorded (G3).
 */
export const syncTerminalSessionsThunk =
  (options: SyncTerminalSessionsOptions = {}): AppThunk<Promise<200 | 400 | 500>> =>
  (dispatch, getState) => {
    const mode = options.mode ?? 'list';
    return runExclusive(`terminal-sessions:${mode}`, async () => {
      const result = mode === 'sync' ? await syncTerminalSessionsApi() : await listTerminalSessionsApi();
      if (!result.success || !result.data) {
        const failures = getState().terminalSidebarBuilder.terminalConsecutiveFailures;
        dispatch(TerminalSidebarBuilderActions.setTerminalConsecutiveFailures(failures + 1));
        dispatch(
          TerminalSidebarBuilderActions.setTerminalLastSyncError(
            result.error ?? 'Failed to sync terminals',
          ),
        );
        return result.httpStatus === 400 ? 400 : 500;
      }

      dispatch(TerminalSessionsActions.replaceTerminalSessions(result.data));

      const ordered = orderTerminalSessions(getState().terminalSessions, getState().projects);
      const activeId = resolveNextActiveTerminalId(
        getState().terminalSidebarBuilder.activeTerminalSessionId,
        ordered.map((session) => session.sessionId),
      );
      dispatch(TerminalSidebarBuilderActions.setActiveTerminalSessionId(activeId));
      dispatch(TerminalSidebarBuilderActions.setTerminalConsecutiveFailures(0));
      dispatch(TerminalSidebarBuilderActions.setTerminalLastSyncError(null));
      dispatch(TerminalSidebarBuilderActions.setTerminalLastSyncedAt(new Date().toISOString()));
      return 200;
    });
  };
