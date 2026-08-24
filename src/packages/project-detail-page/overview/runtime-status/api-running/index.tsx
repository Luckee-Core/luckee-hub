'use client';

import { useMemo } from 'react';

import type { HookStatus } from '@/model';
import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

const API_RUNNING_STATUSES: HookStatus[] = ['api_running', 'ready'];

/**
 * Mini status chip — Express API running.
 */
export const ApiRunningStatus = () => {
  const { id, hookStatus, apiPort } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const expressRepo = useMemo(
    () => findProjectRepo(projectRepos, id, 'express'),
    [projectRepos, id],
  );

  const ok = API_RUNNING_STATUSES.includes(hookStatus);
  const title = ok ? `API up · ${apiPort}` : `API down · ${apiPort}`;

  if (!expressRepo) {
    return null;
  }

  return (
    <span className={ok ? styles.ok : styles.pending} title={title}>
      API {ok ? 'up' : 'down'}
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
