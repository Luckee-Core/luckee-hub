'use client';

import type { DevHubStudio } from '@/model';
import { DevHubOpenChromeAction } from '../open-chrome';
import { DevHubOpenCursorAction } from '../open-cursor';
import { DevHubRunStudioAction } from '../run-studio';

type DevHubStudioRowActionsProps = {
  studio: DevHubStudio;
};

export const DevHubStudioRowActions = ({ studio }: DevHubStudioRowActionsProps) => {
  const isHookedUp = studio.hookStatus !== 'catalog';

  return (
    <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
      <DevHubRunStudioAction studioId={studio.id} disabled={!isHookedUp} />
      <DevHubOpenCursorAction studioId={studio.id} disabled={!isHookedUp} />
      <DevHubOpenChromeAction
        studioId={studio.id}
        disabled={!isHookedUp || studio.apiOnly}
      />
    </div>
  );
};

const styles = {
  actions: `
    flex flex-wrap items-center gap-1.5
  `,
};
