import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import {
  storePreference,
  TERMINAL_SIDEBAR_RUNNING_COLLAPSED_KEY,
} from './terminal-sidebar-preferences';

/**
 * Collapse or expand the Running section and remember the choice.
 */
export const setRunningSectionCollapsedThunk =
  (collapsed: boolean): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(TerminalSidebarBuilderActions.setRunningSectionCollapsed(collapsed));
    storePreference(TERMINAL_SIDEBAR_RUNNING_COLLAPSED_KEY, String(collapsed));
    return 200;
  };
