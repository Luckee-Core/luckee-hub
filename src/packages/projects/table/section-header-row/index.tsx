export type ProjectsTableSectionVariant =
  | 'running'
  | 'favorites'
  | 'catalogActive'
  | 'finalSteps'
  | 'almostReady'
  | 'workInProgress'
  | 'comingSoon'
  | 'cancelled';

type ProjectsTableSectionHeaderRowProps = {
  title: string;
  count: number;
  variant: ProjectsTableSectionVariant;
};

export const ProjectsTableSectionHeaderRow = ({
  title,
  count,
  variant,
}: ProjectsTableSectionHeaderRowProps) => (
  <tr className={rowClassByVariant[variant]}>
    <td colSpan={8} className={styles.cell}>
      <span className={styles.title}>{title}</span>
      <span className={styles.count}>{count}</span>
    </td>
  </tr>
);

const rowClassByVariant: Record<ProjectsTableSectionVariant, string> = {
  running: `bg-emerald-50 border-b border-emerald-100`,
  favorites: `bg-orange-50 border-b border-orange-100`,
  catalogActive: `bg-green-50 border-b border-green-100`,
  finalSteps: `bg-violet-50 border-b border-violet-100`,
  almostReady: `bg-white border-b border-gray-100`,
  workInProgress: `bg-sky-50 border-b border-sky-100`,
  comingSoon: `bg-gray-50 border-b border-gray-200`,
  cancelled: `bg-red-50 border-b border-red-100`,
};

const styles = {
  cell: `px-2 py-2`,
  title: `text-[11px] font-semibold uppercase tracking-wide text-gray-700`,
  count: `ml-2 text-[10px] font-medium text-gray-400`,
};
