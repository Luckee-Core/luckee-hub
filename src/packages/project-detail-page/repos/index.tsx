'use client';

import { useMemo } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectDetailBuilderActions } from '@/store/builders';
import { REPO_ROLE_ORDER } from '../repo-role-order';
import { getRepoRoleLabelForRepo } from '../get-repo-role-label';
import { StatusDot, type DetailStatus } from '../status';
import { getRepoCardStatus } from '../status/get-repo-card-status';

/**
 * Repo cards — open a per-repo workstation.
 */
export const ProjectDetailRepos = () => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const envProbes = useAppSelector((s) => s.envProbes);

  const repos = useMemo(
    () =>
      projectRepos
        .filter((repo) => repo.projectId === id)
        .sort((a, b) => {
          const diff = REPO_ROLE_ORDER[a.role] - REPO_ROLE_ORDER[b.role];
          return diff !== 0 ? diff : a.repoName.localeCompare(b.repoName);
        }),
    [projectRepos, id],
  );

  if (repos.length === 0) {
    return (
      <section className={detailPageStyles.panel}>
        <p className={detailPageStyles.panelSubtitle}>No repos registered for this project.</p>
      </section>
    );
  }

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div>
          <h2 className={detailPageStyles.panelTitle}>Repos</h2>
          <p className={detailPageStyles.panelSubtitle}>
            Each checkout has its own workstation for runtime and environment.
          </p>
        </div>
      </div>
      <ul className={styles.list}>
        {repos.map((repo) => {
          const status: DetailStatus = getRepoCardStatus(repo, envProbes);
          return (
            <li key={`${repo.role}-${repo.repoName}`}>
              <button
                type="button"
                className={styles.card}
                onClick={() => {
                  dispatch(
                    ProjectDetailBuilderActions.setActiveRepo({
                      role: repo.role,
                      repoName: repo.repoName,
                    }),
                  );
                }}
              >
                <div className={styles.cardTop}>
                  <span className={styles.role}>{getRepoRoleLabelForRepo(repo)}</span>
                  <StatusDot status={status} />
                </div>
                <span className={styles.repoName}>{repo.repoName}</span>
                <span className={styles.meta}>
                  {repo.dirExists ? 'Cloned' : 'Not cloned'}
                  {repo.depsInstalled === false ? ' · Install dependencies' : ''}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const styles = {
  list: `grid gap-3 sm:grid-cols-2 lg:grid-cols-3 px-4 pt-4 pb-4`,
  card: `
    w-full text-left rounded-lg border border-gray-200 bg-white px-4 py-3
    hover:border-blue-300 hover:shadow-sm cursor-pointer transition
  `,
  cardTop: `flex items-center justify-between gap-2`,
  role: `text-sm font-semibold text-gray-900`,
  repoName: `block font-mono text-xs text-gray-600 mt-1 truncate`,
  meta: `block text-xs text-gray-500 mt-2`,
};
