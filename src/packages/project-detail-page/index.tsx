'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { detailPageStyles } from '@/components/detail-page-styles';
import { DETAIL_PROJECT_SESSION_KEY, PROJECTS_PATH } from '@/config';
import { useAppDispatch, useAppSelector } from '@/store';
import { setCurrentProjectThunk } from '@/store/thunks/projects';
import { LuckeeParentRequiredModal } from '@/packages/projects/luckee-parent-modal';
import { ProjectSetupModal } from '@/packages/projects/project-setup-modal';
import { ProjectDetailOverview } from './overview';
import { ProjectDetailRepos } from './repos';
import { RepoWorkstation } from './repo-workstation';
import { ProjectDetailSummary } from './summary';
import { ProjectDetailTabs } from './tabs';

export const ProjectDetailPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projects = useAppSelector((s) => s.projects);
  const listLoadStatus = useAppSelector((s) => s.projectsBuilder.listLoadStatus);
  const { activeTab, activeRepo } = useAppSelector((s) => s.projectDetailBuilder);

  useEffect(() => {
    if (currentProject.id || listLoadStatus !== 'loaded') {
      return;
    }

    let storedId: string | null = null;
    try {
      storedId = sessionStorage.getItem(DETAIL_PROJECT_SESSION_KEY);
    } catch {
      storedId = null;
    }

    if (storedId && projects[storedId]) {
      void dispatch(setCurrentProjectThunk(storedId));
      return;
    }

    router.replace(PROJECTS_PATH);
  }, [currentProject.id, dispatch, listLoadStatus, projects, router]);

  if (!currentProject.id) {
    return null;
  }

  return (
    <>
      <LuckeeParentRequiredModal />
      <ProjectSetupModal />
      <div className={detailPageStyles.page}>
        <ProjectDetailSummary />
        {activeRepo ? (
          // A selected repo replaces the tabs: "Back to repos" sits directly under the project header.
          <RepoWorkstation />
        ) : (
          <div className={styles.tabs}>
            <ProjectDetailTabs />
            <div role="tabpanel" className={styles.tabPanel}>
              {activeTab === 'repos' ? <ProjectDetailRepos /> : <ProjectDetailOverview />}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  tabs: `flex flex-col gap-4`,
  tabPanel: `pt-4`,
};
