'use client';

import { useAppSelector } from '@/store';

/**
 * Shown when the hub server cannot manage this project's database yet (usually the storage repo is not cloned).
 */
export const LocalDatabaseUnavailable = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);

  const probe = localDatabaseProbes[id];
  if (!probe || probe.supported) {
    return null;
  }

  return (
    <div className={styles.box}>
      <p className={styles.title}>{probe.message ?? 'Local database is not available yet.'}</p>
      <p className={styles.detail}>
        Run Setup to clone the storage repo (it holds the migrations), then Refresh status.
      </p>
    </div>
  );
};

const styles = {
  box: `rounded border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center`,
  title: `text-sm font-medium text-gray-800`,
  detail: `mt-1 text-xs text-gray-500`,
};
