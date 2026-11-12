'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { setDataPlaneThunk } from '@/store/thunks/projects';
import type { RepoSetupStep } from '../setup-steps/use-repo-setup-steps';
import { WorkstationStep } from '../step';

type RepoWorkstationDataPlaneProps = {
  step: RepoSetupStep;
};

export const RepoWorkstationDataPlane = ({ step }: RepoWorkstationDataPlaneProps) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((s) => s.currentProject);
  const probe = useAppSelector((s) => s.dataPlaneProbes[project.id]);

  if (!project.dataPlane) {
    return null;
  }

  const activeId = probe?.activeOptionId ?? null;

  return (
    <WorkstationStep step={step}>
      <p className={styles.note}>
        Sets <code className={styles.code}>{project.dataPlane.modeKey}</code> in this repo&apos;s .env.
        Environment sections for other modes are hidden.
      </p>
      <div className={styles.options}>
        {project.dataPlane.options.map((option) => {
          const isActive = option.id === activeId;
          return (
            <button
              key={option.id}
              type="button"
              className={isActive ? styles.optionActive : styles.option}
              aria-pressed={isActive}
              onClick={() => void dispatch(setDataPlaneThunk(option.id))}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </WorkstationStep>
  );
};

const styles = {
  note: `text-xs text-gray-500 mb-3`,
  code: `font-mono text-[11px]`,
  options: `flex flex-wrap gap-2`,
  option: `
    rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700
    hover:bg-gray-50 cursor-pointer
  `,
  optionActive: `
    rounded border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700
    cursor-pointer
  `,
};
