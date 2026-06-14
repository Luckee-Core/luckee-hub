'use client';

import { useAppSelector } from '@/store';
import {
  ProjectsOpenChromeAction,
  ProjectsOpenCursorAction,
  ProjectsRunAction,
} from '@/packages/projects';

export const ProjectDetailActions = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  const isHookedUp = currentProject.hookStatus !== 'catalog';

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Dev actions</h2>
      <div className={styles.actions}>
        <ProjectsRunAction projectId={currentProject.id} disabled={!isHookedUp} />
        <ProjectsOpenCursorAction projectId={currentProject.id} disabled={!isHookedUp} />
        <ProjectsOpenChromeAction
          projectId={currentProject.id}
          disabled={!isHookedUp || currentProject.apiOnly}
        />
      </div>
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-3`,
  title: `text-lg font-semibold text-gray-900`,
  actions: `flex flex-wrap gap-2`,
};
