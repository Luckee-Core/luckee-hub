'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { findProjectRepo } from '@/utils/projects';

export const Nextjs = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const webRepo = useMemo(
    () => findProjectRepo(projectRepos, id, 'nextjs'),
    [projectRepos, id],
  );

  if (!webRepo?.repoUrl) {
    return null;
  }

  return (
    <a
      href={webRepo.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      Next.js
    </a>
  );
};

const styles = {
  link: `
    rounded px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200
  `,
};
