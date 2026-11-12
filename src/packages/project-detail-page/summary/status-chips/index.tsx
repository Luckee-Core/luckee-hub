'use client';

import { useMemo } from 'react';

import type { HookStatus } from '@/model';
import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

const API_RUNNING_STATUSES: HookStatus[] = ['api_running', 'ready'];

/**
 * Runtime chips for the summary panel — API, Web, and Storage with ports.
 */
export const SummaryStatusChips = () => {
  const { id, hookStatus, apiPort, webUrl, storageExpressSupported, storagePort, storageRunning } =
    useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const hasExpress = useMemo(
    () => Boolean(findProjectRepo(projectRepos, id, 'express')),
    [projectRepos, id],
  );
  const hasWeb = useMemo(
    () => Boolean(findProjectRepo(projectRepos, id, 'nextjs')),
    [projectRepos, id],
  );

  const apiUp = API_RUNNING_STATUSES.includes(hookStatus);
  const webUp = Boolean(webUrl);

  return (
    <div className={styles.row}>
      {hasExpress ? (
        <span className={apiUp ? styles.chipUp : styles.chipDown}>
          <span className={apiUp ? styles.dotUp : styles.dotDown} aria-hidden />
          API :{apiPort}
        </span>
      ) : null}
      {hasWeb ? (
        webUp ? (
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.chipUp} ${styles.chipLink}`}
          >
            <span className={styles.dotUp} aria-hidden />
            Web {webUrl?.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <span className={styles.chipDown}>
            <span className={styles.dotDown} aria-hidden />
            Web down
          </span>
        )
      ) : null}
      {storageExpressSupported ? (
        <span className={storageRunning ? styles.chipUp : styles.chipDown}>
          <span className={storageRunning ? styles.dotUp : styles.dotDown} aria-hidden />
          Storage :{storagePort}
        </span>
      ) : null}
    </div>
  );
};

const styles = {
  row: `flex flex-wrap items-center gap-1.5`,
  chipUp: `
    inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-mono
    bg-green-50 text-green-800 border border-green-200
  `,
  chipDown: `
    inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-mono
    bg-gray-50 text-gray-600 border border-gray-200
  `,
  chipLink: `hover:bg-green-100 cursor-pointer`,
  dotUp: `h-1.5 w-1.5 rounded-full bg-green-500`,
  dotDown: `h-1.5 w-1.5 rounded-full bg-gray-300`,
};
