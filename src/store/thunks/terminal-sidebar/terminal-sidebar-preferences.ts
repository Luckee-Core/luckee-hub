export const TERMINAL_SIDEBAR_OPEN_KEY = 'luckee-hub-terminal-sidebar-open';
export const TERMINAL_SIDEBAR_WIDTH_KEY = 'luckee-hub-terminal-sidebar-width';
export const TERMINAL_SIDEBAR_RUNNING_COLLAPSED_KEY = 'luckee-hub-terminal-sidebar-running-collapsed';
export const MIN_TERMINAL_SIDEBAR_WIDTH = 320;
const MAX_TERMINAL_SIDEBAR_WIDTH_RATIO = 0.7;

/**
 * Clamps the sidebar width to [320px, 70% of the window].
 */
export const clampTerminalSidebarWidth = (width: number): number => {
  const max =
    typeof window === 'undefined'
      ? 1200
      : Math.max(
          MIN_TERMINAL_SIDEBAR_WIDTH,
          Math.floor(window.innerWidth * MAX_TERMINAL_SIDEBAR_WIDTH_RATIO),
        );
  return Math.min(Math.max(Math.round(width), MIN_TERMINAL_SIDEBAR_WIDTH), max);
};

/**
 * Best-effort localStorage write (private windows / blocked storage are ignored).
 */
export const storePreference = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};
