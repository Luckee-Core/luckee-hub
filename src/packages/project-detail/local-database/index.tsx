'use client';

import { useMemo } from 'react';
import type { HubProject } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  probeLocalDatabaseThunk,
  setupLocalDatabaseThunk,
} from '@/store/thunks/projects';
import { StatusChip } from './status-chip';

type ProjectDetailLocalDatabaseProps = {
  project: HubProject;
};

export const ProjectDetailLocalDatabase = ({ project }: ProjectDetailLocalDatabaseProps) => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);

  const probe = useMemo(
    () => localDatabaseProbes[project.id],
    [localDatabaseProbes, project.id],
  );
  const isLoading = useMemo(
    () =>
      projectsBuilder.localDatabaseLoadStatus === 'loading' &&
      projectsBuilder.activeLocalDatabaseProjectId === project.id,
    [projectsBuilder, project.id],
  );
  const error = useMemo(
    () =>
      projectsBuilder.activeLocalDatabaseProjectId === project.id
        ? projectsBuilder.localDatabaseError
        : null,
    [projectsBuilder, project.id],
  );
  const setupMessage = useMemo(
    () =>
      projectsBuilder.activeLocalDatabaseProjectId === project.id
        ? projectsBuilder.localDatabaseSetupMessage
        : null,
    [projectsBuilder, project.id],
  );

  if (!project.localDatabaseSupported) {
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
          onClick={() => void dispatch(probeLocalDatabaseThunk(project.id))}
        >
          {isLoading ? 'Probing…' : 'Probe'}
        </button>
        <button
          type="button"
          className={styles.primary}
          disabled={isLoading}
          onClick={() => void dispatch(setupLocalDatabaseThunk(project.id))}
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
