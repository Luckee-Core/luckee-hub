import type { HubProjectRepo, HubProjectRepoType } from '@/model';

/**
 * Find a project repo row by project id and repo type.
 */
export const findProjectRepo = (
  repos: HubProjectRepo[],
  projectId: string,
  repoType: HubProjectRepoType,
): HubProjectRepo | undefined =>
  repos.find((repo) => repo.projectId === projectId && repo.repoType === repoType);

/**
 * Whether the project catalog includes a Next.js repo.
 */
export const projectHasWebRepo = (
  repos: HubProjectRepo[],
  projectId: string,
): boolean => !!findProjectRepo(repos, projectId, 'nextjs');
