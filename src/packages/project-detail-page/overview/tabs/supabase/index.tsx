'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';
import {
  saveSupabaseConfigThunk,
  seedSupabaseSchemaThunk,
} from '@/store/thunks/projects';
import { ConfiguredCheck } from '../configured-check';
import {
  DatabasePasswordInput,
  ProjectUrlInput,
  ServiceRoleKeyInput,
} from './inputs';

/**
 * Supabase tab — probed on project open (before other env groups); read-only when configured.
 */
export const SupabaseTab = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const supabaseProbes = useAppSelector((s) => s.supabaseProbes);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const probe = useMemo(
    () => supabaseProbes[currentProject.id],
    [supabaseProbes, currentProject.id],
  );
  const isBusy = projectsBuilder.supabaseLoadStatus === 'loading';
  const isSeeding = isBusy && projectsBuilder.supabaseOperation === 'seed';
  const configured = probe?.configured === true;
  const schemaReady = probe?.schemaReady === true;
  const showForm = !configured || projectsBuilder.supabaseEditing;

  const statusLabel = useMemo(() => {
    if (!probe && projectsBuilder.supabaseLoadStatus === 'loading') {
      return 'Checking…';
    }
    if (!probe && projectsBuilder.supabaseLoadStatus === 'error') {
      return 'Check failed';
    }
    if (!probe) {
      return 'Not checked';
    }
    if (configured && schemaReady) {
      return 'Good to go';
    }
    if (configured) {
      return 'Env ready — seed schema';
    }
    const missing: string[] = [];
    if (!probe.hasSupabaseUrl) missing.push('URL');
    if (!probe.hasServiceKey) missing.push('service role key');
    if (!probe.hasDatabaseUrl) missing.push('DATABASE_URL');
    return missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'Not configured';
  }, [probe, configured, schemaReady, projectsBuilder.supabaseLoadStatus]);

  const canSave = useMemo(
    () =>
      projectsBuilder.supabaseUrl.trim().length > 0 &&
      projectsBuilder.supabaseServiceKey.trim().length > 0 &&
      projectsBuilder.supabaseDatabasePassword.trim().length > 0 &&
      !isBusy,
    [
      projectsBuilder.supabaseUrl,
      projectsBuilder.supabaseServiceKey,
      projectsBuilder.supabaseDatabasePassword,
      isBusy,
    ],
  );

  const schemaDetail = useMemo(() => {
    const tables = probe?.expectedTables?.join(', ');
    if (probe?.bootstrapSql) {
      return tables
        ? `Applies ${probe.bootstrapSql} (expects: ${tables})`
        : `Applies ${probe.bootstrapSql}`;
    }
    return tables
      ? `Expected tables: ${tables}`
      : 'Applies registry bootstrap SQL via DATABASE_URL';
  }, [probe?.bootstrapSql, probe?.expectedTables]);

  if (!currentProject.supabaseSupported) {
    return null;
  }

  const schemaSection = configured ? (
    <div className={styles.schemaBlock}>
      <ConfiguredCheck
        title="Table schema"
        ok={schemaReady}
        detail={schemaDetail}
      />
      <button
        type="button"
        className={styles.seedBtn}
        disabled={isBusy}
        onClick={() => void dispatch(seedSupabaseSchemaThunk())}
      >
        {isSeeding ? 'Seeding schema…' : schemaReady ? 'Re-seed table schema' : 'Seed table schema'}
      </button>
    </div>
  ) : null;

  if (!showForm) {
    return (
      <div className={styles.root}>
        <div className={styles.statusRow}>
          <span className={styles.badgeOk}>{statusLabel}</span>
          {probe?.expressEnvPath ? (
            <span className={styles.envHint}>
              In <code className={styles.code}>{probe.expressEnvPath}</code>
            </span>
          ) : null}
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => dispatch(ProjectsBuilderActions.setSupabaseEditing(true))}
          >
            Edit
          </button>
        </div>

        {projectsBuilder.supabaseError ? (
          <p className={styles.error} role="alert">
            {projectsBuilder.supabaseError}
          </p>
        ) : null}
        {projectsBuilder.supabaseSaveMessage ? (
          <p className={styles.success}>{projectsBuilder.supabaseSaveMessage}</p>
        ) : null}

        <ConfiguredCheck
          title="Project URL"
          ok={probe?.hasSupabaseUrl === true}
          detail="SUPABASE_URL is set in Express .env"
        />
        <ConfiguredCheck
          title="Service role key"
          ok={probe?.hasServiceKey === true}
          detail="SUPABASE_SERVICE_KEY is set in Express .env"
        />
        <ConfiguredCheck
          title="Database URL"
          ok={probe?.hasDatabaseUrl === true}
          detail="DATABASE_URL is set (Postgres pool connection string)"
        />
        {schemaSection}
      </div>
    );
  }

  return (
    <form
      className={styles.root}
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        void dispatch(saveSupabaseConfigThunk());
      }}
    >
      <div className={styles.honeypot} aria-hidden>
        <input type="text" name="username" autoComplete="username" tabIndex={-1} />
        <input type="password" name="password" autoComplete="current-password" tabIndex={-1} />
      </div>

      <div className={styles.statusRow}>
        <span className={configured ? styles.badgeOk : styles.badgeWarn}>{statusLabel}</span>
        {probe?.expressEnvPath ? (
          <span className={styles.envHint}>
            Writes to <code className={styles.code}>{probe.expressEnvPath}</code>
          </span>
        ) : null}
        {configured ? (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => dispatch(ProjectsBuilderActions.setSupabaseEditing(false))}
          >
            Cancel
          </button>
        ) : null}
      </div>

      {projectsBuilder.supabaseError ? (
        <p className={styles.error} role="alert">
          {projectsBuilder.supabaseError}
        </p>
      ) : null}
      {projectsBuilder.supabaseSaveMessage ? (
        <p className={styles.success}>{projectsBuilder.supabaseSaveMessage}</p>
      ) : null}

      {!probe && isBusy ? (
        <p className={styles.envHint}>Reading Express .env…</p>
      ) : (
        <>
          <ProjectUrlInput />
          <ServiceRoleKeyInput />
          <DatabasePasswordInput />

          <button type="submit" className={styles.saveBtn} disabled={!canSave}>
            {isBusy && projectsBuilder.supabaseOperation === 'save'
              ? 'Saving…'
              : 'Save to Express .env'}
          </button>

          {schemaSection}
        </>
      )}
    </form>
  );
};

const styles = {
  root: `space-y-4`,
  honeypot: `absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0`,
  statusRow: `flex flex-wrap items-center gap-x-3 gap-y-1`,
  badgeOk: `text-xs font-medium text-green-800`,
  badgeWarn: `text-xs font-medium text-amber-900`,
  envHint: `text-xs text-gray-500`,
  code: `text-xs font-mono bg-gray-100 px-1 rounded`,
  error: `text-sm text-red-700`,
  success: `text-sm text-green-800`,
  schemaBlock: `space-y-3`,
  editBtn: `
    ml-auto text-xs font-medium text-gray-700 underline underline-offset-2
    cursor-pointer hover:text-gray-900
  `,
  cancelBtn: `
    ml-auto text-xs font-medium text-gray-500 underline underline-offset-2
    cursor-pointer hover:text-gray-800
  `,
  saveBtn: `
    inline-flex items-center justify-center rounded bg-gray-900 text-white text-sm font-medium
    px-4 py-2 cursor-pointer hover:bg-gray-800
    disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed
  `,
  seedBtn: `
    inline-flex items-center justify-center rounded border border-gray-400 bg-white
    text-gray-900 text-sm font-medium px-4 py-2 cursor-pointer hover:bg-gray-50
    disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed
  `,
};
