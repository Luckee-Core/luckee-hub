'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

export const Express = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const expressRepo = useMemo(
    () => findProjectRepo(projectRepos, id, 'express'),
    [projectRepos, id],
  );

  if (!expressRepo?.repoUrl) {
    return null;
  }

  return (
    <a
      href={expressRepo.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      Express
    </a>
  );
};

const styles = {
  link: `
    rounded px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200
  `,
};
