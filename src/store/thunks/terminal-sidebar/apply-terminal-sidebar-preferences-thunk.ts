import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import {
  clampTerminalSidebarWidth,
  TERMINAL_SIDEBAR_OPEN_KEY,
  TERMINAL_SIDEBAR_RUNNING_COLLAPSED_KEY,
  TERMINAL_SIDEBAR_WIDTH_KEY,
} from './terminal-sidebar-preferences';

/**
 * Applies saved sidebar open state, width, and Running-section collapse (defaults stay when unavailable).
 */
export const applyTerminalSidebarPreferencesThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    try {
      const storedOpen = localStorage.getItem(TERMINAL_SIDEBAR_OPEN_KEY);
      if (storedOpen !== null) {
        dispatch(TerminalSidebarBuilderActions.setOpen(storedOpen === 'true'));
      }
      const storedWidth = Number.parseInt(localStorage.getItem(TERMINAL_SIDEBAR_WIDTH_KEY) ?? '', 10);
      if (Number.isFinite(storedWidth)) {
        dispatch(TerminalSidebarBuilderActions.setWidth(clampTerminalSidebarWidth(storedWidth)));
      }
      const storedCollapsed = localStorage.getItem(TERMINAL_SIDEBAR_RUNNING_COLLAPSED_KEY);
      if (storedCollapsed !== null) {
        dispatch(TerminalSidebarBuilderActions.setRunningSectionCollapsed(storedCollapsed === 'true'));
      }
      return 200;
    } catch {
      return 500;
    }
  };
