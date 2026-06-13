'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { TerminalDockTab } from '../tab';

export const TerminalDockTabs = () => {
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const terminalSessions = useAppSelector((s) => s.terminalSessions);

  const sessions = useMemo(
    () =>
      projectsBuilder.terminalSessionOrder
        .map((id) => terminalSessions[id])
        .filter((session): session is NonNullable<typeof session> => session != null),
    [projectsBuilder.terminalSessionOrder, terminalSessions],
  );
  const { activeTerminalSessionId } = projectsBuilder;

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className={styles.bar}>
      {sessions.map((session) => (
        <TerminalDockTab
          key={session.sessionId}
          session={session}
          isActive={session.sessionId === activeTerminalSessionId}
        />
      ))}
    </div>
  );
};

const styles = {
  bar: `
    flex gap-1 overflow-x-auto border-b border-gray-700 bg-gray-900 px-2 pt-1 shrink-0
  `,
};
