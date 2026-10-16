'use client';

import { ApiRunningStatus } from './api-running';
import { StorageRunningStatus } from './storage-running';
import { WebRunningStatus } from './web-running';

/**
 * Compact API + Web running indicators (inline on the meta line).
 */
export const RuntimeStatus = () => (
  <span className={styles.row}>
    <ApiRunningStatus />
    <StorageRunningStatus />
    <WebRunningStatus />
  </span>
);

const styles = {
  row: `inline-flex flex-wrap items-center gap-2`,
};
