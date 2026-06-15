'use client';

import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { probeLocalDatabaseThunk } from '@/store/thunks/projects';

export const RefreshStatus = () => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const isActiveProject = useMemo(
    () => projectsBuilder.activeLocalDatabaseProjectId === id,
    [projectsBuilder.activeLocalDatabaseProjectId, id],
  );
  const isBusy = useMemo(
    () => isActiveProject && projectsBuilder.localDatabaseLoadStatus === 'loading',
    [isActiveProject, projectsBuilder.localDatabaseLoadStatus],
  );
  const isProbing = useMemo(
    () => isBusy && projectsBuilder.localDatabaseOperation === 'probe',
    [isBusy, projectsBuilder.localDatabaseOperation],
  );

  return (
    <button
      type="button"
      className={styles.secondary}
      disabled={isBusy}
      onClick={() => void dispatch(probeLocalDatabaseThunk(id))}
    >
      {isProbing ? 'Refreshing…' : 'Refresh status'}
    </button>
  );
};

const styles = {
  secondary: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200 disabled:opacity-50
  `,
};
