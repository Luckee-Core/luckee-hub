'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PROJECTS_PATH } from '@/config';
import { useAppDispatch } from '@/store';
import {
  startSystemMetricsPollingThunk,
  stopSystemMetricsPollingThunk,
} from '@/store/thunks/system-metrics';

const SYSTEM_METRICS_POLL_MS = 5000;

/**
 * Poll system metrics only on the projects list route; stop on project detail and all other pages.
 */
export const SystemMetricsPollingListener = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (pathname !== PROJECTS_PATH) {
      dispatch(stopSystemMetricsPollingThunk());
      return;
    }

    dispatch(startSystemMetricsPollingThunk({ intervalMs: SYSTEM_METRICS_POLL_MS }));
    return () => {
      dispatch(stopSystemMetricsPollingThunk());
    };
  }, [dispatch, pathname]);

  return null;
};
