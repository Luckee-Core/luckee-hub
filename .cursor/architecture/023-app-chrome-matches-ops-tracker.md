# 023 — App chrome matches my-ops-tracker-web

## Status

Accepted

## Context

The hub had its own look (dark zinc icon-rail sidebar, hamburger toggle, orange buttons, a toolbar glued to the table). Luckee apps should feel like one product, and my-ops-tracker-web is the reference.

## Decision

### Sidebar (`src/components/sidebar/`)

- White, `w-[15.5rem]`, `border-r border-gray-300`
- Brand card: `BrandLogo` (Luckee lightning mark, `src/components/brand-logo/`) + "Luckee Dev Hub" + "A LUCKEE APP"
- "Navigation" label, then text-only links from `getNavigationLinks()` (the same list breadcrumbs use). Active link: `bg-gray-100 ring-1 ring-inset ring-gray-300 font-semibold`
- Projects stays active on `/project-detail-page`

### Header and layout

- Header: white bar, `border-b border-gray-300`, `PanelLeft` / `PanelLeftClose` toggle, `text-sm` breadcrumbs (root muted, current `font-semibold`)
- The toggle shows or hides the whole sidebar (no collapsed rail). Visible by default; saved in `localStorage` key `luckee-hub-sidebar-visible`
- Content area `bg-gray-50`, `p-3`

### Lists

- `src/components/list-filter-bar-styles.ts` and `src/components/list-table-styles.ts` are copies of the ops tracker files. Filter bar sits above the table as its own `bg-gray-50 rounded-lg` panel; table is its own `rounded border border-gray-300` box with `px-3 py-2` cells
- Empty and "no matches" states use `listTableStyles.emptyState`

### Color

- Primary actions, focus rings, spinners and links are blue (`bg-blue-600 hover:bg-blue-700`, `focus:ring-blue-500`), as in the ops tracker
- Orange is only the brand mark and favorites (star toggle, Favorites section)

## Related

- [018 – System metrics row](./018-system-metrics-row.md)
- [022 – Settings page](./022-settings-page.md)
