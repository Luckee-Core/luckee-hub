'use client';

import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

import { detailPageStyles } from '@/components/detail-page-styles';
import { workstationStepAnchorId, type RepoSetupStep } from '../setup-steps/use-repo-setup-steps';

type WorkstationStepProps = {
  step: RepoSetupStep;
  /** Buttons shown on the right of the step header. */
  actions?: ReactNode;
  children: ReactNode;
};

const STATUS_LABELS = {
  ready: 'Done',
  attention: 'To do',
  checking: 'Checking',
} as const;

/**
 * One numbered card in the repo setup walkthrough — same panel chrome as the rest of the detail page.
 */
export const WorkstationStep = ({ step, actions, children }: WorkstationStepProps) => {
  const done = step.status === 'ready';
  return (
    <section id={workstationStepAnchorId(step.id)} className={`${detailPageStyles.panel} ${styles.anchor}`}>
      <div className={detailPageStyles.panelHeader}>
        <div className={styles.titleBlock}>
          <span className={done ? styles.numberDone : styles.number} aria-hidden>
            {done ? <Check className={styles.check} /> : step.number}
          </span>
          <div className={styles.titleText}>
            <div className={styles.titleRow}>
              <h2 className={detailPageStyles.panelTitle}>{step.title}</h2>
              <span className={styles.pill[step.status]}>{STATUS_LABELS[step.status]}</span>
            </div>
            <p className={detailPageStyles.panelSubtitle}>{step.detail}</p>
          </div>
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
      <div className={detailPageStyles.panelBody}>{children}</div>
    </section>
  );
};

const styles = {
  anchor: `scroll-mt-4`,
  titleBlock: `flex items-start gap-3 min-w-0 flex-1`,
  titleText: `min-w-0`,
  titleRow: `flex flex-wrap items-center gap-2`,
  number: `
    flex h-6 w-6 shrink-0 items-center justify-center rounded-full
    border border-gray-300 bg-white text-xs font-semibold text-gray-700
  `,
  numberDone: `
    flex h-6 w-6 shrink-0 items-center justify-center rounded-full
    border border-green-600 bg-green-600 text-white
  `,
  check: `h-3.5 w-3.5`,
  actions: `flex flex-wrap items-center gap-2`,
  pill: {
    ready: `rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200`,
    attention: `rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-800 border border-amber-200`,
    checking: `rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-gray-50 text-gray-500 border border-gray-200`,
  },
};
