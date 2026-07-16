'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadHubConfigThunk, pickHubConfigFolderThunk } from '@/store/thunks/projects';

export const ProjectsLuckeeParentControl = () => {
  const dispatch = useAppDispatch();
  const luckeeParent = useAppSelector((s) => s.projectsBuilder.luckeeParent);
  const hubConfigLoadStatus = useAppSelector((s) => s.projectsBuilder.hubConfigLoadStatus);
  const luckeeParentPicking = useAppSelector((s) => s.projectsBuilder.luckeeParentPicking);

  useEffect(() => {
    if (hubConfigLoadStatus === 'idle') {
      void dispatch(loadHubConfigThunk());
    }
  }, [dispatch, hubConfigLoadStatus]);

  if (!luckeeParent) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Luckee folder</span>
      <code className={styles.path}>{luckeeParent}/luckee/</code>
      <button
        type="button"
        className={styles.changeButton}
        disabled={luckeeParentPicking}
        onClick={() => void dispatch(pickHubConfigFolderThunk())}
      >
        {luckeeParentPicking ? 'Opening Finder…' : 'Change'}
      </button>
    </div>
  );
};

const styles = {
  wrapper: `
    flex flex-wrap items-center gap-2 min-w-0
  `,
  label: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500 shrink-0
  `,
  path: `
    text-[11px] text-gray-700 bg-gray-100 px-2 py-1 rounded font-mono truncate max-w-md
  `,
  changeButton: `
    rounded px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300
    hover:bg-gray-50 disabled:opacity-50
  `,
};
