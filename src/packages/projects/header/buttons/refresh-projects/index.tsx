'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { refreshProjectsThunk } from '@/store/thunks/projects';

export const ProjectsRefreshButton = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((state) => state.projectsBuilder);
  const isRefreshing = projectsBuilder.listLoadStatus === 'loading';

  return (
    <button
      type="button"
      className={styles.button}
      disabled={isRefreshing}
      onClick={() => void dispatch(refreshProjectsThunk({ reconnectTerminals: true }))}
    >
      {isRefreshing ? 'Refreshing…' : 'Refresh'}
    </button>
  );
};

const styles = {
  button: `
    px-2.5 py-1 text-xs font-medium text-white bg-orange-500 rounded
    hover:bg-orange-600 transition-colors cursor-pointer
    disabled:cursor-not-allowed disabled:opacity-60
  `,
};
