'use client';

import type { HubProject } from '@/model';
import { useAppSelector } from '@/store';
import { isHubProjectAvailable } from '@/config';
import { projectHasWebRepo } from '@/utils/projects';
import { ProjectsHookStatusBadge } from '../../badges/hook-status';
import { ProjectsRowActions } from '../../actions/row-actions';

type ProjectsTableProjectRowProps = {
  project: HubProject;
  rowNumber: number;
  onRowClick: (projectId: string) => void;
};

export const ProjectsTableProjectRow = ({
  project,
  rowNumber,
  onRowClick,
}: ProjectsTableProjectRowProps) => {
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const available = isHubProjectAvailable(project.id);

  return (
    <tr
      className={available ? styles.tableRow : styles.tableRowComingSoon}
      onClick={() => onRowClick(project.id)}
    >
      <td className={styles.rowNumberCell}>{rowNumber}</td>
      <td className={styles.tableCell}>
        <div className={styles.projectName}>{project.name}</div>
      </td>
      <td className={styles.descriptionCell}>
        <span className={styles.projectDescription}>{project.description}</span>
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
  tableRowComingSoon: `
    hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer
    opacity-70
  `,
  rowNumberCell: `px-2 py-1 text-xs text-gray-400 font-mono align-middle`,
  tableCell: `px-2 py-1 text-xs text-gray-700 align-middle`,
  descriptionCell: `px-2 py-1 text-xs text-gray-500 align-middle max-w-xs`,
  actionsCell: `px-2 py-1 align-middle whitespace-nowrap`,
  tableCellMono: `px-2 py-1 text-[11px] text-gray-600 font-mono align-middle`,
  projectName: `font-medium text-gray-900 truncate`,
  projectDescription: `line-clamp-1`,
  muted: `text-gray-400 font-sans`,
};
