'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { saveExpressEnvGroupApi } from '@/api/projects';
import { ProjectsBuilderActions } from '@/store/builders';
import { buildExpressEnvProbeKey } from '@/store/dumps/expressEnvProbes';
import { probeExpressEnvGroupThunk } from '@/store/thunks/projects';
import { ConfiguredCheck } from '../configured-check';

const GROUP_ID = 'storage';

const defaultValueForKey = (key: string, storagePort: number): string => {
  if (key === 'CANONICAL_DATA_ACCESS_MODE') {
    return 'direct';
  }
  if (key === 'STORAGE_MODE') {
    return 'remote';
  }
  if (key.endsWith('_STORAGE_URL') || key === 'STORAGE_EXPRESS_URL') {
    return `http://127.0.0.1:${storagePort}`;
  }
  if (key === 'STORAGE_REQUEST_TIMEOUT_MS') {
    return '120000';
  }
  return '';
};

const isSecretKey = (key: string): boolean =>
  key.endsWith('_SECRET') || key.endsWith('_STORAGE_SECRET') || key === 'STORAGE_EXPRESS_SECRET';

/**
 * Storage env tab — keys come from registry `expressEnv.groups.storage` (per project).
 */
export const StorageTab = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const expressEnvProbes = useAppSelector((s) => s.expressEnvProbes);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const probeKey = useMemo(
    () => buildExpressEnvProbeKey(currentProject.id, GROUP_ID),
    [currentProject.id],
  );
  const probe = useMemo(() => expressEnvProbes[probeKey], [expressEnvProbes, probeKey]);
  const storageKeys = useMemo(
    () => (probe?.keysPresent ? Object.keys(probe.keysPresent) : []),
    [probe?.keysPresent],
  );

  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (storageKeys.length === 0) {
      return;
    }
    setValues((prev) => {
      const next = { ...prev };
      for (const key of storageKeys) {
        if (next[key] === undefined || next[key] === '') {
          next[key] = defaultValueForKey(key, currentProject.storagePort);
        }
      }
      return next;
    });
  }, [storageKeys, currentProject.storagePort]);

  const isBusy = projectsBuilder.expressEnvLoadStatus === 'loading';
  const configured = probe?.configured === true;

  if (!currentProject.expressEnvGroupIds.includes(GROUP_ID)) {
    return null;
  }

  const handleSave = async () => {
    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setExpressEnvError(null));

    const payload: Record<string, string> = {};
    for (const key of storageKeys) {
      const value = (values[key] ?? '').trim();
      if (value) {
        payload[key] = value;
      }
    }

    if (Object.keys(payload).length === 0) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(ProjectsBuilderActions.setExpressEnvError('Provide at least one value to save'));
      return;
    }

    const result = await saveExpressEnvGroupApi(currentProject.id, GROUP_ID, payload);
    if (!result.success) {
      dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('error'));
      dispatch(ProjectsBuilderActions.setExpressEnvError(result.error ?? 'Save failed'));
      return;
    }
    dispatch(ProjectsBuilderActions.setExpressEnvSaveMessage(result.data?.message ?? 'Saved'));
    dispatch(ProjectsBuilderActions.setExpressEnvLoadStatus('loaded'));
    void dispatch(probeExpressEnvGroupThunk(GROUP_ID));
  };

  const usesDirectInvoke = storageKeys.some((k) => k.endsWith('_STORAGE_URL'));

  return (
    <div className={styles.root}>
      <p className={styles.hint}>
        {usesDirectInvoke ? (
          <>
            Writes to the product Express <code className={styles.code}>.env</code> for direct
            storage invoke (URL + secret must match{' '}
            <code className={styles.code}>STORAGE_DISPATCHER_SECRET</code> on storage port{' '}
            {currentProject.storagePort}).
          </>
        ) : (
          <>
            Writes to the dispatcher Express <code className={styles.code}>.env</code> for remote
            storage mode (studio dispatcher → laptop storage).
          </>
        )}
      </p>
      {configured && storageKeys.length > 0 ? (
        <div className={styles.checks}>
          {storageKeys.map((key) => (
            <ConfiguredCheck
              key={key}
              title={key}
              ok={probe?.keysPresent?.[key] === true}
              detail={`${key} in Express .env`}
            />
          ))}
        </div>
      ) : null}
      {storageKeys.length === 0 ? (
        <p className={styles.hint}>Open this project again to load storage env keys from the hub API.</p>
      ) : (
        <div className={styles.fields}>
          {storageKeys.map((key) => (
            <label key={key} className={styles.label}>
              {key}
              <input
                className={styles.input}
                type={isSecretKey(key) ? 'password' : 'text'}
                value={values[key] ?? ''}
                onChange={(event) =>
                  setValues((prev) => ({ ...prev, [key]: event.target.value }))
                }
                disabled={isBusy}
                autoComplete={isSecretKey(key) ? 'off' : undefined}
                placeholder={defaultValueForKey(key, currentProject.storagePort) || undefined}
              />
            </label>
          ))}
        </div>
      )}
      <button
        type="button"
        className={styles.save}
        disabled={isBusy || storageKeys.length === 0}
        onClick={() => void handleSave()}
      >
        Save storage env
      </button>
      {projectsBuilder.expressEnvError ? (
        <p className={styles.error}>{projectsBuilder.expressEnvError}</p>
      ) : null}
      {projectsBuilder.expressEnvSaveMessage ? (
        <p className={styles.success}>{projectsBuilder.expressEnvSaveMessage}</p>
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
  success: `text-sm text-green-700`,
};
