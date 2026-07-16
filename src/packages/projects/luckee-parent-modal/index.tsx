'use client';

import { FolderOpen, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { pickHubConfigFolderThunk } from '@/store/thunks/projects';

export const LuckeeParentRequiredModal = () => {
  const dispatch = useAppDispatch();
  const luckeeParentModalOpen = useAppSelector((s) => s.projectsBuilder.luckeeParentModalOpen);
  const luckeeParentPicking = useAppSelector((s) => s.projectsBuilder.luckeeParentPicking);
  const hubConfigError = useAppSelector((s) => s.projectsBuilder.hubConfigError);
  const luckeeParent = useAppSelector((s) => s.projectsBuilder.luckeeParent);

  if (!luckeeParentModalOpen || luckeeParent) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="luckee-parent-title">
      <div className={styles.card}>
        <h2 id="luckee-parent-title" className={styles.title}>
          Choose your Luckee folder location
        </h2>
        <p className={styles.body}>
          Before you can set up projects, choose where the hub should create the{' '}
          <code className={styles.code}>luckee</code> folder. We will clone repos into{' '}
          <code className={styles.code}>luckee/{'{project}'}/</code> inside the folder you pick.
        </p>
        <p className={styles.note}>
          Finder will open so you can select a folder. You do not need to type a path.
        </p>
        {hubConfigError ? <p className={styles.error}>{hubConfigError}</p> : null}
        <button
          type="button"
          className={styles.primaryButton}
          disabled={luckeeParentPicking}
          onClick={() => void dispatch(pickHubConfigFolderThunk())}
        >
          {luckeeParentPicking ? (
            <>
              <Loader2 className={`${styles.buttonIcon} animate-spin`} aria-hidden />
              Waiting for Finder…
            </>
          ) : (
            <>
              <FolderOpen className={styles.buttonIcon} aria-hidden />
              Choose folder in Finder
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  card: `
    w-full max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-xl space-y-4
  `,
  title: `text-lg font-semibold text-gray-900`,
  body: `text-sm text-gray-600 leading-relaxed`,
  note: `text-sm text-gray-500`,
  code: `font-mono text-xs bg-gray-100 px-1 py-0.5 rounded`,
  error: `text-sm text-red-600`,
  primaryButton: `
    inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5
    text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60
  `,
  buttonIcon: `h-4 w-4`,
};
