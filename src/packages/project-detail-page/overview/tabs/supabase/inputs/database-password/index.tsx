'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';

const DASHBOARD_URL = 'https://supabase.com/dashboard';

export const DatabasePasswordInput = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <label className={styles.label} htmlFor="hub-supabase-db-password">
          Database password
        </label>
        <input
          id="hub-supabase-db-password"
          name="hub-supabase-db-password"
          type="password"
          autoComplete="new-password"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          placeholder="Database password from project creation"
          value={projectsBuilder.supabaseDatabasePassword}
          onChange={(e) =>
            dispatch(ProjectsBuilderActions.setSupabaseDatabasePassword(e.target.value))
          }
          className={styles.input}
        />
      </div>
      <ol className={styles.steps}>
        <li className={styles.step}>
          Open the{' '}
          <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
            Supabase Dashboard
          </a>
        </li>
        <li className={styles.step}>Select your project</li>
        <li className={styles.step}>Open Project Settings → Database</li>
        <li className={styles.step}>
          Use the password you set at project creation, or reset it there and paste the new value
        </li>
      </ol>
    </div>
  );
};

const styles = {
  section: `
    grid gap-4 items-start rounded border border-gray-300 bg-white p-4
    md:grid-cols-2
  `,
  left: `flex flex-col gap-1.5 min-w-0`,
  label: `text-sm font-medium text-gray-700`,
  input: `
    w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-orange-400/40
  `,
  steps: `
    list-decimal list-outside pl-4 space-y-1
    text-xs text-gray-500 leading-relaxed
  `,
  step: `pl-0.5`,
  link: `text-orange-700 underline underline-offset-2 hover:text-orange-800`,
};
