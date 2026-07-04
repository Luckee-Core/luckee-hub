'use client';

import { AppWindow } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { openProjectCursorThunk } from '@/store/thunks/projects';

type ProjectsOpenCursorActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
};

export const ProjectsOpenCursorAction = ({
  projectId,
  disabled,
  iconOnly,
}: ProjectsOpenCursorActionProps) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={iconOnly ? styles.iconSecondary : styles.secondary}
      disabled={disabled}
      aria-label={iconOnly ? 'Open in Cursor' : undefined}
      title={iconOnly ? 'Cursor' : undefined}
      onClick={() => void dispatch(openProjectCursorThunk(projectId))}
    >
      {iconOnly ? <AppWindow className={styles.icon} aria-hidden /> : 'Cursor'}
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
