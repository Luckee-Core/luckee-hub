'use client';

import { ProjectsTable } from './table';
import { LuckeeParentRequiredModal } from './luckee-parent-modal';
import { ProjectSetupModal } from './project-setup-modal';

export const Projects = () => {
  return (
    <>
      <LuckeeParentRequiredModal />
      <ProjectSetupModal />
      <div className={styles.page}>
        <ProjectsTable />
      </div>
    </>
  );
};

const styles = {
  page: `w-full`,
};
