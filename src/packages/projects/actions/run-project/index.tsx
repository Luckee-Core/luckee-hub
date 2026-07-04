'use client';

import { Loader2, Play } from 'lucide-react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { runProjectThunk } from '@/store/thunks/projects';

type ProjectsRunActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
};

export const ProjectsRunAction = ({ projectId, disabled, iconOnly }: ProjectsRunActionProps) => {
  const dispatch = useAppDispatch();
  const runningJobs = useAppSelector((s) => s.runningJobs);

  const runningJobId = useMemo(() => runningJobs[projectId], [runningJobs, projectId]);
  const isRunning = !!runningJobId;
  const label = isRunning ? 'Running…' : 'Run';

  return (
    <button
      type="button"
      className={iconOnly ? styles.iconPrimary : styles.primary}
      disabled={disabled || isRunning}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={() => void dispatch(runProjectThunk(projectId))}
    >
      {iconOnly ? (
        isRunning ? (
          <Loader2 className={`${styles.icon} animate-spin`} aria-hidden />
        ) : (
          <Play className={styles.icon} aria-hidden />
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
  iconPrimary: `
    inline-flex items-center justify-center rounded p-1 text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
  icon: `h-3.5 w-3.5`,
};
