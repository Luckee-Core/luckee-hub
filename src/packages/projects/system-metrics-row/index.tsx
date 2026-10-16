'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  startSystemMetricsPollingThunk,
  stopSystemMetricsPollingThunk,
} from '@/store/thunks/system-metrics';
import { UsageBar } from './usage-bar';

const truncateName = (name: string, maxLength = 20): string => {
  if (name.length <= maxLength) {
    return name;
  }
  return `${name.slice(0, maxLength - 1)}…`;
};

export const SystemMetricsRow = () => {
  const dispatch = useAppDispatch();
  const { loadStatus, error, snapshot } = useAppSelector((s) => s.systemMetricsBuilder);

  useEffect(() => {
    dispatch(startSystemMetricsPollingThunk({ intervalMs: 2000 }));
    return () => {
      dispatch(stopSystemMetricsPollingThunk());
    };
  }, [dispatch]);

  const topProcessLabel = useMemo(() => {
    if (!snapshot?.topProcesses.length) {
      return '—';
    }
    return snapshot.topProcesses
      .map((process) => `${truncateName(process.name)} ${Math.round(process.cpuPercent)}%`)
      .join(' · ');
  }, [snapshot?.topProcesses]);

  const isInitialLoading = loadStatus === 'loading' && !snapshot;
  const isStaleError = loadStatus === 'error' && snapshot != null;
  const showErrorOnly = loadStatus === 'error' && !snapshot;

  if (showErrorOnly) {
    return (
      <div className={styles.root} role="status">
        <span className={styles.errorText}>
          {error ?? 'Metrics unavailable. Is luckee-hub-express-server running on :3001?'}
        </span>
      </div>
    );
  }

  if (isInitialLoading) {
    return (
      <div className={styles.root} aria-busy="true">
        <span className={styles.systemLabel}>System</span>
        <UsageBar label="CPU" percent={null} />
        <UsageBar label="GPU" percent={null} />
        <span className={styles.topValue}>Loading metrics…</span>
      </div>
    );
  }

  const rowClass = isStaleError ? `${styles.root} ${styles.rootStale}` : styles.root;

  return (
    <div className={rowClass}>
      <span className={styles.systemLabel}>System</span>
      <UsageBar label="CPU" percent={snapshot?.cpu.usagePercent ?? null} />
      <UsageBar label="GPU" percent={snapshot?.gpu.usagePercent ?? null} />
      <div className={styles.topBlock} aria-label="Top CPU processes">
        <span className={styles.topPrefix}>Top:</span>
        <span className={styles.topValue}>{topProcessLabel}</span>
      </div>
      {isStaleError ? (
        <span className={styles.statusChip} title={error ?? undefined}>
          Metrics unavailable
        </span>
      ) : null}
    </div>
  );
};

const styles = {
  root: `
    flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t text-xs
  `,
  rootStale: `opacity-80`,
  systemLabel: `text-[10px] font-semibold uppercase tracking-wide text-gray-500 shrink-0`,
  topBlock: `flex items-center gap-1 min-w-0 flex-1`,
  topPrefix: `text-[10px] font-semibold uppercase tracking-wide text-gray-500 shrink-0`,
  topValue: `text-[11px] text-gray-800 truncate`,
  statusChip: `
    ml-auto shrink-0 text-[10px] font-medium text-red-700 bg-red-50 border border-red-200 rounded px-1.5 py-0.5
  `,
  errorText: `text-[11px] text-red-700`,
};
