'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { projectCanRun, projectHasWebRepo, projectNeedsSetup } from '@/utils/projects';
import {
  ProjectsCloseAction,
  ProjectsOpenChromeAction,
  ProjectsOpenCursorAction,
  ProjectsRunAction,
  ProjectsSetupAction,
} from '@/packages/projects';

export const ProjectDetailActions = () => {
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const canRun = projectCanRun(currentProject.hookStatus);
  const needsSetup = projectNeedsSetup(currentProject.hookStatus);
  const hasWebRepo = useMemo(
    () => projectHasWebRepo(projectRepos, currentProject.id),
    [projectRepos, currentProject.id],
  );

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Dev actions</h2>
      <div className={styles.actions}>
        <ProjectsSetupAction projectId={currentProject.id} disabled={!needsSetup} />
        <ProjectsRunAction projectId={currentProject.id} disabled={!canRun} />
        <ProjectsOpenCursorAction projectId={currentProject.id} disabled={!canRun} />
        <ProjectsOpenChromeAction
          projectId={currentProject.id}
          disabled={!canRun || !hasWebRepo}
        />
        <ProjectsCloseAction projectId={currentProject.id} disabled={!canRun} />
      </div>
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-3`,
  title: `text-lg font-semibold text-gray-900`,
  actions: `flex flex-wrap gap-2`,
};
