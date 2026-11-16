import { putUiPreferencesApi } from '@/api/projects';
import { writeStoredProjectFavoriteIds } from '@/config/project-favorites-storage';
import type { AppThunk } from '@/store/store';
import { ProjectFavoritesActions } from '@/store/config/projectFavorites';
import { hydrateUiPreferencesThunk } from './hydrate-ui-preferences-thunk';

/**
 * Toggles whether a project is favorited and saves it to data/ui-preferences.json (reverts if the save fails).
 * Waits for hydration first so a toggle never overwrites favorites that have not loaded yet.
 */
export const toggleProjectFavoriteThunk =
  (projectId: string): AppThunk<Promise<200 | 500>> =>
  async (dispatch, getState) => {
    await dispatch(hydrateUiPreferencesThunk());

    const previous = getState().projectFavorites.ids;
    const next = previous.includes(projectId)
      ? previous.filter((id) => id !== projectId)
      : [...previous, projectId];
    dispatch(ProjectFavoritesActions.setFavoriteIds(next));

    const result = await putUiPreferencesApi({ favoriteProjectIds: next });
    if (!result.success) {
      dispatch(ProjectFavoritesActions.setFavoriteIds(previous));
      return 500;
    }
    writeStoredProjectFavoriteIds(next);
    return 200;
  };
