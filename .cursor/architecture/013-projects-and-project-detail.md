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
src/packages/project-detail-page/   # overview, local DB / Supabase panels, dev actions
src/packages/terminal-dock/         # shared dock (extracted from dev-hub)
```

### Redux

- Dump: `projects` (`Record<projectId, HubProject>`)
- Dump: `terminalSessions` (`Record<sessionId, TerminalSession>`)
- Dump: `localDatabaseProbes` (`Record<projectId, LocalDatabaseProbe>`)
- Dump: `supabaseProbes` (`Record<projectId, SupabaseProbe>`) — booleans only, no secrets
- Dump: `runningJobs` (`Record<projectId, jobId>`)
- Builder: `projectsBuilder` — list/terminal/local-DB/Supabase UI flags and `terminalSessionOrder` only (primitives)
- Current: `currentProject` — full `HubProject`; `id === ''` means none selected

Detail packages read **`currentProject`** (whole slice per ADR 001). Lead Studio shows **Supabase** panel when `supabaseSupported` (keys upserted to express `.env` via Hub Express). When configured, **Seed table schema** calls hub-express `POST …/supabase/seed-schema` (`psql` + registry `bootstrapSql`).

- Thunks: `src/store/thunks/projects/` — `setCurrentProjectThunk` hydrates `currentProject` from dump before navigation
- API: `src/api/projects/`

### Navigation

- Row click → `setCurrentProjectThunk` → await `200` → `/project-detail-page` (ADR 008)
- `setCurrentProjectThunk` sets `currentProject`, breadcrumbs (Projects → name), resets local-DB / Supabase builder state, and probes supported panels (not from detail-page `useEffect`)
- Detail page is presentational: reads `currentProject` only; no remount loads of hub config / project list

## Related

- [011 – Dev hub feature](./011-dev-hub-feature.md) (superseded for list/detail routing)
- [012 – Terminal dock UI](./012-terminal-dock-ui.md)
- [008 – Detail page routing](./008-detail-page-routing.md)
