'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, Loader2, MinusCircle, X, XCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { setupProjectThunk } from '@/store/thunks/projects';
import type { SetupJobStep, SetupJobStepStatus } from '@/model';

const formatElapsed = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs}s`;
};

const StepIcon = ({ status }: { status: SetupJobStepStatus }) => {
  if (status === 'running') {
    return <Loader2 className={`${styles.stepIcon} animate-spin text-blue-600`} aria-hidden />;
  }
  if (status === 'done' || status === 'skipped') {
    return <CheckCircle2 className={`${styles.stepIcon} text-green-600`} aria-hidden />;
  }
  if (status === 'failed') {
    return <XCircle className={`${styles.stepIcon} text-red-600`} aria-hidden />;
  }
  return <Circle className={`${styles.stepIcon} text-gray-300`} aria-hidden />;
};

export const ProjectSetupModal = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((s) => s.projects);
  const {
    setupModalOpen,
    setupModalProjectId,
    setupModalStatus,
    setupModalMessage,
    setupModalSteps,
    setupModalLog,
    setupModalStartedAt,
  } = useAppSelector((s) => s.projectsBuilder);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const projectName = useMemo(() => {
    if (!setupModalProjectId) {
      return 'Project';
    }
    return projects[setupModalProjectId]?.name ?? setupModalProjectId;
  }, [projects, setupModalProjectId]);

  useEffect(() => {
    if (!setupModalOpen || setupModalStatus !== 'running' || !setupModalStartedAt) {
      setElapsedSeconds(0);
      return;
    }

    const startedMs = Date.parse(setupModalStartedAt);
    const tick = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedMs) / 1000)));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [setupModalOpen, setupModalStartedAt, setupModalStatus]);

  useEffect(() => {
    if (!setupModalOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(ProjectsBuilderActions.closeSetupModal());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, setupModalOpen]);

  if (!setupModalOpen || !setupModalProjectId) {
    return null;
  }

  const isRunning = setupModalStatus === 'running';
  const isCompleted = setupModalStatus === 'completed';
  const isFailed = setupModalStatus === 'failed';

  const handleClose = () => {
    dispatch(ProjectsBuilderActions.closeSetupModal());
  };

  const handleRetry = () => {
    dispatch(ProjectsBuilderActions.closeSetupModal());
    void dispatch(setupProjectThunk(setupModalProjectId));
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="setup-modal-title">
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 id="setup-modal-title" className={styles.title}>
            Setting up {projectName}
          </h2>
          <button
            type="button"
            className={styles.closeIcon}
            onClick={handleClose}
            aria-label="Close setup window"
            title={isRunning ? 'Hide (setup keeps running)' : 'Close'}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className={styles.body}>
        <div className={styles.statusRow}>
          {isRunning ? (
            <Loader2 className={`${styles.statusIcon} animate-spin text-blue-600`} aria-hidden />
          ) : null}
          {isCompleted ? (
            <CheckCircle2 className={`${styles.statusIcon} text-green-600`} aria-hidden />
          ) : null}
          {isFailed ? <XCircle className={`${styles.statusIcon} text-red-600`} aria-hidden /> : null}
          <p className={styles.statusText}>
            {isRunning ? 'Setup in progress' : isCompleted ? 'Setup complete' : 'Setup failed'}
          </p>
          {isRunning ? (
            <span className={styles.elapsed}>{formatElapsed(elapsedSeconds)}</span>
          ) : null}
        </div>

        {setupModalSteps.length > 0 ? (
          <ul className={styles.stepList}>
            {setupModalSteps.map((step: SetupJobStep) => (
              <li key={step.id} className={styles.stepItem}>
                <StepIcon status={step.status} />
                <div className={styles.stepBody}>
                  <span className={styles.stepLabel}>{step.label}</span>
                  {step.message ? <span className={styles.stepMessage}>{step.message}</span> : null}
                </div>
                {step.status === 'skipped' ? (
                  <MinusCircle className={`${styles.stepIcon} text-gray-400`} aria-hidden />
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <p className={styles.message}>{setupModalMessage ?? 'Working...'}</p>

        {setupModalLog ? <pre className={styles.log}>{setupModalLog}</pre> : null}

        {isRunning ? (
          <p className={styles.note}>
            First-time <code className={styles.code}>npm install</code> usually finishes within a
            few minutes. Steps update as each repo is cloned and installed.
          </p>
        ) : null}
        </div>

        {!isRunning ? (
          <div className={styles.actions}>
            {isFailed ? (
              <button type="button" className={styles.primaryButton} onClick={handleRetry}>
                Retry setup
              </button>
            ) : null}
            <button
              type="button"
              className={isFailed ? styles.secondaryButton : styles.primaryButton}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  card: `
    flex w-full max-w-xl max-h-[calc(100dvh-2rem)] flex-col rounded-lg border border-gray-300
    bg-white shadow-xl
  `,
  header: `flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-6 py-4`,
  closeIcon: `
    rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900
  `,
  body: `min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4`,
  title: `text-lg font-semibold text-gray-900`,
  statusRow: `flex items-center gap-2`,
  statusIcon: `h-5 w-5 shrink-0`,
  statusText: `text-sm font-medium text-gray-900`,
  elapsed: `ml-auto text-xs font-mono text-gray-500`,
  stepList: `space-y-2`,
  stepItem: `flex items-start gap-2 rounded border border-gray-200 bg-gray-50 px-3 py-2`,
  stepBody: `flex-1 min-w-0`,
  stepLabel: `block text-sm font-medium text-gray-900`,
  stepMessage: `block text-xs text-gray-500 mt-0.5`,
  stepIcon: `h-4 w-4 shrink-0 mt-0.5`,
  message: `text-sm text-gray-700 bg-white border border-gray-200 rounded px-3 py-2`,
  log: `
    max-h-48 overflow-auto whitespace-pre-wrap break-all rounded border border-gray-800
    bg-gray-900 p-3 font-mono text-xs leading-relaxed text-gray-100
  `,
  note: `text-sm text-gray-500 leading-relaxed`,
  code: `font-mono text-xs bg-gray-100 px-1 py-0.5 rounded`,
  actions: `flex shrink-0 flex-col gap-2 border-t border-gray-200 px-6 py-4`,
  primaryButton: `
    inline-flex w-full items-center justify-center rounded-md px-4 py-2.5
    text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
  `,
  secondaryButton: `
    inline-flex w-full items-center justify-center rounded-md px-4 py-2.5
    text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50
  `,
};
