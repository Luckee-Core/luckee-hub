'use client';

import { useAppSelector } from '@/store';
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
  const currentProject = useAppSelector((s) => s.currentProject);

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
