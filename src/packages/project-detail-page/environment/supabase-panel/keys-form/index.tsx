'use client';

import type { ReactNode } from 'react';

import { useAppDispatch } from '@/store';
import { saveSupabaseConfigThunk } from '@/store/thunks/projects';
import { ProjectUrlInput, ServiceRoleKeyInput } from '../inputs';

type SupabaseKeysFormProps = {
  /** Submit / cancel buttons — styled by the caller (inline step vs modal). */
  actions: ReactNode;
};

/**
 * Supabase project URL and service role key — shared by the inline first-time form and
 * the Edit keys modal. Submitting saves to the Express .env via saveSupabaseConfigThunk.
 */
export const SupabaseKeysForm = ({ actions }: SupabaseKeysFormProps) => {
  const dispatch = useAppDispatch();

  return (
    <form
      className={styles.form}
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        void dispatch(saveSupabaseConfigThunk());
      }}
    >
      <div className={styles.honeypot} aria-hidden>
        <input type="text" name="username" autoComplete="username" tabIndex={-1} />
        <input type="password" name="password" autoComplete="current-password" tabIndex={-1} />
      </div>
      <ProjectUrlInput />
      <ServiceRoleKeyInput />
      {actions}
    </form>
  );
};

const styles = {
  form: `flex flex-col gap-4`,
  honeypot: `absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0`,
};
