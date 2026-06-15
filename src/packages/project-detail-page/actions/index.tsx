'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { projectHasWebRepo } from '@/utils/projects';
import {
  ProjectsOpenChromeAction,
  ProjectsOpenCursorAction,
  ProjectsRunAction,
} from '@/packages/projects';

export const ProjectDetailActions = () => {
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const isHookedUp = currentProject.hookStatus !== 'catalog';
  const hasWebRepo = useMemo(
    () => projectHasWebRepo(projectRepos, currentProject.id),
    [projectRepos, currentProject.id],
  );

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Dev actions</h2>
      <div className={styles.actions}>
        <ProjectsRunAction projectId={currentProject.id} disabled={!isHookedUp} />
        <ProjectsOpenCursorAction projectId={currentProject.id} disabled={!isHookedUp} />
        <ProjectsOpenChromeAction
          projectId={currentProject.id}
          disabled={!isHookedUp || !hasWebRepo}
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
