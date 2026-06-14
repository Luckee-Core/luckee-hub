import type { ProjectHookCheck } from '@/model';

type ProjectHookStatusChecklistProps = {
  checks: ProjectHookCheck[];
};

export const ProjectHookStatusChecklist = ({ checks }: ProjectHookStatusChecklistProps) => {
  if (checks.length === 0) {
    return null;
  }

  return (
    <ul className={styles.list}>
      {checks.map((check) => (
        <li key={check.id} className={styles.item}>
          <span className={check.ok ? styles.iconOk : styles.iconPending} aria-hidden>
            {check.ok ? '✓' : '○'}
          </span>
          <span className={check.ok ? styles.labelOk : styles.labelPending}>{check.label}</span>
        </li>
      ))}
    </ul>
  );
};

const styles = {
  list: `space-y-1.5`,
  item: `flex items-center gap-2 text-sm`,
  iconOk: `text-green-600 font-semibold w-4 text-center`,
  iconPending: `text-gray-400 w-4 text-center`,
  labelOk: `text-gray-800`,
  labelPending: `text-gray-500`,
};
