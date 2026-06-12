import { openChromeApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';

/**
 * Open Chrome for a studio web URL.
 */
export const openDevHubChromeThunk =
  (studioId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async () => {
    const result = await openChromeApi(studioId);
    if (!result.success) {
      return result.httpStatus === 400 ? 400 : 500;
    }
    return 200;
  };
