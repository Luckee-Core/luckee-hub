import type { HubProjectRepo } from '@/model';
import type { DetailStatus } from './detail-status';

/**
 * Repos are ready when every checkout exists and has dependencies installed.
 */
export const getReposStatus = (repos: HubProjectRepo[]): DetailStatus => {
  if (repos.length === 0) {
    return 'attention';
  }
  return repos.every((repo) => repo.dirExists && repo.depsInstalled) ? 'ready' : 'attention';
};
