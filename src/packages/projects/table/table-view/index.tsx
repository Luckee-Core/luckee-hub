'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HubProject } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import { projectHasRunningTerminals } from '@/utils/projects';
import { getProjectCatalogTier, PROJECT_DETAIL_PAGE_PATH } from '@/config';
import {
  hydrateProjectFavoritesThunk,
  hydrateProjectSectionOverridesThunk,
  setCurrentProjectThunk,
} from '@/store/thunks/projects';
import { ProjectsRefreshButton, ProjectsLuckeeParentControl } from '../../header/buttons';
import { ProjectsTableSectionHeaderRow } from '../section-header-row';
import { ProjectsTableProjectRow } from '../project-row';
import { SystemMetricsRow } from '../../system-metrics-row';

type ProjectsTableViewProps = {
  projects: HubProject[];
};

type SortDirection = 'asc' | 'desc';
type SortableColumn = 'name' | 'status' | 'apiPort';

const sortProjects = (
  items: HubProject[],
  sortColumn: SortableColumn,
  sortDirection: SortDirection,
): HubProject[] => {
  const result = [...items];
  result.sort((a, b) => {
    let comparison = 0;
    if (sortColumn === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortColumn === 'status') {
      comparison = a.hookStatus.localeCompare(b.hookStatus);
    } else {
      comparison = a.apiPort - b.apiPort;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  return result;
};

export const ProjectsTableView = ({ projects }: ProjectsTableViewProps) => {
  const dispatch = useAppDispatch();
  const terminalSessions = useAppSelector((s) => s.terminalSessions);
  const projectFavorites = useAppSelector((s) => s.projectFavorites);
  const projectSectionOverrides = useAppSelector((s) => s.projectSectionOverrides);
  const router = useRouter();

  useEffect(() => {
    void dispatch(hydrateProjectFavoritesThunk());
    void dispatch(hydrateProjectSectionOverridesThunk());
  }, [dispatch]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<SortableColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (projectId: string) => {
    void dispatch(setCurrentProjectThunk(projectId)).then((status) => {
      if (status === 200) {
        router.push(PROJECT_DETAIL_PAGE_PATH);
      }
    });
  };

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(lower) ||
          project.description.toLowerCase().includes(lower) ||
          project.id.toLowerCase().includes(lower),
      );
    }

    if (statusFilter) {
      result = result.filter((project) => project.hookStatus === statusFilter);
    }

    return sortProjects(result, sortColumn, sortDirection);
  }, [projects, searchTerm, statusFilter, sortColumn, sortDirection]);

  const favoriteIdSet = useMemo(
    () => new Set(projectFavorites.ids),
    [projectFavorites.ids],
  );

  const {
    runningProjects,
    favoriteProjects,
    catalogActiveProjects,
    finalStepsProjects,
    almostReadyProjects,
    workInProgressProjects,
    comingSoonProjects,
    cancelledProjects,
  } = useMemo(() => {
    const running: HubProject[] = [];
    const favorites: HubProject[] = [];
    const catalogActive: HubProject[] = [];
    const finalSteps: HubProject[] = [];
    const almostReady: HubProject[] = [];
    const workInProgress: HubProject[] = [];
    const comingSoon: HubProject[] = [];
    const cancelled: HubProject[] = [];

    for (const project of filteredProjects) {
      if (projectHasRunningTerminals(terminalSessions, project.id)) {
        running.push(project);
      } else if (favoriteIdSet.has(project.id)) {
        favorites.push(project);
      } else {
        const tier = getProjectCatalogTier(project.id, projectSectionOverrides.byProjectId);
        if (tier === 'active') {
          catalogActive.push(project);
        } else if (tier === 'finalSteps') {
          finalSteps.push(project);
        } else if (tier === 'almostReady') {
          almostReady.push(project);
        } else if (tier === 'workInProgress') {
          workInProgress.push(project);
        } else if (tier === 'cancelled') {
          cancelled.push(project);
        } else {
          comingSoon.push(project);
        }
      }
    }

    return {
      runningProjects: running,
      favoriteProjects: favorites,
      catalogActiveProjects: catalogActive,
      finalStepsProjects: finalSteps,
      almostReadyProjects: almostReady,
      workInProgressProjects: workInProgress,
      comingSoonProjects: comingSoon,
      cancelledProjects: cancelled,
    };
  }, [filteredProjects, terminalSessions, favoriteIdSet, projectSectionOverrides.byProjectId]);

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No projects in registry</p>
      </div>
    );
  }

  const hasVisibleProjects =
    runningProjects.length > 0 ||
    favoriteProjects.length > 0 ||
    catalogActiveProjects.length > 0 ||
    finalStepsProjects.length > 0 ||
    almostReadyProjects.length > 0 ||
    workInProgressProjects.length > 0 ||
    comingSoonProjects.length > 0 ||
    cancelledProjects.length > 0;

  return (
    <div className={styles.wrapper}>
      <SystemMetricsRow />
      <div className={styles.toolbar}>
        <ProjectsLuckeeParentControl />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search projects…"
          className={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={styles.filterSelect}
        >
          <option value="">All statuses</option>
          <option value="ready">Ready</option>
          <option value="api_running">API running</option>
          <option value="web_running">Web running</option>
          <option value="configured">Configured</option>
          <option value="cloned">Cloned</option>
          <option value="missing">Missing paths</option>
          <option value="disabled">Disabled</option>
          <option value="catalog">Catalog</option>
        </select>
        <div className={styles.toolbarEnd}>
          <ProjectsRefreshButton />
        </div>
      </div>

      {!hasVisibleProjects ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No projects match your filters</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.rowNumberHeader}>#</th>
                <th className={styles.sortableHeader} onClick={() => handleSort('name')}>
                  <span>Project</span>
                  <span className={styles.sortIcon}>
                    {sortColumn === 'name' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th className={styles.tableHeaderWide}>Description</th>
                <th className={styles.tableHeaderSection}>Section</th>
                <th className={styles.sortableHeader} onClick={() => handleSort('status')}>
                  <span>Status</span>
                  <span className={styles.sortIcon}>
                    {sortColumn === 'status' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th className={styles.sortableHeaderNarrow} onClick={() => handleSort('apiPort')}>
                  <span>API</span>
                  <span className={styles.sortIcon}>
                    {sortColumn === 'apiPort' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th className={styles.tableHeaderNarrow}>Web</th>
                <th className={styles.tableHeaderActions}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {runningProjects.length > 0 ? (
                <>
                  <ProjectsTableSectionHeaderRow
                    title="Running"
                    count={runningProjects.length}
                    variant="running"
                  />
                  {runningProjects.map((project, index) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
                      rowNumber={index + 1}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </>
              ) : null}
              {favoriteProjects.length > 0 ? (
                <>
                  <ProjectsTableSectionHeaderRow
                    title="Favorites"
                    count={favoriteProjects.length}
                    variant="favorites"
                  />
                  {favoriteProjects.map((project, index) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
                      rowNumber={index + 1}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </>
              ) : null}
              {catalogActiveProjects.length > 0 ? (
                <>
                  <ProjectsTableSectionHeaderRow
                    title="Active"
                    count={catalogActiveProjects.length}
                    variant="catalogActive"
                  />
                  {catalogActiveProjects.map((project, index) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
                      rowNumber={index + 1}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </>
              ) : null}
              {finalStepsProjects.length > 0 ? (
                <>
                  <ProjectsTableSectionHeaderRow
                    title="Final steps"
                    count={finalStepsProjects.length}
                    variant="finalSteps"
                  />
                  {finalStepsProjects.map((project, index) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
                      rowNumber={index + 1}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </>
              ) : null}
              {almostReadyProjects.length > 0 ? (
                <>
                  <ProjectsTableSectionHeaderRow
                    title="Almost ready"
                    count={almostReadyProjects.length}
                    variant="almostReady"
                  />
                  {almostReadyProjects.map((project, index) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
                      rowNumber={index + 1}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </>
              ) : null}
              <ProjectsTableSectionHeaderRow
                title="Work in progress"
                count={workInProgressProjects.length}
                variant="workInProgress"
              />
              {workInProgressProjects.map((project, index) => (
                <ProjectsTableProjectRow
                  key={project.id}
                  project={project}
                  rowNumber={index + 1}
                  onRowClick={handleRowClick}
                />
              ))}
              <ProjectsTableSectionHeaderRow
                title="Coming soon"
                count={comingSoonProjects.length}
                variant="comingSoon"
              />
              {comingSoonProjects.map((project, index) => (
                <ProjectsTableProjectRow
                  key={project.id}
                  project={project}
                  rowNumber={index + 1}
                  onRowClick={handleRowClick}
                />
              ))}
              <ProjectsTableSectionHeaderRow
                title="Cancelled"
                count={cancelledProjects.length}
                variant="cancelled"
              />
              {cancelledProjects.map((project, index) => (
                <ProjectsTableProjectRow
                  key={project.id}
                  project={project}
                  rowNumber={index + 1}
                  onRowClick={handleRowClick}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: `space-y-0`,
  toolbar: `
    flex flex-wrap items-center gap-3 px-3 py-2 bg-white border border-gray-300 border-b-0
  `,
  searchInput: `
    flex-1 min-w-[12rem] max-w-xs px-2.5 py-1 text-xs border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500
    placeholder:text-gray-400
  `,
  filterSelect: `
    px-2.5 py-1 text-xs border border-gray-300 rounded bg-white
    focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500
  `,
  toolbarEnd: `ml-auto shrink-0`,
  tableContainer: `
    bg-white rounded-b border border-gray-300 overflow-x-auto overflow-y-visible
  `,
  table: `w-full border-collapse text-xs relative`,
  rowNumberHeader: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-7
  `,
  sortableHeader: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortableHeaderNarrow: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none w-16
  `,
  tableHeaderWide: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 min-w-[12rem]
  `,
  tableHeaderSection: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-[9.5rem]
  `,
  tableHeaderNarrow: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-28
  `,
  tableHeaderActions: `
    px-2 py-1.5 text-left text-[10px] font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-32
  `,
  sortIcon: `ml-1 text-gray-400 text-[10px]`,
  emptyState: `bg-white rounded-b border border-gray-300 border-t-0 p-8 text-center`,
  emptyTitle: `text-lg font-semibold text-gray-900`,
};
