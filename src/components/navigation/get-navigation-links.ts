import { DASHBOARD_PATH } from '@/config/routes';

export type NavigationRoute = {
  name: string;
  href: string;
};

/**
 * Flat sidebar nav links for breadcrumb resolution.
 */
export const getNavigationLinks = (): NavigationRoute[] => [
  { name: 'Studios', href: DASHBOARD_PATH },
];
