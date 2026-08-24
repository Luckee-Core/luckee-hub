'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

/**
 * Mini status chip — Next.js web running.
 */
export const WebRunningStatus = () => {
  const { id, webUrl } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const webRepo = useMemo(
    () => findProjectRepo(projectRepos, id, 'nextjs'),
    [projectRepos, id],
  );

  const ok = !!webUrl;

  if (!webRepo) {
    return null;
  }

  return (
    <span
      className={ok ? styles.ok : styles.pending}
      title={ok ? `Web up · ${webUrl}` : 'Web down'}
    >
      Web {ok ? 'up' : 'down'}
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
