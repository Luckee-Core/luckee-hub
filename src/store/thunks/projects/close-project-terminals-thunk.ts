import { closeProjectApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsActions } from '@/store/dumps/projects';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { TerminalSessionsActions } from '@/store/dumps/terminalSessions';

/**
 * Close project dev servers, hub Postgres consumer, and stop Postgres when idle.
 */
export const closeProjectTerminalsThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const result = await closeProjectApi(projectId);
    if (!result.success || !result.data) {
      return result.httpStatus === 400 ? 400 : 500;
    }

    const { killedSessionIds } = result.data;
    const { terminalSessionOrder, activeTerminalSessionId } = getState().projectsBuilder;

    for (const sessionId of killedSessionIds) {
      dispatch(TerminalSessionsActions.removeTerminalSession(sessionId));
    }

    const nextOrder = terminalSessionOrder.filter((id) => !killedSessionIds.includes(id));
    dispatch(ProjectsBuilderActions.setTerminalSessionOrder(nextOrder));

    if (activeTerminalSessionId && killedSessionIds.includes(activeTerminalSessionId)) {
      const removedIndex = terminalSessionOrder.indexOf(activeTerminalSessionId);
      const nextSessionId =
        nextOrder[removedIndex] ?? nextOrder[removedIndex - 1] ?? nextOrder[0] ?? null;
      dispatch(ProjectsBuilderActions.setActiveTerminalSessionId(nextSessionId));
    }

    if (nextOrder.length === 0) {
      dispatch(ProjectsBuilderActions.setTerminalDockOpen(false));
    }

    dispatch(RunningJobsActions.setRunningJob({ projectId, jobId: null }));

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
