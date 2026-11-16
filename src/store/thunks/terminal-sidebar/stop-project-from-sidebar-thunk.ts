import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { closeProjectTerminalsThunk } from '@/store/thunks/projects/close-project-terminals-thunk';
import { syncProjectsRuntimeThunk } from './sync-projects-runtime-thunk';

/**
 * Stop all of a project's hub terminals (and the Postgres it started) from the sidebar.
 */
export const stopProjectFromSidebarThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const project = getState().projects[projectId];
    if (!project) {
      return 400;
    }
    dispatch(TerminalSidebarBuilderActions.setActionProjectId(projectId));
    dispatch(TerminalSidebarBuilderActions.setActionKind('stop'));
    dispatch(TerminalSidebarBuilderActions.setActionMessage(null));
    dispatch(TerminalSidebarBuilderActions.setActionError(null));
    try {
      const status = await dispatch(closeProjectTerminalsThunk(projectId));
      if (status !== 200) {
        dispatch(
          TerminalSidebarBuilderActions.setActionError(
            status === 400
              ? `Nothing for the hub to stop for ${project.name}`
              : `Couldn't stop ${project.name}`,
          ),
        );
        return status;
      }
      dispatch(TerminalSidebarBuilderActions.setActionMessage(`Stopped ${project.name}`));
      void dispatch(syncProjectsRuntimeThunk());
      return 200;
    } finally {
      dispatch(TerminalSidebarBuilderActions.setActionKind(null));
    }
  };
