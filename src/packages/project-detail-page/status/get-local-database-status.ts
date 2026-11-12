import type { LocalDatabaseProbe } from '@/model';
import type { DetailStatus } from './detail-status';

/**
 * Local database is ready when every setup step is done or skipped.
 */
export const getLocalDatabaseStatus = (probe: LocalDatabaseProbe | undefined): DetailStatus => {
  if (!probe) {
    return 'checking';
  }
  if (!probe.supported) {
    return 'attention';
  }
  const steps = probe.setupSteps ?? [];
  if (steps.length === 0) {
    return probe.schemaReady && probe.envConfigured ? 'ready' : 'attention';
  }
  return steps.every((step) => step.status === 'done' || step.status === 'skipped')
    ? 'ready'
    : 'attention';
};
