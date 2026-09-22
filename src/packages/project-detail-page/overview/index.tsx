'use client';

import { useAppSelector } from '@/store';
import { OverviewMetaLine } from './meta-line';
import { ProjectDetailActions } from '../actions';
import { ProjectDetailTabs } from './tabs';

/**
 * Project overview — left: description + meta; right: actions (warn under icons).
 */
export const ProjectDetailOverview = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  return (
    <div className={styles.stack}>
      <div className={styles.header}>
        <div className={styles.left}>
          {currentProject.description ? (
            <p className={styles.description}>{currentProject.description}</p>
          ) : null}
          <OverviewMetaLine />
        </div>
        <ProjectDetailActions />
      </div>
      <ProjectDetailTabs />
    </div>
  );
};

const styles = {
  stack: `space-y-6`,
  header: `flex items-start justify-between gap-4`,
  left: `min-w-0 flex-1 space-y-2`,
  description: `text-sm text-gray-600`,
};
