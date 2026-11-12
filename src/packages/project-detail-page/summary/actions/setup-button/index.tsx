'use client';

import { Download, Loader2 } from 'lucide-react';
import { useMemo } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { setupProjectThunk } from '@/store/thunks/projects';
import {
  hasActiveRunOperation,
  hasActiveSetupOperation,
  isProjectSetupActive,
} from '@/utils/projects';

/**
 * Labeled Setup (clone + install) button for the summary panel.
 */
export const SetupButton = () => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const runningJobs = useAppSelector((s) => s.runningJobs);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const jobState = useMemo(
    () => ({ runningJobs, projectsBuilder }),
    [runningJobs, projectsBuilder],
  );
  const isSettingUp = useMemo(() => isProjectSetupActive(jobState, id), [jobState, id]);
  const isBusy = useMemo(
    () => hasActiveSetupOperation(jobState) || hasActiveRunOperation(jobState),
    [jobState],
  );

  return (
    <button
      type="button"
      className={detailPageStyles.secondaryButton}
      disabled={isBusy}
      onClick={() => void dispatch(setupProjectThunk(id))}
    >
      {isSettingUp ? (
        <Loader2 className={styles.iconSpin} aria-hidden />
      ) : (
        <Download className={styles.icon} aria-hidden />
      )}
      {isSettingUp ? 'Setting up…' : 'Setup'}
    </button>
  );
};

const styles = {
  icon: `h-3.5 w-3.5`,
  iconSpin: `h-3.5 w-3.5 animate-spin`,
};
