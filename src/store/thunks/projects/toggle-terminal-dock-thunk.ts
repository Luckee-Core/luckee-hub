import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';

/**
 * Toggle terminal dock open/closed.
 */
export const toggleTerminalDockThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const open = getState().projectsBuilder.terminalDockOpen;
    dispatch(ProjectsBuilderActions.setTerminalDockOpen(!open));
    return 200;
  };
