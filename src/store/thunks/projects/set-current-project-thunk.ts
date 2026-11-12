import type { AppThunk } from '@/store/store';
import { CurrentProjectActions } from '@/store/current/currentProject';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { ProjectDetailBuilderActions } from '@/store/builders/projectDetailBuilder';
import { DETAIL_PROJECT_SESSION_KEY, PROJECTS_PATH } from '@/config';
import { probeLocalDatabaseThunk } from './local-database-thunk';
import { probeSupabaseConfigThunk } from './supabase-config-thunk';
import { probeDataPlaneThunk } from './data-plane-thunk';
import { probeExpressRepoEnvForProjectThunk } from './project-env-thunk';
import { loadProjectOverviewThunk } from './project-overview-thunk';

/**
 * Hydrate `currentProject` and probe data needed for repo cards.
 */
export const setCurrentProjectThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const project = getState().projects[projectId];
    if (!project) {
      return 400;
    }

    dispatch(CurrentProjectActions.setCurrentProject(project));

    try {
      sessionStorage.setItem(DETAIL_PROJECT_SESSION_KEY, projectId);
    } catch {
      // ignore
    }

    dispatch(
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Projects', href: PROJECTS_PATH },
        segments: [{ kind: 'plainText', label: project.name }],
      }),
    );

    dispatch(ProjectsBuilderActions.resetLocalDatabaseState());
    dispatch(ProjectsBuilderActions.resetSupabaseState());
    dispatch(ProjectDetailBuilderActions.reset());

    // Always refetch so edits to data/project-overviews/<id>.json show up; the last copy stays visible meanwhile.
    void dispatch(loadProjectOverviewThunk(projectId));

    if (project.localDatabaseSupported) {
      void dispatch(probeLocalDatabaseThunk(projectId));
    }

    void (async () => {
      if (project.dataPlane) {
        await dispatch(probeDataPlaneThunk(projectId));
      }
      if (project.supabaseSupported) {
        await dispatch(probeSupabaseConfigThunk(projectId));
      }
      const expressRepo = getState().projectRepos.find(
        (r) => r.projectId === projectId && r.role === 'express',
      );
      if (expressRepo) {
        await dispatch(probeExpressRepoEnvForProjectThunk(projectId, expressRepo.repoName));
      }
    })();

    return 200;
  };
