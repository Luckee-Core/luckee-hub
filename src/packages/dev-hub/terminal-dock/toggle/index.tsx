'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTerminalDockThunk } from '@/store/thunks/dev-hub';

export const DevHubTerminalDockToggle = () => {
  const dispatch = useAppDispatch();
  const terminalDockOpen = useAppSelector((s) => s.devHubBuilder.terminalDockOpen);
  const sessionCount = useAppSelector((s) => s.devHubBuilder.terminalSessions.length);

  if (sessionCount === 0) {
    return null;
  }

  return (
    <button
      type="button"
      className={terminalDockOpen ? styles.button : styles.buttonCollapsed}
      onClick={() => void dispatch(toggleTerminalDockThunk())}
    >
      {terminalDockOpen ? 'Hide' : `Show (${sessionCount})`}
    </button>
  );
};

const styles = {
  button: `
    text-xs font-medium text-gray-500 hover:text-gray-800
  `,
  buttonCollapsed: `
    text-xs font-medium text-gray-500 hover:text-gray-800
    [writing-mode:vertical-rl] rotate-180 py-2
  `,
};
