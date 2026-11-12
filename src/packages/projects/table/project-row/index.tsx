'use client';

import { useMemo, type DragEvent } from 'react';
import { GripVertical } from 'lucide-react';
import type { HubProject } from '@/model';
import { getProjectCatalogTier } from '@/config';
import { useAppSelector } from '@/store';
import { listTableStyles } from '@/components/list-table-styles';
import { findProjectRepo } from '@/utils/projects';
import { ProjectsHookStatusBadge } from '../../badges/hook-status';
import { ProjectsRowActions } from '../../actions/row-actions';
import type { ProjectCatalogTier } from '@/config';

type ProjectsTableProjectRowProps = {
  project: HubProject;
  onRowClick: (projectId: string) => void;
  /** Rows in tier sections can be dragged onto another section. */
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (projectId: string) => void;
  onDragEnd?: () => void;
};

const getPortFromUrl = (url: string): string | undefined => {
  try {
    return new URL(url).port || undefined;
  } catch {
    return undefined;
  }
};

const rowClassForTier = (tier: ProjectCatalogTier): string => {
  switch (tier) {
    case 'active':
      return styles.tableRowCatalogActive;
    case 'finalSteps':
      return styles.tableRowFinalSteps;
    case 'almostReady':
      return styles.tableRow;
    case 'workInProgress':
      return styles.tableRowWorkInProgress;
    default:
      return styles.tableRow;
  }
};

export const ProjectsTableProjectRow = ({
  project,
  onRowClick,
  draggable = false,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: ProjectsTableProjectRowProps) => {
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const projectSectionOverrides = useAppSelector((s) => s.projectSectionOverrides);
  const catalogTier = useMemo(
    () => getProjectCatalogTier(project.id, projectSectionOverrides.byProjectId),
    [project.id, projectSectionOverrides.byProjectId],
  );
  const rowClassName = rowClassForTier(catalogTier);

  const webRepo = useMemo(
    () => findProjectRepo(projectRepos, project.id, 'nextjs'),
    [projectRepos, project.id],
  );
  const runningWebPort = project.webUrl ? getPortFromUrl(project.webUrl) : undefined;
  const webPort = runningWebPort ?? webRepo?.defaultWebPortStart;

  const handleDragStart = (event: DragEvent<HTMLTableRowElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', project.id);
    onDragStart?.(project.id);
  };

  return (
    <tr
      className={isDragging ? `${rowClassName} ${styles.dragging}` : rowClassName}
      onClick={() => onRowClick(project.id)}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
    >
      <td className={styles.tableCell}>
        <div className={styles.nameWrap}>
          <GripVertical
            className={draggable ? styles.grip : styles.gripHidden}
            aria-hidden
          />
          <span className={styles.projectName}>{project.name}</span>
        </div>
      </td>
      <td className={styles.descriptionCell}>
        <span className={styles.projectDescription}>{project.description}</span>
      </td>
      <td className={styles.tableCell}>
        <ProjectsHookStatusBadge hookStatus={project.hookStatus} compact />
      </td>
      <td className={styles.tableCellMono}>
        <span title="API port">:{project.apiPort}</span>
        <span className={styles.portSeparator}>·</span>
        {!webRepo ? (
          <span className={styles.muted}>API only</span>
        ) : webPort ? (
          <span
            className={runningWebPort ? styles.webPortRunning : undefined}
            title={runningWebPort ? `Web running at ${project.webUrl}` : 'Web port'}
          >
            :{webPort}
          </span>
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
  tableRow: listTableStyles.row,
  tableRowCatalogActive: `
    hover:bg-green-50/60 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  tableRowFinalSteps: `
    hover:bg-violet-50/60 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  tableRowWorkInProgress: `
    hover:bg-sky-50/60 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  tableCell: listTableStyles.cell,
  descriptionCell: `px-3 py-2 text-xs text-gray-500 align-middle max-w-xs`,
  dragging: `opacity-40`,
  nameWrap: `flex items-center gap-1 min-w-0`,
  grip: `h-3.5 w-3.5 shrink-0 text-gray-300 cursor-grab`,
  gripHidden: `h-3.5 w-3.5 shrink-0 invisible`,
  actionsCell: `px-3 py-2 align-middle whitespace-nowrap`,
  tableCellMono: `px-3 py-2 text-[11px] text-gray-600 font-mono align-middle whitespace-nowrap`,
  portSeparator: `mx-1.5 text-gray-300`,
  webPortRunning: `text-green-700 font-medium`,
  projectName: `font-medium text-gray-900 truncate`,
  projectDescription: `line-clamp-1`,
  muted: `text-gray-400 font-sans`,
};
