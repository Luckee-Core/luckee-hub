'use client';

import { AlertTriangle, FolderOpen, Github } from 'lucide-react';
import { useState } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { HubProjectRepo } from '@/model';
import { useAppDispatch } from '@/store';
import { openRepoFolderThunk } from '@/store/thunks/projects';
import { getRepoRoleLabelForRepo } from '../../get-repo-role-label';
import { StatusDot } from '../../status';
import { workstationStepAnchorId, type RepoSetupStep } from '../setup-steps/use-repo-setup-steps';
import { CloneCopyButton } from './clone-copy-button';
import { DevServerControls } from './dev-server-controls';
import { StorageControls } from './storage-controls';

type RepoWorkstationHeaderProps = {
  repo: HubProjectRepo;
  steps: RepoSetupStep[];
};

/**
 * Repo header — mirrors the project summary panel: repo name, role, path, GitHub / Finder,
 * and a setup overview that links to each walkthrough step below.
 */
export const RepoWorkstationHeader = ({ repo, steps }: RepoWorkstationHeaderProps) => {
  const dispatch = useAppDispatch();
  const [finderError, setFinderError] = useState<string | null>(null);

  const doneCount = steps.filter((s) => s.status === 'ready').length;

  const openFinder = async () => {
    setFinderError(null);
    const status = await dispatch(openRepoFolderThunk(repo.role, repo.repoName));
    if (status !== 200) {
      setFinderError('Could not open this folder in Finder.');
    }
  };

  const scrollToStep = (step: RepoSetupStep) => {
    document
      .getElementById(workstationStepAnchorId(step.id))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={detailPageStyles.panel}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{repo.repoName}</h1>
            <span className={styles.roleBadge}>{getRepoRoleLabelForRepo(repo)}</span>
          </div>
          <p className={styles.path}>{repo.dirExists ? (repo.localDir ?? '—') : 'Not cloned yet'}</p>
        </div>
        <div className={styles.actions}>
          {repo.role === 'storage' ? <StorageControls cloned={repo.dirExists === true} /> : null}
          {repo.role === 'express' || repo.role === 'web' ? (
            <DevServerControls target={repo.role} cloned={repo.dirExists === true} />
          ) : null}
          {repo.repoUrl ? (
            <CloneCopyButton
              repoUrl={repo.repoUrl}
              className={styles.iconButton}
              iconClassName={styles.icon}
            />
          ) : null}
          {repo.repoUrl ? (
            <a
              href={repo.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconButton}
              aria-label="Open on GitHub"
              title="Open on GitHub"
            >
              <Github className={styles.icon} aria-hidden />
            </a>
          ) : null}
          <button
            type="button"
            className={styles.iconButton}
            disabled={!repo.dirExists}
            onClick={() => void openFinder()}
            aria-label="Open in Finder"
            title={repo.dirExists ? 'Open in Finder' : 'Clone the repo first'}
          >
            <FolderOpen className={styles.icon} aria-hidden />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {!repo.dirExists ? (
          <div className={styles.banner} role="status">
            <AlertTriangle className={styles.bannerIcon} aria-hidden />
            <span>Not cloned — run Setup in the project header to clone and install this repo.</span>
          </div>
        ) : null}
        {finderError ? <p className={detailPageStyles.errorText}>{finderError}</p> : null}

        {steps.length === 0 ? (
          <p className={styles.empty}>Nothing to set up for this repo.</p>
        ) : (
          <div className={styles.setup}>
            <p className={detailPageStyles.sectionTitle}>
              Setup · {doneCount} of {steps.length} done
            </p>
            <ol className={styles.stepList}>
              {steps.map((step) => (
                <li key={step.id}>
                  <button
                    type="button"
                    className={styles.stepChip}
                    onClick={() => scrollToStep(step)}
                    title={step.detail}
                  >
                    <span className={styles.stepNumber}>{step.number}</span>
                    {step.title}
                    <StatusDot status={step.status} />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

const styles = {
  titleBlock: `min-w-0 flex-1`,
  titleRow: `flex flex-wrap items-center gap-2`,
  title: `text-base font-semibold text-gray-900 tracking-tight break-all`,
  roleBadge: `shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700`,
  path: `font-mono text-xs text-gray-500 mt-1 break-all`,
  actions: `flex flex-wrap items-center gap-2`,
  iconButton: `
    inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white
    text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer
    disabled:opacity-40 disabled:cursor-not-allowed
  `,
  icon: `h-4 w-4`,
  body: `px-4 py-3 flex flex-col gap-3`,
  banner: `
    flex flex-wrap items-center gap-2 rounded border border-amber-200 bg-amber-50
    px-3 py-2 text-xs text-amber-900
  `,
  bannerIcon: `h-3.5 w-3.5 shrink-0`,
  empty: `text-xs text-gray-500`,
  setup: `flex flex-col gap-2`,
  stepList: `flex flex-wrap items-center gap-1.5 list-none`,
  stepChip: `
    inline-flex items-center gap-2 rounded border border-gray-200 bg-white px-2 py-1
    text-xs font-medium text-gray-800 hover:border-gray-300 hover:bg-gray-50 cursor-pointer
  `,
  stepNumber: `
    flex h-4 w-4 items-center justify-center rounded-full bg-gray-100
    text-[10px] font-semibold text-gray-600
  `,
};
