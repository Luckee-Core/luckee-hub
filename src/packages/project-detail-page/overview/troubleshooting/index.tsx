'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { listTableStyles } from '@/components/list-table-styles';
import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';

type OverviewTroubleshootingProps = {
  overview: ProjectOverview;
};

/**
 * Symptom → fix table.
 */
export const OverviewTroubleshooting = ({ overview }: OverviewTroubleshootingProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <h2 className={detailPageStyles.panelTitle}>Troubleshooting</h2>
    </div>
    <div className={listTableStyles.tableScrollContainer}>
      <table className={listTableStyles.table}>
        <thead>
          <tr>
            <th className={listTableStyles.th}>If you see</th>
            <th className={listTableStyles.th}>Do this</th>
          </tr>
        </thead>
        <tbody>
          {overview.troubleshooting.map((row) => (
            <tr key={row.symptom} className={styles.row}>
              <td className={`${listTableStyles.cell} ${styles.symptom}`}>
                <InlineText text={row.symptom} />
              </td>
              <td className={`${listTableStyles.cell} ${styles.fix}`}>
                <InlineText text={row.fix} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const styles = {
  row: `border-b border-gray-200 last:border-b-0 align-top`,
  symptom: `text-sm font-medium text-gray-900 w-2/5`,
  fix: `text-sm text-gray-700`,
};
