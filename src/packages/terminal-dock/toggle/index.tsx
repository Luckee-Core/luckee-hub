'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTerminalDockThunk } from '@/store/thunks/projects';

export const TerminalDockToggle = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const sessionCount = useMemo(
    () => projectsBuilder.terminalSessionOrder.length,
    [projectsBuilder.terminalSessionOrder],
  );
  const { terminalDockOpen } = projectsBuilder;

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
  button: `text-xs font-medium text-gray-500 hover:text-gray-800`,
  buttonCollapsed: `
    text-xs font-medium text-gray-500 hover:text-gray-800
  `,
};
