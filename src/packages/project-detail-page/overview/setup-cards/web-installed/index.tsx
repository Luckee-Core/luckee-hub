'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

export const WebInstalled = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const webRepo = useMemo(
    () => findProjectRepo(projectRepos, id, 'nextjs'),
    [projectRepos, id],
  );

  const ok = useMemo(() => webRepo?.depsInstalled === true, [webRepo?.depsInstalled]);

  if (!webRepo || webRepo.dirExists !== true) {
    return null;
  }

  return (
    <div className={styles.card}>
      <span className={ok ? styles.iconOk : styles.iconPending} aria-hidden>
        {ok ? '✓' : '○'}
      </span>
      <span className={ok ? styles.labelOk : styles.labelPending}>Web installed</span>
      <p className={styles.description}>
        Dependencies are installed in the Next.js repo (node_modules is present).
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
