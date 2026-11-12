import type { HubProjectRepo, HubProjectRepoRole } from '@/model';

const ROLE_LABELS: Record<HubProjectRepoRole, string> = {
  web: 'Web',
  express: 'API Express',
  storage: 'Storage',
  console: 'Console',
  'dispatcher-web': 'Dispatcher web',
  dispatcher: 'Dispatcher',
  mobile: 'React Native',
};

/**
 * Human label for a repo role on the detail page.
 */
export const getRepoRoleLabel = (role: HubProjectRepoRole): string => ROLE_LABELS[role];

export const getRepoRoleLabelForRepo = (repo: HubProjectRepo): string =>
  getRepoRoleLabel(repo.role);
