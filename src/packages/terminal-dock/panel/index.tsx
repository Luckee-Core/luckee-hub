'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/store';

const TerminalSessionPanel = dynamic(
  () => import('../session-panel').then((m) => m.TerminalSessionPanel),
  { ssr: false },
);

export const TerminalDockPanel = () => {
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const terminalSessions = useAppSelector((s) => s.terminalSessions);

  const sessions = useMemo(
    () =>
      projectsBuilder.terminalSessionOrder
        .map((id) => terminalSessions[id])
        .filter((session): session is NonNullable<typeof session> => session != null),
    [projectsBuilder.terminalSessionOrder, terminalSessions],
  );
  const { activeTerminalSessionId, terminalDockOpen } = projectsBuilder;

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className={styles.stack}>
      {sessions.map((session) => (
        <TerminalSessionPanel
          key={session.sessionId}
          sessionId={session.sessionId}
          isActive={session.sessionId === activeTerminalSessionId}
          dockOpen={terminalDockOpen}
        />
      ))}
    </div>
  );
};

const styles = {
  stack: `relative flex-1 min-h-0 h-full w-full`,
};
