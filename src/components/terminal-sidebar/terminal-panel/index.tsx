'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { TerminalPanelEmptyState } from './empty-state';
import { TerminalSessionPanel } from './session';

/**
 * Every live session keeps its own xterm + socket mounted (inactive ones are invisible) so tab switches
 * and sidebar collapse preserve scrollback.
 */
export const TerminalPanel = () => {
  const terminalSessions = useAppSelector((state) => state.terminalSessions);
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);

  const sessionIds = useMemo(() => Object.keys(terminalSessions).sort(), [terminalSessions]);

  if (sessionIds.length === 0) {
    return <TerminalPanelEmptyState />;
  }

  return (
    <div className={styles.stack}>
      {sessionIds.map((sessionId) => (
        <TerminalSessionPanel
          key={sessionId}
          sessionId={sessionId}
          isActive={sessionId === builder.activeTerminalSessionId}
          isSidebarOpen={builder.isOpen}
        />
      ))}
    </div>
  );
};

const styles = {
  stack: `
    relative min-h-0 w-full flex-1
  `,
} as const;
