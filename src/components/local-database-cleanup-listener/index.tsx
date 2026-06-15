'use client';

import { useEffect } from 'react';

import { getLocalDatabaseCleanupUrl } from '@/api/projects';
import { store } from '@/store';

/**
 * On tab/window close, stop Postgres only if the hub started it for the current project.
 */
export const LocalDatabaseCleanupListener = () => {
  useEffect(() => {
    const handlePageHide = () => {
      const { currentProject } = store.getState();
      if (!currentProject.id || !currentProject.localDatabaseSupported) {
        return;
      }

      const url = getLocalDatabaseCleanupUrl(currentProject.id);
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon(url);
        return;
      }

      void fetch(url, { method: 'POST', keepalive: true });
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, []);

  return null;
};
