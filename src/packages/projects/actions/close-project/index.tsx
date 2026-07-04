'use client';

import { Loader2, Square } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeProjectTerminalsThunk } from '@/store/thunks/projects';

type ProjectsCloseActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
};

export const ProjectsCloseAction = ({ projectId, disabled, iconOnly }: ProjectsCloseActionProps) => {
  const dispatch = useAppDispatch();
  const terminalSessions = useAppSelector((s) => s.terminalSessions);
  const [isClosing, setIsClosing] = useState(false);

  const hasSessions = useMemo(
    () => Object.values(terminalSessions).some((session) => session.projectId === projectId),
    [terminalSessions, projectId],
  );

  const label = isClosing ? 'Closing…' : 'Close';

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
      className={iconOnly ? styles.iconSecondary : styles.secondary}
      disabled={disabled || !hasSessions || isClosing}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onClick={() => void handleClose()}
    >
      {iconOnly ? (
        isClosing ? (
          <Loader2 className={`${styles.icon} animate-spin`} aria-hidden />
        ) : (
          <Square className={styles.icon} aria-hidden />
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
  iconSecondary: `
    inline-flex items-center justify-center rounded p-1 text-gray-600
    hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40
  `,
  icon: `h-3.5 w-3.5`,
};
