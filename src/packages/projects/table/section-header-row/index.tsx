export type ProjectsTableSectionVariant =
  | 'running'
  | 'favorites'
  | 'catalogActive'
  | 'finalSteps'
  | 'almostReady'
  | 'workInProgress';

type ProjectsTableSectionHeaderRowProps = {
  title: string;
  count: number;
  variant: ProjectsTableSectionVariant;
  isDropTarget?: boolean;
};

export const ProjectsTableSectionHeaderRow = ({
  title,
  count,
  variant,
  isDropTarget,
}: ProjectsTableSectionHeaderRowProps) => (
  <tr className={rowClassByVariant[variant]}>
    <td colSpan={5} className={isDropTarget ? styles.cellDropTarget : styles.cell}>
      <span className={styles.title}>{title}</span>
      <span className={styles.count}>{count}</span>
      {isDropTarget ? <span className={styles.dropHint}>Drop to move here</span> : null}
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
};

const styles = {
  cell: `px-3 py-2`,
  cellDropTarget: `px-3 py-2 ring-2 ring-inset ring-blue-500`,
  title: `text-[11px] font-semibold uppercase tracking-wide text-gray-700`,
  count: `ml-2 text-[10px] font-medium text-gray-400`,
  dropHint: `ml-3 text-[10px] font-medium text-blue-700`,
};
