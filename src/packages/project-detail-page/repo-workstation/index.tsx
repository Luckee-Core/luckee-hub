'use client';

import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectDetailBuilderActions } from '@/store/builders';
import { probeRepoEnvThunk } from '@/store/thunks/projects';
import { ProjectDetailLocalDatabase } from '../local-database';
import { SupabasePanel } from '../environment/supabase-panel';
import { RepoWorkstationDataPlane } from './data-plane';
import { RepoWorkstationEnvironment } from './environment';
import { RepoWorkstationHeader } from './header';
import { useRepoSetupSteps, type RepoSetupStep } from './setup-steps/use-repo-setup-steps';

/**
 * Single-repo workstation — repo header with setup overview, then a numbered walkthrough
 * (data plane → Supabase → local database → environment) for whichever steps apply.
 */
export const RepoWorkstation = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const { activeRepo } = useAppSelector((s) => s.projectDetailBuilder);

  const repo = useMemo(() => {
    if (!activeRepo) {
      return undefined;
    }
    return projectRepos.find(
      (r) =>
        r.projectId === currentProject.id &&
        r.role === activeRepo.role &&
        r.repoName === activeRepo.repoName,
    );
  }, [activeRepo, currentProject.id, projectRepos]);

  const steps = useRepoSetupSteps(repo);

  useEffect(() => {
    if (activeRepo) {
      void dispatch(probeRepoEnvThunk());
    }
  }, [activeRepo, dispatch]);

  if (!activeRepo || !repo) {
    return null;
  }

  const renderStep = (step: RepoSetupStep) => {
    switch (step.id) {
      case 'data-plane':
        return <RepoWorkstationDataPlane key={step.id} step={step} />;
      case 'supabase':
        return <SupabasePanel key={step.id} step={step} />;
      case 'local-database':
        return <ProjectDetailLocalDatabase key={step.id} step={step} />;
      case 'environment':
        return <RepoWorkstationEnvironment key={step.id} step={step} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.back}
        onClick={() => dispatch(ProjectDetailBuilderActions.setActiveRepo(null))}
      >
        <ArrowLeft className={styles.backIcon} aria-hidden />
        Back to repos
      </button>
      <RepoWorkstationHeader repo={repo} steps={steps} />
      {steps.map(renderStep)}
    </div>
  );
};

const styles = {
  root: `flex flex-col gap-4`,
  back: `
    self-start inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 cursor-pointer
  `,
  backIcon: `h-4 w-4`,
};
