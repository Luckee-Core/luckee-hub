'use client';

import type { TerminalSession } from '@/model';
import { useAppDispatch } from '@/store';
import {
  closeTerminalSessionThunk,
  setActiveTerminalTabThunk,
} from '@/store/thunks/projects';

type TerminalDockTabProps = {
  session: TerminalSession;
  isActive: boolean;
};

export const TerminalDockTab = ({ session, isActive }: TerminalDockTabProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className={isActive ? styles.tabActive : styles.tab}>
      <button
        type="button"
        className={styles.label}
        onClick={() => void dispatch(setActiveTerminalTabThunk(session.sessionId))}
      >
        {session.label}
      </button>
      <button
        type="button"
        className={styles.close}
        aria-label={`Close ${session.label}`}
        onClick={(event) => {
          event.stopPropagation();
          void dispatch(closeTerminalSessionThunk(session.sessionId));
        }}
      >
        ×
      </button>
    </div>
  );
};

const styles = {
  tab: `
    flex shrink-0 items-center gap-0.5 rounded-t bg-gray-800/60 text-gray-400
    hover:bg-gray-800 hover:text-gray-200
  `,
  tabActive: `
    flex shrink-0 items-center gap-0.5 rounded-t bg-gray-950 text-gray-100
  `,
  label: `
    max-w-[10rem] truncate px-2 py-1.5 text-xs font-medium
    hover:text-inherit
  `,
  close: `
    mr-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-sm leading-none
    text-gray-500 hover:bg-gray-700 hover:text-gray-100
  `,
};
