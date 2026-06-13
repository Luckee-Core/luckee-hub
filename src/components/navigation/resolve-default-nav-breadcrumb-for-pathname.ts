import { PROJECTS_PATH } from '@/config/routes';
import { getNavigationLinks } from './get-navigation-links';

export type DefaultNavBreadcrumb = {
  label: string;
  href?: string;
};

/**
 * Default breadcrumb from the active sidebar nav item.
 */
export const resolveDefaultNavBreadcrumbForPathname = (
  pathname: string,
): DefaultNavBreadcrumb | null => {
  for (const link of getNavigationLinks()) {
    if (link.href === PROJECTS_PATH) {
      if (pathname === PROJECTS_PATH || pathname.startsWith(`${PROJECTS_PATH}/`)) {
        return { label: link.name, href: link.href };
      }
      continue;
    }
    if (pathname === link.href || pathname.startsWith(`${link.href}/`)) {
      return { label: link.name, href: link.href };
    }
  }
  return null;
};
