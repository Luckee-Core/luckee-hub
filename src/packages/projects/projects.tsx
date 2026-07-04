'use client';

import { useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { useAppDispatch } from '@/store';
import {
  loadProjectsThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/projects';
import { ProjectsTable } from './table';
import { TerminalDock } from '@/packages/terminal-dock';

export const Projects = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadProjectsThunk());
    void dispatch(syncTerminalSessionsThunk());
    void dispatch(loadProjectsThunk({ live: true }));
  }, [dispatch]);

  return (
    <AppLayout terminalDock={<TerminalDock />}>
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
