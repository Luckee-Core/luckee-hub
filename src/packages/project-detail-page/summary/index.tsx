'use client';

import { AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { ProjectsHookStatusBadge } from '@/packages/projects';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectDetailBuilderActions } from '@/store/builders';
import { SummaryActions } from './actions';
import { SummaryStatusChips } from './status-chips';

/**
 * Detail summary panel — name, status, description, runtime chips, and project actions.
 */
export const ProjectDetailSummary = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const supabaseProbes = useAppSelector((s) => s.supabaseProbes);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  const supabaseBlocking = useMemo(() => {
    if (!currentProject.supabaseSupported) {
      return false;
    }
    return supabaseProbes[currentProject.id]?.configured !== true;
  }, [currentProject.supabaseSupported, currentProject.id, supabaseProbes]);

  const openSupabase = () => {
    const expressRepo = projectRepos.find(
      (r) => r.projectId === currentProject.id && r.role === 'express',
    );
    dispatch(ProjectDetailBuilderActions.setActiveTab('repos'));
    if (expressRepo) {
      dispatch(
        ProjectDetailBuilderActions.setActiveRepo({
          role: 'express',
          repoName: expressRepo.repoName,
        }),
      );
    }
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{currentProject.name}</h1>
            <ProjectsHookStatusBadge hookStatus={currentProject.hookStatus} />
          </div>
          {currentProject.description ? (
            <p className={styles.description}>{currentProject.description}</p>
          ) : null}
        </div>
        <SummaryActions supabaseBlocking={supabaseBlocking} />
      </div>
      <div className={styles.body}>
        <SummaryStatusChips />
        {supabaseBlocking ? (
          <div className={styles.banner} role="status">
            <AlertTriangle className={styles.bannerIcon} aria-hidden />
            <span>Run is disabled until Supabase is configured in the Express .env.</span>
            <button type="button" className={styles.bannerLink} onClick={openSupabase}>
              Configure Supabase
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  titleBlock: `min-w-0 flex-1`,
  titleRow: `flex flex-wrap items-center gap-2`,
  title: `text-base font-semibold text-gray-900 tracking-tight`,
  description: `text-sm text-gray-600 mt-1 max-w-3xl`,
  body: `px-4 py-3 flex flex-col gap-3`,
  banner: `
    flex flex-wrap items-center gap-2 rounded border border-amber-200 bg-amber-50
    px-3 py-2 text-xs text-amber-900
  `,
  bannerIcon: `h-3.5 w-3.5 shrink-0`,
  bannerLink: `
    font-semibold underline underline-offset-2 hover:text-amber-950 cursor-pointer
  `,
};
