'use client';

import { useAppDispatch } from '@/store';
import { refreshProjectsThunk } from '@/store/thunks/projects';

export const ProjectsRefreshButton = () => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => void dispatch(refreshProjectsThunk())}
    >
      Refresh
    </button>
  );
};

const styles = {
  button: `
    px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded
    hover:bg-orange-600 transition-colors
  `,
};
