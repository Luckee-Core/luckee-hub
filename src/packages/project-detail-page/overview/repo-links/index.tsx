'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { RepoLinkRow } from './repo-link-row';

/**
 * Single-line Express + Web clone / GitHub actions under the description.
 */
export const RepoLinks = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const repos = useMemo(
    () =>
      projectRepos
        .filter((repo) => repo.projectId === id && repo.repoUrl)
        .sort((a, b) => {
          if (a.repoType === b.repoType) {
            return a.repoName.localeCompare(b.repoName);
          }
          return a.repoType === 'express' ? -1 : 1;
        }),
    [projectRepos, id],
  );

  if (repos.length === 0) {
    return null;
  }

  return (
    <div className={styles.line}>
      {repos.map((repo, index) => (
        <span key={`${repo.projectId}-${repo.repoType}-${repo.repoName}`} className={styles.item}>
          {index > 0 ? <span className={styles.sep} aria-hidden>·</span> : null}
          <RepoLinkRow repoType={repo.repoType} repoUrl={repo.repoUrl!} />
        </span>
      ))}
    </div>
  );
};

const styles = {
  line: `flex flex-wrap items-center gap-2`,
  item: `inline-flex items-center gap-2`,
  sep: `text-gray-300 select-none`,
};
