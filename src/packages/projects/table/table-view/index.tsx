'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HubProject } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import { projectHasRunningTerminals } from '@/utils/projects';
import {
  getProjectCatalogTier,
  PROJECT_CATALOG_TIER_LABELS,
  PROJECT_DETAIL_PAGE_PATH,
  type ProjectCatalogTier,
} from '@/config';
import {
  setCurrentProjectThunk,
} from '@/store/thunks/projects';
import { setProjectCatalogTierThunk } from '@/store/thunks/projects/set-project-catalog-tier-thunk';
import { listFilterBarStyles } from '@/components/list-filter-bar-styles';
import { listTableStyles } from '@/components/list-table-styles';
import { ProjectsRefreshButton } from '../../header/buttons';
import {
  ProjectsTableSectionHeaderRow,
  type ProjectsTableSectionVariant,
} from '../section-header-row';
import { ProjectsTableProjectRow } from '../project-row';
import { ProjectsTableTierSection } from '../tier-section';

type ProjectsTableViewProps = {
  projects: HubProject[];
};

const TIER_SECTION_VARIANTS: Record<ProjectCatalogTier, ProjectsTableSectionVariant> = {
  active: 'catalogActive',
  finalSteps: 'finalSteps',
  almostReady: 'almostReady',
  workInProgress: 'workInProgress',
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

  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortableColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [draggingProjectId, setDraggingProjectId] = useState<string | null>(null);
  const [dropTargetTier, setDropTargetTier] = useState<ProjectCatalogTier | null>(null);

  const handleRowDragEnd = () => {
    setDraggingProjectId(null);
    setDropTargetTier(null);
  };

  const handleDragLeaveTier = (tier: ProjectCatalogTier) => {
    setDropTargetTier((current) => (current === tier ? null : current));
  };

  const handleDropOnTier = (tier: ProjectCatalogTier) => {
    const projectId = draggingProjectId;
    handleRowDragEnd();
    if (!projectId) {
      return;
    }
    if (getProjectCatalogTier(projectId, projectSectionOverrides.byProjectId) === tier) {
      return;
    }
    void dispatch(setProjectCatalogTierThunk(projectId, tier));
  };

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

    return sortProjects(result, sortColumn, sortDirection);
  }, [projects, searchTerm, sortColumn, sortDirection]);

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
  } = useMemo(() => {
    const running: HubProject[] = [];
    const favorites: HubProject[] = [];
    const catalogActive: HubProject[] = [];
    const finalSteps: HubProject[] = [];
    const almostReady: HubProject[] = [];
    const workInProgress: HubProject[] = [];

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
        } else {
          almostReady.push(project);
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
    };
  }, [filteredProjects, terminalSessions, favoriteIdSet, projectSectionOverrides.byProjectId]);

  const tierSections = useMemo(
    (): { tier: ProjectCatalogTier; projects: HubProject[] }[] => [
      { tier: 'active', projects: catalogActiveProjects },
      { tier: 'finalSteps', projects: finalStepsProjects },
      { tier: 'almostReady', projects: almostReadyProjects },
      { tier: 'workInProgress', projects: workInProgressProjects },
    ],
    [catalogActiveProjects, finalStepsProjects, almostReadyProjects, workInProgressProjects],
  );

  const hasVisibleProjects =
    runningProjects.length > 0 ||
    favoriteProjects.length > 0 ||
    catalogActiveProjects.length > 0 ||
    finalStepsProjects.length > 0 ||
    almostReadyProjects.length > 0 ||
    workInProgressProjects.length > 0;

  return (
    <div className={styles.wrapper}>
      <div className={listFilterBarStyles.section}>
        <div className={listFilterBarStyles.searchInputWrapper}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search projects..."
            className={listFilterBarStyles.searchInput}
          />
          {searchTerm ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className={listFilterBarStyles.clearButton}
              aria-label="Clear search"
            >
              ✕
            </button>
          ) : null}
        </div>
        <div className={listFilterBarStyles.end}>
          <ProjectsRefreshButton />
        </div>
      </div>

      <div className={listTableStyles.tableWrapper}>
      {!hasVisibleProjects ? (
        <div className={listTableStyles.emptyState}>
          <p className={listTableStyles.emptyText}>No projects match your search.</p>
        </div>
      ) : (
        <div className={listTableStyles.tableScrollContainer}>
          <table className={listTableStyles.table}>
            <thead>
              <tr>
                <th className={styles.sortableHeader} onClick={() => handleSort('name')}>
                  <span>Project</span>
                  <span className={styles.sortIcon}>
                    {sortColumn === 'name' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th className={styles.tableHeaderWide}>Description</th>
                <th className={styles.sortableHeader} onClick={() => handleSort('status')}>
                  <span>Status</span>
                  <span className={styles.sortIcon}>
                    {sortColumn === 'status' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th
                  className={styles.sortableHeaderPorts}
                  onClick={() => handleSort('apiPort')}
                  title="API port · Web port"
                >
                  <span>Ports</span>
                  <span className={styles.sortIcon}>
                    {sortColumn === 'apiPort' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
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
                  {runningProjects.map((project) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
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
                  {favoriteProjects.map((project) => (
                    <ProjectsTableProjectRow
                      key={project.id}
                      project={project}
                      onRowClick={handleRowClick}
                    />
                  ))}
                </>
              ) : null}
            </tbody>
            {tierSections.map(({ tier, projects: tierProjects }) => (
              <ProjectsTableTierSection
                key={tier}
                tier={tier}
                title={PROJECT_CATALOG_TIER_LABELS[tier]}
                variant={TIER_SECTION_VARIANTS[tier]}
                projects={tierProjects}
                showWhenEmpty={
                  tier === 'active' || tier === 'workInProgress' || draggingProjectId !== null
                }
                draggingProjectId={draggingProjectId}
                isDropTarget={dropTargetTier === tier}
                onDragOverTier={setDropTargetTier}
                onDragLeaveTier={handleDragLeaveTier}
                onDropOnTier={handleDropOnTier}
                onRowDragStart={setDraggingProjectId}
                onRowDragEnd={handleRowDragEnd}
                onRowClick={handleRowClick}
              />
            ))}
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: `space-y-3`,
  sortableHeader: listTableStyles.thSortable,
  sortableHeaderPorts: `${listTableStyles.thSortable} w-32`,
  tableHeaderWide: `${listTableStyles.th} min-w-[12rem]`,
  tableHeaderActions: `${listTableStyles.th} w-32`,
  sortIcon: `ml-1 text-gray-400 text-[10px]`,
};
