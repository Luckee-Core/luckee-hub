'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';

export const DatabaseUrl = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);

  const probe = useMemo(() => localDatabaseProbes[id], [localDatabaseProbes, id]);

  if (!probe?.envConfigured || !probe.databaseUrl) {
    return null;
  }

  return (
    <p className={styles.url}>
      <span className={styles.urlLabel}>DATABASE_URL</span>
      <code className={styles.urlValue}>{probe.databaseUrl}</code>
    </p>
  );
};

const styles = {
  url: `text-sm space-y-1`,
  urlLabel: `font-semibold text-gray-700`,
  urlValue: `block font-mono text-xs text-gray-600 break-all`,
};
