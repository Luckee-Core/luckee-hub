'use client';

import { Loader2, Play } from 'lucide-react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { runProjectThunk } from '@/store/thunks/projects';
import { hasActiveRunOperation, isProjectRunActive } from '@/utils/projects';

type ProjectsRunActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
  /** `sm` for projects table (default); `md` for detail header */
  iconSize?: 'sm' | 'md';
};

export const ProjectsRunAction = ({
  projectId,
  disabled,
  iconOnly,
  iconSize = 'sm',
}: ProjectsRunActionProps) => {
  const dispatch = useAppDispatch();
  const runningJobs = useAppSelector((s) => s.runningJobs);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const runState = useMemo(
    () => ({ runningJobs, projectsBuilder }),
    [runningJobs, projectsBuilder],
  );
  const isRunning = useMemo(() => isProjectRunActive(runState, projectId), [runState, projectId]);
  const isRunBusy = useMemo(() => hasActiveRunOperation(runState), [runState]);
  const label = isRunning ? 'Running…' : 'Run';
  const iconClass = iconSize === 'md' ? styles.iconMd : styles.iconSm;
  const buttonClass = iconOnly
    ? iconSize === 'md'
      ? styles.iconPrimaryMd
      : styles.iconPrimarySm
    : styles.primary;

  return (
    <button
      type="button"
      className={buttonClass}
      disabled={disabled || isRunBusy}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={() => void dispatch(runProjectThunk(projectId))}
    >
      {iconOnly ? (
        isRunning ? (
          <Loader2 className={`${iconClass} animate-spin`} aria-hidden />
        ) : (
          <Play className={iconClass} aria-hidden />
        )
      ) : (
        label
      )}
    </button>
  );
};

const styles = {
  primary: `
    rounded px-2.5 py-1 text-xs font-medium text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  iconPrimarySm: `
    inline-flex items-center justify-center rounded p-1 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  iconPrimaryMd: `
    inline-flex items-center justify-center rounded p-1.5 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  iconSm: `h-3.5 w-3.5`,
  iconMd: `h-5 w-5`,
};
