'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';

export const SetupSuccess = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const isActiveProject = useMemo(
    () => projectsBuilder.activeLocalDatabaseProjectId === id,
    [projectsBuilder.activeLocalDatabaseProjectId, id],
  );
  const setupMessage = useMemo(
    () => (isActiveProject ? projectsBuilder.localDatabaseSetupMessage : null),
    [isActiveProject, projectsBuilder.localDatabaseSetupMessage],
  );

  if (!setupMessage) {
    return null;
  }

  return <p className={styles.success}>{setupMessage}</p>;
};

const styles = {
  success: `text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2`,
};
