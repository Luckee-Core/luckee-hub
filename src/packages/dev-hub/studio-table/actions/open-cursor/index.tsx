'use client';

import { useAppDispatch } from '@/store';
import { openDevHubCursorThunk } from '@/store/thunks/dev-hub';

type DevHubOpenCursorActionProps = {
  studioId: string;
  disabled?: boolean;
};

export const DevHubOpenCursorAction = ({ studioId, disabled }: DevHubOpenCursorActionProps) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      className={styles.button}
      disabled={disabled}
      onClick={() => void dispatch(openDevHubCursorThunk(studioId))}
    >
      Cursor
    </button>
  );
};

const styles = {
  button: `
    rounded border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium
    text-gray-700 hover:bg-gray-50 disabled:opacity-50
  `,
};
