'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { runDevHubStudioThunk } from '@/store/thunks/dev-hub';

type DevHubRunStudioActionProps = {
  studioId: string;
  disabled?: boolean;
};

export const DevHubRunStudioAction = ({ studioId, disabled }: DevHubRunStudioActionProps) => {
  const dispatch = useAppDispatch();
  const runningJobId = useAppSelector((s) => s.devHubBuilder.runningJobIds[studioId]);
  const isRunning = !!runningJobId;

  return (
    <button
      type="button"
      className={styles.primary}
      disabled={disabled || isRunning}
      onClick={() => void dispatch(runDevHubStudioThunk(studioId))}
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
