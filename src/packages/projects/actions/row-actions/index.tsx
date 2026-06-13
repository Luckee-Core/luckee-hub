'use client';

import type { HubProject } from '@/model';
import { ProjectsOpenChromeAction } from '../open-chrome';
import { ProjectsOpenCursorAction } from '../open-cursor';
import { ProjectsRunAction } from '../run-project';

type ProjectsRowActionsProps = {
  project: HubProject;
};

export const ProjectsRowActions = ({ project }: ProjectsRowActionsProps) => {
  const isHookedUp = project.hookStatus !== 'catalog';

  return (
    <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
      <ProjectsRunAction projectId={project.id} disabled={!isHookedUp} />
      <ProjectsOpenCursorAction projectId={project.id} disabled={!isHookedUp} />
      <ProjectsOpenChromeAction
        projectId={project.id}
        disabled={!isHookedUp || project.apiOnly}
      />
    </div>
  );
};

const styles = {
  actions: `
    flex flex-wrap items-center gap-1.5
  `,
};
