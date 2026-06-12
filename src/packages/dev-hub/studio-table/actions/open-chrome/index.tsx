'use client';

import { useAppDispatch } from '@/store';
import { openDevHubChromeThunk } from '@/store/thunks/dev-hub';

type DevHubOpenChromeActionProps = {
  studioId: string;
  disabled?: boolean;
};

export const DevHubOpenChromeAction = ({ studioId, disabled }: DevHubOpenChromeActionProps) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      onClick={() => void dispatch(openDevHubChromeThunk(studioId))}
    >
      Chrome
    </button>
  );
};

const styles = {
  button: `
    rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium
    text-gray-700 hover:bg-gray-50 disabled:opacity-50
  `,
};
