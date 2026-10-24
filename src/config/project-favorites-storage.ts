export const PROJECT_FAVORITES_STORAGE_KEY = 'luckee-hub-project-favorites';

/**
 * Reads favorited project ids from localStorage (client only).
 */
export const readStoredProjectFavoriteIds = (): string[] => {
  try {
    const raw = localStorage.getItem(PROJECT_FAVORITES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0);
  } catch {
    return [];
  }
};

/**
 * Persists favorited project ids to localStorage.
 */
export const writeStoredProjectFavoriteIds = (ids: string[]): void => {
  try {
    localStorage.setItem(PROJECT_FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / private mode
  }
};
