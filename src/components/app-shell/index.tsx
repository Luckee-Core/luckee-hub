'use client';

import { useEffect, type ReactNode } from 'react';
import { AppLayout } from '@/components/app-layout';
import { TerminalDock } from '@/packages/terminal-dock';
import { useAppDispatch } from '@/store';
import {
  loadHubConfigThunk,
  loadProjectsThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/projects';

type AppShellProps = {
  children: ReactNode;
};

/**
 * Shared layout + terminal dock. Loads hub config, the catalog, and terminal sessions once.
 */
export const AppShell = ({ children }: AppShellProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async (): Promise<void> => {
      await dispatch(loadHubConfigThunk());
      await dispatch(loadProjectsThunk());
      void dispatch(syncTerminalSessionsThunk());
    };
    void load();
  }, [dispatch]);

  return <AppLayout terminalDock={<TerminalDock />}>{children}</AppLayout>;
};
