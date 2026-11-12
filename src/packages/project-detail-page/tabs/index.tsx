'use client';

import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectDetailBuilderActions, type ProjectDetailTabId } from '@/store/builders';
import { StatusDot, type DetailStatus } from '../status';
import { getRepoCardStatus } from '../status/get-repo-card-status';

type DetailTab = {
  id: ProjectDetailTabId;
  label: string;
  /** Omitted for tabs that aren't a readiness check (Overview). */
  status?: DetailStatus;
};

const worstStatus = (statuses: DetailStatus[]): DetailStatus => {
  if (statuses.includes('attention')) {
    return 'attention';
  }
  if (statuses.includes('checking')) {
    return 'checking';
  }
  return 'ready';
};

export const ProjectDetailTabs = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const envProbes = useAppSelector((s) => s.envProbes);
  const { activeTab } = useAppSelector((s) => s.projectDetailBuilder);

  const tabs = useMemo((): DetailTab[] => {
    const repos = projectRepos.filter((repo) => repo.projectId === currentProject.id);
    const repoStatuses = repos.map((repo) => getRepoCardStatus(repo, envProbes));
    return [
      { id: 'overview', label: 'Overview' },
      { id: 'repos', label: 'Repos', status: repoStatuses.length ? worstStatus(repoStatuses) : 'ready' },
    ];
  }, [currentProject, projectRepos, envProbes]);

  const activeId = tabs.some((tab) => tab.id === activeTab) ? activeTab : 'overview';

  return (
    <div className={styles.tabList} role="tablist" aria-label="Project detail sections">
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? styles.tabActive : styles.tab}
            onClick={() => dispatch(ProjectDetailBuilderActions.setActiveTab(tab.id))}
          >
            {tab.label}
            {tab.status ? <StatusDot status={tab.status} /> : null}
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  tabList: `flex flex-wrap gap-1 border-b border-gray-200`,
  tab: `
    -mb-px inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600
    border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 cursor-pointer
  `,
  tabActive: `
    -mb-px inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600
    border-b-2 border-blue-600 cursor-pointer
  `,
};
