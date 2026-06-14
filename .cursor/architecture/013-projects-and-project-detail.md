# 013 — Projects and project detail

## Status

Accepted

## Context

The dev hub listed studios at `/` in `packages/dev-hub`. Users need a projects list and a per-project control plane following ADR 008 detail routing (`{entity}-detail-page`).

## Decision

### Routes

- `/` → redirect to `/projects`
- `/projects` → `src/packages/projects/`
- `/project-detail-page` → `src/packages/project-detail-page/` (static route; `currentProject` in Redux)

### Packages

```text
src/packages/projects/              # list table, header, row actions
src/packages/project-detail-page/   # overview, local DB panel, dev actions
src/packages/terminal-dock/         # shared dock (extracted from dev-hub)
```

### Redux

- Dump: `projects` (`Record<projectId, HubProject>`)
- Dump: `terminalSessions` (`Record<sessionId, TerminalSession>`)
- Dump: `localDatabaseProbes` (`Record<projectId, LocalDatabaseProbe>`)
- Dump: `runningJobs` (`Record<projectId, jobId>`)
- Builder: `projectsBuilder` — list/terminal/local-DB UI flags and `terminalSessionOrder` only (primitives)
- Current: `currentProject` — full `HubProject`; `id === ''` means none selected

Detail packages read **`currentProject`** (whole slice per ADR 001).

- Thunks: `src/store/thunks/projects/` — `setCurrentProjectThunk` hydrates `currentProject` from dump before navigation
- API: `src/api/projects/`

### Navigation

- Row click → `setCurrentProjectThunk` → await `200` → `/project-detail-page` (ADR 008)
- Breadcrumbs: Projects → project name (static segment v1)

## Related

- [011 – Dev hub feature](./011-dev-hub-feature.md) (superseded for list/detail routing)
- [012 – Terminal dock UI](./012-terminal-dock-ui.md)
- [008 – Detail page routing](./008-detail-page-routing.md)
