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
  iconSize?: 'sm' | 'md';
};

export const ProjectsSetupAction = ({
  projectId,
  disabled,
  iconOnly,
  iconSize = 'sm',
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
  const iconClass = iconSize === 'md' ? styles.iconMd : styles.iconSm;
  const buttonClass = iconOnly
    ? iconSize === 'md'
      ? styles.iconSecondaryMd
      : styles.iconSecondarySm
    : styles.secondary;

  return (
    <button
      type="button"
      className={buttonClass}
      disabled={disabled || isSetupBusy}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={() => void dispatch(setupProjectThunk(projectId))}
    >
      {iconOnly ? (
        isSettingUp ? (
          <Loader2 className={`${iconClass} animate-spin`} aria-hidden />
        ) : (
          <Download className={iconClass} aria-hidden />
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
  iconSecondarySm: `
    inline-flex items-center justify-center rounded p-1 text-gray-600
    hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40
  `,
  iconSecondaryMd: `
    inline-flex items-center justify-center rounded p-1.5 text-gray-600
    hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40
  `,
  iconSm: `h-3.5 w-3.5`,
  iconMd: `h-5 w-5`,
};
