import { runStorageExpressApi, syncTerminalSessionsApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { addTerminalSessionsThunk, syncTerminalSessionsThunk } from './sync-terminal-sessions-thunk';
import { loadProjectsThunk } from './load-projects-thunk';

/**
 * Start Storage Express from project detail (not list Run).
 */
export const runStorageExpressThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(
      ProjectsBuilderActions.setStorageExpressInFlight({ projectId, action: 'start' }),
    );
    dispatch(
      ProjectsBuilderActions.setStorageExpressError({ projectId, error: null }),
    );
    dispatch(
      ProjectsBuilderActions.setStorageExpressMessage({ projectId, message: null }),
    );

    try {
      const result = await runStorageExpressApi(projectId);
      if (!result.success || !result.data) {
        const error = result.error ?? 'Failed to start storage';
        dispatch(ProjectsBuilderActions.setStorageExpressError({ projectId, error }));
        return result.httpStatus === 400 ? 400 : 500;
      }

      const { sessions = [] } = result.data;

      const syncResult = await syncTerminalSessionsApi();
      if (syncResult.success && syncResult.data) {
        const storageSessionIds = syncResult.data
          .filter((s) => s.projectId === projectId && s.role === 'storage-express')
          .map((s) => s.sessionId);
        const reopenIds = [
          ...sessions.map((s) => s.sessionId),
          ...storageSessionIds,
        ];
        dispatch(ProjectsBuilderActions.removeClosedTerminalSessionIds(reopenIds));
      } else if (sessions.length > 0) {
        dispatch(
          ProjectsBuilderActions.removeClosedTerminalSessionIds(
            sessions.map((s) => s.sessionId),
          ),
        );
      }

      if (sessions.length > 0) {
        await dispatch(addTerminalSessionsThunk(sessions));
        dispatch(
          ProjectsBuilderActions.setStorageExpressMessage({
            projectId,
            message: 'Storage terminal opened — check the dock below.',
          }),
        );
      } else {
        await dispatch(syncTerminalSessionsThunk());
        dispatch(
          ProjectsBuilderActions.setStorageExpressMessage({
            projectId,
            message:
              'Storage was already running — terminal dock opened (or scroll to the dock below).',
          }),
        );
      }

      await dispatch(loadProjectsThunk({ live: true }));
      return 200;
    } finally {
      dispatch(ProjectsBuilderActions.setStorageExpressInFlight(null));
    }
  };
