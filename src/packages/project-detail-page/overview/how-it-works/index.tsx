'use client';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';
import { ComponentApi } from './component-api';

type OverviewHowItWorksProps = {
  overview: ProjectOverview;
};

/**
 * How the parts fit together — what each codebase owns and serves (API / pages), how data moves,
 * and where secrets live.
 * Repo status (cloned, deps, env) lives on the Repos tab; this is the conceptual map.
 */
export const OverviewHowItWorks = ({ overview }: OverviewHowItWorksProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <h2 className={detailPageStyles.panelTitle}>How it fits together</h2>
    </div>
    <div className={`${detailPageStyles.panelBody} ${styles.body}`}>
      <ul className={styles.components}>
        {overview.components.map((component) => (
          <li key={component.repoName} className={styles.component}>
            <div className={styles.componentInfo}>
              <div className={styles.componentHead}>
                <p className={styles.componentName}>{component.name}</p>
                {!component.inHub ? <span className={styles.notInHub}>Not in Hub</span> : null}
              </div>
              <p className={styles.repoName}>{component.repoName}</p>
              <dl className={styles.dl}>
                <dt className={styles.dt}>Runs on</dt>
                <dd className={styles.dd}>
                  <InlineText text={component.runsOn} />
                </dd>
                <dt className={styles.dt}>Owns</dt>
                <dd className={styles.dd}>
                  <InlineText text={component.owns} />
                </dd>
                <dt className={styles.dt}>Doesn&apos;t own</dt>
                <dd className={styles.dd}>
                  <InlineText text={component.doesNotOwn} />
                </dd>
                <dt className={styles.dt}>Stack</dt>
                <dd className={styles.dd}>
                  <InlineText text={component.stack} />
                </dd>
              </dl>
            </div>
            {component.api ? <ComponentApi api={component.api} /> : null}
          </li>
        ))}
      </ul>

      <div className={styles.columns}>
        <div>
          <h3 className={detailPageStyles.sectionTitle}>Data flow</h3>
          <ol className={styles.steps}>
            {overview.dataFlow.map((step, index) => (
              <li key={index} className={styles.step}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <span>
                  <InlineText text={step} />
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className={detailPageStyles.sectionTitle}>Where secrets live</h3>
          <ul className={styles.trust}>
            {overview.trust.map((zone) => (
              <li key={zone.title} className={styles.zone}>
                <p className={styles.zoneTitle}>{zone.title}</p>
                <p className={styles.zoneDetail}>
                  <InlineText text={zone.detail} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

const styles = {
  body: `flex flex-col gap-5`,
  components: `flex flex-col gap-3`,
  component: `
    grid gap-4 rounded border border-gray-200 px-3 py-3
    lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]
  `,
  componentInfo: `min-w-0`,
  componentHead: `flex items-center justify-between gap-2`,
  componentName: `text-sm font-semibold text-gray-900`,
  notInHub: `
    rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide
    bg-gray-100 text-gray-600 border border-gray-200
  `,
  repoName: `font-mono text-xs text-gray-500 mt-0.5`,
  dl: `grid grid-cols-[6.5rem_1fr] gap-x-3 gap-y-1.5 mt-2 text-xs`,
  dt: `text-gray-500`,
  dd: `text-gray-800 leading-relaxed`,
  columns: `grid gap-5 lg:grid-cols-2`,
  steps: `mt-2 flex flex-col gap-2 list-none`,
  step: `flex items-start gap-2.5 text-sm text-gray-700`,
  stepNumber: `
    flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300
    bg-white text-[10px] font-semibold text-gray-600 mt-0.5
  `,
  trust: `mt-2 flex flex-col gap-2`,
  zone: `rounded border border-gray-200 bg-gray-50 px-3 py-2`,
  zoneTitle: `text-xs font-semibold text-gray-900`,
  zoneDetail: `text-xs text-gray-600 mt-0.5 leading-relaxed`,
};
