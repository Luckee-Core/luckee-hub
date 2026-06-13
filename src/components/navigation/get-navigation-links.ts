import { PROJECTS_PATH } from '@/config/routes';

export type NavigationRoute = {
  name: string;
  href: string;
};

/**
 * Flat sidebar nav links for breadcrumb resolution.
 */
export const getNavigationLinks = (): NavigationRoute[] => [
  { name: 'Projects', href: PROJECTS_PATH },
];
