'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { PROJECTS_PATH } from '@/config';
import { useAppSelector } from '@/store';
import { UsageBar } from './usage-bar';

export const SystemMetricsHeaderItem = () => {
  const pathname = usePathname();
  const { loadStatus, error, snapshot } = useAppSelector((s) => s.systemMetricsBuilder);
  const topProcesses = snapshot?.topProcesses;

  const topProcessesTitle = useMemo(() => {
    if (!topProcesses?.length) {
      return undefined;
    }
    const lines = topProcesses.map(
      (process) => `${process.name} ${Math.round(process.cpuPercent)}%`,
    );
    return `Top CPU processes\n${lines.join('\n')}`;
  }, [topProcesses]);

  if (pathname !== PROJECTS_PATH) {
    return null;
  }

  if (loadStatus === 'error' && !snapshot) {
    return (
      <span className={styles.unavailable} title={error ?? undefined} role="status">
        Metrics unavailable
      </span>
    );
  }

  const isStale = loadStatus === 'error' && snapshot != null;

  return (
    <div
      className={isStale ? `${styles.root} ${styles.rootStale}` : styles.root}
      title={isStale ? (error ?? 'Metrics unavailable') : topProcessesTitle}
      aria-busy={loadStatus === 'loading' && !snapshot}
    >
      <UsageBar label="CPU" percent={snapshot?.cpu.usagePercent ?? null} />
      <UsageBar label="GPU" percent={snapshot?.gpu.usagePercent ?? null} />
    </div>
  );
};

const styles = {
  root: `
    hidden md:flex shrink-0 items-center gap-3 rounded-md border border-gray-200 bg-white px-2 py-1 cursor-default
  `,
  rootStale: `opacity-60`,
  unavailable: `
    shrink-0 text-[10px] font-medium text-gray-400
  `,
};
