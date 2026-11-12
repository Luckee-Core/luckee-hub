/**
 * Shared layout and panel chrome for detail screens (matches ops-tracker detail pages, ADR 023).
 */
export const detailPageStyles = {
  page: `
    w-full flex flex-col gap-5
  `,
  panel: `
    bg-white rounded border border-gray-300 overflow-visible
  `,
  panelHeader: `
    px-4 py-3 border-b border-gray-300 bg-gray-50
    flex flex-wrap items-start justify-between gap-3
  `,
  panelTitle: `
    text-sm font-semibold text-gray-900 tracking-tight
  `,
  panelSubtitle: `
    text-xs text-gray-500 mt-0.5
  `,
  panelBody: `
    px-4 py-4
  `,
  sectionTitle: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  primaryButton: `
    inline-flex items-center gap-1.5
    text-xs font-medium text-white bg-blue-600
    px-3 py-1.5 rounded border border-blue-600
    hover:bg-blue-700 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  secondaryButton: `
    inline-flex items-center gap-1.5
    text-xs font-medium text-gray-700
    px-3 py-1.5 rounded border border-gray-300 bg-white
    hover:bg-gray-50 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `,
  textLink: `
    text-xs font-medium text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline
  `,
  fieldLabel: `
    text-[10px] font-semibold uppercase tracking-wide text-gray-500
  `,
  fieldValue: `
    text-sm text-gray-900
  `,
  textInput: `
    w-full rounded border border-gray-300 bg-white px-2.5 py-1.5
    text-sm text-gray-900 font-mono placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500
  `,
  errorText: `
    text-xs text-red-700
  `,
  successText: `
    text-xs text-green-700
  `,
  emptyState: `
    flex flex-col items-start gap-2 py-8
  `,
};
