'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';

export const CheckingStatus = () => {
  const { id } = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);

  const probe = useMemo(() => localDatabaseProbes[id], [localDatabaseProbes, id]);
  const isActiveProject = useMemo(
    () => projectsBuilder.activeLocalDatabaseProjectId === id,
    [projectsBuilder.activeLocalDatabaseProjectId, id],
  );
  const isBusy = useMemo(
    () => isActiveProject && projectsBuilder.localDatabaseLoadStatus === 'loading',
    [isActiveProject, projectsBuilder.localDatabaseLoadStatus],
  );
  const isSettingUp = useMemo(
    () => isBusy && projectsBuilder.localDatabaseOperation === 'setup',
    [isBusy, projectsBuilder.localDatabaseOperation],
  );

  if (!isBusy || probe) {
    return null;
  }

  return (
    <p className={styles.message}>
      {isSettingUp ? 'Setting up database…' : 'Checking database status…'}
    </p>
  );
};

const styles = {
  message: `text-sm text-gray-600`,
};
