import type { AppThunk } from '@/store/store';
import { setTerminalSidebarOpenThunk } from './set-terminal-sidebar-open-thunk';

/**
 * ⌘J / Ctrl+J: flip the terminal sidebar open state.
 */
export const toggleTerminalSidebarThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) =>
    dispatch(setTerminalSidebarOpenThunk(!getState().terminalSidebarBuilder.isOpen));
