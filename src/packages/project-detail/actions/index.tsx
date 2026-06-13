'use client';

import type { HubProject } from '@/model';
import {
  ProjectsOpenChromeAction,
  ProjectsOpenCursorAction,
  ProjectsRunAction,
} from '@/packages/projects';

type ProjectDetailActionsProps = {
  project: HubProject;
};

export const ProjectDetailActions = ({ project }: ProjectDetailActionsProps) => {
  const isHookedUp = project.hookStatus !== 'catalog';

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Dev actions</h2>
      <div className={styles.actions}>
        <ProjectsRunAction projectId={project.id} disabled={!isHookedUp} />
        <ProjectsOpenCursorAction projectId={project.id} disabled={!isHookedUp} />
        <ProjectsOpenChromeAction
          projectId={project.id}
          disabled={!isHookedUp || project.apiOnly}
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
