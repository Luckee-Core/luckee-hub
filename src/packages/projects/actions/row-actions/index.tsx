'use client';

import { useMemo } from 'react';

import type { HubProject } from '@/model';
import { useAppSelector } from '@/store';
import { projectHasWebRepo } from '@/utils/projects';
import { ProjectsCloseAction } from '../close-project';
import { ProjectsOpenChromeAction } from '../open-chrome';
import { ProjectsOpenCursorAction } from '../open-cursor';
import { ProjectsRunAction } from '../run-project';

type ProjectsRowActionsProps = {
  project: HubProject;
  iconOnly?: boolean;
};

export const ProjectsRowActions = ({ project, iconOnly }: ProjectsRowActionsProps) => {
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const isHookedUp = project.hookStatus !== 'catalog';
  const hasWebRepo = useMemo(
    () => projectHasWebRepo(projectRepos, project.id),
    [projectRepos, project.id],
  );

  return (
    <div className={iconOnly ? styles.iconActions : styles.actions} onClick={(event) => event.stopPropagation()}>
      <ProjectsRunAction projectId={project.id} disabled={!isHookedUp} iconOnly={iconOnly} />
      <ProjectsOpenCursorAction projectId={project.id} disabled={!isHookedUp} iconOnly={iconOnly} />
      <ProjectsOpenChromeAction
        projectId={project.id}
        disabled={!isHookedUp || !hasWebRepo}
        iconOnly={iconOnly}
      />
      <ProjectsCloseAction projectId={project.id} disabled={!isHookedUp} iconOnly={iconOnly} />
    </div>
  );
};

const styles = {
  actions: `
    flex flex-wrap items-center gap-1.5
  `,
  iconActions: `
    flex items-center gap-0.5
  `,
};
