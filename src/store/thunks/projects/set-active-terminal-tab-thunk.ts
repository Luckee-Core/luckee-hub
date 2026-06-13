import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';

/**
 * Switch the active terminal tab in the bottom dock.
 */
export const setActiveTerminalTabThunk =
  (sessionId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(ProjectsBuilderActions.setActiveTerminalSessionId(sessionId));
    return 200;
  };
