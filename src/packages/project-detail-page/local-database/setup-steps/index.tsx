'use client';

import { useMemo } from 'react';

import { useAppSelector } from '@/store';
import { SetupStepRow } from './setup-step-row';

export const LocalDatabaseSetupSteps = () => {
  const { id, localDatabaseSupported } = useAppSelector((s) => s.currentProject);
  const localDatabaseProbes = useAppSelector((s) => s.localDatabaseProbes);

  const probe = useMemo(() => localDatabaseProbes[id], [localDatabaseProbes, id]);
  const steps = useMemo(() => probe?.setupSteps ?? [], [probe?.setupSteps]);

  if (!localDatabaseSupported || !probe?.supported || steps.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Setup steps</h3>
      <ol className={styles.list}>
        {steps.map((step, index) => (
          <SetupStepRow key={step.id} step={step} index={index} />
        ))}
      </ol>
    </div>
  );
};

const styles = {
  container: `space-y-2`,
  heading: `text-sm font-medium text-gray-800`,
  list: `space-y-2 list-none`,
};
