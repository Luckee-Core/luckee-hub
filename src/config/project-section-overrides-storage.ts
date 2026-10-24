import type { ProjectCatalogTier } from '@/config/project-catalog-tier';

export const PROJECT_SECTION_OVERRIDES_STORAGE_KEY = 'luckee-hub-project-section-overrides';

const isProjectCatalogTier = (value: unknown): value is ProjectCatalogTier =>
  value === 'active' ||
  value === 'finalSteps' ||
  value === 'almostReady' ||
  value === 'workInProgress' ||
  value === 'comingSoon' ||
  value === 'cancelled';

/**
 * Reads per-project section overrides from localStorage (client only).
 */
export const readStoredProjectSectionOverrides = (): Record<string, ProjectCatalogTier> => {
  try {
    const raw = localStorage.getItem(PROJECT_SECTION_OVERRIDES_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }
    const next: Record<string, ProjectCatalogTier> = {};
    for (const [projectId, tier] of Object.entries(parsed)) {
      if (typeof projectId === 'string' && isProjectCatalogTier(tier)) {
        next[projectId] = tier;
      }
    }
    return next;
  } catch {
    return {};
  }
};

/**
 * Persists per-project section overrides to localStorage.
 */
export const writeStoredProjectSectionOverrides = (
  overrides: Record<string, ProjectCatalogTier>,
): void => {
  try {
    localStorage.setItem(PROJECT_SECTION_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore quota / private mode
  }
};
