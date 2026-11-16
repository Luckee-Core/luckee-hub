import type { AppThunk } from '@/store/store';
import { hydrateUiPreferencesThunk } from '@/store/thunks/projects/hydrate-ui-preferences-thunk';
import { loadHubConfigThunk } from '@/store/thunks/projects/hub-config-thunk';
import { loadProjectsThunk } from '@/store/thunks/projects/load-projects-thunk';
import { applyTerminalSidebarPreferencesThunk } from './apply-terminal-sidebar-preferences-thunk';
import { runtimeSyncSchedulerHandle } from './runtime-sync-scheduler-handle';
import { startRuntimeSyncSchedulerThunk } from './start-runtime-sync-scheduler-thunk';
import { syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';

let initializing: Promise<200 | 400 | 500> | null = null;

/**
 * App start: sidebar preferences, hub config + UI preferences (favorites / sections), catalog, first full terminal sync, then the always-on
 * sync scheduler. Idempotent (ADR 025 §2).
 */
export const initializeAppThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  (dispatch) => {
    if (runtimeSyncSchedulerHandle.stop) {
      return Promise.resolve(200);
    }
    if (initializing) {
      return initializing;
    }
    initializing = (async () => {
      await dispatch(applyTerminalSidebarPreferencesThunk());
      await Promise.all([dispatch(loadHubConfigThunk()), dispatch(hydrateUiPreferencesThunk())]);
      const catalogStatus = await dispatch(loadProjectsThunk());
      await dispatch(syncTerminalSessionsThunk({ mode: 'sync' }));
      await dispatch(startRuntimeSyncSchedulerThunk());
      return catalogStatus;
    })().finally(() => {
      initializing = null;
    });
    return initializing;
  };
