'use client';

import { projectCanRun } from '@/utils/projects';
import { useAppSelector } from '@/store';
import { OpenMenu } from './open-menu';
import { RunButton } from './run-button';
import { SetupButton } from './setup-button';
import { StopButton } from './stop-button';

type SummaryActionsProps = {
  supabaseBlocking: boolean;
};

/**
 * Summary panel actions — Setup, Run (split), Open (Cursor / Chrome), Stop.
 */
export const SummaryActions = ({ supabaseBlocking }: SummaryActionsProps) => {
  const { hookStatus } = useAppSelector((s) => s.currentProject);
  const canRun = projectCanRun(hookStatus) && !supabaseBlocking;

  return (
    <div className={styles.row}>
      <SetupButton />
      <OpenMenu disabled={!projectCanRun(hookStatus)} />
      <StopButton />
      <RunButton disabled={!canRun} />
    </div>
  );
};

const styles = {
  row: `flex flex-wrap items-center gap-2`,
};
