'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import { useAppSelector } from '@/store';
import { OverviewAbout } from './about';
import { OverviewCapabilities } from './capabilities';
import { OverviewCommonTasks } from './common-tasks';
import { OverviewHowItWorks } from './how-it-works';
import { OverviewHubNotes } from './hub-notes';
import { OverviewReference } from './reference';
import { OverviewTroubleshooting } from './troubleshooting';

/**
 * Overview tab — what the project is, how it fits together, and how to do common things.
 * Content comes from hub Express `data/project-overviews/<projectId>.json`.
 */
export const ProjectDetailOverview = () => {
  const { id, name, description } = useAppSelector((s) => s.currentProject);
  const overview = useAppSelector((s) => s.projectOverviews[id]);

  if (overview === undefined) {
    return (
      <section className={detailPageStyles.panel}>
        <p className={styles.note}>Loading overview…</p>
      </section>
    );
  }

  if (overview === null) {
    return (
      <section className={detailPageStyles.panel}>
        <div className={detailPageStyles.panelHeader}>
          <div>
            <h2 className={detailPageStyles.panelTitle}>About {name}</h2>
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
        </div>
        <p className={styles.note}>
          No overview written yet. Add{' '}
          <code className={styles.code}>data/project-overviews/{id}.json</code> to
          luckee-hub-express-server to describe what this project does and its common tasks.
        </p>
      </section>
    );
  }

  return (
    <div className={styles.stack}>
      <OverviewAbout overview={overview} />
      <OverviewHubNotes overview={overview} />
      <OverviewCapabilities overview={overview} />
      <OverviewCommonTasks overview={overview} />
      <OverviewHowItWorks overview={overview} />
      <OverviewTroubleshooting overview={overview} />
      <OverviewReference overview={overview} />
      <p className={styles.updated}>Overview last updated {overview.updatedAt}</p>
    </div>
  );
};

const styles = {
  stack: `flex flex-col gap-4`,
  note: `px-4 py-4 text-sm text-gray-600`,
  description: `text-sm text-gray-600 mt-1 max-w-3xl`,
  code: `font-mono text-xs bg-gray-100 px-1 py-0.5 rounded`,
  updated: `text-xs text-gray-400`,
};
