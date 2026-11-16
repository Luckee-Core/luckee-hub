import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { runProjectThunk } from '@/store/thunks/projects/run-project-thunk';

/**
 * Start (Run all) a project from the sidebar's Running list. The run thunk syncs terminals itself.
 */
export const startProjectFromSidebarThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const project = getState().projects[projectId];
    if (!project) {
      return 400;
    }
    dispatch(TerminalSidebarBuilderActions.setActionProjectId(projectId));
    dispatch(TerminalSidebarBuilderActions.setActionKind('start'));
    dispatch(TerminalSidebarBuilderActions.setActionMessage(null));
    dispatch(TerminalSidebarBuilderActions.setActionError(null));
    try {
      const status = await dispatch(runProjectThunk(projectId));
      if (status !== 200) {
        dispatch(
          TerminalSidebarBuilderActions.setActionError(
            status === 400 && !getState().projectsBuilder.listError
              ? 'Another run or setup is in progress'
              : (getState().projectsBuilder.listError ?? `Couldn't start ${project.name}`),
          ),
        );
        return status;
      }
      dispatch(TerminalSidebarBuilderActions.setActionMessage(`Starting ${project.name}…`));
      return 200;
    } finally {
      dispatch(TerminalSidebarBuilderActions.setActionKind(null));
    }
  };
