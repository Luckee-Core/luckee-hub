'use client';

import { useAppSelector } from '@/store';
import { ProjectsSetupAction } from '@/packages/projects';
import { HubConfigured } from './hub-configured';
import { WebPath } from './web-path';
import { ExpressPath } from './express-path';
import { WebInstalled } from './web-installed';
import { ExpressInstalled } from './express-installed';

/**
 * Setup tab — run setup, then list clone and install checks.
 */
export const SetupTab = () => {
  const projectId = useAppSelector((state) => state.currentProject.id);

  return (
    <div className={styles.stack}>
      <ProjectsSetupAction projectId={projectId} />
      <HubConfigured />
      <WebPath />
      <ExpressPath />
      <WebInstalled />
      <ExpressInstalled />
    </div>
  );
};

const styles = {
  stack: `space-y-2`,
};
