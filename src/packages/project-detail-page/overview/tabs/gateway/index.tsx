'use client';

import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { saveExpressEnvGroupApi } from '@/api/projects';
import { ProjectsBuilderActions } from '@/store/builders';
import { buildExpressEnvProbeKey } from '@/store/dumps/expressEnvProbes';
import { probeExpressEnvGroupThunk } from '@/store/thunks/projects';
import { ConfiguredCheck } from '../configured-check';

const GROUP_ID = 'gateway';

const GATEWAY_KEYS = [
  'DISPATCHER_GATE_SECRET',
  'DISPATCHER_INFRA_ADMIN_SECRET',
  'GMAIL_STORAGE_DISPATCHER_SECRET',
  'DISPATCHER_ALLOWED_CLIENT_IPS',
  'DISPATCHER_SPAWN_ROOTS',
  'DISPATCHER_BIND_HOST',
  'PORT',
] as const;

/**
 * On-device dispatcher gateway env tab — studio express .env keys.
 */
export const GatewayTab = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const expressEnvProbes = useAppSelector((s) => s.expressEnvProbes);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const [gateSecret, setGateSecret] = useState('');
  const [infraAdminSecret, setInfraAdminSecret] = useState('');
  const [storageSecret, setStorageSecret] = useState('');
  const [allowedIps, setAllowedIps] = useState('');
  const [spawnRoots, setSpawnRoots] = useState('');
  const [bindHost, setBindHost] = useState('0.0.0.0');
  const [port, setPort] = useState('3010');

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
      DISPATCHER_GATE_SECRET: gateSecret.trim(),
      DISPATCHER_INFRA_ADMIN_SECRET: infraAdminSecret.trim(),
      GMAIL_STORAGE_DISPATCHER_SECRET: storageSecret.trim(),
      DISPATCHER_ALLOWED_CLIENT_IPS: allowedIps.trim(),
      DISPATCHER_SPAWN_ROOTS: spawnRoots.trim(),
      DISPATCHER_BIND_HOST: bindHost.trim(),
      PORT: port.trim(),
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
        Studio gateway Express <code className={styles.code}>.env</code>. Use{' '}
        <code className={styles.code}>PORT=3010</code> and{' '}
        <code className={styles.code}>DISPATCHER_BIND_HOST=0.0.0.0</code> for LAN. Restart Hub Run
        after saving; laptop <code className={styles.code}>STORAGE_EXPRESS_URL</code> must match{' '}
        <code className={styles.code}>DISPATCHER_PUBLIC_BASE_URL</code> (same port as the Express
        banner).
      </p>
      {configured ? (
        <div className={styles.checks}>
          {GATEWAY_KEYS.map((key) => (
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
          DISPATCHER_GATE_SECRET
          <input
            className={styles.input}
            type="password"
            value={gateSecret}
            onChange={(event) => setGateSecret(event.target.value)}
            disabled={isBusy}
            autoComplete="off"
          />
        </label>
        <label className={styles.label}>
          DISPATCHER_INFRA_ADMIN_SECRET
          <input
            className={styles.input}
            type="password"
            value={infraAdminSecret}
            onChange={(event) => setInfraAdminSecret(event.target.value)}
            disabled={isBusy}
            autoComplete="off"
          />
        </label>
        <label className={styles.label}>
          GMAIL_STORAGE_DISPATCHER_SECRET
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
          DISPATCHER_ALLOWED_CLIENT_IPS
          <input
            className={styles.input}
            value={allowedIps}
            onChange={(event) => setAllowedIps(event.target.value)}
            disabled={isBusy}
            placeholder="10.0.0.148"
          />
        </label>
        <label className={styles.label}>
          DISPATCHER_SPAWN_ROOTS
          <input
            className={styles.input}
            value={spawnRoots}
            onChange={(event) => setSpawnRoots(event.target.value)}
            disabled={isBusy}
            placeholder="/Users/you/luckee,/Users/you/github"
          />
        </label>
        <label className={styles.label}>
          DISPATCHER_BIND_HOST
          <input
            className={styles.input}
            value={bindHost}
            onChange={(event) => setBindHost(event.target.value)}
            disabled={isBusy}
          />
        </label>
        <label className={styles.label}>
          PORT
          <input
            className={styles.input}
            value={port}
            onChange={(event) => setPort(event.target.value)}
            disabled={isBusy}
          />
        </label>
      </div>
      <button type="button" className={styles.save} disabled={isBusy} onClick={() => void handleSave()}>
        Save gateway env
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
