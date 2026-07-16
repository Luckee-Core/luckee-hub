'use client';

import { Download, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setupProjectThunk } from '@/store/thunks/projects';
import {
  hasActiveRunOperation,
  hasActiveSetupOperation,
  isProjectSetupActive,
} from '@/utils/projects';

type ProjectsSetupActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
};

export const ProjectsSetupAction = ({
  projectId,
  disabled,
  iconOnly,
}: ProjectsSetupActionProps) => {
  const dispatch = useAppDispatch();
  const runningJobs = useAppSelector((s) => s.runningJobs);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const setupState = useMemo(
    () => ({ runningJobs, projectsBuilder }),
    [runningJobs, projectsBuilder],
  );
  const isSettingUp = useMemo(
    () => isProjectSetupActive(setupState, projectId),
    [setupState, projectId],
  );
  const isSetupBusy = useMemo(
    () => hasActiveSetupOperation(setupState) || hasActiveRunOperation(setupState),
    [setupState],
  );
  const label = isSettingUp ? 'Setting up…' : 'Setup';

  return (
    <button
      type="button"
      className={iconOnly ? styles.iconSecondary : styles.secondary}
      disabled={disabled || isSetupBusy}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={() => void dispatch(setupProjectThunk(projectId))}
    >
      {iconOnly ? (
        isSettingUp ? (
          <Loader2 className={`${styles.icon} animate-spin`} aria-hidden />
        ) : (
          <Download className={styles.icon} aria-hidden />
        )
      ) : (
        label
      )}
    </button>
  );
};

const styles = {
  secondary: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300
    hover:bg-gray-50 disabled:opacity-50
  `,
  iconSecondary: `
    inline-flex items-center justify-center rounded p-1 text-gray-600
    hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40
  `,
  icon: `h-3.5 w-3.5`,
};
