import type { AppThunk } from '@/store/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import { clampTerminalSidebarWidth } from './terminal-sidebar-preferences';

/**
 * Sets the sidebar width while dragging (clamped; persisted separately on release).
 */
export const setTerminalSidebarWidthThunk =
  (width: number): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    dispatch(TerminalSidebarBuilderActions.setWidth(clampTerminalSidebarWidth(width)));
    return 200;
  };
