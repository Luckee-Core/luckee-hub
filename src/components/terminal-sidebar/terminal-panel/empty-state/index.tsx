'use client';

import { TerminalSquare } from 'lucide-react';

/**
 * Shown when hub Express reports no live terminals.
 */
export const TerminalPanelEmptyState = () => (
  <div className={styles.wrap}>
    <TerminalSquare className={styles.icon} aria-hidden />
    <p className={styles.title}>No terminals running</p>
    <p className={styles.hint}>Start a project above or from the projects table.</p>
  </div>
);

const styles = {
  wrap: `
    flex min-h-0 flex-1 flex-col items-center justify-center gap-1.5 px-6 text-center
  `,
  icon: `
    h-6 w-6 text-gray-600
  `,
  title: `
    text-xs font-medium text-gray-400
  `,
  hint: `
    text-[11px] text-gray-500
  `,
} as const;
