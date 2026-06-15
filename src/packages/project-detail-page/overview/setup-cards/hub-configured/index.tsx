'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';

export const HubConfigured = () => {
  const { paths, enabled } = useAppSelector((s) => s.currentProject);

  const ok = useMemo(() => !!paths && enabled, [paths, enabled]);

  return (
    <div className={styles.card}>
      <span className={ok ? styles.iconOk : styles.iconPending} aria-hidden>
        {ok ? '✓' : '○'}
      </span>
      <span className={ok ? styles.labelOk : styles.labelPending}>Hub configured</span>
      <p className={styles.description}>
        This project has an entry in hub.local.json and is not disabled.
      </p>
    </div>
  );
};

const styles = {
  card: `
    group relative flex flex-col items-center gap-1 rounded border px-3 py-2.5 min-w-[6.5rem]
    bg-gray-50 border-gray-200 text-center
    hover:bg-white hover:border-gray-300 hover:shadow-sm
  `,
  iconOk: `text-green-600 font-semibold text-sm`,
  iconPending: `text-gray-400 text-sm`,
  labelOk: `text-xs font-medium text-gray-800 leading-tight`,
  labelPending: `text-xs font-medium text-gray-500 leading-tight`,
  description: `
    pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-52 -translate-x-1/2
    rounded border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-600 shadow-md
    opacity-0 invisible transition-opacity duration-150
    group-hover:opacity-100 group-hover:visible
  `,
};
