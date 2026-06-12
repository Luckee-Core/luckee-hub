'use client';

import dynamic from 'next/dynamic';
import { useAppSelector } from '@/store';
import { DevHubTerminalDockTabs } from './tabs';
import { DevHubTerminalDockToggle } from './toggle';

const DevHubTerminalDockPanel = dynamic(
  () => import('./panel').then((m) => m.DevHubTerminalDockPanel),
  { ssr: false },
);

export const DevHubTerminalDock = () => {
  const terminalDockOpen = useAppSelector((s) => s.devHubBuilder.terminalDockOpen);
  const sessions = useAppSelector((s) => s.devHubBuilder.terminalSessions);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <aside className={terminalDockOpen ? styles.dockOpen : styles.dockCollapsed}>
      {terminalDockOpen ? (
        <div className={styles.toolbar}>
          <span className={styles.title}>Terminal</span>
          <DevHubTerminalDockToggle />
        </div>
      ) : (
        <DevHubTerminalDockToggle />
      )}
      {terminalDockOpen ? <DevHubTerminalDockTabs /> : null}
      <div className={terminalDockOpen ? styles.panelWrap : styles.panelWrapHidden}>
        <DevHubTerminalDockPanel />
      </div>
    </aside>
  );
};

const styles = {
  dockOpen: `
    flex flex-col self-stretch border-l border-gray-700 bg-gray-950 shrink-0
    w-[min(32rem,45vw)] min-h-0
  `,
  dockCollapsed: `
    flex flex-col items-center self-stretch border-l border-gray-200 bg-gray-100 shrink-0
    w-12 min-h-0 pt-3 px-1
  `,
  toolbar: `
    flex items-center justify-between gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200 shrink-0
  `,
  title: `
    text-xs font-semibold uppercase tracking-wide text-gray-500 truncate
  `,
  panelWrap: `
    flex flex-1 flex-col min-h-0 overflow-hidden
  `,
  panelWrapHidden: `
    hidden flex-1 min-h-0
  `,
};
