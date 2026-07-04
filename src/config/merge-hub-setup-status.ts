import type { HubProject, HubProjectRepo } from '@/model';
import type { HubCatalogProjectRow } from './build-hub-startup-state';

/**
 * Combine static catalog rows with Express probe results.
 */
export const mergeHubProjectSetup = (
  catalog: HubCatalogProjectRow[],
  probed: HubProject[],
): HubProject[] =>
  catalog.flatMap((project) => {
    const status = probed.find((row) => row.id === project.id);
    if (!status) {
      return [];
    }

    return [
      {
        ...project,
        hookStatus: status.hookStatus,
        enabled: status.enabled,
        webUrl: status.webUrl,
        paths: status.paths,
        postgresActiveConsumer: status.postgresActiveConsumer,
      },
    ];
  });

/**
 * Overlay Express probe results onto static catalog repos.
 */
export const mergeHubRepoSetup = (
  catalog: HubProjectRepo[],
  probed: HubProjectRepo[],
): HubProjectRepo[] =>
  catalog.map((repo) => {
    const status = probed.find(
      (row) => row.projectId === repo.projectId && row.repoType === repo.repoType,
    );
    if (!status) {
      return repo;
    }

    return {
      ...repo,
      localDir: status.localDir,
      dirExists: status.dirExists,
      depsInstalled: status.depsInstalled,
    };
  });
