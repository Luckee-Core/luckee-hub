'use client';

import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { DevHubStudioTableView } from './table-view';

export const DevHubStudioTable = () => {
  const devHubStudios = useAppSelector((s) => s.devHubStudios);
  const listLoadStatus = useAppSelector((s) => s.devHubBuilder.listLoadStatus);
  const listError = useAppSelector((s) => s.devHubBuilder.listError);

  const studios = useMemo(() => Object.values(devHubStudios), [devHubStudios]);

  if (listLoadStatus === 'loading' && studios.length === 0) {
    return <p className={styles.message}>Loading studios…</p>;
  }

  if (listLoadStatus === 'error') {
    return (
      <p className={styles.error}>
        {listError ?? 'Failed to load studios. Is luckee-hub-express-server running on :4110?'}
      </p>
    );
  }

  if (studios.length === 0) {
    return <p className={styles.message}>No studios in registry.</p>;
  }

  return <DevHubStudioTableView studios={studios} />;
};

const styles = {
  message: `
    text-gray-600
  `,
  error: `
    text-red-600
  `,
};
