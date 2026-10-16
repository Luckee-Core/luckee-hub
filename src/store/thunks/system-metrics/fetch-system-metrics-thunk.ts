import { getSystemMetricsApi } from '@/api/system-metrics';
import type { AppThunk } from '@/store/store';
import { SystemMetricsBuilderActions } from '@/store/builders/systemMetricsBuilder';

/**
 * Fetch one system metrics snapshot from hub-express.
 */
export const fetchSystemMetricsThunk = (): AppThunk<Promise<200 | 400 | 500>> =>
  async (dispatch, getState) => {
    const hadSnapshot = getState().systemMetricsBuilder.snapshot != null;
    if (!hadSnapshot) {
      dispatch(SystemMetricsBuilderActions.setLoadStatus('loading'));
    }
    dispatch(SystemMetricsBuilderActions.setError(null));

    const result = await getSystemMetricsApi();

    if (!result.success || !result.data) {
      const message = result.error ?? 'Failed to load system metrics';
      dispatch(SystemMetricsBuilderActions.setLoadStatus('error'));
      dispatch(SystemMetricsBuilderActions.setError(message));
      return result.httpStatus === 400 ? 400 : 500;
    }

    dispatch(SystemMetricsBuilderActions.setSnapshot(result.data));
    dispatch(SystemMetricsBuilderActions.setLoadStatus('loaded'));
    dispatch(SystemMetricsBuilderActions.setLastFetchedAt(new Date().toISOString()));
    return 200;
  };
