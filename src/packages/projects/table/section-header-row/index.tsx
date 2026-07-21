type ProjectsTableSectionHeaderRowProps = {
  title: string;
  count: number;
  comingSoon?: boolean;
};

export const ProjectsTableSectionHeaderRow = ({
  title,
  count,
  comingSoon = false,
}: ProjectsTableSectionHeaderRowProps) => (
  <tr className={comingSoon ? styles.rowComingSoon : styles.rowAvailable}>
    <td colSpan={7} className={styles.cell}>
      <span className={styles.title}>{title}</span>
      <span className={styles.count}>{count}</span>
    </td>
  </tr>
);

const styles = {
  rowAvailable: `bg-orange-50 border-b border-orange-100`,
  rowComingSoon: `bg-gray-50 border-b border-gray-200`,
  cell: `px-2 py-2`,
  title: `text-[11px] font-semibold uppercase tracking-wide text-gray-700`,
  count: `ml-2 text-[10px] font-medium text-gray-400`,
};
