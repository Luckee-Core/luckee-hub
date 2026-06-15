'use client';

import { useMemo } from 'react';

import type { HubProject } from '@/model';
import { useAppSelector } from '@/store';
import { projectHasWebRepo } from '@/utils/projects';
import { ProjectsOpenChromeAction } from '../open-chrome';
import { ProjectsOpenCursorAction } from '../open-cursor';
import { ProjectsRunAction } from '../run-project';

type ProjectsRowActionsProps = {
  project: HubProject;
};

export const ProjectsRowActions = ({ project }: ProjectsRowActionsProps) => {
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const isHookedUp = project.hookStatus !== 'catalog';
  const hasWebRepo = useMemo(
    () => projectHasWebRepo(projectRepos, project.id),
    [projectRepos, project.id],
  );

  return (
    <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
      <ProjectsRunAction projectId={project.id} disabled={!isHookedUp} />
      <ProjectsOpenCursorAction projectId={project.id} disabled={!isHookedUp} />
      <ProjectsOpenChromeAction
        projectId={project.id}
        disabled={!isHookedUp || !hasWebRepo}
      />
    </div>
  );
};

const styles = {
  actions: `
    flex flex-wrap items-center gap-1.5
  `,
};
