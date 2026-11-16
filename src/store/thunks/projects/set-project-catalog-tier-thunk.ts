import { putUiPreferencesApi } from '@/api/projects';
import type { ProjectCatalogTier } from '@/config/project-catalog-tier';
import { getProjectCatalogTier } from '@/config/project-catalog-tier';
import { writeStoredProjectSectionOverrides } from '@/config/project-section-overrides-storage';
import type { AppThunk } from '@/store/store';
import { ProjectSectionOverridesActions } from '@/store/config/projectSectionOverrides';
import { hydrateUiPreferencesThunk } from './hydrate-ui-preferences-thunk';

/**
 * Sets a project's launcher table tier (drag-and-drop between sections) and saves it to data/ui-preferences.json
 * (reverts if the save fails). Moving a project back to its default tier clears the override.
 */
export const setProjectCatalogTierThunk =
  (projectId: string, tier: ProjectCatalogTier): AppThunk<Promise<200 | 500>> =>
  async (dispatch, getState) => {
    await dispatch(hydrateUiPreferencesThunk());

    const previous = getState().projectSectionOverrides.byProjectId;
    const defaultTier = getProjectCatalogTier(projectId, {});
    const next = { ...previous };
    if (tier === defaultTier) {
      delete next[projectId];
    } else {
      next[projectId] = tier;
    }
    dispatch(ProjectSectionOverridesActions.setOverrides(next));

    const result = await putUiPreferencesApi({ projectSectionOverrides: next });
    if (!result.success) {
      dispatch(ProjectSectionOverridesActions.setOverrides(previous));
      return 500;
    }
    writeStoredProjectSectionOverrides(next);
    return 200;
  };
