import {
  isHubProjectActive,
  isHubProjectAlmostReady,
  isHubProjectFinalSteps,
  isHubProjectWorkInProgress,
} from '@/config/hub-project-availability';

/** Launcher table tier (excludes Running / Favorites). */
export type ProjectCatalogTier =
  | 'active'
  | 'finalSteps'
  | 'almostReady'
  | 'workInProgress';

export const PROJECT_CATALOG_TIER_LABELS: Record<ProjectCatalogTier, string> = {
  active: 'Active',
  finalSteps: 'Final steps',
  almostReady: 'Almost ready',
  workInProgress: 'Work in progress',
};

/**
 * Resolves catalog tier from admin override or default hub lists.
 */
export const getProjectCatalogTier = (
  projectId: string,
  overrides: Record<string, ProjectCatalogTier>,
): ProjectCatalogTier => {
  const override = overrides[projectId];
  if (override) {
    return override;
  }
  if (isHubProjectActive(projectId)) {
    return 'active';
  }
  if (isHubProjectFinalSteps(projectId)) {
    return 'finalSteps';
  }
  if (isHubProjectAlmostReady(projectId)) {
    return 'almostReady';
  }
  if (isHubProjectWorkInProgress(projectId)) {
    return 'workInProgress';
  }
  return 'almostReady';
};
