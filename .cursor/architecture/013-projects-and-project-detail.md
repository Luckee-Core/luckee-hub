# 013 — Projects and project detail

## Status

Accepted

## Context

The dev hub listed studios at `/` in `packages/dev-hub`. Users need `/projects` (list) and `/projects/detail` (per-project control plane) following luckee-web Redux detail routing.

## Decision

### Routes

- `/` → redirect to `/projects`
- `/projects` → `src/packages/projects/`
- `/projects/detail` → `src/packages/project-detail/` (static route; `currentProjectDetail.projectId` in Redux)

### Packages

```text
src/packages/projects/          # list table, header, row actions
src/packages/project-detail/    # overview, local DB panel, dev actions
src/packages/terminal-dock/     # shared bottom dock (extracted from dev-hub)
```

### Redux

- Dump: `projects` (`Record<projectId, HubProject>`)
- Dump: `terminalSessions` (`Record<sessionId, TerminalSession>`)
- Dump: `localDatabaseProbes` (`Record<projectId, LocalDatabaseProbe>`)
- Dump: `runningJobs` (`Record<projectId, jobId>`)
- Builder: `projectsBuilder` — list/terminal/local-DB UI flags and `terminalSessionOrder` only (primitives)
- Current: `currentProjectDetail` — `{ projectId: string | null }` only

**001 exception:** `currentProjectDetail` stores `projectId` only, not the full `HubProject`. Resolve the entity from the `projects` dump in components via `useMemo` (see ADR 001 zero-selector rule).

- Thunks: `src/store/thunks/projects/`
- API: `src/api/projects/`

### Navigation

- Row click → `setCurrentProjectDetailThunk` → await `200` → `/projects/detail` (ADR 008)
- Breadcrumbs: Projects → project name (static segment v1)

## Related

- [011 – Dev hub feature](./011-dev-hub-feature.md) (superseded for list/detail routing)
- [012 – Terminal dock UI](./012-terminal-dock-ui.md)
- [008 – Detail page routing](./008-detail-page-routing.md)
