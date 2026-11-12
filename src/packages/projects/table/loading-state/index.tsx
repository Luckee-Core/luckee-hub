import { Loader2 } from 'lucide-react';

const SKELETON_ROW_COUNT = 6;

export const ProjectsTableLoadingState = () => (
  <div className={styles.root} role="status" aria-live="polite">
    <div className={styles.banner}>
      <Loader2 className={styles.spinner} aria-hidden />
      <div>
        <p className={styles.title}>Loading projects</p>
        <p className={styles.subtitle}>Reading the project catalog from the hub server…</p>
      </div>
    </div>
    <div className={styles.rows} aria-hidden>
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <div key={index} className={styles.row}>
          <div className={styles.cellName} />
          <div className={styles.cellDescription} />
          <div className={styles.cellStatus} />
          <div className={styles.cellPort} />
        </div>
      ))}
    </div>
  </div>
);

const styles = {
  root: `
    bg-white rounded border border-gray-300 overflow-hidden
  `,
  banner: `
    flex items-center gap-3 px-4 py-3 border-b border-gray-300 bg-gray-50
  `,
  spinner: `
    h-5 w-5 shrink-0 text-blue-600 animate-spin
  `,
  title: `
    text-sm font-semibold text-gray-900
  `,
  subtitle: `
    text-xs text-gray-500
  `,
  rows: `
    animate-pulse
  `,
  row: `
    flex items-center gap-4 px-3 py-2.5 border-b border-gray-200 last:border-b-0
  `,
  cellName: `
    h-3 w-32 rounded bg-gray-200
  `,
  cellDescription: `
    h-3 flex-1 rounded bg-gray-100
  `,
  cellStatus: `
    h-4 w-16 rounded-full bg-gray-200
  `,
  cellPort: `
    h-3 w-10 rounded bg-gray-100
  `,
};
