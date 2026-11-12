'use client';

import { ChevronRight } from 'lucide-react';

import { detailPageStyles } from '@/components/detail-page-styles';
import type { ProjectOverview } from '@/model';
import { InlineText } from '../inline-text';

type OverviewCommonTasksProps = {
  overview: ProjectOverview;
};

/**
 * Common tasks as expandable how-tos — the first one starts open.
 */
export const OverviewCommonTasks = ({ overview }: OverviewCommonTasksProps) => (
  <section className={detailPageStyles.panel}>
    <div className={detailPageStyles.panelHeader}>
      <div>
        <h2 className={detailPageStyles.panelTitle}>Common tasks</h2>
        <p className={detailPageStyles.panelSubtitle}>Step-by-step for the things you do most.</p>
      </div>
    </div>
    <ul className={styles.list}>
      {overview.commonTasks.map((task, taskIndex) => (
        <li key={task.title} className={styles.item}>
          <details className={styles.details} open={taskIndex === 0}>
            <summary className={styles.summary}>
              <ChevronRight className={styles.chevron} aria-hidden />
              <span className={styles.summaryText}>
                <span className={styles.title}>{task.title}</span>
                <span className={styles.when}>
                  <InlineText text={task.when} />
                </span>
              </span>
            </summary>
            <ol className={styles.steps}>
              {task.steps.map((step, index) => (
                <li key={index} className={styles.step}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span>
                    <InlineText text={step} />
                  </span>
                </li>
              ))}
            </ol>
          </details>
        </li>
      ))}
    </ul>
  </section>
);

const styles = {
  list: `divide-y divide-gray-200`,
  item: ``,
  details: `group`,
  summary: `
    flex items-start gap-2 px-4 py-3 cursor-pointer list-none hover:bg-gray-50
    [&::-webkit-details-marker]:hidden
  `,
  chevron: `h-4 w-4 shrink-0 mt-0.5 text-gray-400 transition-transform group-open:rotate-90`,
  summaryText: `flex flex-col min-w-0`,
  title: `text-sm font-medium text-gray-900`,
  when: `text-xs text-gray-500 mt-0.5`,
  steps: `flex flex-col gap-2 px-4 pb-4 pl-10 list-none`,
  step: `flex items-start gap-2.5 text-sm text-gray-700`,
  stepNumber: `
    flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50
    text-[10px] font-semibold text-blue-700 mt-0.5
  `,
};
