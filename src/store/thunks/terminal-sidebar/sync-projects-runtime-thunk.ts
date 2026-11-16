import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { loadProjectsThunk } from '@/store/thunks/projects/load-projects-thunk';
import { runExclusive } from './run-exclusive';

/**
 * Live port probe of the project catalog (API / web / storage running) for the sidebar's status dots.
 * Does not touch terminal sessions.
 */
export const syncProjectsRuntimeThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  (dispatch, getState) =>
    runExclusive('projects-runtime', async () => {
      const status = await dispatch(loadProjectsThunk({ live: true, syncTerminals: false }));
      if (status !== 200) {
        dispatch(
          TerminalSidebarBuilderActions.setRuntimeLastSyncError(
            getState().projectsBuilder.listError ?? 'Failed to check running projects',
          ),
        );
        return status;
      }
      dispatch(TerminalSidebarBuilderActions.setRuntimeLastSyncError(null));
      dispatch(TerminalSidebarBuilderActions.setRuntimeLastSyncedAt(new Date().toISOString()));
      return 200;
    });
