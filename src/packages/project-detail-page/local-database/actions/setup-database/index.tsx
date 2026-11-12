'use client';

import { useMemo } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { setupLocalDatabaseThunk } from '@/store/thunks/projects';

export const SetupDatabase = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const isActiveProject = useMemo(
    () => projectsBuilder.activeLocalDatabaseProjectId === currentProject.id,
    [projectsBuilder.activeLocalDatabaseProjectId, currentProject.id],
  );
  const isBusy = useMemo(
    () => isActiveProject && projectsBuilder.localDatabaseLoadStatus === 'loading',
    [isActiveProject, projectsBuilder.localDatabaseLoadStatus],
  );
  const isSettingUp = useMemo(
    () => isBusy && projectsBuilder.localDatabaseOperation === 'setup',
    [isBusy, projectsBuilder.localDatabaseOperation],
  );

  const handleRunAll = () => {
    void dispatch(setupLocalDatabaseThunk(currentProject.id));
  };

  return (
    <button type="button" className={detailPageStyles.primaryButton} disabled={isBusy} onClick={handleRunAll}>
      {isSettingUp ? 'Running setup…' : 'Run all remaining'}
    </button>
  );
};
