# 022 — Settings page

## Status

Accepted

## Context

The Luckee folder (`luckeeParent` in hub-express `hub.local.json`) is where Setup clones repos into `{luckeeParent}/luckee/{projectId}/{repoName}`. It is chosen once and rarely changed, so showing it in the projects toolbar on every visit added noise without explaining what it was for.

## Decision

- Route: `/settings` (`SETTINGS_PATH`), thin `src/app/settings/page.tsx` → `src/packages/settings/`
- Sidebar: **Settings** listed under **Projects** in `getNavigationLinks` (sidebar and breadcrumbs share the list; see [023](./023-app-chrome-matches-ops-tracker.md))
- One card per setting under `src/packages/settings/{setting}/`. First card: `luckee-folder/`
- Luckee folder card explains what the folder is for, shows the current `…/luckee/` path, an example clone path, and that changing it only affects projects set up afterwards (existing checkouts in `hub.local.json` are kept). Saves via `pickHubConfigFolderThunk` (Finder picker)
- The projects page no longer shows the folder. First-run still uses `LuckeeParentRequiredModal` when `luckeeParent` is unset

## Related

- [013 – Projects and project detail](./013-projects-and-project-detail.md)
