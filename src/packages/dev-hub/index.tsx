'use client';

import { useEffect } from 'react';
import { AppLayout } from '@/components/app-layout';
import { useAppDispatch } from '@/store';
import {
  loadDevHubStudiosThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/dev-hub';
import { DevHubHeader } from './header';
import { DevHubStudioTable } from './studio-table';
import { DevHubTerminalDock } from './terminal-dock';

export const DevHub = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadDevHubStudiosThunk());
    void dispatch(syncTerminalSessionsThunk());
    void dispatch(loadDevHubStudiosThunk({ live: true }));
  }, [dispatch]);

  return (
    <AppLayout terminalDock={<DevHubTerminalDock />}>
      <div className={styles.page}>
        <DevHubHeader />
        <DevHubStudioTable />
      </div>
    </AppLayout>
  );
};

const styles = {
  page: `
    w-full space-y-4
  `,
};
