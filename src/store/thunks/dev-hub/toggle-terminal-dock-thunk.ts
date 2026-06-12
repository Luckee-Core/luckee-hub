import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';
/**
 * Toggle terminal dock open/closed.
 */
export const toggleTerminalDockThunk = (): AppThunk<Promise<200>> => async (dispatch, getState) => {
  const open = getState().devHubBuilder.terminalDockOpen;
  dispatch(DevHubBuilderActions.setTerminalDockOpen(!open));
  return 200;
};
