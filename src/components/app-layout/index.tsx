'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import {
  AppLayoutHeader,
  type AppLayoutBreadcrumb,
  useResolvedDashboardBreadcrumbs,
} from '@/components/app-layout-header';
import { resolveDefaultNavBreadcrumbForPathname } from '@/components/navigation/resolve-default-nav-breadcrumb-for-pathname';
import { Sidebar } from '@/components/sidebar';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { useAppDispatch } from '@/store';

const SIDEBAR_EXPANDED_KEY = 'luckee-hub-sidebar-visible';

const getStoredSidebarExpanded = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  try {
    const stored = localStorage.getItem(SIDEBAR_EXPANDED_KEY);
    if (stored === null) {
      return false;
    }
    return stored === 'true';
  } catch {
    return false;
  }
};

type AppLayoutProps = {
  children: ReactNode;
  terminalDock?: ReactNode;
};

export const AppLayout = ({ children, terminalDock }: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(getStoredSidebarExpanded);
  const pathname = usePathname();

  useLayoutEffect(() => {
    dispatch(BreadcrumbBuilderActions.reset());
  }, [dispatch, pathname]);

  const defaultNavCrumb = useMemo(
    () => resolveDefaultNavBreadcrumbForPathname(pathname),
    [pathname],
  );

  const navOnlyBreadcrumbItems = useMemo((): AppLayoutBreadcrumb[] => {
    if (!defaultNavCrumb) {
      return [];
    }
    return [{ label: defaultNavCrumb.label, href: defaultNavCrumb.href }];
  }, [defaultNavCrumb]);

  const reduxBreadcrumbItems = useResolvedDashboardBreadcrumbs();

  const breadcrumbItems = useMemo(
    () => (reduxBreadcrumbItems.length > 0 ? reduxBreadcrumbItems : navOnlyBreadcrumbItems),
    [reduxBreadcrumbItems, navOnlyBreadcrumbItems],
  );

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.appShell}>
      <Sidebar collapsed={!isSidebarExpanded} />
      <div className={styles.mainColumn}>
        <AppLayoutHeader
          isSidebarExpanded={isSidebarExpanded}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems}
        />
        <div className={styles.content}>
          <div className={styles.inner}>{children}</div>
        </div>
        {terminalDock}
      </div>
    </div>
  );
};

const styles = {
  appShell: `
    flex h-screen overflow-hidden bg-gray-50
  `,
  mainColumn: `
    flex flex-1 flex-col min-h-0 min-w-0 overflow-hidden
  `,
  content: `
    flex flex-1 min-h-0 min-w-0 overflow-y-auto p-2
  `,
  inner: `
    w-full
  `,
};
