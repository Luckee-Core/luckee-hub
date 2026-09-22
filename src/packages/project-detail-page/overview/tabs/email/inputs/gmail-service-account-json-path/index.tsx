'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';

const GCP_SERVICE_ACCOUNT_URL =
  'https://cloud.google.com/iam/docs/service-accounts-create#creating';

export const GmailServiceAccountJsonPathInput = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <label className={styles.label} htmlFor="hub-gmail-sa-json-path">
          Service account JSON path
        </label>
        <input
          id="hub-gmail-sa-json-path"
          name="hub-gmail-sa-json-path"
          type="text"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          placeholder="/path/to/service-account.json"
          value={projectsBuilder.gmailServiceAccountJsonPath}
          onChange={(e) =>
            dispatch(ProjectsBuilderActions.setGmailServiceAccountJsonPath(e.target.value))
          }
          className={styles.input}
        />
      </div>
      <ol className={styles.steps}>
        <li className={styles.step}>
          Create a GCP service account with Gmail API — see{' '}
          <a
            href={GCP_SERVICE_ACCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            GCP docs
          </a>
        </li>
        <li className={styles.step}>Download the JSON key to a safe path on this machine</li>
        <li className={styles.step}>Enter the absolute path (not the file contents)</li>
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
    w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 font-mono
    focus:outline-none focus:ring-2 focus:ring-orange-400/40
  `,
  steps: `
    list-decimal list-outside pl-4 space-y-1
    text-xs text-gray-500 leading-relaxed
  `,
  step: `pl-0.5`,
  link: `text-orange-700 underline underline-offset-2 hover:text-orange-800`,
};
