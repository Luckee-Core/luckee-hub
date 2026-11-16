'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { orderTerminalSessions } from '@/utils/terminals';
import { TerminalTab } from './tab';

/**
 * One tab per live hub terminal. Tabs mirror hub Express's sessions and cannot be closed (ADR 025 G12).
 */
export const TerminalTabs = () => {
  const terminalSessions = useAppSelector((state) => state.terminalSessions);
  const projects = useAppSelector((state) => state.projects);
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);

  const sessions = useMemo(
    () => orderTerminalSessions(terminalSessions, projects),
    [terminalSessions, projects],
  );

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className={styles.strip} role="tablist" aria-label="Terminals">
      {sessions.map((session) => (
        <TerminalTab
          key={session.sessionId}
          sessionId={session.sessionId}
          isActive={session.sessionId === builder.activeTerminalSessionId}
        />
      ))}
    </div>
  );
};

const styles = {
  strip: `
    flex shrink-0 items-end gap-0.5 overflow-x-auto border-b border-gray-800 bg-gray-900 px-2 pt-1.5
  `,
} as const;
