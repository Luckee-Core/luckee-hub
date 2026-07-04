'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/store';
import { TerminalDockTabs } from './tabs';
import { TerminalDockToggle } from './toggle';

const TerminalDockPanel = dynamic(
  () => import('./panel').then((m) => m.TerminalDockPanel),
  { ssr: false },
);

const TERMINAL_DOCK_HEIGHT_KEY = 'luckee-hub-terminal-dock-height';
const DEFAULT_TERMINAL_DOCK_HEIGHT = 280;
const MIN_TERMINAL_DOCK_HEIGHT = 120;
const MAX_TERMINAL_DOCK_HEIGHT_RATIO = 0.75;

const getMaxTerminalDockHeight = (): number => {
  if (typeof window === 'undefined') {
    return 600;
  }
  return Math.floor(window.innerHeight * MAX_TERMINAL_DOCK_HEIGHT_RATIO);
};

const clampTerminalDockHeight = (height: number): number => {
  return Math.min(Math.max(height, MIN_TERMINAL_DOCK_HEIGHT), getMaxTerminalDockHeight());
};

const getStoredTerminalDockHeight = (): number => {
  if (typeof window === 'undefined') {
    return DEFAULT_TERMINAL_DOCK_HEIGHT;
  }
  try {
    const stored = localStorage.getItem(TERMINAL_DOCK_HEIGHT_KEY);
    if (stored === null) {
      return DEFAULT_TERMINAL_DOCK_HEIGHT;
    }
    const parsed = Number.parseInt(stored, 10);
    if (!Number.isFinite(parsed)) {
      return DEFAULT_TERMINAL_DOCK_HEIGHT;
    }
    return clampTerminalDockHeight(parsed);
  } catch {
    return DEFAULT_TERMINAL_DOCK_HEIGHT;
  }
};

export const TerminalDock = () => {
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const terminalSessions = useAppSelector((s) => s.terminalSessions);
  const [dockHeight, setDockHeight] = useState(getStoredTerminalDockHeight);
  const dockHeightRef = useRef(dockHeight);

  const sessions = useMemo(
    () =>
      projectsBuilder.terminalSessionOrder
        .map((id) => terminalSessions[id])
        .filter((session): session is NonNullable<typeof session> => session != null),
    [projectsBuilder.terminalSessionOrder, terminalSessions],
  );
  const { terminalDockOpen } = projectsBuilder;

  const persistDockHeight = useCallback((height: number) => {
    try {
      localStorage.setItem(TERMINAL_DOCK_HEIGHT_KEY, String(height));
    } catch {
      // ignore
    }
  }, []);

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startY = event.clientY;
      const startHeight = dockHeightRef.current;

      const handlePointerMove = (moveEvent: PointerEvent): void => {
        const nextHeight = clampTerminalDockHeight(startHeight + (startY - moveEvent.clientY));
        dockHeightRef.current = nextHeight;
        setDockHeight(nextHeight);
      };

      const handlePointerUp = (): void => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        persistDockHeight(dockHeightRef.current);
      };

      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    },
    [persistDockHeight],
  );

  if (sessions.length === 0) {
    return null;
  }

  if (!terminalDockOpen) {
    return (
      <aside className={styles.dockCollapsed}>
        <TerminalDockToggle />
      </aside>
    );
  }

  return (
    <aside className={styles.dockOpen} style={{ height: dockHeight }}>
      <div
        className={styles.resizeHandle}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize terminal"
        onPointerDown={handleResizePointerDown}
      />
      <div className={styles.toolbar}>
        <span className={styles.title}>Terminal</span>
        <TerminalDockToggle />
      </div>
      <TerminalDockTabs />
      <div className={styles.panelWrap}>
        <TerminalDockPanel />
      </div>
    </aside>
  );
};

const styles = {
  dockOpen: `
    flex flex-col w-full min-h-0 shrink-0 border-t border-gray-700 bg-gray-950
  `,
  dockCollapsed: `
    flex items-center justify-end shrink-0 w-full h-10 border-t border-gray-200 bg-gray-100 px-3
  `,
  resizeHandle: `
    h-1.5 shrink-0 cursor-ns-resize bg-gray-800 hover:bg-blue-500/70 active:bg-blue-500
    transition-colors
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
};
