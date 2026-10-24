import type { AppThunk } from '@/store';
import {
  readStoredProjectFavoriteIds,
  writeStoredProjectFavoriteIds,
} from '@/config/project-favorites-storage';
import { ProjectFavoritesActions } from '@/store/config/projectFavorites';

/**
 * Loads favorited project ids from localStorage into Redux.
 */
export const hydrateProjectFavoritesThunk =
  (): AppThunk<Promise<200>> => async (dispatch) => {
    dispatch(ProjectFavoritesActions.setFavoriteIds(readStoredProjectFavoriteIds()));
    return 200;
  };

/**
 * Toggles whether a project is favorited and persists to localStorage.
 */
export const toggleProjectFavoriteThunk =
  (projectId: string): AppThunk<Promise<200>> =>
  async (dispatch, getState) => {
    const current = getState().projectFavorites.ids;
    const next = current.includes(projectId)
      ? current.filter((id) => id !== projectId)
      : [...current, projectId];
    writeStoredProjectFavoriteIds(next);
    dispatch(ProjectFavoritesActions.setFavoriteIds(next));
    return 200;
  };
