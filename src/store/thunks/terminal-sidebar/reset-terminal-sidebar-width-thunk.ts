import type { AppThunk } from '@/store/store';
import {
  DEFAULT_TERMINAL_SIDEBAR_WIDTH,
  TerminalSidebarBuilderActions,
} from '@/store/builders/terminalSidebarBuilder';
import { storePreference, TERMINAL_SIDEBAR_WIDTH_KEY } from './terminal-sidebar-preferences';

/**
 * Double-click on the resize handle: back to the default width.
 */
export const resetTerminalSidebarWidthThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(TerminalSidebarBuilderActions.setWidth(DEFAULT_TERMINAL_SIDEBAR_WIDTH));
    storePreference(TERMINAL_SIDEBAR_WIDTH_KEY, String(DEFAULT_TERMINAL_SIDEBAR_WIDTH));
    return 200;
  };
