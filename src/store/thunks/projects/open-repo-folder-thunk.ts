import { openRepoFolderApi } from '@/api/projects/client';
import type { HubProjectRepoRole } from '@/model';
import type { AppThunk } from '@/store/store';

/**
 * Reveal one repo checkout of the current project in Finder.
 */
export const openRepoFolderThunk =
  (role: HubProjectRepoRole, repoName: string): AppThunk<Promise<200 | 400 | 500>> =>
  async (_dispatch, getState) => {
    const projectId = getState().currentProject.id;
    if (!projectId) {
      return 400;
    }
    const result = await openRepoFolderApi(projectId, role, repoName);
    if (!result.success) {
      return result.httpStatus === 400 ? 400 : 500;
    }
    return 200;
  };
