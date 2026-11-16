import type { AppThunk } from '@/store/store';
import { storePreference, TERMINAL_SIDEBAR_WIDTH_KEY } from './terminal-sidebar-preferences';

/**
 * Saves the current sidebar width (on drag release).
 */
export const persistTerminalSidebarWidthThunk =
  (): AppThunk<Promise<200 | 400 | 500>> =>
  async (_dispatch, getState) => {
    storePreference(TERMINAL_SIDEBAR_WIDTH_KEY, String(getState().terminalSidebarBuilder.width));
    return 200;
  };
