import { getUiPreferencesApi, putUiPreferencesApi } from '@/api/projects';
import { readStoredProjectFavoriteIds, writeStoredProjectFavoriteIds } from '@/config/project-favorites-storage';
import {
  readStoredProjectSectionOverrides,
  writeStoredProjectSectionOverrides,
} from '@/config/project-section-overrides-storage';
import type { AppThunk } from '@/store/store';
import { ProjectFavoritesActions } from '@/store/config/projectFavorites';
import { ProjectSectionOverridesActions } from '@/store/config/projectSectionOverrides';

let hydrating: Promise<200 | 500> | null = null;
let hydrated = false;

/**
 * Loads favorites and table section overrides from hub Express (committed data/ui-preferences.json), the source of truth.
 * First run migrates any existing localStorage values up to the server. localStorage stays as an offline
 * cache: if hub Express is unreachable, the cached values are shown. Runs once; later calls share it.
 */
export const hydrateUiPreferencesThunk =
  (): AppThunk<Promise<200 | 500>> =>
  (dispatch) => {
    if (hydrated) {
      return Promise.resolve(200);
    }
    if (hydrating) {
      return hydrating;
    }
    hydrating = (async (): Promise<200 | 500> => {
      const cachedFavorites = readStoredProjectFavoriteIds();
      const cachedOverrides = readStoredProjectSectionOverrides();

      const result = await getUiPreferencesApi();
      if (!result.success || !result.data) {
        dispatch(ProjectFavoritesActions.setFavoriteIds(cachedFavorites));
        dispatch(ProjectSectionOverridesActions.setOverrides(cachedOverrides));
        return 500;
      }

      let { favoriteProjectIds, projectSectionOverrides } = result.data;
      const hasCached = cachedFavorites.length > 0 || Object.keys(cachedOverrides).length > 0;
      if (!result.data.stored && hasCached) {
        const migrated = await putUiPreferencesApi({
          favoriteProjectIds: cachedFavorites,
          projectSectionOverrides: cachedOverrides,
        });
        favoriteProjectIds = cachedFavorites;
        projectSectionOverrides = cachedOverrides;
        if (migrated.success) {
          console.log('✅ Migrated project favorites and sections from this browser to data/ui-preferences.json');
        }
      }

      writeStoredProjectFavoriteIds(favoriteProjectIds);
      writeStoredProjectSectionOverrides(projectSectionOverrides);
      dispatch(ProjectFavoritesActions.setFavoriteIds(favoriteProjectIds));
      dispatch(ProjectSectionOverridesActions.setOverrides(projectSectionOverrides));
      hydrated = true;
      return 200;
    })().finally(() => {
      hydrating = null;
    });
    return hydrating;
  };
