import { getHubConfigApi, pickHubConfigFolderApi } from '@/api/projects';
import type { AppThunk } from '@/store/store';
import { ProjectsBuilderActions } from '@/store/builders/projectsBuilder';

/**
 * Load luckeeParent from hub-express hub.local.json.
 */
export const loadHubConfigThunk = (): AppThunk<Promise<200 | 500>> => async (dispatch) => {
  dispatch(ProjectsBuilderActions.setHubConfigLoadStatus('loading'));

  const result = await getHubConfigApi();
  if (!result.success || !result.data) {
    dispatch(ProjectsBuilderActions.setHubConfigLoadStatus('error'));
    dispatch(ProjectsBuilderActions.setHubConfigError(result.error ?? 'Failed to load hub config'));
    return 500;
  }

  const luckeeParent = result.data.luckeeParent ?? null;
  dispatch(ProjectsBuilderActions.setLuckeeParent(luckeeParent));
  dispatch(ProjectsBuilderActions.setHubConfigError(null));
  dispatch(ProjectsBuilderActions.setHubConfigLoadStatus('loaded'));

  if (!luckeeParent) {
    dispatch(ProjectsBuilderActions.setLuckeeParentModalOpen(true));
  }

  return 200;
};

/**
 * Open macOS Finder folder picker and save luckeeParent.
 */
export const pickHubConfigFolderThunk =
  (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
    dispatch(ProjectsBuilderActions.setLuckeeParentPicking(true));
    dispatch(ProjectsBuilderActions.setHubConfigError(null));

    const result = await pickHubConfigFolderApi();
    dispatch(ProjectsBuilderActions.setLuckeeParentPicking(false));

    if (!result.success || !result.data?.luckeeParent) {
      const message = result.error ?? 'Failed to choose folder';
      if (result.httpStatus !== 400) {
        dispatch(ProjectsBuilderActions.setHubConfigError(message));
      }
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(ProjectsBuilderActions.setLuckeeParent(result.data.luckeeParent));
    dispatch(ProjectsBuilderActions.setHubConfigError(null));
    dispatch(ProjectsBuilderActions.setLuckeeParentModalOpen(false));
    return 200;
  };

/**
 * Show the required luckee folder picker modal.
 */
export const openLuckeeParentModalThunk = (): AppThunk => (dispatch) => {
  dispatch(ProjectsBuilderActions.setLuckeeParentModalOpen(true));
};
