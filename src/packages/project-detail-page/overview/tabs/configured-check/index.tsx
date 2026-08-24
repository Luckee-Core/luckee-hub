'use client';

type ConfiguredCheckProps = {
  title: string;
  ok: boolean;
  detail: string;
};

/**
 * Read-only check row when an express env key is already present.
 */
export const ConfiguredCheck = ({ title, ok, detail }: ConfiguredCheckProps) => (
  <div className={styles.section}>
    <div className={styles.row}>
      <span className={ok ? styles.iconOk : styles.iconPending} aria-hidden>
        {ok ? '✓' : '○'}
      </span>
      <div className={styles.text}>
        <p className={ok ? styles.titleOk : styles.titlePending}>{title}</p>
        <p className={styles.detail}>{detail}</p>
      </div>
    </div>
  </div>
);

const styles = {
  section: `rounded border border-gray-300 bg-white p-4`,
  row: `flex items-start gap-3`,
  iconOk: `text-green-600 font-semibold text-lg shrink-0 leading-none mt-0.5`,
  iconPending: `text-gray-400 text-lg shrink-0 leading-none mt-0.5`,
  text: `min-w-0 space-y-0.5`,
  titleOk: `text-sm font-medium text-gray-900`,
  titlePending: `text-sm font-medium text-gray-500`,
  detail: `text-xs text-gray-500`,
};
