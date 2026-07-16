'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { ProjectsSetupAction } from '@/packages/projects';
import { projectNeedsSetup } from '@/utils/projects';
import { RepoLinkRow } from './repo-link-row';

export const RepoLinks = () => {
  const { id, hookStatus } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const luckeeParent = useAppSelector((s) => s.projectsBuilder.luckeeParent);

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

  const needsSetup = projectNeedsSetup(hookStatus);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Repositories</h2>
      {needsSetup ? (
        <div className={styles.setupBlock}>
          <p className={styles.hint}>
            {luckeeParent ? (
              <>
                Use Setup to clone into{' '}
                <code className={styles.inlineCode}>{luckeeParent}/luckee/{id}/</code> and install
                dependencies.
              </>
            ) : (
              <>
                Use Setup to choose your Luckee folder in Finder, then clone and install dependencies.
              </>
            )}
          </p>
          <ProjectsSetupAction projectId={id} disabled={!needsSetup} />
        </div>
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
  setupBlock: `space-y-2`,
  hint: `text-sm text-gray-600`,
  inlineCode: `font-mono text-xs bg-gray-100 px-1 py-0.5 rounded`,
  list: `flex flex-col gap-3`,
};
