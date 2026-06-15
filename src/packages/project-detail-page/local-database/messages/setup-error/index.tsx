'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';

export const SetupError = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const isActiveProject = useMemo(
    () => projectsBuilder.activeLocalDatabaseProjectId === id,
    [projectsBuilder.activeLocalDatabaseProjectId, id],
  );
  const error = useMemo(
    () => (isActiveProject ? projectsBuilder.localDatabaseError : null),
    [isActiveProject, projectsBuilder.localDatabaseError],
  );

  if (!error) {
    return null;
  }

  return <p className={styles.error}>{error}</p>;
};

const styles = {
  error: `text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
};
