'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { buildEnvProbeKey } from '@/store/dumps/envProbes';
import type { RepoSetupStep } from '../setup-steps/use-repo-setup-steps';
import { WorkstationStep } from '../step';
import { EnvSectionList } from './section-list';
import { EnvSectionPanel } from './env-section-panel';

type RepoWorkstationEnvironmentProps = {
  step: RepoSetupStep;
};

export const RepoWorkstationEnvironment = ({ step }: RepoWorkstationEnvironmentProps) => {
  const projectId = useAppSelector((s) => s.currentProject.id);
  const { activeRepo, activeEnvSectionId } = useAppSelector((s) => s.projectDetailBuilder);
  const envProbes = useAppSelector((s) => s.envProbes);

  const probe = useMemo(() => {
    if (!activeRepo) {
      return undefined;
    }
    return envProbes[buildEnvProbeKey(projectId, activeRepo.role, activeRepo.repoName)];
  }, [activeRepo, envProbes, projectId]);

  const activeSection = useMemo(
    () => probe?.sections.find((s) => s.id === activeEnvSectionId),
    [probe, activeEnvSectionId],
  );

  const content = (() => {
    if (!probe) {
      return <p className={styles.note}>Loading environment…</p>;
    }
    if (!probe.cloned) {
      return <p className={styles.note}>{probe.message ?? 'Repo not cloned.'}</p>;
    }
    if (probe.sections.length === 0) {
      return <p className={styles.note}>No .env keys found for this repo.</p>;
    }
    return (
      <>
        <p className={styles.note}>
          Work through each section from <code className={styles.code}>.env.example</code> and save it to
          {' '}
          <code className={styles.code}>{probe.envPath ?? '.env'}</code>. Secrets are written to disk only
          and never shown back.
        </p>
        <div className={styles.grid}>
          <EnvSectionList />
          <div className={styles.panel}>
            {activeSection ? <EnvSectionPanel section={activeSection} /> : null}
          </div>
        </div>
      </>
    );
  })();

  return <WorkstationStep step={step}>{content}</WorkstationStep>;
};

const styles = {
  grid: `grid md:grid-cols-[15rem_1fr] gap-4 pt-4`,
  panel: `min-w-0`,
  note: `text-xs text-gray-500`,
  code: `font-mono text-[11px] break-all`,
};
