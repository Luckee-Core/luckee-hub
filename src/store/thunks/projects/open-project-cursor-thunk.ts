import { openCursorApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';

/**
 * Open Cursor workspace for a hooked-up project.
 */
export const openProjectCursorThunk =
  (projectId: string): AppThunk<Promise<200 | 400 | 500>> =>
  async () => {
    const result = await openCursorApi(projectId);
    if (!result.success) {
      return result.httpStatus === 400 ? 400 : 500;
    }
    return 200;
  };
