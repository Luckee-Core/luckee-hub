import { openChromeApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';

/**
 * Open Chrome for a hooked-up project web URL.
 */
export const openProjectChromeThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async () => {
    const result = await openChromeApi(projectId);
    if (!result.success) {
      return result.httpStatus === 400 ? 400 : 500;
    }
    return 200;
  };
