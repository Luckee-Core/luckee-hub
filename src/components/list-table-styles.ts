/**
 * Shared list table chrome (matches my-ops-tracker-web list tables).
 */
export const listTableStyles = {
  tableWrapper: `
    bg-white rounded border border-gray-300 overflow-visible
  `,
  tableScrollContainer: `
    overflow-x-auto
  `,
  emptyState: `
    text-center py-12
  `,
  emptyText: `
    text-gray-500 text-sm
  `,
  table: `
    w-full border-collapse text-xs
  `,
  th: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
  `,
  thSortable: `
    px-3 py-2 text-left text-[10px] font-semibold text-gray-600
    uppercase tracking-wide bg-gray-100 border-b border-gray-300
    cursor-pointer select-none transition-colors hover:bg-gray-200
  `,
  row: `
    hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0 cursor-pointer
  `,
  cell: `
    px-3 py-2 text-xs text-gray-700 align-middle
  `,
  cellEmphasis: `
    font-medium text-gray-900
  `,
};
