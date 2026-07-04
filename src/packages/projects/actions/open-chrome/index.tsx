'use client';

import { Globe } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { openProjectChromeThunk } from '@/store/thunks/projects';

type ProjectsOpenChromeActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
};

export const ProjectsOpenChromeAction = ({
  projectId,
  disabled,
  iconOnly,
}: ProjectsOpenChromeActionProps) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={iconOnly ? styles.iconSecondary : styles.secondary}
      disabled={disabled}
      aria-label={iconOnly ? 'Open in Chrome' : undefined}
      title={iconOnly ? 'Chrome' : undefined}
      onClick={() => void dispatch(openProjectChromeThunk(projectId))}
    >
      {iconOnly ? <Globe className={styles.icon} aria-hidden /> : 'Chrome'}
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
