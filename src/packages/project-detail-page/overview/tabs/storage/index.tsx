'use client';

import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { saveExpressEnvGroupApi } from '@/api/projects';
import { ProjectsBuilderActions } from '@/store/builders';
import { buildExpressEnvProbeKey } from '@/store/dumps/expressEnvProbes';
import { probeExpressEnvGroupThunk } from '@/store/thunks/projects';
import { ConfiguredCheck } from '../configured-check';

const GROUP_ID = 'storage';

const STORAGE_KEYS = [
  'STORAGE_MODE',
  'STORAGE_EXPRESS_URL',
  'STORAGE_EXPRESS_SECRET',
  'STORAGE_REQUEST_TIMEOUT_MS',
] as const;

/**
 * Storage remote env tab — dispatcher STORAGE_* keys in express .env.
 */
export const StorageTab = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const expressEnvProbes = useAppSelector((s) => s.expressEnvProbes);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const [storageMode, setStorageMode] = useState('remote');
  const [storageUrl, setStorageUrl] = useState('');
  const [storageSecret, setStorageSecret] = useState('');
  const [storageTimeout, setStorageTimeout] = useState('120000');

  const probeKey = useMemo(
    () => buildExpressEnvProbeKey(currentProject.id, GROUP_ID),
    [currentProject.id],
  );
  const probe = useMemo(() => expressEnvProbes[probeKey], [expressEnvProbes, probeKey]);
  const isBusy = projectsBuilder.expressEnvLoadStatus === 'loading';
  const configured = probe?.configured === true;

  if (!currentProject.expressEnvGroupIds.includes(GROUP_ID)) {
    return null;
  }

  const handleSave = async () => {
    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setExpressEnvError(null));
    const result = await saveExpressEnvGroupApi(currentProject.id, GROUP_ID, {
      STORAGE_MODE: storageMode.trim(),
      STORAGE_EXPRESS_URL: storageUrl.trim(),
      STORAGE_EXPRESS_SECRET: storageSecret.trim(),
      STORAGE_REQUEST_TIMEOUT_MS: storageTimeout.trim(),
    });
    if (!result.success) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(ProjectsBuilderActions.setExpressEnvError(result.error ?? 'Save failed'));
      return;
    }
    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(result.data?.message ?? 'Saved'));
    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loaded'));
    void dispatch(probeExpressEnvGroupThunk(GROUP_ID));
  };

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        Writes to the dispatcher Express <code className={styles.code}>.env</code> for remote
        storage mode (studio dispatcher → laptop storage).
      </p>
      {configured ? (
        <div className={styles.checks}>
          {STORAGE_KEYS.map((key) => (
            <ConfiguredCheck
              key={key}
              title={key}
              ok={probe?.keysPresent?.[key] === true}
              detail={`${key} in Express .env`}
            />
          ))}
        </div>
      ) : null}
      <div className={styles.fields}>
        <label className={styles.label}>
          STORAGE_MODE
          <input
            className={styles.input}
            value={storageMode}
            onChange={(event) => setStorageMode(event.target.value)}
            disabled={isBusy}
          />
        </label>
        <label className={styles.label}>
          STORAGE_EXPRESS_URL
          <input
            className={styles.input}
            value={storageUrl}
            onChange={(event) => setStorageUrl(event.target.value)}
            disabled={isBusy}
            placeholder="http://192.168.x.x:3010"
          />
        </label>
        <label className={styles.label}>
          STORAGE_EXPRESS_SECRET
          <input
            className={styles.input}
            type="password"
            value={storageSecret}
            onChange={(event) => setStorageSecret(event.target.value)}
            disabled={isBusy}
            autoComplete="off"
          />
        </label>
        <label className={styles.label}>
          STORAGE_REQUEST_TIMEOUT_MS
          <input
            className={styles.input}
            value={storageTimeout}
            onChange={(event) => setStorageTimeout(event.target.value)}
            disabled={isBusy}
          />
        </label>
      </div>
      <button type="button" className={styles.save} disabled={isBusy} onClick={() => void handleSave()}>
        Save storage env
      </button>
      {projectsBuilder.expressEnvError ? (
        <p className={styles.error}>{projectsBuilder.expressEnvError}</p>
      ) : null}
    </div>
  );
};

const styles = {
  root: `space-y-3`,
  hint: `text-sm text-gray-600`,
  code: `text-xs bg-gray-100 px-1 rounded`,
  checks: `space-y-2`,
  fields: `grid gap-3 sm:grid-cols-2`,
  label: `flex flex-col gap-1 text-xs font-medium text-gray-700`,
  input: `
    rounded border border-gray-300 px-2 py-1.5 text-sm font-normal text-gray-900
    focus:outline-none focus:ring-1 focus:ring-gray-400
  `,
  save: `
    rounded px-3 py-1.5 text-xs font-medium text-white bg-gray-900
    hover:bg-gray-800 cursor-pointer border-none disabled:opacity-50
  `,
  error: `text-sm text-red-600`,
};
