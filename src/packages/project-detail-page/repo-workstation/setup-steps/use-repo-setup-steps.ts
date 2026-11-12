'use client';

import { useMemo } from 'react';

import type { HubProjectRepo } from '@/model';
import { useAppSelector } from '@/store';
import { buildEnvProbeKey } from '@/store/dumps/envProbes';
import { getLocalDatabaseStatus, isEnvSectionComplete, type DetailStatus } from '../../status';

export type RepoSetupStepId = 'data-plane' | 'supabase' | 'local-database' | 'environment';

export type RepoSetupStep = {
  id: RepoSetupStepId;
  /** 1-based position in the walkthrough. */
  number: number;
  title: string;
  detail: string;
  status: DetailStatus;
};

/**
 * Ordered setup walkthrough for one repo workstation. Only steps that apply to this repo's role
 * and the project's registry config are returned; the header and each step card share this list.
 */
export const useRepoSetupSteps = (repo: HubProjectRepo | undefined): RepoSetupStep[] => {
  const project = useAppSelector((s) => s.currentProject);
  const dataPlaneProbes = useAppSelector((s) => s.dataPlaneProbes);
  const supabaseProbes = useAppSelector((s) => s.supabaseProbes);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);
  const envProbes = useAppSelector((s) => s.envProbes);
  const projectRepos = useAppSelector((s) => s.projectRepos);

  return useMemo(() => {
    if (!repo) {
      return [];
    }
    const steps: Omit<RepoSetupStep, 'number'>[] = [];
    const isExpress = repo.role === 'express';

    if (isExpress && project.dataPlane) {
      const probe = dataPlaneProbes[project.id];
      const active = project.dataPlane.options.find((o) => o.id === probe?.activeOptionId);
      steps.push({
        id: 'data-plane',
        title: 'Choose data plane',
        status: !probe ? 'checking' : active ? 'ready' : 'attention',
        detail: !probe
          ? 'Checking…'
          : active
            ? `Active: ${active.label}`
            : probe.value
              ? `${project.dataPlane.modeKey}=${probe.value} is not a known option — pick one`
              : 'Pick where this API reads and writes data',
      });
    }

    if (isExpress && project.supabaseSupported) {
      const probe = supabaseProbes[project.id];
      const missingKeys = probe
        ? [probe.hasSupabaseUrl, probe.hasServiceKey].filter((ok) => !ok).length
        : 0;
      const missingTables = probe?.missingTables ?? [];
      steps.push({
        id: 'supabase',
        title: 'Connect Supabase',
        status: !probe ? 'checking' : probe.configured && probe.schemaReady ? 'ready' : 'attention',
        detail: !probe
          ? 'Checking…'
          : !probe.configured
            ? `${missingKeys} of 2 keys missing`
            : probe.schemaCheckError
              ? 'Keys set — could not check tables'
              : probe.schemaReady
                ? 'Keys set and tables exist'
                : `Keys set — ${missingTables.length} table${missingTables.length === 1 ? '' : 's'} missing`,
      });
    }

    // Hub writes DATABASE_URL to the storage repo, or to API Express when the project has no storage repo.
    const hasStorageRepo = projectRepos.some((r) => r.projectId === project.id && r.role === 'storage');
    const ownsLocalDatabase = repo.role === 'storage' || (isExpress && !hasStorageRepo);
    if (ownsLocalDatabase && project.localDatabaseSupported) {
      const plane = project.dataPlane;
      const activeId = dataPlaneProbes[project.id]?.activeOptionId;
      const usesLocal = !plane || plane.options.find((o) => o.id === activeId)?.usesLocalDatabase === true;
      if (usesLocal) {
        const probe = localDatabaseProbes[project.id];
        const status = getLocalDatabaseStatus(probe);
        const setupSteps = probe?.setupSteps ?? [];
        const done = setupSteps.filter((s) => s.status === 'done' || s.status === 'skipped').length;
        steps.push({
          id: 'local-database',
          title: 'Set up local database',
          status,
          detail: !probe
            ? 'Checking…'
            : setupSteps.length
              ? `${done} of ${setupSteps.length} steps done`
              : status === 'ready'
                ? 'Postgres ready'
                : 'Postgres not ready',
        });
      }
    }

    if (repo.dirExists) {
      const probe = envProbes[buildEnvProbeKey(project.id, repo.role, repo.repoName)];
      const total = probe?.sections.length ?? 0;
      const complete = probe?.sections.filter(isEnvSectionComplete).length ?? 0;
      steps.push({
        id: 'environment',
        title: 'Fill in environment',
        status: !probe ? 'checking' : !probe.cloned ? 'attention' : complete === total ? 'ready' : 'attention',
        detail: !probe
          ? 'Reading .env…'
          : !probe.cloned
            ? (probe.message ?? 'Repo not cloned')
            : total === 0
              ? 'No .env.example keys'
              : `${complete} of ${total} sections complete`,
      });
    }

    return steps.map((step, index) => ({ ...step, number: index + 1 }));
  }, [repo, project, dataPlaneProbes, supabaseProbes, localDatabaseProbes, envProbes, projectRepos]);
};

export const workstationStepAnchorId = (id: RepoSetupStepId): string => `workstation-step-${id}`;
