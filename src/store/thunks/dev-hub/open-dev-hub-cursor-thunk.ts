import { openCursorApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';

/**
 * Open Cursor workspace for a hooked-up studio.
 */
export const openDevHubCursorThunk =
  (studioId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async () => {
    const result = await openCursorApi(studioId);
    if (!result.success) {
      return result.httpStatus === 400 ? 400 : 500;
    }
    return 200;
  };
