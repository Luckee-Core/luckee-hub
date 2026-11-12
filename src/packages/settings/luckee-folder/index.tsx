'use client';

import { FolderOpen, Info, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { pickHubConfigFolderThunk } from '@/store/thunks/projects';

const EXAMPLE_PROJECT_ID = 'lead-studio';
const EXAMPLE_REPO_NAME = 'lead-studio-express-server';

export const LuckeeFolderSetting = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);
  const { luckeeParent, luckeeParentPicking, hubConfigLoadStatus, hubConfigError } =
    projectsBuilder;

  const isLoading = hubConfigLoadStatus === 'idle' || hubConfigLoadStatus === 'loading';
  const luckeeRoot = luckeeParent ? `${luckeeParent}/luckee` : null;

  return (
    <section className={styles.card} aria-labelledby="luckee-folder-title">
      <div>
        <h2 id="luckee-folder-title" className={styles.title}>
          Luckee folder
        </h2>
        <p className={styles.description}>
          Where <strong>Setup</strong> clones each project&apos;s repos and runs{' '}
          <code className={styles.inlineCode}>npm install</code>. The hub creates a{' '}
          <code className={styles.inlineCode}>luckee</code> folder inside the location you
          choose, with one subfolder per project.
        </p>
      </div>

      <div className={styles.valueRow}>
        <span className={styles.valueLabel}>Current location</span>
        {isLoading ? (
          <span className={styles.muted}>Loading…</span>
        ) : luckeeRoot ? (
          <code className={styles.path}>{luckeeRoot}/</code>
        ) : (
          <span className={styles.notSet}>Not set yet. Setup won&apos;t run until you choose one.</span>
        )}
        <button
          type="button"
          className={styles.button}
          disabled={luckeeParentPicking || isLoading}
          onClick={() => void dispatch(pickHubConfigFolderThunk())}
        >
          {luckeeParentPicking ? (
            <>
              <Loader2 className={`${styles.buttonIcon} animate-spin`} aria-hidden />
              Waiting for Finder…
            </>
          ) : (
            <>
              <FolderOpen className={styles.buttonIcon} aria-hidden />
              {luckeeRoot ? 'Change folder' : 'Choose folder'}
            </>
          )}
        </button>
      </div>
      {hubConfigError ? <p className={styles.error}>{hubConfigError}</p> : null}

      <div className={styles.example}>
        <p className={styles.exampleLabel}>Example: setting up Lead Studio clones into</p>
        <code className={styles.examplePath}>
          {luckeeRoot ?? '{your folder}/luckee'}/{EXAMPLE_PROJECT_ID}/{EXAMPLE_REPO_NAME}
        </code>
      </div>

      <div className={styles.note}>
        <Info className={styles.noteIcon} aria-hidden />
        <p>
          Changing this only affects projects you set up afterwards. Projects that are already
          set up keep their saved paths, and nothing is moved or deleted. The choice is saved in{' '}
          <code className={styles.inlineCode}>luckee-hub-express-server/hub.local.json</code>.
        </p>
      </div>
    </section>
  );
};

const styles = {
  card: `
    rounded border border-gray-300 bg-white p-4 space-y-4
  `,
  title: `
    text-sm font-semibold text-gray-900
  `,
  description: `
    mt-1 text-xs leading-relaxed text-gray-600
  `,
  valueRow: `
    flex flex-wrap items-center gap-3
  `,
  valueLabel: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500 shrink-0
  `,
  path: `
    min-w-0 truncate rounded bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-800
  `,
  notSet: `
    text-xs font-medium text-amber-700
  `,
  muted: `
    text-xs text-gray-400
  `,
  button: `
    ml-auto inline-flex shrink-0 items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium
    text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 cursor-pointer disabled:cursor-default
  `,
  buttonIcon: `
    h-3.5 w-3.5
  `,
  error: `
    text-xs text-red-700
  `,
  example: `
    rounded border border-dashed border-gray-200 bg-gray-50 px-3 py-2 space-y-1
  `,
  exampleLabel: `
    text-[11px] text-gray-500
  `,
  examplePath: `
    block break-all font-mono text-[11px] text-gray-700
  `,
  note: `
    flex gap-2 text-[11px] leading-relaxed text-gray-500
  `,
  noteIcon: `
    mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400
  `,
  inlineCode: `
    rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px] text-gray-700
  `,
};
