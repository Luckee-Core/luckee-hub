import {
  isHubProjectActive,
  isHubProjectAlmostReady,
  isHubProjectCancelled,
  isHubProjectFinalSteps,
  isHubProjectWorkInProgress,
} from '@/config/hub-project-availability';

/** Launcher table tier (excludes Running / Favorites). */
export type ProjectCatalogTier =
  | 'active'
  | 'finalSteps'
  | 'almostReady'
  | 'workInProgress'
  | 'comingSoon'
  | 'cancelled';

export const PROJECT_CATALOG_TIER_LABELS: Record<ProjectCatalogTier, string> = {
  active: 'Active',
  finalSteps: 'Final steps',
  almostReady: 'Almost ready',
  workInProgress: 'Work in progress',
  comingSoon: 'Coming soon',
  cancelled: 'Cancelled',
};

/** Dropdown / pipeline order for the temp admin Section control. */
export const PROJECT_CATALOG_TIER_OPTIONS: ProjectCatalogTier[] = [
  'active',
  'finalSteps',
  'almostReady',
  'workInProgress',
  'comingSoon',
  'cancelled',
];

export const isProjectCatalogTierRowSelectable = (tier: ProjectCatalogTier): boolean =>
  tier !== 'comingSoon' && tier !== 'cancelled';

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
  if (isHubProjectCancelled(projectId)) {
    return 'cancelled';
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
  return 'comingSoon';
};
