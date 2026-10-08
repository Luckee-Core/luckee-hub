'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { ProjectsTableView } from './table-view';

export const ProjectsTable = () => {
  const projects = useAppSelector((s) => s.projects);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const projectsList = useMemo(() => Object.values(projects), [projects]);
  const { listLoadStatus, listError } = projectsBuilder;

  if (listLoadStatus === 'loading' && projectsList.length === 0) {
    return <p className={styles.message}>Loading projects…</p>;
  }

  if (listLoadStatus === 'error') {
    return (
      <p className={styles.error}>
        {listError ?? 'Failed to load projects. Is luckee-hub-express-server running on :3001?'}
      </p>
    );
  }

  if (projectsList.length === 0) {
    return <p className={styles.message}>No projects in registry.</p>;
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
  message: `
    text-gray-600
  `,
  error: `
    text-sm text-red-700
  `,
};
