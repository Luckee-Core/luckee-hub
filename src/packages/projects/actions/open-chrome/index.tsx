'use client';

import { Globe } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { openProjectChromeThunk } from '@/store/thunks/projects';

type ProjectsOpenChromeActionProps = {
  projectId: string;
  disabled?: boolean;
  iconOnly?: boolean;
  iconSize?: 'sm' | 'md';
};

export const ProjectsOpenChromeAction = ({
  projectId,
  disabled,
  iconOnly,
  iconSize = 'sm',
}: ProjectsOpenChromeActionProps) => {
  const dispatch = useAppDispatch();
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
      disabled={disabled}
      aria-label={iconOnly ? 'Open in Chrome' : undefined}
      title={iconOnly ? 'Chrome' : undefined}
      onClick={() => void dispatch(openProjectChromeThunk(projectId))}
    >
      {iconOnly ? <Globe className={iconClass} aria-hidden /> : 'Chrome'}
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
