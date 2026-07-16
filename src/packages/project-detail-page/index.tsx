'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { PROJECTS_PATH } from '@/config';
import { useAppDispatch, useAppSelector } from '@/store';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import {
  loadHubConfigThunk,
  loadProjectsThunk,
  probeLocalDatabaseThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/projects';
import { TerminalDock } from '@/packages/terminal-dock';
import { LuckeeParentRequiredModal } from '@/packages/projects/luckee-parent-modal';
import { ProjectSetupModal } from '@/packages/projects/project-setup-modal';
import { ProjectDetailOverview } from './overview';
import { ProjectDetailLocalDatabase } from './local-database';
import { ProjectDetailActions } from './actions';

/**
 * Project detail workspace — reads `currentProject` (ADR 008).
 */
export const ProjectDetailPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);

  useEffect(() => {
    const load = async (): Promise<void> => {
      await dispatch(loadHubConfigThunk());
      await dispatch(loadProjectsThunk({ live: true }));
    };
    void load();
  }, [dispatch]);

  useEffect(() => {
    if (!currentProject.id) {
      dispatch(BreadcrumbBuilderActions.reset());
      return;
    }

    dispatch(
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Projects', href: PROJECTS_PATH },
        segments: [{ kind: 'plainText', label: currentProject.name }],
      }),
    );

    return () => {
      dispatch(BreadcrumbBuilderActions.reset());
    };
  }, [currentProject.id, currentProject.name, dispatch]);

  useEffect(() => {
    if (!currentProject.id) {
      router.replace(PROJECTS_PATH);
      return;
    }
    dispatch(ProjectsBuilderActions.resetLocalDatabaseState());
    void dispatch(probeLocalDatabaseThunk(currentProject.id));
  }, [currentProject.id, router, dispatch]);

  if (!currentProject.id) {
    return (
      <AppLayout>
        <p className={styles.message}>Loading project…</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout terminalDock={<TerminalDock />}>
      <LuckeeParentRequiredModal />
      <ProjectSetupModal />
      <div className={styles.page}>
        <ProjectDetailOverview />
        <ProjectDetailLocalDatabase />
        <ProjectDetailActions />
      </div>
    </AppLayout>
  );
};

const styles = {
  page: `w-full space-y-6`,
  message: `text-gray-600`,
};
