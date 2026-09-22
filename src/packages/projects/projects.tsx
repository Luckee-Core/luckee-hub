'use client';

import { useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { useAppDispatch } from '@/store';
import {
  loadHubConfigThunk,
  loadProjectsThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/projects';
import { ProjectsTable } from './table';
import { TerminalDock } from '@/packages/terminal-dock';
import { LuckeeParentRequiredModal } from './luckee-parent-modal';
import { ProjectSetupModal } from './project-setup-modal';

export const Projects = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async (): Promise<void> => {
      await dispatch(loadHubConfigThunk());
      // Filesystem catalog only — skip auto `live: true` (blocks Express ~10s).
      await dispatch(loadProjectsThunk());
      void dispatch(syncTerminalSessionsThunk());
    };
    void load();
  }, [dispatch]);

  return (
    <AppLayout terminalDock={<TerminalDock />}>
      <LuckeeParentRequiredModal />
      <ProjectSetupModal />
      <div className={styles.page}>
        <ProjectsTable />
      </div>
    </AppLayout>
  );
};

const styles = {
  page: `
    w-full
  `,
};
