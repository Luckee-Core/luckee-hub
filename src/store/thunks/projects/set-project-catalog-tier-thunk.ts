import type { AppThunk } from '@/store';
import type { ProjectCatalogTier } from '@/config/project-catalog-tier';
import { getProjectCatalogTier } from '@/config/project-catalog-tier';
import {
  readStoredProjectSectionOverrides,
  writeStoredProjectSectionOverrides,
} from '@/config/project-section-overrides-storage';
import { ProjectSectionOverridesActions } from '@/store/config/projectSectionOverrides';

/**
 * Loads project section overrides from localStorage into Redux.
 */
export const hydrateProjectSectionOverridesThunk =
  (): AppThunk<Promise<200>> => async (dispatch) => {
    dispatch(
      ProjectSectionOverridesActions.setOverrides(readStoredProjectSectionOverrides()),
    );
    return 200;
  };

/**
 * Sets a project's launcher table tier (temp admin override) and persists to localStorage.
 */
export const setProjectCatalogTierThunk =
  (projectId: string, tier: ProjectCatalogTier): AppThunk<Promise<200>> =>
  async (dispatch, getState) => {
    const { byProjectId } = getState().projectSectionOverrides;
    const defaultTier = getProjectCatalogTier(projectId, {});
    const next = { ...byProjectId };

    if (tier === defaultTier) {
      delete next[projectId];
    } else {
      next[projectId] = tier;
    }

    writeStoredProjectSectionOverrides(next);
    dispatch(ProjectSectionOverridesActions.setOverrides(next));
    return 200;
  };
