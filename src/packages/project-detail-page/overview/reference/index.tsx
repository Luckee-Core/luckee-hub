'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';

type OverviewReferenceProps = {
  overview: ProjectOverview;
};

/**
 * Glossary and further reading inside the repos.
 */
export const OverviewReference = ({ overview }: OverviewReferenceProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <h2 className={detailPageStyles.panelTitle}>Reference</h2>
    </div>
    <div className={`${detailPageStyles.panelBody} ${styles.columns}`}>
      {overview.glossary.length > 0 ? (
        <div>
          <h3 className={detailPageStyles.sectionTitle}>Glossary</h3>
          <dl className={styles.dl}>
            {overview.glossary.map((entry) => (
              <div key={entry.term} className={styles.entry}>
                <dt className={styles.term}>{entry.term}</dt>
                <dd className={styles.definition}>
                  <InlineText text={entry.definition} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
      {overview.links.length > 0 ? (
        <div>
          <h3 className={detailPageStyles.sectionTitle}>Further reading</h3>
          <ul className={styles.links}>
            {overview.links.map((link) => (
              <li key={link.label} className={styles.link}>
                <span className={styles.linkLabel}>{link.label}</span>
                <code className={styles.path}>{link.path}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  </section>
);

const styles = {
  columns: `grid gap-5 lg:grid-cols-2`,
  dl: `mt-2 flex flex-col gap-2`,
  entry: `text-sm`,
  term: `font-semibold text-gray-900`,
  definition: `text-gray-600 text-xs mt-0.5 leading-relaxed`,
  links: `mt-2 flex flex-col gap-2`,
  link: `flex flex-col`,
  linkLabel: `text-sm text-gray-900`,
  path: `font-mono text-xs text-gray-500 break-all`,
};
