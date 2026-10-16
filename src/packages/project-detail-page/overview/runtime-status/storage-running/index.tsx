'use client';

import { useAppSelector } from '@/store';

/**
 * Mini status chip — Storage Express API running.
 */
export const StorageRunningStatus = () => {
  const { storageExpressSupported, storageRunning, storagePort } = useAppSelector(
    (s) => s.currentProject,
  );

  if (!storageExpressSupported) {
    return null;
  }

  const ok = storageRunning === true;
  const title = ok ? `Storage up · ${storagePort}` : `Storage down · ${storagePort}`;

  return (
    <span className={ok ? styles.ok : styles.pending} title={title}>
      Storage {ok ? 'up' : 'down'}
    </span>
  );
};

const styles = {
  ok: `
    inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
    bg-green-50 text-green-800 border border-green-200
  `,
  pending: `
    inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
    bg-gray-50 text-gray-600 border border-gray-200
  `,
};
