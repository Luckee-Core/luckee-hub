'use client';

import type { ProjectRunTarget } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import { runProjectThunk } from '@/store/thunks/projects';
import { hasActiveRunOperation, isProjectRunActive } from '@/utils/projects';

type DevServerControlsProps = {
  target: ProjectRunTarget;
  cloned: boolean;
};

const TARGET_LABEL: Record<ProjectRunTarget, string> = {
  express: 'API',
  web: 'Web',
};

/**
 * Restart (or Start) just this repo's dev server: a Run with one target, which first stops
 * the repo's hub terminal and any listener it owns. Restarting Web does not open Chrome.
 */
export const DevServerControls = ({ target, cloned }: DevServerControlsProps) => {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.currentProject.id);
  const hasSession = useAppSelector((s) =>
    Object.values(s.terminalSessions).some(
      (session) => session.projectId === id && session.role === target,
    ),
  );
  const isThisProjectRunning = useAppSelector((s) => isProjectRunActive(s, id));
  const isAnyRunActive = useAppSelector(hasActiveRunOperation);
  const listError = useAppSelector((s) => s.projectsBuilder.listError);

  const label = TARGET_LABEL[target];
  const disabled = !cloned || isAnyRunActive;
  const title = !cloned
    ? 'Run Setup to clone this repo first'
    : isAnyRunActive && !isThisProjectRunning
      ? 'Another project is starting — wait for it to finish'
      : hasSession
        ? `Stop the ${label} dev server and start it again`
        : `Start the ${label} dev server`;

  return (
    <div className={styles.row}>
      <span className={hasSession ? styles.chipUp : styles.chipDown}>
        <span className={hasSession ? styles.dotUp : styles.dotDown} aria-hidden />
        {hasSession ? 'Running' : 'Not running in hub'}
      </span>
      <button
        type="button"
        className={styles.button}
        disabled={disabled}
        title={title}
        onClick={() => void dispatch(runProjectThunk(id, [target], { openChrome: false }))}
      >
        {isThisProjectRunning ? 'Starting…' : hasSession ? 'Restart' : 'Start'}
      </button>
      {listError && !isThisProjectRunning ? (
        <span className={styles.error} role="alert">
          {listError}
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
