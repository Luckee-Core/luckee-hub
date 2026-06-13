'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { runProjectThunk } from '@/store/thunks/projects';

type ProjectsRunActionProps = {
  projectId: string;
  disabled?: boolean;
};

export const ProjectsRunAction = ({ projectId, disabled }: ProjectsRunActionProps) => {
  const dispatch = useAppDispatch();
  const runningJobs = useAppSelector((s) => s.runningJobs);

  const runningJobId = useMemo(() => runningJobs[projectId], [runningJobs, projectId]);
  const isRunning = !!runningJobId;

  return (
    <button
      type="button"
      className={styles.primary}
      disabled={disabled || isRunning}
      onClick={() => void dispatch(runProjectThunk(projectId))}
    >
      {isRunning ? 'Running…' : 'Run'}
    </button>
  );
};

const styles = {
  primary: `
    rounded px-2.5 py-1 text-xs font-medium text-white bg-orange-500
    hover:bg-orange-600 disabled:opacity-50
  `,
};
