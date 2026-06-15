'use client';

import { CheckingStatus } from './checking-status';
import { SetupError } from './setup-error';
import { SetupSuccess } from './setup-success';

export const LocalDatabaseMessages = () => (
  <div className={styles.stack}>
    <CheckingStatus />
    <SetupError />
    <SetupSuccess />
  </div>
);

const styles = {
  stack: `space-y-2`,
};
