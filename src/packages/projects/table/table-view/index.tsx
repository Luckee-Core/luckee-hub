'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { HubProject } from '@/model';
import { useAppDispatch } from '@/store';
import { PROJECT_DETAIL_PATH } from '@/config/routes';
import {
  setCurrentProjectDetailThunk,
} from '@/store/thunks/projects';
import { ProjectsHookStatusBadge } from '../../badges/hook-status';
import { ProjectsRowActions } from '../../actions/row-actions';

type ProjectsTableViewProps = {
  projects: HubProject[];
};

type SortDirection = 'asc' | 'desc';
type SortableColumn = 'name' | 'status' | 'apiPort';

export const ProjectsTableView = ({ projects }: ProjectsTableViewProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
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
    void dispatch(setCurrentProjectDetailThunk(projectId)).then((status) => {
      if (status === 200) {
        router.push(PROJECT_DETAIL_PATH);
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
  }, [projects, searchTerm, statusFilter, sortColumn, sortDirection]);

  if (projects.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No projects in registry</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
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
          <option value="catalog">Available</option>
        </select>
        <span className={styles.resultCount}>
          {filteredProjects.length} {filteredProjects.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {filteredProjects.length === 0 ? (
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
                <th className={styles.tableHeader}>Web</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project, index) => (
                <tr
                  key={project.id}
                  className={styles.tableRow}
                  onClick={() => handleRowClick(project.id)}
                >
                  <td className={styles.rowNumberCell}>{index + 1}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.projectName}>{project.name}</div>
                    <div className={styles.projectDescription}>{project.description}</div>
                  </td>
                  <td className={styles.tableCell}>
                    <ProjectsHookStatusBadge hookStatus={project.hookStatus} />
                  </td>
                  <td className={styles.tableCellMono}>:{project.apiPort}</td>
                  <td className={styles.tableCellMono}>
                    {project.apiOnly ? (
                      <span className={styles.muted}>API only</span>
                    ) : project.webUrl ? (
                      project.webUrl.replace('http://', '')
                    ) : (
                      <span className={styles.muted}>—</span>
                    )}
                  </td>
                  <td className={styles.tableCell}>
                    <ProjectsRowActions project={project} />
                  </td>
                </tr>
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
    flex flex-wrap items-center gap-3 px-3 py-3 bg-white border border-gray-300 border-b-0 rounded-t
  `,
  searchInput: `
    flex-1 min-w-[12rem] max-w-xs px-3 py-1.5 text-sm border border-gray-300 rounded
    focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500
    placeholder:text-gray-400
  `,
  filterSelect: `
    px-3 py-1.5 text-sm border border-gray-300 rounded bg-white
    focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500
  `,
  resultCount: `ml-auto text-xs text-gray-500`,
  tableContainer: `
    bg-white rounded-b border border-gray-300 overflow-x-auto overflow-y-visible
  `,
  table: `w-full border-collapse text-sm relative`,
  rowNumberHeader: `
    px-2 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 w-8
  `,
  sortableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none
  `,
  sortableHeaderNarrow: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300 cursor-pointer hover:bg-gray-200 transition-colors select-none w-24
  `,
  tableHeader: `
    px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide
    bg-gray-100 border-b border-gray-300
  `,
  sortIcon: `ml-1 text-gray-400 text-[10px]`,
  tableRow: `
    hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer
  `,
  rowNumberCell: `px-2 py-3 text-sm text-gray-400 font-mono`,
  tableCell: `px-3 py-3 text-sm text-gray-700 align-top`,
  tableCellMono: `px-3 py-3 text-xs text-gray-600 font-mono align-top`,
  projectName: `font-medium text-gray-900`,
  projectDescription: `text-xs text-gray-500 mt-0.5 line-clamp-2`,
  muted: `text-gray-400 font-sans`,
  emptyState: `bg-white rounded border border-gray-300 p-8 text-center`,
  emptyTitle: `text-lg font-semibold text-gray-900`,
};
