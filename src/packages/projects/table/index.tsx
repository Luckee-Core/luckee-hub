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
        {listError ?? 'Failed to load projects. Is luckee-hub-express-server running on :4110?'}
      </p>
    );
  }

  if (projectsList.length === 0) {
    return <p className={styles.message}>No projects in registry.</p>;
  }

  return <ProjectsTableView projects={projectsList} />;
};

const styles = {
  message: `
    text-gray-600
  `,
  error: `
    text-red-600
  `,
};
