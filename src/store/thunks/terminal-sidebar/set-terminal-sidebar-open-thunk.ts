import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { storePreference, TERMINAL_SIDEBAR_OPEN_KEY } from './terminal-sidebar-preferences';

/**
 * Opens or collapses the terminal sidebar and remembers the choice.
 */
export const setTerminalSidebarOpenThunk =
  (isOpen: boolean): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(TerminalSidebarBuilderActions.setOpen(isOpen));
    storePreference(TERMINAL_SIDEBAR_OPEN_KEY, String(isOpen));
    return 200;
  };
