'use client';

import dynamic from 'next/dynamic';
import { useAppSelector } from '@/store';

const DevHubTerminalSessionPanel = dynamic(
  () => import('../session-panel').then((m) => m.DevHubTerminalSessionPanel),
  { ssr: false },
);

export const DevHubTerminalDockPanel = () => {
  const sessions = useAppSelector((s) => s.devHubBuilder.terminalSessions);
  const activeSessionId = useAppSelector((s) => s.devHubBuilder.activeTerminalSessionId);
  const terminalDockOpen = useAppSelector((s) => s.devHubBuilder.terminalDockOpen);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className={styles.stack}>
      {sessions.map((session) => (
        <DevHubTerminalSessionPanel
          key={session.sessionId}
          sessionId={session.sessionId}
          isActive={session.sessionId === activeSessionId}
          dockOpen={terminalDockOpen}
        />
      ))}
    </div>
  );
};

const styles = {
  stack: `
    relative flex-1 min-h-0 h-full w-full
  `,
};
