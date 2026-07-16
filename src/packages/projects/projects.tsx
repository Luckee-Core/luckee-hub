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
      await dispatch(loadProjectsThunk());
      await dispatch(loadProjectsThunk({ live: true }));
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
