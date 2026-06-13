'use client';

import { useAppDispatch } from '@/store';
import { openProjectChromeThunk } from '@/store/thunks/projects';

type ProjectsOpenChromeActionProps = {
  projectId: string;
  disabled?: boolean;
};

export const ProjectsOpenChromeAction = ({ projectId, disabled }: ProjectsOpenChromeActionProps) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.secondary}
      disabled={disabled}
      onClick={() => void dispatch(openProjectChromeThunk(projectId))}
    >
      Chrome
    </button>
  );
};

const styles = {
  secondary: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200 disabled:opacity-50
  `,
};
