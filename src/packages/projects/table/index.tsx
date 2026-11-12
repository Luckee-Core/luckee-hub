'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { listTableStyles } from '@/components/list-table-styles';
import { ProjectsTableLoadingState } from './loading-state';
import { ProjectsTableView } from './table-view';

export const ProjectsTable = () => {
  const projects = useAppSelector((s) => s.projects);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const projectsList = useMemo(() => Object.values(projects), [projects]);
  const { listLoadStatus, listError } = projectsBuilder;

  if ((listLoadStatus === 'idle' || listLoadStatus === 'loading') && projectsList.length === 0) {
    return <ProjectsTableLoadingState />;
  }

  if (listLoadStatus === 'error') {
    return (
      <p className={styles.error}>
        {listError ?? 'Failed to load projects. Is luckee-hub-express-server running on :3001?'}
      </p>
    );
  }

  if (projectsList.length === 0) {
    return (
      <div className={listTableStyles.tableWrapper}>
        <div className={listTableStyles.emptyState}>
          <p className={listTableStyles.emptyText}>No projects in registry.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {listError ? (
        <p className={styles.error} role="alert">
          {listError}
        </p>
      ) : null}
      <ProjectsTableView projects={projectsList} />
    </div>
  );
};

const styles = {
  root: `
    space-y-3
  `,
  error: `
    text-sm text-red-700
  `,
};
