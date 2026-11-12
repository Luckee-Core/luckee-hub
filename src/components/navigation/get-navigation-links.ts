import { PROJECTS_PATH, SETTINGS_PATH } from '@/config/routes';

export type NavigationRoute = {
  name: string;
  href: string;
};

/**
 * Flat sidebar nav links for breadcrumb resolution.
 */
export const getNavigationLinks = (): NavigationRoute[] => [
  { name: 'Projects', href: PROJECTS_PATH },
  { name: 'Settings', href: SETTINGS_PATH },
];
