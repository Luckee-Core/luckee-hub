'use client';

import { useMemo } from 'react';
import type { HubProject } from '@/model';
import { getProjectCatalogTier, isProjectCatalogTierRowSelectable } from '@/config';
import { useAppSelector } from '@/store';
import { projectHasWebRepo } from '@/utils/projects';
import { ProjectsHookStatusBadge } from '../../badges/hook-status';
import { ProjectsRowActions } from '../../actions/row-actions';
import { ProjectsTableSectionSelect } from '../section-select';
import type { ProjectCatalogTier } from '@/config';

type ProjectsTableProjectRowProps = {
  project: HubProject;
  rowNumber: number;
  onRowClick: (projectId: string) => void;
};

const rowClassForTier = (tier: ProjectCatalogTier, selectable: boolean): string => {
  if (!selectable) {
    return tier === 'cancelled' ? styles.tableRowCancelled : styles.tableRowComingSoon;
  }
  switch (tier) {
    case 'active':
      return styles.tableRowCatalogActive;
    case 'finalSteps':
      return styles.tableRowFinalSteps;
    case 'almostReady':
      return styles.tableRow;
    case 'workInProgress':
      return styles.tableRowWorkInProgress;
    case 'comingSoon':
      return styles.tableRowComingSoon;
    case 'cancelled':
      return styles.tableRowCancelled;
    default:
      return styles.tableRow;
  }
};

export const ProjectsTableProjectRow = ({
  project,
  rowNumber,
  onRowClick,
}: ProjectsTableProjectRowProps) => {
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const projectSectionOverrides = useAppSelector((s) => s.projectSectionOverrides);
  const catalogTier = useMemo(
    () => getProjectCatalogTier(project.id, projectSectionOverrides.byProjectId),
    [project.id, projectSectionOverrides.byProjectId],
  );
  const selectable = isProjectCatalogTierRowSelectable(catalogTier);
  const rowClassName = rowClassForTier(catalogTier, selectable);

  return (
    <tr
      className={rowClassName}
      onClick={selectable ? () => onRowClick(project.id) : undefined}
      aria-disabled={selectable ? undefined : true}
    >
      <td className={styles.rowNumberCell}>{rowNumber}</td>
      <td className={styles.tableCell}>
        <div className={styles.projectName}>{project.name}</div>
      </td>
      <td className={styles.descriptionCell}>
        <span className={styles.projectDescription}>{project.description}</span>
      </td>
      <td className={styles.sectionCell} onClick={(event) => event.stopPropagation()}>
        <ProjectsTableSectionSelect projectId={project.id} />
      </td>
      <td className={styles.tableCell}>
        <ProjectsHookStatusBadge hookStatus={project.hookStatus} compact />
      </td>
      <td className={styles.tableCellMono}>:{project.apiPort}</td>
      <td className={styles.tableCellMono}>
        {!projectHasWebRepo(projectRepos, project.id) ? (
          <span className={styles.muted}>API only</span>
        ) : project.webUrl ? (
          project.webUrl.replace('http://', '')
        ) : (
          <span className={styles.muted}>—</span>
        )}
      </td>
      <td className={styles.actionsCell}>
        <ProjectsRowActions project={project} iconOnly />
      </td>
    </tr>
  );
};

const styles = {
  tableRow: `
    hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer
  `,
  tableRowCatalogActive: `
    hover:bg-green-50/60 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer
  `,
  tableRowFinalSteps: `
    hover:bg-violet-50/60 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer
  `,
  tableRowWorkInProgress: `
    hover:bg-sky-50/60 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer
  `,
  tableRowComingSoon: `
    border-b border-gray-100 last:border-b-0 cursor-default opacity-70
  `,
  tableRowCancelled: `
    border-b border-gray-100 last:border-b-0 cursor-default opacity-60
  `,
  rowNumberCell: `px-2 py-1 text-xs text-gray-400 font-mono align-middle`,
  tableCell: `px-2 py-1 text-xs text-gray-700 align-middle`,
  descriptionCell: `px-2 py-1 text-xs text-gray-500 align-middle max-w-xs`,
  sectionCell: `px-2 py-1 align-middle`,
  actionsCell: `px-2 py-1 align-middle whitespace-nowrap`,
  tableCellMono: `px-2 py-1 text-[11px] text-gray-600 font-mono align-middle`,
  projectName: `font-medium text-gray-900 truncate`,
  projectDescription: `line-clamp-1`,
  muted: `text-gray-400 font-sans`,
};
