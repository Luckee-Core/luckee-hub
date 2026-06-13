import type { HubProject } from '@/model';
import { ProjectsHookStatusBadge } from '@/packages/projects';

type ProjectDetailOverviewProps = {
  project: HubProject;
};

export const ProjectDetailOverview = ({ project }: ProjectDetailOverviewProps) => {
  return (
    <section className={styles.card}>
      <h1 className={styles.title}>{project.name}</h1>
      <p className={styles.description}>{project.description}</p>
      <div className={styles.meta}>
        <ProjectsHookStatusBadge hookStatus={project.hookStatus} />
        <span className={styles.metaItem}>API :{project.apiPort}</span>
        {project.apiOnly ? (
          <span className={styles.metaItem}>Web: API only</span>
        ) : project.webUrl ? (
          <span className={styles.metaItem}>Web: {project.webUrl}</span>
        ) : null}
      </div>
      {project.paths ? (
        <dl className={styles.paths}>
          {project.paths.expressDir ? (
            <div>
              <dt className={styles.pathLabel}>Express</dt>
              <dd className={styles.pathValue}>{project.paths.expressDir}</dd>
            </div>
          ) : null}
          {project.paths.webDir ? (
            <div>
              <dt className={styles.pathLabel}>Web</dt>
              <dd className={styles.pathValue}>{project.paths.webDir}</dd>
            </div>
          ) : null}
        </dl>
      ) : null}
    </section>
  );
};

const styles = {
  card: `bg-white border border-gray-300 rounded p-6 space-y-3`,
  title: `text-2xl font-bold text-gray-900`,
  description: `text-gray-600`,
  meta: `flex flex-wrap items-center gap-3`,
  metaItem: `text-sm text-gray-500 font-mono`,
  paths: `space-y-2 text-sm`,
  pathLabel: `font-semibold text-gray-700`,
  pathValue: `font-mono text-gray-600 break-all`,
};
