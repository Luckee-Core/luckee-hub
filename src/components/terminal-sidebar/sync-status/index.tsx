'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '@/store';
import {
  TERMINAL_SYNC_FAILURE_WARNING_THRESHOLD,
  TERMINAL_SYNC_STALE_AFTER_MS,
} from '../terminal-sidebar-constants';

/**
 * Freshness line derived from sync timestamps and failure counts (ADR 025 G10). No loading flags.
 */
export const TerminalSidebarSyncStatus = () => {
  const builder = useAppSelector((state) => state.terminalSidebarBuilder);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const status = useMemo(() => {
    const lastSynced = builder.terminalLastSyncedAt ? Date.parse(builder.terminalLastSyncedAt) : null;
    if (builder.terminalConsecutiveFailures >= TERMINAL_SYNC_FAILURE_WARNING_THRESHOLD) {
      return {
        isWarning: true,
        text: `Can't reach hub Express — showing last known terminals. ${builder.terminalLastSyncError ?? ''}`.trim(),
      };
    }
    if (lastSynced === null) {
      return { isWarning: false, text: 'Connecting to hub Express…' };
    }
    const ageSeconds = Math.max(0, Math.round((now - lastSynced) / 1000));
    if (now - lastSynced > TERMINAL_SYNC_STALE_AFTER_MS) {
      return { isWarning: true, text: `Last synced ${ageSeconds}s ago` };
    }
    return { isWarning: false, text: `Synced ${ageSeconds}s ago` };
  }, [
    builder.terminalConsecutiveFailures,
    builder.terminalLastSyncError,
    builder.terminalLastSyncedAt,
    now,
  ]);

  return <p className={status.isWarning ? styles.warning : styles.ok}>{status.text}</p>;
};

const styles = {
  ok: `
    shrink-0 px-3 py-1 text-[11px] text-gray-500
  `,
  warning: `
    shrink-0 bg-amber-950/60 px-3 py-1 text-[11px] text-amber-300
  `,
} as const;
