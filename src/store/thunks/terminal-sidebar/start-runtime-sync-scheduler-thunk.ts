import type { AppThunk } from '@/store/store';
import { runtimeSyncSchedulerHandle } from './runtime-sync-scheduler-handle';
import { syncProjectsRuntimeThunk } from './sync-projects-runtime-thunk';
import { syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';
import { toggleTerminalSidebarThunk } from './toggle-terminal-sidebar-thunk';

export const TERMINAL_SYNC_INTERVAL_MS = 5000;
export const RUNTIME_SYNC_INTERVAL_MS = 30_000;

/**
 * App-wide syncing (ADR 025 G4/G5): list terminals every 5s, probe project ports every 30s, both paused
 * while the page is hidden. Full terminal sync + port probe on visible/focus/online. ⌘J / Ctrl+J toggles
 * the terminal sidebar.
 */
export const startRuntimeSyncSchedulerThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    if (runtimeSyncSchedulerHandle.stop) {
      return 200;
    }

    const syncAll = (): void => {
      void dispatch(syncTerminalSessionsThunk({ mode: 'sync' }));
      void dispatch(syncProjectsRuntimeThunk());
    };

    const terminalTimer = window.setInterval(() => {
      if (!document.hidden) {
        void dispatch(syncTerminalSessionsThunk());
      }
    }, TERMINAL_SYNC_INTERVAL_MS);

    const runtimeTimer = window.setInterval(() => {
      if (!document.hidden) {
        void dispatch(syncProjectsRuntimeThunk());
      }
    }, RUNTIME_SYNC_INTERVAL_MS);

    const onVisibilityChange = (): void => {
      if (!document.hidden) {
        syncAll();
      }
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        void dispatch(toggleTerminalSidebarThunk());
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', syncAll);
    window.addEventListener('online', syncAll);
    window.addEventListener('keydown', onKeyDown);

    runtimeSyncSchedulerHandle.stop = () => {
      window.clearInterval(terminalTimer);
      window.clearInterval(runtimeTimer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', syncAll);
      window.removeEventListener('online', syncAll);
      window.removeEventListener('keydown', onKeyDown);
      runtimeSyncSchedulerHandle.stop = null;
    };
    return 200;
  };
