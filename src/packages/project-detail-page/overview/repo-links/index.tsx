'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { RepoLinkRow } from './repo-link-row';

export const RepoLinks = () => {
  const { id, hookStatus } = useAppSelector((s) => s.currentProject);
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

  const showCloneHint = hookStatus === 'catalog' || hookStatus === 'missing';

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Repositories</h2>
      {showCloneHint ? (
        <p className={styles.hint}>
          Clone these repos, then add paths in <code className={styles.inlineCode}>hub.local.json</code>.
        </p>
      ) : null}
      <div className={styles.list}>
        {repos.map((repo) => (
          <RepoLinkRow
            key={`${repo.projectId}-${repo.repoType}-${repo.repoName}`}
            repoType={repo.repoType}
            repoName={repo.repoName}
            repoUrl={repo.repoUrl!}
          />
        ))}
      </div>
    </section>
  );
};

const styles = {
  section: `space-y-3`,
  heading: `text-sm font-semibold text-gray-900 uppercase tracking-wide`,
  hint: `text-sm text-gray-600`,
  inlineCode: `font-mono text-xs bg-gray-100 px-1 py-0.5 rounded`,
  list: `flex flex-col gap-3`,
};
