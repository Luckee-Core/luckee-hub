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
import { PROJECT_DETAIL_PAGE_PATH, PROJECTS_PATH } from '@/config';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { useAppDispatch, useAppSelector } from '@/store';

const SIDEBAR_VISIBLE_KEY = 'luckee-hub-sidebar-visible';

const getStoredSidebarVisible = (): boolean => {
  try {
    return localStorage.getItem(SIDEBAR_VISIBLE_KEY) !== 'false';
  } catch {
    return true;
  }
};

type AppLayoutProps = {
  children: ReactNode;
  terminalDock?: ReactNode;
  headerEndContent?: ReactNode;
};

export const AppLayout = ({ children, terminalDock, headerEndContent }: AppLayoutProps) => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const pathname = usePathname();

  useLayoutEffect(() => {
    setIsSidebarVisible(getStoredSidebarVisible());
  }, []);

  useLayoutEffect(() => {
    // Pathname changes reset stale trails — but detail opens set the trail in
    // setCurrentProjectThunk *before* navigate, so re-apply after reset.
    if (pathname === PROJECT_DETAIL_PAGE_PATH && currentProject.id) {
      dispatch(
        BreadcrumbBuilderActions.setTrail({
          base: { label: 'Projects', href: PROJECTS_PATH },
          segments: [{ kind: 'plainText', label: currentProject.name }],
        }),
      );
      return;
    }
    dispatch(BreadcrumbBuilderActions.reset());
  }, [dispatch, pathname, currentProject.id, currentProject.name]);

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
    setIsSidebarVisible((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.appShell}>
      {isSidebarVisible ? <Sidebar /> : null}
      <div className={styles.mainColumn}>
        <AppLayoutHeader
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems}
          endContent={headerEndContent}
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
    flex flex-1 min-h-0 min-w-0 overflow-y-auto p-3
  `,
  inner: `
    w-full
  `,
};
