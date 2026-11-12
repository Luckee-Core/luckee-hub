'use client';

import { useMemo } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProjectEnvSection } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store';
import { saveActiveEnvSectionThunk, selectEnvSectionThunk } from '@/store/thunks/projects';
import { buildEnvProbeKey } from '@/store/dumps/envProbes';
import { isEnvSectionComplete } from '../../../status';
import { getGeneralSectionIntro } from '../get-general-section-intro';
import { EnvKeyField } from '../key-field';

type EnvSectionPanelProps = {
  section: ProjectEnvSection;
};

export const EnvSectionPanel = ({ section }: EnvSectionPanelProps) => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector((s) => s.currentProject.id);
  const projectRepos = useAppSelector((s) => s.projectRepos);
  const { activeRepo } = useAppSelector((s) => s.projectDetailBuilder);
  const form = useAppSelector((s) => s.projectDetailBuilder.envSectionForms[section.id]);
  const envProbes = useAppSelector((s) => s.envProbes);
  const getEnvProbe = () =>
    activeRepo ? envProbes[buildEnvProbeKey(projectId, activeRepo.role, activeRepo.repoName)] : undefined;
  const isBusy = form?.status === 'loading';

  const activeRepoRow = useMemo(() => {
    if (!activeRepo) {
      return undefined;
    }
    return projectRepos.find(
      (r) =>
        r.projectId === projectId &&
        r.role === activeRepo.role &&
        r.repoName === activeRepo.repoName,
    );
  }, [activeRepo, projectId, projectRepos]);

  /** Next section after this one that still needs values (wraps around), if any. */
  const findNextIncompleteSectionId = (): string | null => {
    if (!activeRepo) {
      return null;
    }
    const probe = getEnvProbe();
    const sections = probe?.sections ?? [];
    const start = sections.findIndex((s) => s.id === section.id);
    for (let offset = 1; offset < sections.length; offset += 1) {
      const candidate = sections[(start + offset) % sections.length];
      if (!isEnvSectionComplete(candidate)) {
        return candidate.id;
      }
    }
    return null;
  };

  const saveAndContinue = async () => {
    const status = await dispatch(saveActiveEnvSectionThunk());
    if (status !== 200) {
      return;
    }
    const nextId = findNextIncompleteSectionId();
    if (nextId) {
      dispatch(selectEnvSectionThunk(nextId));
    }
  };

  const generalIntro =
    section.id === 'general' && activeRepo
      ? getGeneralSectionIntro(
          activeRepo.role,
          activeRepo.repoName,
          activeRepoRow?.defaultApiPort ?? activeRepoRow?.defaultWebPortStart,
        )
      : null;

  const requiredKeys = useMemo(
    () => section.keys.filter((k) => !k.optional),
    [section.keys],
  );
  const optionalKeys = useMemo(
    () => section.keys.filter((k) => k.optional),
    [section.keys],
  );

  return (
    <div className={styles.root}>
      <h3 className={detailPageStyles.panelTitle}>{section.title}</h3>
      {generalIntro ? <p className={styles.context}>{generalIntro}</p> : null}
      {section.description ? <p className={styles.description}>{section.description}</p> : null}
      {form?.error ? (
        <p className={detailPageStyles.errorText} role="alert">
          {form.error}
        </p>
      ) : null}
      {form?.message ? <p className={detailPageStyles.successText}>{form.message}</p> : null}

      <form
        className={styles.form}
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          void dispatch(saveActiveEnvSectionThunk());
        }}
      >
        {requiredKeys.map((key) => (
          <EnvKeyField
            key={key.key}
            sectionId={section.id}
            envKey={key.key}
            secret={key.secret}
            present={key.present}
            placeholder={key.placeholder}
            disabled={isBusy}
          />
        ))}
        {optionalKeys.length > 0 ? (
          <div className={styles.optionalBlock}>
            <p className={styles.optionalTitle}>Optional</p>
            {optionalKeys.map((key) => (
              <EnvKeyField
                key={key.key}
                sectionId={section.id}
                envKey={key.key}
                secret={key.secret}
                present={key.present}
                placeholder={key.placeholder}
                disabled={isBusy}
              />
            ))}
          </div>
        ) : null}
        <div className={styles.actions}>
          <button
            type="button"
            className={detailPageStyles.primaryButton}
            disabled={isBusy}
            onClick={() => void saveAndContinue()}
          >
            {isBusy ? 'Saving…' : 'Save & continue'}
          </button>
          <button type="submit" className={detailPageStyles.secondaryButton} disabled={isBusy}>
            Save section
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  root: `flex flex-col gap-3`,
  context: `
    text-sm text-gray-700 rounded-md border border-gray-200 bg-gray-50 px-3 py-2
  `,
  description: `text-sm text-gray-600`,
  form: `flex flex-col gap-4`,
  optionalBlock: `flex flex-col gap-3 pt-2 border-t border-gray-100`,
  actions: `flex flex-wrap items-center gap-2`,
  optionalTitle: `text-xs font-semibold uppercase tracking-wide text-gray-500`,
};
