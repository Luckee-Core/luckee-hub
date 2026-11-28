import { runProjectApi } from '@/api/projects';
import type { ProjectRunTarget } from '@/model';
import type { AppThunk } from '@/store/store';
import { ProjectsActions } from '@/store/dumps/projects';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { RunningJobsActions } from '@/store/dumps/runningJobs';
import { hasActiveRunOperation, hasActiveSetupOperation } from '@/utils/projects';
import { focusProjectTerminalThunk } from '@/store/thunks/terminal-sidebar/focus-project-terminal-thunk';
import { syncTerminalSessionsThunk } from '@/store/thunks/terminal-sidebar/sync-terminal-sessions-thunk';
import { pollProjectJobThunk } from './poll-project-job-thunk';

/**
 * Run project dev servers and poll job until complete.
 */
export const runProjectThunk =
  (
    projectId: string,
    targets?: ProjectRunTarget[],
    options: { openChrome?: boolean } = {},
  ): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    if (hasActiveRunOperation(getState()) || hasActiveSetupOperation(getState())) {
      return 400;
    }

    dispatch(ProjectsBuilderActions.setListError(null));
    dispatch(ProjectsBuilderActions.setRunInFlightProjectId(projectId));

    const result = await runProjectApi(projectId, targets, options);
    if (!result.success || !result.data?.jobId) {
      dispatch(ProjectsBuilderActions.setRunInFlightProjectId(null));
      dispatch(ProjectsBuilderActions.setListError(result.error ?? 'Run failed'));
      return result.httpStatus === 400 ? 400 : 500;
    }

    const { jobId, sessions = [] } = result.data;
    dispatch(RunningJobsActions.setRunningJob({ projectId, jobId }));
    await dispatch(syncTerminalSessionsThunk());
    if (sessions.length > 0) {
      await dispatch(focusProjectTerminalThunk(projectId));
    }

    const project = getState().projects[projectId];
    const startsExpress = !targets?.length || targets.includes('express');
    if (project?.localDatabaseSupported && startsExpress) {
      dispatch(
        ProjectsActions.upsertProject({
          ...project,
          postgresActiveConsumer: true,
        }),
      );
    }

    void dispatch(pollProjectJobThunk(projectId, jobId));
    return 200;
  };
