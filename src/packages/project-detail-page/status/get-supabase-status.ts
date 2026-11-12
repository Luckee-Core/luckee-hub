import type { SupabaseProbe } from '@/model';
import type { DetailStatus } from './detail-status';

/**
 * Supabase is ready once the env keys are set and the expected tables exist.
 */
export const getSupabaseStatus = (probe: SupabaseProbe | undefined): DetailStatus => {
  if (!probe) {
    return 'checking';
  }
  return probe.configured && probe.schemaReady ? 'ready' : 'attention';
};
