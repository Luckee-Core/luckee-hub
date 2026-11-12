'use client';

import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store';
import { ProjectsBuilderActions } from '@/store/builders';
import { SupabaseKeysForm } from '../keys-form';

/**
 * Edit Supabase keys — opened from the Supabase step once keys are configured.
 * Open state is `projectsBuilder.supabaseEditing`; a successful save closes it (saveSupabaseConfigThunk).
 */
export const SupabaseEditKeysModal = () => {
  const dispatch = useAppDispatch();
  const { id } = useAppSelector((s) => s.currentProject);
  const probe = useAppSelector((s) => s.supabaseProbes[id]);
  const {
    supabaseEditing,
    supabaseError,
    supabaseLoadStatus,
    supabaseOperation,
    supabaseUrl,
    supabaseServiceKey,
  } = useAppSelector((s) => s.projectsBuilder);

  const isOpen = supabaseEditing && probe?.configured === true;
  const isSaving = supabaseLoadStatus === 'loading' && supabaseOperation === 'save';
  const canSave =
    !isSaving &&
    supabaseUrl.trim().length > 0 &&
    supabaseServiceKey.trim().length > 0;

  const close = () => {
    dispatch(ProjectsBuilderActions.setSupabaseEditing(false));
    dispatch(ProjectsBuilderActions.setSupabaseServiceKey(''));
    dispatch(ProjectsBuilderActions.setSupabaseError(null));
  };

  useEffect(() => {
    if (!isOpen || isSaving) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(ProjectsBuilderActions.setSupabaseEditing(false));
        dispatch(ProjectsBuilderActions.setSupabaseServiceKey(''));
        dispatch(ProjectsBuilderActions.setSupabaseError(null));
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [dispatch, isOpen, isSaving]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="supabase-edit-keys-title"
    >
      <div className={styles.card}>
        <h2 id="supabase-edit-keys-title" className={styles.title}>
          Edit Supabase keys
        </h2>
        <p className={styles.body}>
          Saving replaces the project URL and service role key in{' '}
          {probe?.expressEnvPath ? (
            <code className={styles.code}>{probe.expressEnvPath}</code>
          ) : (
            'the Express .env'
          )}
          . The current key is never shown — paste it again to save.
        </p>
        {supabaseError ? (
          <p className={styles.error} role="alert">
            {supabaseError}
          </p>
        ) : null}
        <SupabaseKeysForm
          actions={
            <div className={styles.actions}>
              <button type="submit" className={styles.primaryButton} disabled={!canSave}>
                {isSaving ? (
                  <>
                    <Loader2 className={`${styles.buttonIcon} animate-spin`} aria-hidden />
                    Saving…
                  </>
                ) : (
                  'Save to .env'
                )}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={isSaving}
                onClick={close}
              >
                Cancel
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  card: `
    w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-lg border border-gray-300 bg-white p-6
    shadow-xl space-y-4
  `,
  title: `text-lg font-semibold text-gray-900`,
  body: `text-sm text-gray-600 leading-relaxed`,
  code: `font-mono text-xs bg-gray-100 px-1 py-0.5 rounded break-all`,
  error: `text-sm text-red-600`,
  actions: `flex flex-col gap-2 pt-1`,
  primaryButton: `
    inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5
    text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60
  `,
  secondaryButton: `
    inline-flex w-full items-center justify-center rounded-md px-4 py-2.5
    text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50
    disabled:opacity-60
  `,
  buttonIcon: `h-4 w-4`,
};
