'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';

export const GmailSendAsEmailInput = () => {
  const dispatch = useAppDispatch();
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  return (
    <div className={styles.section}>
      <div className={styles.left}>
        <label className={styles.label} htmlFor="hub-gmail-send-as-email">
          Send-as email
        </label>
        <input
          id="hub-gmail-send-as-email"
          name="hub-gmail-send-as-email"
          type="email"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
          placeholder="you@yourdomain.com"
          value={projectsBuilder.gmailSendAsEmail}
          onChange={(e) => dispatch(ProjectsBuilderActions.setGmailSendAsEmail(e.target.value))}
          className={styles.input}
        />
      </div>
      <ol className={styles.steps}>
        <li className={styles.step}>Use the Gmail address the service account may send as</li>
        <li className={styles.step}>Must match domain-wide delegation setup in Google Workspace</li>
        <li className={styles.step}>Saved as GMAIL_SEND_AS_EMAIL</li>
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
