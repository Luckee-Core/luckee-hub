'use client';

import { HubConfigured } from './hub-configured';
import { WebPath } from './web-path';
import { ExpressPath } from './express-path';
import { WebInstalled } from './web-installed';
import { ExpressInstalled } from './express-installed';

/**
 * Setup tab — one panel listing all setup checks.
 */
export const SetupTab = () => (
  <div className={styles.stack}>
    <HubConfigured />
    <WebPath />
    <ExpressPath />
    <WebInstalled />
    <ExpressInstalled />
  </div>
);

const styles = {
  stack: `space-y-2`,
};
