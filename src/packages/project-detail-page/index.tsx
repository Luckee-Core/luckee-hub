'use client';

import { AppLayout } from '@/components/app-layout';
import { useAppSelector } from '@/store';
import { TerminalDock } from '@/packages/terminal-dock';
import { LuckeeParentRequiredModal } from '@/packages/projects/luckee-parent-modal';
import { ProjectSetupModal } from '@/packages/projects/project-setup-modal';
import { ProjectDetailOverview } from './overview';
import { ProjectDetailLocalDatabase } from './local-database';

/**
 * Project detail workspace — reads `currentProject` (ADR 008).
 * Open via `setCurrentProjectThunk` + navigate from the projects list.
 */
export const ProjectDetailPage = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  return (
    <AppLayout terminalDock={<TerminalDock />}>
      <LuckeeParentRequiredModal />
      <ProjectSetupModal />
      <div className={styles.page}>
        <ProjectDetailOverview />
        {currentProject.localDatabaseSupported ? <ProjectDetailLocalDatabase /> : null}
      </div>
    </AppLayout>
  );
};

const styles = {
  page: `w-full space-y-6`,
};
