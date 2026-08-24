'use client';

import { Loader2, Square } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeProjectTerminalsThunk } from '@/store/thunks/projects';

type ProjectsCloseActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
  iconSize?: 'sm' | 'md';
};

export const ProjectsCloseAction = ({
  projectId,
  disabled,
  iconOnly,
  iconSize = 'sm',
}: ProjectsCloseActionProps) => {
  const dispatch = useAppDispatch();
  const terminalSessions = useAppSelector((s) => s.terminalSessions);
  const project = useAppSelector((s) => s.projects[projectId]);
  const [isClosing, setIsClosing] = useState(false);

  const hasSessions = useMemo(
    () => Object.values(terminalSessions).some((session) => session.projectId === projectId),
    [terminalSessions, projectId],
  );

  const canClose = hasSessions || !!project?.postgresActiveConsumer;

  const label = isClosing ? 'Closing…' : 'Close';
  const iconClass = iconSize === 'md' ? styles.iconMd : styles.iconSm;
  const buttonClass = iconOnly
    ? iconSize === 'md'
      ? styles.iconSecondaryMd
      : styles.iconSecondarySm
    : styles.secondary;

  const handleClose = async () => {
    setIsClosing(true);
    try {
      await dispatch(closeProjectTerminalsThunk(projectId));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <button
      type="button"
      className={buttonClass}
      disabled={disabled || !canClose || isClosing}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={() => void handleClose()}
    >
      {iconOnly ? (
        isClosing ? (
          <Loader2 className={`${iconClass} animate-spin`} aria-hidden />
        ) : (
          <Square className={iconClass} aria-hidden />
        )
      ) : (
        label
      )}
    </button>
  );
};

const styles = {
  secondary: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200 disabled:opacity-50
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
