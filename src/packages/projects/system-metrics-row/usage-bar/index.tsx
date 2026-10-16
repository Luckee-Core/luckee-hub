type UsageBarProps = {
  label: string;
  percent: number | null;
};

const SEGMENT_COUNT = 10;

const fillClassForPercent = (percent: number): string => {
  if (percent >= 80) {
    return styles.segmentHigh;
  }
  if (percent >= 50) {
    return styles.segmentMedium;
  }
  return styles.segmentLow;
};

export const UsageBar = ({ label, percent }: UsageBarProps) => {
  const safePercent = percent == null ? 0 : Math.min(100, Math.max(0, percent));
  const filledSegments =
    percent == null ? 0 : Math.min(SEGMENT_COUNT, Math.round(safePercent / (100 / SEGMENT_COUNT)));
  const displayPercent = percent == null ? '—' : `${Math.round(percent)}%`;
  const fillClass = fillClassForPercent(safePercent);

  return (
    <div className={styles.block}>
      <span className={styles.label}>{label}</span>
      <div
        className={styles.track}
        role="progressbar"
        aria-label={`${label} usage`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent == null ? undefined : Math.round(safePercent)}
      >
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <div
            key={index}
            className={`${styles.segment} ${index < filledSegments ? fillClass : styles.segmentEmpty}`}
          />
        ))}
      </div>
      <span className={styles.value}>{displayPercent}</span>
    </div>
  );
};

const styles = {
  block: `flex items-center gap-2 min-w-[9rem]`,
  label: `text-[10px] font-semibold uppercase tracking-wide text-gray-500 w-8 shrink-0`,
  track: `flex h-2 w-24 gap-px rounded-sm overflow-hidden bg-gray-200`,
  segment: `flex-1 min-w-0 rounded-[1px]`,
  segmentLow: `bg-green-500`,
  segmentMedium: `bg-amber-500`,
  segmentHigh: `bg-red-500`,
  segmentEmpty: `bg-gray-200`,
  value: `text-[11px] font-medium text-gray-800 tabular-nums w-9 text-right`,
};
