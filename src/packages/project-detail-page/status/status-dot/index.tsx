import type { DetailStatus } from '../detail-status';

type StatusDotProps = {
  status: DetailStatus;
};

const LABELS: Record<DetailStatus, string> = {
  ready: 'Ready',
  attention: 'Needs attention',
  checking: 'Checking',
};

/**
 * Small colored dot: green ready, amber needs attention, pulsing gray while checking.
 */
export const StatusDot = ({ status }: StatusDotProps) => (
  <span className={styles[status]} role="img" aria-label={LABELS[status]} title={LABELS[status]} />
);

const styles: Record<DetailStatus, string> = {
  ready: `inline-block h-2 w-2 shrink-0 rounded-full bg-green-500`,
  attention: `inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500`,
  checking: `inline-block h-2 w-2 shrink-0 rounded-full bg-gray-300 animate-pulse`,
};
