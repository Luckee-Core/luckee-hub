'use client';

import { useAppDispatch } from '@/store';
import { focusProjectTerminalThunk } from '@/store/thunks/terminal-sidebar';
import type { ProjectTier, ProjectTierStatus } from '../../../resolve-project-runtime';

const TIER_LETTER: Record<ProjectTier, string> = {
  express: 'A',
  web: 'W',
  'storage-express': 'S',
  'scheduler-worker': 'L',
};

const TIER_NAME: Record<ProjectTier, string> = {
  express: 'Express API',
  web: 'Web',
  'storage-express': 'Storage',
  'scheduler-worker': 'Scheduler worker log',
};

type TierDotProps = {
  projectId: string;
  status: ProjectTierStatus;
  webUrl?: string;
};

/**
 * Letter + status dot for one tier. Focuses that tier's terminal; W with no terminal opens the web URL.
 */
export const TierDot = ({ projectId, status, webUrl }: TierDotProps) => {
  const dispatch = useAppDispatch();
  const stateText =
    status.tone === 'pending'
      ? 'starting'
      : status.portUp
        ? 'running'
        : status.sessionId
          ? 'terminal open'
          : 'off';
  const title = `${TIER_NAME[status.tier]}: ${stateText}`;

  const onClick = (): void => {
    if (status.sessionId) {
      void dispatch(focusProjectTerminalThunk(projectId, status.tier));
      return;
    }
    if (status.tier === 'web' && status.portUp && webUrl) {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button type="button" className={styles.button} title={title} aria-label={title} onClick={onClick}>
      <span className={styles.letter}>{TIER_LETTER[status.tier]}</span>
      <span className={`${styles.dot} ${styles[status.tone]}`} />
    </button>
  );
};

const styles = {
  button: `
    flex items-center gap-0.5 rounded px-1 py-0.5 hover:bg-gray-800 cursor-pointer
  `,
  letter: `
    font-mono text-[10px] text-gray-500
  `,
  dot: `
    h-2 w-2 rounded-full
  `,
  ok: `
    bg-green-500
  `,
  pending: `
    bg-amber-400 animate-pulse
  `,
  off: `
    bg-gray-600
  `,
} as const;
