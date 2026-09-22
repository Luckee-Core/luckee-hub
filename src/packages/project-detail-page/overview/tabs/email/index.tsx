'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';
import { buildExpressEnvProbeKey } from '@/store/dumps/expressEnvProbes';
import { saveEmailEnvThunk } from '@/store/thunks/projects';
import { ConfiguredCheck } from '../configured-check';
import {
  EmailOpenTrackingBaseUrlInput,
  GmailFromNameInput,
  GmailSendAsEmailInput,
  GmailServiceAccountJsonPathInput,
} from './inputs';

const GROUP_ID = 'email';

/**
 * Email tab — probed on project open after Supabase; read-only when configured.
 */
export const EmailTab = () => {
  const dispatch = useAppDispatch();
  const currentProject = useAppSelector((s) => s.currentProject);
  const expressEnvProbes = useAppSelector((s) => s.expressEnvProbes);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const probeKey = useMemo(
    () => buildExpressEnvProbeKey(currentProject.id, GROUP_ID),
    [currentProject.id],
  );
  const probe = useMemo(() => expressEnvProbes[probeKey], [expressEnvProbes, probeKey]);
  const isBusy = projectsBuilder.expressEnvLoadStatus === 'loading';
  const configured = probe?.configured === true;
  const showForm = !configured || projectsBuilder.emailEnvEditing;

  const statusLabel = useMemo(() => {
    if (projectsBuilder.expressEnvLoadStatus === 'loading' && !probe) {
      return 'Checking…';
    }
    if (!probe) {
      return 'Not checked';
    }
    if (configured) {
      return 'Good to go';
    }
    const missing = probe.keysPresent
      ? Object.entries(probe.keysPresent)
          .filter(([, present]) => !present)
          .map(([key]) => key)
      : [];
    return missing.length > 0 ? `Missing: ${missing.join(', ')}` : 'Not configured';
  }, [probe, configured, projectsBuilder.expressEnvLoadStatus]);

  const canSave = useMemo(() => {
    const hasValue =
      projectsBuilder.gmailServiceAccountJsonPath.trim().length > 0 ||
      projectsBuilder.gmailSendAsEmail.trim().length > 0 ||
      projectsBuilder.gmailFromName.trim().length > 0 ||
      projectsBuilder.emailOpenTrackingBaseUrl.trim().length > 0;
    return hasValue && !isBusy;
  }, [
    projectsBuilder.gmailServiceAccountJsonPath,
    projectsBuilder.gmailSendAsEmail,
    projectsBuilder.gmailFromName,
    projectsBuilder.emailOpenTrackingBaseUrl,
    isBusy,
  ]);

  if (!currentProject.expressEnvGroupIds.includes(GROUP_ID)) {
    return null;
  }

  if (!showForm) {
    return (
      <div className={styles.root}>
        <div className={styles.statusRow}>
          <span className={styles.badgeOk}>{statusLabel}</span>
          {probe?.expressEnvPath ? (
            <span className={styles.envHint}>
              In <code className={styles.code}>{probe.expressEnvPath}</code>
            </span>
          ) : null}
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => dispatch(ProjectsBuilderActions.setEmailEnvEditing(true))}
          >
            Edit
          </button>
        </div>

        <ConfiguredCheck
          title="Service account JSON path"
          ok={probe?.keysPresent?.GMAIL_SERVICE_ACCOUNT_JSON_PATH === true}
          detail="GMAIL_SERVICE_ACCOUNT_JSON_PATH is set in Express .env"
        />
        <ConfiguredCheck
          title="Send-as email"
          ok={probe?.keysPresent?.GMAIL_SEND_AS_EMAIL === true}
          detail="GMAIL_SEND_AS_EMAIL is set in Express .env"
        />
        <ConfiguredCheck
          title="From name"
          ok={probe?.keysPresent?.GMAIL_FROM_NAME === true}
          detail="GMAIL_FROM_NAME is set in Express .env"
        />
        <ConfiguredCheck
          title="Open tracking base URL"
          ok={probe?.keysPresent?.EMAIL_OPEN_TRACKING_BASE_URL === true}
          detail="EMAIL_OPEN_TRACKING_BASE_URL is set in Express .env"
        />
      </div>
    );
  }

  return (
    <form
      className={styles.root}
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        void dispatch(saveEmailEnvThunk());
      }}
    >
      <div className={styles.honeypot} aria-hidden>
        <input type="text" name="username" autoComplete="username" tabIndex={-1} />
        <input type="password" name="password" autoComplete="current-password" tabIndex={-1} />
      </div>

      <div className={styles.statusRow}>
        <span className={configured ? styles.badgeOk : styles.badgeWarn}>{statusLabel}</span>
        {probe?.expressEnvPath ? (
          <span className={styles.envHint}>
            Writes to <code className={styles.code}>{probe.expressEnvPath}</code>
          </span>
        ) : null}
        {configured ? (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => dispatch(ProjectsBuilderActions.setEmailEnvEditing(false))}
          >
            Cancel
          </button>
        ) : null}
      </div>

      {projectsBuilder.expressEnvError ? (
        <p className={styles.error} role="alert">
          {projectsBuilder.expressEnvError}
        </p>
      ) : null}
      {projectsBuilder.expressEnvSaveMessage ? (
        <p className={styles.success}>{projectsBuilder.expressEnvSaveMessage}</p>
      ) : null}

      {!probe && isBusy ? (
        <p className={styles.envHint}>Reading Express .env…</p>
      ) : (
        <>
          <GmailServiceAccountJsonPathInput />
          <GmailSendAsEmailInput />
          <GmailFromNameInput />
          <EmailOpenTrackingBaseUrlInput />

          <button type="submit" className={styles.saveBtn} disabled={!canSave}>
            {isBusy ? 'Saving…' : 'Save to Express .env'}
          </button>
        </>
      )}
    </form>
  );
};

const styles = {
  root: `space-y-4`,
  honeypot: `absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0`,
  statusRow: `flex flex-wrap items-center gap-x-3 gap-y-1`,
  badgeOk: `text-xs font-medium text-green-800`,
  badgeWarn: `text-xs font-medium text-amber-900`,
  envHint: `text-xs text-gray-500`,
  code: `text-xs font-mono bg-gray-100 px-1 rounded`,
  error: `text-sm text-red-700`,
  success: `text-sm text-green-800`,
  editBtn: `
    ml-auto text-xs font-medium text-gray-700 underline underline-offset-2
    cursor-pointer hover:text-gray-900
  `,
  cancelBtn: `
    ml-auto text-xs font-medium text-gray-500 underline underline-offset-2
    cursor-pointer hover:text-gray-800
  `,
  saveBtn: `
    inline-flex items-center justify-center rounded bg-gray-900 text-white text-sm font-medium
    px-4 py-2 cursor-pointer hover:bg-gray-800
    disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed
  `,
};
