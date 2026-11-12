import type { HubProjectRepoRole } from '@/model';

export const REPO_ROLE_ORDER: Record<HubProjectRepoRole, number> = {
  express: 0,
  storage: 1,
  dispatcher: 2,
  web: 3,
  console: 4,
  'dispatcher-web': 5,
  mobile: 6,
};
