'use client';

import { RefreshStatus } from './refresh-status';
import { SetupDatabase } from './setup-database';

export const LocalDatabaseActions = () => (
  <div className={styles.actions}>
    <RefreshStatus />
    <SetupDatabase />
  </div>
);

const styles = {
  actions: `flex flex-wrap gap-2`,
};
