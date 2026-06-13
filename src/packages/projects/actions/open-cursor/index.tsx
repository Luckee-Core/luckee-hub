'use client';

import { useAppDispatch } from '@/store';
import { openProjectCursorThunk } from '@/store/thunks/projects';

type ProjectsOpenCursorActionProps = {
  projectId: string;
  disabled?: boolean;
};

export const ProjectsOpenCursorAction = ({ projectId, disabled }: ProjectsOpenCursorActionProps) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.secondary}
      disabled={disabled}
      onClick={() => void dispatch(openProjectCursorThunk(projectId))}
    >
      Cursor
    </button>
  );
};

const styles = {
  secondary: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200 disabled:opacity-50
  `,
};
