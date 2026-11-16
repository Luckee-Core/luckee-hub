'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTerminalSessionThunk } from '@/store/thunks/terminal-sidebar';

type TerminalTabProps = {
  sessionId: string;
  isActive: boolean;
};

/**
 * Tab label: hub Express's session label (already "project / Role").
 */
export const TerminalTab = ({ sessionId, isActive }: TerminalTabProps) => {
  const dispatch = useAppDispatch();
  const terminalSessions = useAppSelector((state) => state.terminalSessions);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const session = terminalSessions[sessionId];

  useEffect(() => {
    if (isActive) {
      buttonRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [isActive]);

  if (!session) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={isActive ? styles.tabActive : styles.tab}
      onClick={() => void dispatch(setActiveTerminalSessionThunk(sessionId))}
      title={session.label}
    >
      <span className={styles.label}>{session.label}</span>
    </button>
  );
};

const styles = {
  tab: `
    flex max-w-[14rem] shrink-0 items-center rounded-t bg-gray-800/60 px-2 py-1.5
    text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-200 cursor-pointer
  `,
  tabActive: `
    flex max-w-[14rem] shrink-0 items-center rounded-t bg-gray-950 px-2 py-1.5
    text-xs text-gray-100 cursor-pointer
  `,
  label: `
    truncate font-medium
  `,
} as const;
