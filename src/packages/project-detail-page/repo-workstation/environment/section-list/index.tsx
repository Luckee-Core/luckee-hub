'use client';

import { Check } from 'lucide-react';
import { useMemo } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { buildEnvProbeKey } from '@/store/dumps/envProbes';
import { selectEnvSectionThunk } from '@/store/thunks/projects';
import { isEnvSectionComplete } from '../../../status';

type SectionRow = {
  id: string;
  title: string;
  complete: boolean;
};

/**
 * Numbered list of env sections — the walkthrough inside the Environment step.
 */
export const EnvSectionList = () => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector((s) => s.currentProject.id);
  const { activeRepo, activeEnvSectionId } = useAppSelector((s) => s.projectDetailBuilder);
  const envProbes = useAppSelector((s) => s.envProbes);

  const rows = useMemo((): SectionRow[] => {
    if (!activeRepo) {
      return [];
    }
    const probe = envProbes[buildEnvProbeKey(projectId, activeRepo.role, activeRepo.repoName)];
    if (!probe) {
      return [];
    }
    return probe.sections.map((section) => ({
      id: section.id,
      title: section.title,
      complete: isEnvSectionComplete(section),
    }));
  }, [activeRepo, envProbes, projectId]);

  return (
    <nav className={styles.nav} aria-label="Env sections">
      <ol className={styles.list}>
        {rows.map((row, index) => {
          const isActive = row.id === activeEnvSectionId;
          return (
            <li key={row.id}>
              <button
                type="button"
                className={isActive ? styles.itemActive : styles.item}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => dispatch(selectEnvSectionThunk(row.id))}
              >
                <span className={row.complete ? styles.numberDone : styles.number} aria-hidden>
                  {row.complete ? <Check className={styles.check} /> : index + 1}
                </span>
                <span className={styles.label}>{row.title}</span>
                <span className={styles.srOnly}>{row.complete ? 'complete' : 'to do'}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const styles = {
  nav: `md:border-r md:border-gray-200 md:pr-2`,
  list: `flex flex-col gap-0.5 list-none`,
  item: `
    w-full flex items-center gap-2 rounded px-2 py-2 text-left text-sm
    text-gray-700 hover:bg-gray-50 cursor-pointer
  `,
  itemActive: `
    w-full flex items-center gap-2 rounded px-2 py-2 text-left text-sm
    font-medium text-blue-700 bg-blue-50 cursor-pointer
  `,
  number: `
    flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300
    bg-white text-[10px] font-semibold text-gray-600
  `,
  numberDone: `
    flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-white
  `,
  check: `h-3 w-3`,
  label: `min-w-0 break-words`,
  srOnly: `sr-only`,
};
