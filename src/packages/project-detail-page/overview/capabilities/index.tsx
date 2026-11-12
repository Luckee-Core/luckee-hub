'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';

type OverviewCapabilitiesProps = {
  overview: ProjectOverview;
};

/**
 * What the product does, as a grid of short cards.
 */
export const OverviewCapabilities = ({ overview }: OverviewCapabilitiesProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <h2 className={detailPageStyles.panelTitle}>What it does</h2>
    </div>
    <ul className={styles.grid}>
      {overview.capabilities.map((capability) => (
        <li key={capability.title} className={styles.card}>
          <p className={styles.title}>{capability.title}</p>
          <p className={styles.detail}>
            <InlineText text={capability.detail} />
          </p>
        </li>
      ))}
    </ul>
  </section>
);

const styles = {
  grid: `grid gap-3 sm:grid-cols-2 lg:grid-cols-3 px-4 py-4`,
  card: `rounded border border-gray-200 bg-white px-3 py-2.5`,
  title: `text-sm font-semibold text-gray-900`,
  detail: `text-xs text-gray-600 mt-1 leading-relaxed`,
};
