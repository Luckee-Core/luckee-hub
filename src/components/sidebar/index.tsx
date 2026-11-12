'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { BrandLogo } from '@/components/brand-logo';
import { getNavigationLinks } from '@/components/navigation/get-navigation-links';
import { PROJECT_DETAIL_PAGE_PATH, PROJECTS_PATH } from '@/config/routes';

/**
 * Primary hub navigation (layout matches my-ops-tracker-web).
 */
export const Sidebar = () => {
  const pathname = usePathname();
  const navigationLinks = useMemo(() => getNavigationLinks(), []);

  const isLinkActive = useCallback(
    (href: string): boolean => {
      if (href === PROJECTS_PATH) {
        return (
          pathname === PROJECTS_PATH ||
          pathname.startsWith(`${PROJECTS_PATH}/`) ||
          pathname.startsWith(PROJECT_DETAIL_PAGE_PATH)
        );
      }
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <aside className={styles.sidebar}>
      <div className={styles.inner}>
        <Link href={PROJECTS_PATH} className={styles.brandPanel}>
          <BrandLogo className={styles.logoMark} />
          <div className={styles.brandTextGroup}>
            <span className={styles.logoText}>Luckee Dev Hub</span>
            <span className={styles.logoHint}>A LUCKEE APP</span>
          </div>
        </Link>

        <nav className={styles.navigation} aria-label="Primary">
          <p className={styles.navLabel}>Navigation</p>
          <ul className={styles.menuList}>
            {navigationLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <li key={link.href} className={styles.menuItem}>
                  <Link
                    href={link.href}
                    className={`${styles.menuButton} ${
                      isActive ? styles.menuButtonActive : styles.menuButtonInactive
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: `
    relative flex h-screen w-[15.5rem] shrink-0 flex-col
    border-r border-gray-300 bg-white overflow-y-auto
  `,
  inner: `
    flex h-full flex-1 flex-col gap-4 p-3
  `,
  brandPanel: `
    flex items-center gap-2.5 rounded border border-gray-300 bg-gray-50 px-3 py-2.5
  `,
  logoMark: `h-8 w-auto shrink-0`,
  brandTextGroup: `
    flex min-w-0 flex-col
  `,
  logoText: `
    text-sm font-semibold text-gray-900 tracking-tight truncate
  `,
  logoHint: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  navigation: `
    flex-1 overflow-y-auto
  `,
  navLabel: `
    mb-2 px-2 text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  menuList: `
    flex flex-col gap-0.5
  `,
  menuItem: `
    group relative
  `,
  menuButton: `
    flex flex-1 items-center gap-2 rounded px-2.5 py-2 text-xs font-medium
    text-gray-700 transition-colors cursor-pointer
    hover:bg-gray-50 hover:text-gray-900
  `,
  menuButtonActive: `
    bg-gray-100 text-gray-900 font-semibold
    ring-1 ring-inset ring-gray-300
  `,
  menuButtonInactive: `
    bg-transparent
  `,
};
