'use client';

import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeStorageExpressThunk, runStorageExpressThunk } from '@/store/thunks/projects';

/**
 * Storage Express controls — start/close on project detail only.
 */
export const ProjectDetailStorageExpress = () => {
  const dispatch = useAppDispatch();
  const { id, name, storageExpressSupported, storagePort, storageRunning } = useAppSelector(
    (s) => s.currentProject,
  );
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const inFlight = projectsBuilder.storageExpressInFlight;
  const isBusyForProject = inFlight?.projectId === id;
  const isStarting = isBusyForProject && inFlight?.action === 'start';
  const isClosing = isBusyForProject && inFlight?.action === 'close';
  const feedbackForProject = projectsBuilder.storageExpressFeedbackProjectId === id;
  const storageError = useMemo(
    () => (feedbackForProject ? projectsBuilder.storageExpressError : null),
    [feedbackForProject, projectsBuilder.storageExpressError],
  );
  const storageMessage = useMemo(
    () => (feedbackForProject ? projectsBuilder.storageExpressMessage : null),
    [feedbackForProject, projectsBuilder.storageExpressMessage],
  );

  if (!storageExpressSupported) {
    return null;
  }

  const handleStart = () => {
    void dispatch(runStorageExpressThunk(id));
  };

  const handleClose = () => {
    void dispatch(closeStorageExpressThunk(id));
  };

  return (
    <section className={styles.section} aria-labelledby="storage-express-heading">
      <h2 id="storage-express-heading" className={styles.title}>Storage Express</h2>
      <p className={styles.description}>
        Postgres data plane for {name}. Runs <code className={styles.code}>git pull --ff-only</code>{' '}
        then <code className={styles.code}>npm run dev</code> on port {storagePort}. List Run does not
        start this server.
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={handleStart}
          disabled={isBusyForProject}
          aria-busy={isStarting}
        >
          {isStarting ? 'Starting storage…' : 'Start storage'}
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={handleClose}
          disabled={isBusyForProject}
          aria-busy={isClosing}
        >
          {isClosing ? 'Closing storage…' : 'Close storage'}
        </button>
        {storageRunning ? (
          <span className={styles.badgeOk}>Storage listening</span>
        ) : (
          <span className={styles.badgeMuted}>Storage down</span>
        )}
      </div>
      {storageError ? <p className={styles.error}>{storageError}</p> : null}
      {storageMessage ? <p className={styles.success}>{storageMessage}</p> : null}
    </section>
  );
};

const styles = {
  section: `rounded-lg border border-gray-200 bg-white p-4 space-y-3`,
  title: `text-sm font-semibold text-gray-900`,
  description: `text-sm text-gray-600`,
  code: `text-xs bg-gray-100 px-1 rounded`,
  actions: `flex flex-wrap items-center gap-2`,
  primary: `
    rounded px-3 py-1.5 text-xs font-medium text-white bg-gray-900
    hover:bg-gray-800 cursor-pointer border-none
    disabled:opacity-60 disabled:cursor-not-allowed
  `,
  secondary: `
    rounded px-3 py-1.5 text-xs font-medium text-gray-800 bg-white border border-gray-300
    hover:bg-gray-50 cursor-pointer
    disabled:opacity-60 disabled:cursor-not-allowed
  `,
  badgeOk: `
    inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
    bg-green-50 text-green-800 border border-green-200
  `,
  badgeMuted: `
    inline-flex items-center rounded px-2 py-0.5 text-xs font-medium
    bg-gray-50 text-gray-600 border border-gray-200
  `,
  error: `text-sm text-red-700`,
  success: `text-sm text-green-800`,
};
