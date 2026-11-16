'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/store';
import { TerminalSidebarCollapsedRail } from './collapsed-rail';
import { TerminalSidebarHeader } from './header';
import { TerminalSidebarResizeHandle } from './resize-handle';
import { RunningServices } from './running-services';
import { TerminalSidebarSyncStatus } from './sync-status';
import { TerminalTabs } from './terminal-tabs';

const TerminalPanel = dynamic(() => import('./terminal-panel').then((m) => m.TerminalPanel), {
  ssr: false,
});

/**
 * App-wide right sidebar: set-up projects with Start / Stop all, and every live hub terminal.
 * Renders state only; syncing is owned by the app init thunk's scheduler (ADR 025).
 * The panel stays mounted while collapsed so PTY sockets and scrollback survive.
 */
export const TerminalSidebar = () => {
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    asideRef.current?.style.setProperty('--terminal-sidebar-width', `${builder.width}px`);
  }, [builder.width]);

  return (
    <>
      {builder.isOpen ? null : <TerminalSidebarCollapsedRail />}
      <aside
        ref={asideRef}
        className={builder.isOpen ? styles.panel : styles.panelHidden}
        aria-label="Terminals"
        aria-hidden={!builder.isOpen}
      >
        <TerminalSidebarResizeHandle />
        <TerminalSidebarHeader />
        <TerminalSidebarSyncStatus />
        <RunningServices />
        <TerminalTabs />
        <TerminalPanel />
      </aside>
    </>
  );
};

const styles = {
  panel: `
    relative flex h-screen w-[var(--terminal-sidebar-width,480px)] shrink-0 flex-col
    border-l border-gray-800 bg-gray-950 text-gray-100
    max-lg:fixed max-lg:inset-y-0 max-lg:right-0 max-lg:z-30 max-lg:shadow-2xl
  `,
  panelHidden: `
    hidden
  `,
} as const;
