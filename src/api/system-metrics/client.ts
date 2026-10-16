import { requestApi } from '@/api/_shared';
import type { SystemMetricsSnapshot } from '@/model';
import { systemMetricsApiBase } from './config';

/**
 * GET live CPU/GPU snapshot from hub-express (Apple Silicon).
 */
export const getSystemMetricsApi = () =>
  requestApi<SystemMetricsSnapshot>(`${systemMetricsApiBase}/api/system-metrics`);
