'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { isHubProjectAvailable } from '@/config';
import { projectCanRun, projectHasWebRepo } from '@/utils/projects';
import {
  ProjectsCloseAction,
  ProjectsOpenChromeAction,
  ProjectsOpenCursorAction,
  ProjectsRunAction,
} from '@/packages/projects';

/**
 * Project detail header actions — icon buttons with hover labels (no Setup).
 */
export const ProjectDetailActions = () => {
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const supabaseProbes = useAppSelector((s) => s.supabaseProbes);

  const launcherAvailable = isHubProjectAvailable(currentProject.id);
  const supabaseProbe = supabaseProbes[currentProject.id];
  const supabaseBlocking =
    currentProject.supabaseSupported &&
    (supabaseProbe === undefined || !supabaseProbe.configured);
  const canRun =
    launcherAvailable && projectCanRun(currentProject.hookStatus) && !supabaseBlocking;
  const hasWebRepo = useMemo(
    () => projectHasWebRepo(projectRepos, currentProject.id),
    [projectRepos, currentProject.id],
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.actions}>
        <ProjectsRunAction
          projectId={currentProject.id}
          disabled={!canRun}
          iconOnly
          iconSize="md"
        />
        <ProjectsOpenCursorAction
          projectId={currentProject.id}
          disabled={!canRun}
          iconOnly
          iconSize="md"
        />
        <ProjectsOpenChromeAction
          projectId={currentProject.id}
          disabled={!canRun || !hasWebRepo}
          iconOnly
          iconSize="md"
        />
        <ProjectsCloseAction
          projectId={currentProject.id}
          disabled={!canRun}
          iconOnly
          iconSize="md"
        />
      </div>
      {supabaseBlocking ? (
        <p className={styles.warn} title="Configure Supabase before Run">
          Supabase required
        </p>
      ) : null}
    </div>
  );
};

const styles = {
  wrap: `flex flex-col items-end gap-1 shrink-0`,
  actions: `flex items-center gap-1`,
  warn: `text-xs text-amber-800`,
};
