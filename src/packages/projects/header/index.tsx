import { ProjectsRefreshButton } from './buttons/refresh-projects';

export const ProjectsHeader = () => {
  return (
    <div className={styles.row}>
      <div>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>
          Luckee open-source apps — run dev servers, configure local databases, Cursor, and Chrome.
        </p>
      </div>
      <ProjectsRefreshButton />
    </div>
  );
};

const styles = {
  row: `
    flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
  `,
  title: `
    text-3xl font-bold text-gray-900
  `,
  subtitle: `
    mt-1 text-gray-600 max-w-2xl
  `,
};
