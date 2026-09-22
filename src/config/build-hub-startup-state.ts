import type { HubProjectRepo } from '@/model';
import { HUB_CATALOG, HUB_GITHUB_ORG, type HubCatalogProject } from './hub-catalog';

export type HubCatalogProjectRow = Pick<
  HubCatalogProject,
  | 'id'
  | 'name'
  | 'description'
  | 'localDatabaseSupported'
  | 'supabaseSupported'
  | 'expressEnvGroupIds'
> & {
  apiPort: number;
};

const toGithubRepoUrl = (repoName: string): string =>
  `https://github.com/${HUB_GITHUB_ORG}/${repoName}`;

const getExpressApiPort = (entry: HubCatalogProject): number =>
  entry.repos.find((repo) => repo.repoType === 'express')?.defaultApiPort ?? 0;

/**
 * Static project rows from the hardcoded catalog (no probe/status fields).
 */
export const buildHubCatalogProjects = (): HubCatalogProjectRow[] =>
  HUB_CATALOG.map((entry) => ({
    id: entry.id,
    name: entry.name,
    description: entry.description,
    apiPort: getExpressApiPort(entry),
    localDatabaseSupported: entry.localDatabaseSupported,
    supabaseSupported: entry.supabaseSupported,
    expressEnvGroupIds: entry.expressEnvGroupIds,
  }));

/**
 * Static repo rows from the hardcoded catalog (no probe/status fields).
 */
export const buildHubCatalogRepos = (): HubProjectRepo[] =>
  HUB_CATALOG.flatMap((entry) =>
    entry.repos.map((repo) => ({
      projectId: entry.id,
      repoType: repo.repoType,
      repoName: repo.repoName,
      repoUrl: toGithubRepoUrl(repo.repoName),
      defaultApiPort: repo.defaultApiPort,
      defaultWebPortStart: repo.defaultWebPortStart,
      healthPath: repo.healthPath,
    })),
  );
