'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { closeStorageExpressThunk, runStorageExpressThunk } from '@/store/thunks/projects';

type StorageControlsProps = {
  cloned: boolean;
};

/**
 * Running state + Start / Stop for Storage Express — project Run does not start it.
 */
export const StorageControls = ({ cloned }: StorageControlsProps) => {
  const dispatch = useAppDispatch();
  const { id, storageRunning, storagePort } = useAppSelector((s) => s.currentProject);
  const { storageExpressInFlight, storageExpressFeedbackProjectId, storageExpressError } =
    useAppSelector((s) => s.projectsBuilder);
  const error = storageExpressFeedbackProjectId === id ? storageExpressError : null;

  const isBusy = storageExpressInFlight?.projectId === id;
  const isStarting = isBusy && storageExpressInFlight?.action === 'start';
  const isStopping = isBusy && storageExpressInFlight?.action === 'close';

  return (
    <div className={styles.row}>
      <span className={storageRunning ? styles.chipUp : styles.chipDown}>
        <span className={storageRunning ? styles.dotUp : styles.dotDown} aria-hidden />
        {storageRunning ? `Running :${storagePort}` : 'Stopped'}
      </span>
      {storageRunning ? (
        <button
          type="button"
          className={styles.button}
          disabled={isBusy}
          onClick={() => void dispatch(closeStorageExpressThunk(id))}
        >
          {isStopping ? 'Stopping…' : 'Stop'}
        </button>
      ) : (
        <button
          type="button"
          className={styles.button}
          disabled={isBusy || !cloned}
          title={cloned ? 'Project Run does not start Storage' : 'Run Setup to clone the storage repo first'}
          onClick={() => void dispatch(runStorageExpressThunk(id))}
        >
          {isStarting ? 'Starting…' : 'Start'}
        </button>
      )}
      {error && !isBusy ? (
        <span className={styles.error} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
};

const styles = {
  row: `flex items-center gap-2`,
  chipUp: `
    inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-mono
    bg-green-50 text-green-800 border border-green-200
  `,
  chipDown: `
    inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium font-mono
    bg-gray-50 text-gray-600 border border-gray-200
  `,
  error: `text-xs text-red-600`,
  dotUp: `h-1.5 w-1.5 rounded-full bg-green-500`,
  dotDown: `h-1.5 w-1.5 rounded-full bg-gray-300`,
  button: `
    inline-flex h-8 items-center rounded border border-gray-300 bg-white px-3 text-xs font-medium
    text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
  `,
};
