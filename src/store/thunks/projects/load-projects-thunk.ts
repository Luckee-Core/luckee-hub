import {
  buildHubCatalogProjects,
  buildHubCatalogRepos,
  mergeHubProjectSetup,
  mergeHubRepoSetup,
} from '@/config';
import { listProjectsApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import { ProjectsActions } from '@/store/dumps/projects';
import { ProjectReposActions } from '@/store/dumps/projectRepos';

/**
 * Seed static repo catalog (identity + GitHub URLs only).
 */
export const initializeHubCatalogThunk = (): AppThunk => (dispatch) => {
  dispatch(ProjectReposActions.setProjectRepos(buildHubCatalogRepos()));
};

type LoadProjectsOptions = {
  /** Curl/lsof ports for Ready / API running / Web running badges. */
  live?: boolean;
};

/**
 * Probe hub.local.json setup via Express and merge onto the hardcoded catalog.
 */
export const loadProjectsThunk =
  (options: LoadProjectsOptions = {}): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const live = options.live ?? false;
    const hasProjects = Object.keys(getState().projects).length > 0;

    if (!hasProjects) {
      dispatch(initializeHubCatalogThunk());
      dispatch(ProjectsBuilderActions.setListLoadStatus('loading'));
      dispatch(ProjectsBuilderActions.setListError(null));
    }

    const result = await listProjectsApi({ live });
    if (!result.success || !result.data) {
      if (!hasProjects) {
        dispatch(ProjectsBuilderActions.setListLoadStatus('error'));
        dispatch(ProjectsBuilderActions.setListError(result.error ?? 'Failed to load projects'));
      }
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(
      ProjectsActions.setProjects(
        mergeHubProjectSetup(buildHubCatalogProjects(), result.data.projects),
      ),
    );
    dispatch(
      ProjectReposActions.setProjectRepos(
        mergeHubRepoSetup(buildHubCatalogRepos(), result.data.repos),
      ),
    );
    dispatch(ProjectsBuilderActions.setListLoadStatus('loaded'));
    return 200;
  };

/**
 * Full refresh with live port probes (Refresh button).
 */
export const refreshProjectsThunk =
  (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
    dispatch(ProjectsBuilderActions.setListLoadStatus('loading'));
    dispatch(ProjectsBuilderActions.setListError(null));
    return dispatch(loadProjectsThunk({ live: true }));
  };
