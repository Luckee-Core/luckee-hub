import { listStudiosApi } from '@/api/dev-hub';
import type { AppThunk } from '@/store/store';
import { DevHubBuilderActions } from '@/store/builders/devHubBuilder';
import { DevHubStudiosActions } from '@/store/dumps/devHubStudios';

type LoadDevHubStudiosOptions = {
  /** Curl/lsof ports for Ready / API running / Web running badges. */
  live?: boolean;
};

/**
 * Load studio catalog from hub Express. Default is instant (registry + filesystem only).
 */
export const loadDevHubStudiosThunk =
  (options: LoadDevHubStudiosOptions = {}): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const live = options.live ?? false;
    const hasStudios = Object.keys(getState().devHubStudios).length > 0;

    if (!hasStudios) {
      dispatch(DevHubBuilderActions.setListLoadStatus('loading'));
      dispatch(DevHubBuilderActions.setListError(null));
    }

    const result = await listStudiosApi({ live });
    if (!result.success || !result.data) {
      if (!hasStudios) {
        dispatch(DevHubBuilderActions.setListLoadStatus('error'));
        dispatch(DevHubBuilderActions.setListError(result.error ?? 'Failed to load studios'));
      }
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(DevHubStudiosActions.setStudios(result.data));
    dispatch(DevHubBuilderActions.setListLoadStatus('loaded'));
    return 200;
  };

/**
 * Full refresh with live port probes (Refresh button).
 */
export const refreshDevHubStudiosThunk =
  (): AppThunk<Promise<200 | 400 | 500>> => async (dispatch) => {
    dispatch(DevHubBuilderActions.setListLoadStatus('loading'));
    dispatch(DevHubBuilderActions.setListError(null));
    return dispatch(loadDevHubStudiosThunk({ live: true }));
  };
