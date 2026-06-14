'use client';

import { useAppSelector } from '@/store';
import { ProjectHookStatusChecklist } from './hook-status-checklist';

export const ProjectDetailOverview = () => {
  const currentProject = useAppSelector((s) => s.currentProject);

  return (
    <section className={styles.card}>
      <h1 className={styles.title}>{currentProject.name}</h1>
      <p className={styles.description}>{currentProject.description}</p>
      <ProjectHookStatusChecklist checks={currentProject.hookChecks} />
      <div className={styles.links}>
        {!currentProject.webOnly && currentProject.apiRepoUrl ? (
          <a
            href={currentProject.apiRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Express
          </a>
        ) : null}
        {!currentProject.apiOnly && currentProject.webRepoUrl ? (
          <a
            href={currentProject.webRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Next.js
          </a>
        ) : null}
      </div>
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-3`,
  title: `text-2xl font-bold text-gray-900`,
  description: `text-gray-600`,
  links: `flex flex-wrap gap-2`,
  link: `
    rounded px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300
    hover:bg-gray-200
  `,
};
