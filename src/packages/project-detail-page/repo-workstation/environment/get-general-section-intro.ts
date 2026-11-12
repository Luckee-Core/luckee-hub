import type { HubProjectRepoRole } from '@/model';

/**
 * Short copy for the General env section — what the user is configuring on this repo role.
 */
export const getGeneralSectionIntro = (
  role: HubProjectRepoRole,
  repoName: string,
  catalogPort?: number,
): string => {
  const portHint =
    catalogPort !== undefined
      ? ` Hub’s catalog port for this repo is ${catalogPort}.`
      : '';

  switch (role) {
    case 'express':
      return `Local API settings for ${repoName}. PORT is what this Express process listens on when you Run from Projects — keep it aligned with the Runtime card above and avoid clashing with other apps on your machine.${portHint} NODE_ENV is typically development while you work locally.`;
    case 'storage':
      return `Local settings for the storage server (${repoName}). PORT and connection-related values here should match how you reach Postgres and how the API repo’s data plane is configured.`;
    case 'web':
    case 'console':
      return `Frontend settings for ${repoName}. These are read when you start the Next.js (or console) dev server — usually public URLs and feature flags, not database secrets.`;
    case 'dispatcher':
      return `Gateway/dispatcher settings for ${repoName}. PORT and gate secrets must match how other repos route through this dispatcher in studio or local setups.`;
    default:
      return `Baseline variables for ${repoName}. Change only what you need for local run; other sections cover integrations and optional features.`;
  }
};
