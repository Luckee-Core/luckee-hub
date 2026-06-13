import { PROJECTS_PATH } from '@/config/routes';

export type HubSidebarLink = {
  name: string;
  href: string;
};

export type HubSidebarSection = {
  title: string;
  links: HubSidebarLink[];
};

/**
 * Dev Hub sidebar sections (flat nav).
 */
export const getHubSidebarSections = (): HubSidebarSection[] => [
  {
    title: '',
    links: [{ name: 'Projects', href: PROJECTS_PATH }],
  },
];
