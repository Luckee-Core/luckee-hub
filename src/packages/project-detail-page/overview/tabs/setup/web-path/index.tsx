'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

export const WebPath = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const webRepo = useMemo(
    () => findProjectRepo(projectRepos, id, 'nextjs'),
    [projectRepos, id],
  );

  const ok = webRepo?.dirExists === true;
  const path = webRepo?.localDir;

  return (
    <div className={styles.row}>
      <span className={ok ? styles.iconOk : styles.iconPending} aria-hidden>
        {ok ? '✓' : '○'}
      </span>
      <span className={ok ? styles.titleOk : styles.titlePending}>Web path</span>
      <span className={styles.detail}>{path ?? 'Not configured — run Setup'}</span>
    </div>
  );
};

const styles = {
  row: `flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm`,
  iconOk: `text-green-600 font-semibold shrink-0`,
  iconPending: `text-gray-400 shrink-0`,
  titleOk: `font-medium text-gray-900 shrink-0`,
  titlePending: `font-medium text-gray-500 shrink-0`,
  detail: `text-gray-500 font-mono text-xs break-all`,
};
