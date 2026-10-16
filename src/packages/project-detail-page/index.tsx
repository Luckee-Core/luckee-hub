'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DETAIL_PROJECT_SESSION_KEY, PROJECTS_PATH } from '@/config';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import { LuckeeParentRequiredModal } from '@/packages/projects/luckee-parent-modal';
import { ProjectSetupModal } from '@/packages/projects/project-setup-modal';
import { ProjectDetailOverview } from './overview';
import { ProjectDetailLocalDatabase } from './local-database';
import { ProjectDetailStorageExpress } from './storage-express';

/**
 * Project detail workspace — reads `currentProject` (ADR 008).
 * Open via `setCurrentProjectThunk` + navigate from the projects list.
 */
export const ProjectDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projects = useAppSelector((s) => s.projects);
  const listLoadStatus = useAppSelector((s) => s.projectsBuilder.listLoadStatus);

  useEffect(() => {
    if (currentProject.id || listLoadStatus !== 'loaded') {
      return;
    }

    let storedId: string | null = null;
    try {
      storedId = sessionStorage.getItem(DETAIL_PROJECT_SESSION_KEY);
    } catch {
      storedId = null;
    }

    if (storedId && projects[storedId]) {
      void dispatch(setCurrentProjectThunk(storedId));
      return;
    }

    router.replace(PROJECTS_PATH);
  }, [currentProject.id, dispatch, listLoadStatus, projects, router]);

  return (
    <>
      <LuckeeParentRequiredModal />
      <ProjectSetupModal />
      <div className={styles.page}>
        <ProjectDetailOverview />
        {currentProject.storageExpressSupported ? <ProjectDetailStorageExpress /> : null}
        {currentProject.localDatabaseSupported ? <ProjectDetailLocalDatabase /> : null}
      </div>
    </>
  );
};

const styles = {
  page: `w-full space-y-6`,
};
