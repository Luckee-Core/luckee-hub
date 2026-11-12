/**
 * Shared filter bar chrome for list pages (matches my-ops-tracker-web filter bars).
 */
export const listFilterBarStyles = {
  section: `
    flex flex-wrap gap-3 items-center p-3 bg-gray-50 rounded-lg border border-gray-200
  `,
  searchInputWrapper: `
    relative flex items-center min-w-48 w-full max-w-xs
  `,
  searchInput: `
    h-7 pl-2 pr-6 py-1 text-xs border border-gray-300 rounded bg-white
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent
    placeholder-gray-400 w-full
  `,
  clearButton: `
    absolute right-1.5 top-1/2 transform -translate-y-1/2
    text-gray-400 hover:text-gray-600 text-xs cursor-pointer
  `,
  end: `
    ml-auto shrink-0
  `,
};
