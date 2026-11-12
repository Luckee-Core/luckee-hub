'use client';

import { useAppSelector } from '@/store';
import type { RepoSetupStep } from '../repo-workstation/setup-steps/use-repo-setup-steps';
import { WorkstationStep } from '../repo-workstation/step';
import { LocalDatabaseActions } from './actions';
import { DatabaseUrl } from './database-url';
import { LocalDatabaseMessages } from './messages';
import { LocalDatabaseSetupSteps } from './setup-steps';

type ProjectDetailLocalDatabaseProps = {
  step: RepoSetupStep;
};

/**
 * Local database walkthrough step (Storage workstation) — Postgres setup steps run from Hub,
 * plus the resulting DATABASE_URL.
 */
export const ProjectDetailLocalDatabase = ({ step }: ProjectDetailLocalDatabaseProps) => {
  const currentProject = useAppSelector((s) => s.currentProject);

  if (!currentProject.localDatabaseSupported) {
    return null;
  }

  return (
    <WorkstationStep step={step} actions={<LocalDatabaseActions />}>
      <div className={styles.body}>
        <p className={styles.note}>
          Install and start Postgres, create the database, apply migrations from the storage repo,
          and write <code className={styles.code}>DATABASE_URL</code> to its .env.
        </p>
        <LocalDatabaseMessages />
        <LocalDatabaseSetupSteps />
        <DatabaseUrl />
      </div>
    </WorkstationStep>
  );
};

const styles = {
  note: `text-xs text-gray-500`,
  code: `font-mono text-[11px]`,
  body: `space-y-4`,
};
