'use client';

import { useMemo } from 'react';
import { PanelRightClose, RefreshCw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { TerminalSidebarBuilderActions } from '@/store/builders/terminalSidebarBuilder';
import {
  setTerminalSidebarOpenThunk,
  syncProjectsRuntimeThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/terminal-sidebar';

/**
 * Sidebar title bar: terminal count, refresh (full sync + port probe + reconnect), collapse.
 */
export const TerminalSidebarHeader = () => {
  const dispatch = useAppDispatch();
  const terminalSessions = useAppSelector((state) => state.terminalSessions);
  const terminalCount = useMemo(() => Object.keys(terminalSessions).length, [terminalSessions]);

  const refresh = async (): Promise<void> => {
    await Promise.all([
      dispatch(syncTerminalSessionsThunk({ mode: 'sync' })),
      dispatch(syncProjectsRuntimeThunk()),
    ]);
    dispatch(TerminalSidebarBuilderActions.bumpConnectionEpoch());
  };

  return (
    <div className={styles.bar}>
      <span className={styles.title}>
        Terminals
        <span className={styles.count}>{terminalCount}</span>
      </span>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Refresh terminals and running projects"
          title="Refresh"
          onClick={() => void refresh()}
        >
          <RefreshCw className={styles.icon} aria-hidden />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Collapse terminal sidebar (⌘J)"
          title="Collapse (⌘J)"
          onClick={() => void dispatch(setTerminalSidebarOpenThunk(false))}
        >
          <PanelRightClose className={styles.icon} aria-hidden />
        </button>
      </div>
    </div>
  );
};

const styles = {
  bar: `
    flex shrink-0 items-center justify-between gap-2 border-b border-gray-800 bg-gray-900 px-3 py-2
  `,
  title: `
    flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-300
  `,
  count: `
    rounded-full bg-gray-800 px-1.5 text-[10px] font-semibold text-gray-300
  `,
  actions: `
    flex items-center gap-1
  `,
  iconButton: `
    rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-100 cursor-pointer
  `,
  icon: `
    h-3.5 w-3.5
  `,
} as const;
