type StatusChipProps = {
  label: string;
  ok: boolean;
};

export const StatusChip = ({ label, ok }: StatusChipProps) => (
  <span className={ok ? styles.chipOk : styles.chipPending}>{label}</span>
);

const styles = {
  chipOk: `rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800`,
  chipPending: `rounded-full px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600`,
};
