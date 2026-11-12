import type { HubProjectRepo, ProjectEnvProbe } from '@/model';
import { buildEnvProbeKey } from '@/store/dumps/envProbes';

import type { DetailStatus } from './detail-status';

/**
 * Status dot for a repo card on the Repos tab.
 */
export const getRepoCardStatus = (
  repo: HubProjectRepo,
  envProbes: Record<string, ProjectEnvProbe | undefined>,
): DetailStatus => {
  if (repo.dirExists === false) {
    return 'attention';
  }
  if (repo.depsInstalled === false) {
    return 'attention';
  }

  const probe = envProbes[buildEnvProbeKey(repo.projectId, repo.role, repo.repoName)];
  if (!probe) {
    return 'checking';
  }
  if (!probe.cloned) {
    return 'attention';
  }

  const missingRequired = probe.sections.some((section) =>
    section.keys.some((k) => k.required && !k.present),
  );
  if (missingRequired) {
    return 'attention';
  }

  return 'ready';
};
