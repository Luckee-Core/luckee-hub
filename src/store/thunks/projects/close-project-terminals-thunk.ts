import { closeProjectApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsActions } from '@/store/dumps/projects';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { syncTerminalSessionsThunk } from '@/store/thunks/terminal-sidebar/sync-terminal-sessions-thunk';

/**
 * Close project dev servers, hub Postgres consumer, and stop Postgres when idle. Tabs follow from the
 * terminal sync that ends this thunk (ADR 025 G7).
 */
export const closeProjectTerminalsThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const result = await closeProjectApi(projectId);
    if (!result.success || !result.data) {
      return result.httpStatus === 400 ? 400 : 500;
    }

    await dispatch(syncTerminalSessionsThunk());

    dispatch(RunningJobsActions.setRunningJob({ projectId, jobId: null }));

    if (getState().projectsBuilder.runInFlightProjectId === projectId) {
      dispatch(ProjectsBuilderActions.setRunInFlightProjectId(null));
    }

    const project = getState().projects[projectId];
    if (project) {
      dispatch(
        ProjectsActions.upsertProject({
          ...project,
          postgresActiveConsumer: false,
        }),
      );
    }

    return 200;
  };
