'use client';

import { Express } from './express';
import { Nextjs } from './nextjs';

export const RepoLinks = () => (
  <div className={styles.row}>
    <Express />
    <Nextjs />
  </div>
);

const styles = {
  row: `flex flex-wrap gap-2`,
};
