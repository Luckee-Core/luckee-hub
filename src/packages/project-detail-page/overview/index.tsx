'use client';

import { useAppSelector } from '@/store';
import { RepoLinks } from './repo-links';
import { SetupCards } from './setup-cards';

export const ProjectDetailOverview = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  return (
    <section className={styles.card}>
      <h1 className={styles.title}>{currentProject.name}</h1>
      <p className={styles.description}>{currentProject.description}</p>
      <SetupCards />
      <RepoLinks />
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-3`,
  title: `text-2xl font-bold text-gray-900`,
  description: `text-gray-600`,
};
