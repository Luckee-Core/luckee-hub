'use client';

import { useEffect, type ReactNode } from 'react';
import { AppLayout } from '@/components/app-layout';
import { SystemMetricsHeaderItem } from '@/packages/projects/system-metrics-header-item';
import { useAppDispatch } from '@/store';
import { initializeAppThunk } from '@/store/thunks/terminal-sidebar';

type AppShellProps = {
  children: ReactNode;
};

/**
 * Shared layout (nav sidebar, header, terminal sidebar). Kicks off app init once; it holds no state.
 */
export const AppShell = ({ children }: AppShellProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initializeAppThunk());
  }, [dispatch]);

  return <AppLayout headerEndContent={<SystemMetricsHeaderItem />}>{children}</AppLayout>;
};
