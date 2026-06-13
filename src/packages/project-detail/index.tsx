'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/app-layout';
import { PROJECTS_PATH } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store';
import { BreadcrumbBuilderActions } from '@/store/builders/breadcrumbBuilder';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';
import {
  loadProjectsThunk,
  probeLocalDatabaseThunk,
  syncTerminalSessionsThunk,
} from '@/store/thunks/projects';
import { TerminalDock } from '@/packages/terminal-dock';
import { ProjectDetailOverview } from './overview';
import { ProjectDetailLocalDatabase } from './local-database';
import { ProjectDetailActions } from './actions';

export const ProjectDetail = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentProjectDetail = useAppSelector((s) => s.currentProjectDetail);
  const projects = useAppSelector((s) => s.projects);

  const projectId = useMemo(() => currentProjectDetail.projectId, [currentProjectDetail]);
  const project = useMemo(
    () => (projectId ? projects[projectId] : undefined),
    [projectId, projects],
  );

  useEffect(() => {
    void dispatch(loadProjectsThunk({ live: true }));
    void dispatch(syncTerminalSessionsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!projectId) {
      dispatch(BreadcrumbBuilderActions.reset());
      return;
    }

    dispatch(
      BreadcrumbBuilderActions.setTrail({
        base: { label: 'Projects', href: PROJECTS_PATH },
        segments: [{ kind: 'plainText', label: project?.name ?? projectId }],
      }),
    );

    return () => {
      dispatch(BreadcrumbBuilderActions.reset());
    };
  }, [projectId, project?.name, dispatch]);

  useEffect(() => {
    if (!projectId) {
      router.replace(PROJECTS_PATH);
      return;
    }
    dispatch(ProjectsBuilderActions.resetLocalDatabaseState());
    void dispatch(probeLocalDatabaseThunk(projectId));
  }, [projectId, router, dispatch]);

  if (!projectId || !project) {
    return (
      <AppLayout>
        <p className={styles.message}>Loading project…</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout terminalDock={<TerminalDock />}>
      <div className={styles.page}>
        <ProjectDetailOverview project={project} />
        <ProjectDetailLocalDatabase project={project} />
        <ProjectDetailActions project={project} />
      </div>
    </AppLayout>
  );
};

const styles = {
  page: `w-full space-y-6`,
  message: `text-gray-600`,
};
