import {
  getProjectEnvApi,
  saveProjectEnvApi,
} from '@/api/projects/client';
import type { AppThunk } from '@/store/store';
import { ProjectDetailBuilderActions } from '@/store/builders/projectDetailBuilder';
import { EnvProbesActions, buildEnvProbeKey } from '@/store/dumps/envProbes';

/**
 * Probe env for the active repo in project detail.
 */
export const probeRepoEnvThunk =
  (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    const activeRepo = getState().projectDetailBuilder.activeRepo;
    if (!projectId || !activeRepo) {
      return 400;
    }

    const res = await getProjectEnvApi(projectId, activeRepo.role, activeRepo.repoName);
    if (!res.success || !res.data) {
      return res.httpStatus === 400 ? 400 : 500;
    }

    dispatch(
      EnvProbesActions.setProbe({
        projectId,
        ...res.data,
      }),
    );

    const firstSection = res.data.sections[0];
    if (firstSection && !getState().projectDetailBuilder.activeEnvSectionId) {
      dispatch(ProjectDetailBuilderActions.setActiveEnvSectionId(firstSection.id));
      const values: Record<string, string> = {};
      for (const key of firstSection.keys) {
        if (!key.secret && key.value !== undefined) {
          values[key.key] = key.value;
        }
      }
      dispatch(
        ProjectDetailBuilderActions.fillEnvSectionFromProbe({
          sectionId: firstSection.id,
          values,
        }),
      );
    }

    return 200;
  };

/**
 * Select an env section in the active repo workstation and fill its form from the last probe.
 */
export const selectEnvSectionThunk =
  (sectionId: string): AppThunk<void> =>
  (dispatch, getState) => {
    dispatch(ProjectDetailBuilderActions.setActiveEnvSectionId(sectionId));
    const projectId = getState().currentProject.id;
    const activeRepo = getState().projectDetailBuilder.activeRepo;
    if (!projectId || !activeRepo) {
      return;
    }
    const probe = getState().envProbes[buildEnvProbeKey(projectId, activeRepo.role, activeRepo.repoName)];
    const section = probe?.sections.find((s) => s.id === sectionId);
    if (!section) {
      return;
    }
    const values: Record<string, string> = {};
    for (const key of section.keys) {
      if (!key.secret && key.value !== undefined) {
        values[key.key] = key.value;
      }
    }
    dispatch(ProjectDetailBuilderActions.fillEnvSectionFromProbe({ sectionId, values }));
  };

/**
 * Probe express repo env for repo card status (project open).
 */
export const probeExpressRepoEnvForProjectThunk =
  (projectId: string, repoName: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch) => {
    const res = await getProjectEnvApi(projectId, 'express', repoName);
    if (!res.success || !res.data) {
      return res.httpStatus === 400 ? 400 : 500;
    }
    dispatch(EnvProbesActions.setProbe({ projectId, ...res.data }));
    return 200;
  };

/**
 * Save the active env section for the active repo.
 */
export const saveActiveEnvSectionThunk =
  (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch, getState) => {
    const projectId = getState().currentProject.id;
    const { activeRepo, activeEnvSectionId, envSectionForms } = getState().projectDetailBuilder;
    if (!projectId || !activeRepo || !activeEnvSectionId) {
      return 400;
    }

    const probeKey = buildEnvProbeKey(projectId, activeRepo.role, activeRepo.repoName);
    const probe = getState().envProbes[probeKey];
    const section = probe?.sections.find((s) => s.id === activeEnvSectionId);
    const form = envSectionForms[activeEnvSectionId];
    if (!section || !form) {
      return 400;
    }

    const values: Record<string, string> = {};
    for (const [key, value] of Object.entries(form.values)) {
      const field = section.keys.find((k) => k.key === key);
      if (!value.trim()) {
        continue;
      }
      if (field?.secret || value !== (field?.value ?? '')) {
        values[key] = value.trim();
      }
    }

    dispatch(
      ProjectDetailBuilderActions.setEnvSectionStatus({
        sectionId: activeEnvSectionId,
        status: 'loading',
      }),
    );

    const res = await saveProjectEnvApi(
      projectId,
      activeRepo.role,
      activeRepo.repoName,
      values,
    );

    if (!res.success) {
      dispatch(
        ProjectDetailBuilderActions.setEnvSectionError({
          sectionId: activeEnvSectionId,
          error: res.error ?? 'Save failed',
        }),
      );
      dispatch(
        ProjectDetailBuilderActions.setEnvSectionStatus({
          sectionId: activeEnvSectionId,
          status: 'error',
        }),
      );
      return res.httpStatus === 400 ? 400 : 500;
    }

    const saved = res.data?.probe;
    if (saved) {
      dispatch(EnvProbesActions.setProbe({ projectId, ...saved }));
    }

    dispatch(
      ProjectDetailBuilderActions.setEnvSectionMessage({
        sectionId: activeEnvSectionId,
        message: res.data?.message ?? 'Saved',
      }),
    );
    dispatch(
      ProjectDetailBuilderActions.setEnvSectionStatus({
        sectionId: activeEnvSectionId,
        status: 'loaded',
      }),
    );
    return 200;
  };
