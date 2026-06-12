'use client';

import { useAppSelector } from '@/store';
import { DevHubTerminalDockTab } from '../tab';

export const DevHubTerminalDockTabs = () => {
  const sessions = useAppSelector((s) => s.devHubBuilder.terminalSessions);
  const activeId = useAppSelector((s) => s.devHubBuilder.activeTerminalSessionId);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className={styles.bar}>
      {sessions.map((session) => (
        <DevHubTerminalDockTab
          key={session.sessionId}
          session={session}
          isActive={session.sessionId === activeId}
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
