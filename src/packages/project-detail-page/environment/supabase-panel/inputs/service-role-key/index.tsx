'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';

const DASHBOARD_URL = 'https://supabase.com/dashboard';
const API_KEYS_DOCS_URL = 'https://supabase.com/docs/guides/getting-started/api-keys';

export const ServiceRoleKeyInput = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <label className={styles.label} htmlFor="hub-supabase-service-key">
          Service role key
        </label>
        <input
          id="hub-supabase-service-key"
          name="hub-supabase-service-key"
          type="text"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          spellCheck={false}
          placeholder="service_role secret"
          value={projectsBuilder.supabaseServiceKey}
          onChange={(e) => dispatch(ProjectsBuilderActions.setSupabaseServiceKey(e.target.value))}
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
        <li className={styles.step}>
          Open Project Settings →{' '}
          <a
            href={API_KEYS_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            API Keys
          </a>
        </li>
        <li className={styles.step}>
          Reveal and copy the service_role secret (or a secret key) — never use this in the browser
        </li>
      </ol>
    </div>
  );
};

const styles = {
  section: `flex flex-col gap-1.5`,
  left: `flex flex-col gap-1.5 min-w-0`,
  label: `text-xs font-semibold text-gray-800`,
  input: `
    w-full rounded border border-gray-300 bg-white px-2.5 py-1.5
    text-sm text-gray-900 font-mono placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  `,
  steps: `
    list-decimal list-outside pl-4 space-y-0.5
    text-xs text-gray-500 leading-relaxed
  `,
  step: `pl-0.5`,
  link: `text-blue-600 underline-offset-2 hover:underline hover:text-blue-700`,
};
