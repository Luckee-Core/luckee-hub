'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';

export const GmailFromNameInput = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <label className={styles.label} htmlFor="hub-gmail-from-name">
          From name
        </label>
        <input
          id="hub-gmail-from-name"
          name="hub-gmail-from-name"
          type="text"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          placeholder="Your Company"
          value={projectsBuilder.gmailFromName}
          onChange={(e) => dispatch(ProjectsBuilderActions.setGmailFromName(e.target.value))}
          className={styles.input}
        />
      </div>
      <ol className={styles.steps}>
        <li className={styles.step}>Display name recipients see in the From header</li>
        <li className={styles.step}>Saved as GMAIL_FROM_NAME in Express .env</li>
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
