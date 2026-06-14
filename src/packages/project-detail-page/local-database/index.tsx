'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  probeLocalDatabaseThunk,
  setupLocalDatabaseThunk,
} from '@/store/thunks/projects';
import { StatusChip } from './status-chip';

export const ProjectDetailLocalDatabase = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);

  const projectId = currentProject.id;

  const probe = useMemo(
    () => localDatabaseProbes[projectId],
    [localDatabaseProbes, projectId],
  );
  const isLoading = useMemo(
    () =>
      projectsBuilder.localDatabaseLoadStatus === 'loading' &&
      projectsBuilder.activeLocalDatabaseProjectId === projectId,
    [projectsBuilder, projectId],
  );
  const error = useMemo(
    () =>
      projectsBuilder.activeLocalDatabaseProjectId === projectId
        ? projectsBuilder.localDatabaseError
        : null,
    [projectsBuilder, projectId],
  );
  const setupMessage = useMemo(
    () =>
      projectsBuilder.activeLocalDatabaseProjectId === projectId
        ? projectsBuilder.localDatabaseSetupMessage
        : null,
    [projectsBuilder, projectId],
  );

  if (!currentProject.localDatabaseSupported) {
    return null;
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Local database</h2>
      <p className={styles.subtitle}>
        Hub creates the Postgres database, applies migrations, and writes DATABASE_URL to the express
        .env.
      </p>

      {probe?.message ? <p className={styles.warning}>{probe.message}</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}
      {setupMessage ? <p className={styles.success}>{setupMessage}</p> : null}

      {probe?.supported ? (
        <div className={styles.chips}>
          <StatusChip label="Postgres running" ok={probe.postgresRunning} />
          <StatusChip label="Database exists" ok={probe.databaseExists} />
          <StatusChip label="Schema ready" ok={probe.schemaReady} />
          <StatusChip label=".env configured" ok={probe.envConfigured} />
        </div>
      ) : null}

      {probe?.databaseUrl ? (
        <p className={styles.url}>
          <span className={styles.urlLabel}>DATABASE_URL</span>
          <code className={styles.urlValue}>{probe.databaseUrl}</code>
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondary}
          disabled={isLoading}
          onClick={() => void dispatch(probeLocalDatabaseThunk(projectId))}
        >
          {isLoading ? 'Probing…' : 'Probe'}
        </button>
        <button
          type="button"
          className={styles.primary}
          disabled={isLoading}
          onClick={() => void dispatch(setupLocalDatabaseThunk(projectId))}
        >
          Setup database
        </button>
      </div>
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-4`,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-600`,
  warning: `text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2`,
  error: `text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2`,
  success: `text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2`,
  chips: `flex flex-wrap gap-2`,
  url: `text-sm space-y-1`,
  urlLabel: `font-semibold text-gray-700`,
  urlValue: `block font-mono text-xs text-gray-600 break-all`,
  actions: `flex flex-wrap gap-2`,
  primary: `
    px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded
    hover:bg-orange-600 disabled:opacity-50
  `,
  secondary: `
    px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded
    hover:bg-gray-200 disabled:opacity-50
  `,
};
