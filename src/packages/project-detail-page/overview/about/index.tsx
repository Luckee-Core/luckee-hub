'use client';

import { Check, X } from 'lucide-react';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';

type OverviewAboutProps = {
  overview: ProjectOverview;
};

/**
 * What the project is, who it's for, and what it deliberately isn't.
 */
export const OverviewAbout = ({ overview }: OverviewAboutProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <div className={styles.headerText}>
        <h2 className={detailPageStyles.panelTitle}>About</h2>
        <p className={styles.tagline}>
          <InlineText text={overview.tagline} />
        </p>
      </div>
    </div>
    <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
      {overview.summary.map((paragraph, index) => (
        <p key={index} className={styles.paragraph}>
          <InlineText text={paragraph} />
        </p>
      ))}
      <div className={styles.columns}>
        <div>
          <h3 className={detailPageStyles.sectionTitle}>Use it if</h3>
          <ul className={styles.list}>
            {overview.audience.map((item) => (
              <li key={item} className={styles.item}>
                <Check className={styles.iconYes} aria-hidden />
                <span>
                  <InlineText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={detailPageStyles.sectionTitle}>Not for</h3>
          <ul className={styles.list}>
            {overview.notFor.map((item) => (
              <li key={item} className={styles.item}>
                <X className={styles.iconNo} aria-hidden />
                <span>
                  <InlineText text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const styles = {
  headerText: `min-w-0`,
  tagline: `text-sm text-gray-700 mt-1 max-w-3xl`,
  body: `flex flex-col gap-3`,
  paragraph: `text-sm text-gray-700 leading-relaxed max-w-3xl`,
  columns: `grid gap-4 md:grid-cols-2 pt-2`,
  list: `mt-2 flex flex-col gap-1.5`,
  item: `flex items-start gap-2 text-sm text-gray-700`,
  iconYes: `h-4 w-4 shrink-0 mt-0.5 text-green-600`,
  iconNo: `h-4 w-4 shrink-0 mt-0.5 text-gray-400`,
};
