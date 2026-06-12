import { DevHubRefreshStudiosButton } from './buttons/refresh-studios';

export const DevHubHeader = () => {
  return (
    <div className={styles.row}>
      <div>
        <h1 className={styles.title}>Studios</h1>
        <p className={styles.subtitle}>
          Open-source Luckee studios — run dev servers, Cursor, and Chrome from one place.
        </p>
      </div>
      <DevHubRefreshStudiosButton />
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
