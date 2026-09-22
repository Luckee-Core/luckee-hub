import type { AppThunk } from '@/store/store';
import { CurrentProjectActions } from '@/store/current/currentProject';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { PROJECTS_PATH } from '@/config';
import { probeLocalDatabaseThunk } from './local-database-thunk';
import { probeSupabaseConfigThunk } from './supabase-config-thunk';
import { probeExpressEnvGroupThunk } from './express-env-thunk';

/**
 * Hydrate `currentProject`, then probe env in order: Supabase first (so that tab
 * can render), then each express-env group one at a time.
 */
export const setCurrentProjectThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const project = getState().projects[projectId];
    if (!project) {
      return 400;
    }

    dispatch(CurrentProjectActions.setCurrentProject(project));

    dispatch(
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Projects', href: PROJECTS_PATH },
        segments: [{ kind: 'plainText', label: project.name }],
      }),
    );

    dispatch(ProjectsBuilderActions.resetLocalDatabaseState());
    dispatch(ProjectsBuilderActions.resetSupabaseState());
    dispatch(ProjectsBuilderActions.resetExpressEnvForm());

    if (project.localDatabaseSupported) {
      void dispatch(probeLocalDatabaseThunk(projectId));
    }

    // Fire-and-forget ordered probes so navigation isn't blocked, but Supabase
    // always completes before AI / Maps / Email start.
    void (async () => {
      if (project.supabaseSupported) {
        await dispatch(probeSupabaseConfigThunk(projectId));
      }
      for (const groupId of project.expressEnvGroupIds) {
        await dispatch(probeExpressEnvGroupThunk(groupId));
      }
    })();

    return 200;
  };
