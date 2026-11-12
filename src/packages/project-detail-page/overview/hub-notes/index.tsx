'use client';

import { AlertTriangle } from 'lucide-react';

import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';

type OverviewHubNotesProps = {
  overview: ProjectOverview;
};

/**
 * Things about how this project is wired into Hub that are worth knowing (gaps, port clashes…).
 */
export const OverviewHubNotes = ({ overview }: OverviewHubNotesProps) => {
  if (overview.hubNotes.length === 0) {
    return null;
  }
  return (
    <section className={styles.callout} aria-label="Hub notes">
      <p className={styles.title}>
        <AlertTriangle className={styles.icon} aria-hidden />
        In Hub
      </p>
      <ul className={styles.list}>
        {overview.hubNotes.map((note) => (
          <li key={note} className={styles.item}>
            <InlineText text={note} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const styles = {
  callout: `rounded border border-amber-200 bg-amber-50 px-4 py-3`,
  title: `flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-900`,
  icon: `h-3.5 w-3.5`,
  list: `mt-2 flex flex-col gap-1 list-disc pl-5`,
  item: `text-sm text-amber-950`,
};
