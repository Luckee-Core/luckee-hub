'use client';

import { ApiRunning } from './api-running';
import { ExpressInstalled } from './express-installed';
import { ExpressPath } from './express-path';
import { HubConfigured } from './hub-configured';
import { WebInstalled } from './web-installed';
import { WebPath } from './web-path';
import { WebRunning } from './web-running';

export const SetupCards = () => (
  <div className={styles.row}>
    <HubConfigured />
    <WebPath />
    <ExpressPath />
    <WebInstalled />
    <ExpressInstalled />
    <ApiRunning />
    <WebRunning />
  </div>
);

const styles = {
  row: `flex flex-wrap gap-2`,
};
