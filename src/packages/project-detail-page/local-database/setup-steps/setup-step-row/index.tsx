'use client';

import { useMemo } from 'react';

import type { LocalDatabaseSetupStep } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import { runLocalDatabaseStepThunk } from '@/store/thunks/projects/run-local-database-step-thunk';

type SetupStepRowProps = {
  step: LocalDatabaseSetupStep;
  index: number;
};

export const SetupStepRow = ({ step, index }: SetupStepRowProps) => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const isActiveProject = useMemo(
    () => projectsBuilder.activeLocalDatabaseProjectId === currentProject.id,
    [projectsBuilder.activeLocalDatabaseProjectId, currentProject.id],
  );
  const stopStepId = useMemo(() => step.stopStepId ?? 'postgres-stop', [step.stopStepId]);
  const isRunningStep = useMemo(
    () =>
      isActiveProject &&
      projectsBuilder.localDatabaseOperation === 'step' &&
      projectsBuilder.activeLocalDatabaseStepId === step.id,
    [
      isActiveProject,
      projectsBuilder.localDatabaseOperation,
      projectsBuilder.activeLocalDatabaseStepId,
      step.id,
    ],
  );
  const isStoppingStep = useMemo(
    () =>
      isActiveProject &&
      projectsBuilder.localDatabaseOperation === 'step' &&
      projectsBuilder.activeLocalDatabaseStepId === stopStepId,
    [
      isActiveProject,
      projectsBuilder.localDatabaseOperation,
      projectsBuilder.activeLocalDatabaseStepId,
      stopStepId,
    ],
  );
  const isBusy = useMemo(
    () => isActiveProject && projectsBuilder.localDatabaseLoadStatus === 'loading',
    [isActiveProject, projectsBuilder.localDatabaseLoadStatus],
  );

  const handleRun = () => {
    void dispatch(runLocalDatabaseStepThunk(currentProject.id, step.id));
  };

  const handleStop = () => {
    void dispatch(runLocalDatabaseStepThunk(currentProject.id, stopStepId));
  };

  return (
    <li className={styles.row}>
      <div className={styles.main}>
        <span className={styles.index}>{index + 1}</span>
        <div className={styles.body}>
          <div className={styles.titleRow}>
            <p className={styles.title}>{step.title}</p>
            <span className={statusStyles[step.status]}>{statusLabels[step.status]}</span>
          </div>
          {step.detail ? <p className={styles.detail}>{step.detail}</p> : null}
        </div>
      </div>
      <div className={styles.actions}>
        {step.stoppable ? (
          <button
            type="button"
            className={styles.stopButton}
            disabled={isBusy}
            onClick={handleStop}
          >
            {isStoppingStep ? 'Stopping…' : step.stopActionLabel ?? 'Stop'}
          </button>
        ) : null}
        {step.runnable ? (
          <button
            type="button"
            className={styles.runButton}
            disabled={isBusy}
            onClick={handleRun}
          >
            {isRunningStep ? 'Running…' : step.actionLabel ?? 'Run'}
          </button>
        ) : null}
      </div>
    </li>
  );
};

const statusLabels = {
  done: 'Done',
  pending: 'Pending',
  skipped: 'Skipped',
  blocked: 'Blocked',
} as const;

const statusStyles = {
  done: `text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5`,
  pending: `text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5`,
  skipped: `text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded px-2 py-0.5`,
  blocked: `text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-0.5`,
};

const styles = {
  row: `
    flex flex-col gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2.5
    sm:flex-row sm:items-center sm:justify-between
  `,
  main: `flex gap-3 min-w-0 flex-1`,
  index: `
    flex h-6 w-6 shrink-0 items-center justify-center rounded-full
    bg-white border border-gray-200 text-xs font-semibold text-gray-700
  `,
  body: `space-y-1 min-w-0 flex-1`,
  titleRow: `flex flex-wrap items-center gap-2`,
  title: `text-sm font-medium text-gray-900`,
  detail: `text-xs text-gray-600 break-all`,
  actions: `flex shrink-0 flex-wrap gap-2`,
  runButton: `
    rounded px-2.5 py-1 text-xs font-medium text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  stopButton: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300
    hover:bg-gray-100 disabled:opacity-50
  `,
};
