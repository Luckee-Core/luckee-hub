'use client';

import { Check, Circle } from 'lucide-react';
import { useMemo } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';
import { probeSupabaseConfigThunk } from '@/store/thunks/projects';
import type { RepoSetupStep } from '../../repo-workstation/setup-steps/use-repo-setup-steps';
import { WorkstationStep } from '../../repo-workstation/step';
import { SupabaseEditKeysModal } from './edit-keys-modal';
import { SupabaseKeysForm } from './keys-form';

type SupabaseCheck = {
  title: string;
  detail: string;
  ok: boolean;
};

type SupabasePanelProps = {
  step: RepoSetupStep;
};

/**
 * Supabase env + schema — a walkthrough step on the API Express workstation. Inline form until
 * keys are configured, then a checklist with an Edit keys modal; then a check that the
 * expected tables exist (via the service key). Hub never asks for the DB password.
 * Required before Run.
 */
export const SupabasePanel = ({ step }: SupabasePanelProps) => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const supabaseProbes = useAppSelector((s) => s.supabaseProbes);
  const projectsBuilder = useAppSelector((s) => s.projectsBuilder);

  const probe = supabaseProbes[id];
  const isBusy = projectsBuilder.supabaseLoadStatus === 'loading';
  const isSaving = isBusy && projectsBuilder.supabaseOperation === 'save';
  const configured = probe?.configured === true;
  const schemaReady = probe?.schemaReady === true;
  const editing = configured && projectsBuilder.supabaseEditing;

  const checks = useMemo(
    (): SupabaseCheck[] => [
      { title: 'SUPABASE_URL', detail: 'Project URL', ok: probe?.hasSupabaseUrl === true },
      {
        title: 'SUPABASE_SERVICE_KEY',
        detail: 'Service role key (or SUPABASE_SERVICE_ROLE_KEY)',
        ok: probe?.hasServiceKey === true,
      },
    ],
    [probe?.hasSupabaseUrl, probe?.hasServiceKey],
  );

  const missingTables = probe?.missingTables ?? [];
  const tablesDetail = !configured
    ? 'Checked once the keys above are saved.'
    : probe?.schemaCheckError
      ? probe.schemaCheckError
      : schemaReady
        ? `All expected tables exist${probe?.expectedTables?.length ? ` (${probe.expectedTables.join(', ')})` : ''}.`
        : `Missing ${missingTables.join(', ')}.`;

  const canSave =
    !isBusy &&
    projectsBuilder.supabaseUrl.trim().length > 0 &&
    projectsBuilder.supabaseServiceKey.trim().length > 0;

  return (
    <WorkstationStep
      step={step}
      actions={
        configured ? (
          <button
            type="button"
            className={detailPageStyles.secondaryButton}
            onClick={() => dispatch(ProjectsBuilderActions.setSupabaseEditing(true))}
          >
            Edit keys
          </button>
        ) : null
      }
    >
      <div className={styles.root}>
        <p className={styles.note}>
          Required before Run. Hub writes these to this repo&apos;s .env only
          {probe?.expressEnvPath ? (
            <>
              {' — '}
              <code className={styles.code}>{probe.expressEnvPath}</code>
            </>
          ) : null}
          .
        </p>
        {/* While the Edit keys modal is open it shows the error itself. */}
        {projectsBuilder.supabaseError && !editing ? (
          <p className={detailPageStyles.errorText} role="alert">
            {projectsBuilder.supabaseError}
          </p>
        ) : null}
        {projectsBuilder.supabaseSaveMessage ? (
          <p className={detailPageStyles.successText}>{projectsBuilder.supabaseSaveMessage}</p>
        ) : null}

        <div className={styles.subStep}>
          <p className={styles.subStepTitle}>
            {configured ? (
              <Check className={styles.iconOk} aria-hidden />
            ) : (
              <Circle className={styles.iconPending} aria-hidden />
            )}
            a. Add your Supabase keys
          </p>
          {!probe ? (
            <p className={styles.note}>Reading .env…</p>
          ) : !configured ? (
            <div className={styles.inlineForm}>
              <SupabaseKeysForm
                actions={
                  <div className={styles.formActions}>
                    <button type="submit" className={detailPageStyles.primaryButton} disabled={!canSave}>
                      {isSaving ? 'Saving…' : 'Save to .env'}
                    </button>
                  </div>
                }
              />
            </div>
          ) : (
            <ul className={styles.checklist}>
              {checks.map((check) => (
                <li key={check.title} className={styles.checkRow}>
                  {check.ok ? (
                    <Check className={styles.iconOk} aria-hidden />
                  ) : (
                    <Circle className={styles.iconPending} aria-hidden />
                  )}
                  <code className={styles.keyName}>{check.title}</code>
                  <span className={styles.detail}>{check.detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.subStep}>
          <div className={styles.schemaRow}>
            <div className={styles.schemaText}>
              <p className={styles.subStepTitle}>
                {schemaReady ? (
                  <Check className={styles.iconOk} aria-hidden />
                ) : (
                  <Circle className={styles.iconPending} aria-hidden />
                )}
                b. Create the tables
              </p>
              <p className={probe?.schemaCheckError ? detailPageStyles.errorText : styles.note}>
                {tablesDetail}
              </p>
              {configured && !schemaReady && !probe?.schemaCheckError && probe?.bootstrapSql ? (
                <p className={styles.note}>
                  Run <code className={styles.code}>{probe.bootstrapSql}</code> in the Supabase SQL
                  editor, then check again.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className={detailPageStyles.secondaryButton}
              disabled={isBusy || !configured}
              onClick={() => void dispatch(probeSupabaseConfigThunk(id))}
            >
              {isBusy && !isSaving ? 'Checking…' : 'Check again'}
            </button>
          </div>
        </div>
      </div>
      <SupabaseEditKeysModal />
    </WorkstationStep>
  );
};

const styles = {
  root: `flex flex-col gap-4`,
  code: `font-mono text-[11px] break-all`,
  note: `text-xs text-gray-500`,
  subStep: `flex flex-col gap-3 border-t border-gray-200 pt-4 first-of-type:border-t-0 first-of-type:pt-0`,
  subStepTitle: `flex items-center gap-2 text-sm font-medium text-gray-900`,
  inlineForm: `max-w-xl`,
  formActions: `flex flex-wrap items-center gap-2 pt-1`,
  checklist: `divide-y divide-gray-200 rounded border border-gray-200`,
  checkRow: `flex items-center gap-2 px-3 py-2`,
  iconOk: `h-3.5 w-3.5 text-green-600 shrink-0`,
  iconPending: `h-3.5 w-3.5 text-gray-300 shrink-0`,
  keyName: `font-mono text-xs text-gray-800 w-48 shrink-0 truncate`,
  detail: `text-xs text-gray-500 truncate`,
  schemaRow: `flex flex-wrap items-center justify-between gap-3`,
  schemaText: `min-w-0 space-y-0.5`,
};
