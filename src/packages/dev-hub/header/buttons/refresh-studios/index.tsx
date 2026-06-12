'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { refreshDevHubStudiosThunk } from '@/store/thunks/dev-hub';

export const DevHubRefreshStudiosButton = () => {
  const dispatch = useAppDispatch();
  const listLoadStatus = useAppSelector((s) => s.devHubBuilder.listLoadStatus);
  const isLoading = listLoadStatus === 'loading';

  return (
    <button
      type="button"
      className={styles.button}
      disabled={isLoading}
      onClick={() => void dispatch(refreshDevHubStudiosThunk())}
    >
      {isLoading ? 'Refreshing…' : 'Refresh'}
    </button>
  );
};

const styles = {
  button: `
    rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium
    text-gray-700 hover:bg-gray-50 disabled:opacity-50
  `,
};
