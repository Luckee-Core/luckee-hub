import type { AppThunk } from '@/store/store';
import { fetchSystemMetricsThunk } from './fetch-system-metrics-thunk';

let pollIntervalId: ReturnType<typeof setInterval> | null = null;
let fetchInFlight = false;

const DEFAULT_POLL_MS = 2000;

const clearPolling = (): void => {
  if (pollIntervalId != null) {
    clearInterval(pollIntervalId);
    pollIntervalId = null;
  }
  fetchInFlight = false;
};

/**
 * Start polling system metrics at a fixed interval (default 2s).
 */
export const startSystemMetricsPollingThunk =
  (options?: { intervalMs?: number }): AppThunk =>
  (dispatch) => {
    clearPolling();

    const intervalMs = options?.intervalMs ?? DEFAULT_POLL_MS;

    void dispatch(fetchSystemMetricsThunk());

    pollIntervalId = setInterval(() => {
      if (fetchInFlight) {
        return;
      }
      fetchInFlight = true;
      void dispatch(fetchSystemMetricsThunk()).finally(() => {
        fetchInFlight = false;
      });
    }, intervalMs);
  };

/**
 * Stop system metrics polling and clear in-flight guard.
 */
export const stopSystemMetricsPollingThunk = (): AppThunk => () => {
  clearPolling();
};
