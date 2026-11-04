'use client';

import { useAppSelector } from '@/store';
import { LocalDatabaseActions } from './actions';
import { DatabaseUrl } from './database-url';
import { LocalDatabaseMessages } from './messages';
import { LocalDatabaseSetupSteps } from './setup-steps';

export const ProjectDetailLocalDatabase = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  if (!currentProject.localDatabaseSupported) {
    return null;
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Local database</h2>
      <p className={styles.subtitle}>
        Hub runs each setup step from this page — install/start Postgres, create the database,
        apply migrations, and write <code className={styles.code}>DATABASE_URL</code> to the
        storage-express repo <code className={styles.code}>.env</code> (migrations live in that
        checkout).
      </p>
      <LocalDatabaseMessages />
      <LocalDatabaseSetupSteps />
      <DatabaseUrl />
      <LocalDatabaseActions />
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-3`,
  title: `text-lg font-semibold text-gray-900`,
  subtitle: `text-sm text-gray-600`,
  code: `text-xs bg-gray-100 px-1 rounded font-mono`,
};
