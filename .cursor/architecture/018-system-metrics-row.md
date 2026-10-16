# 018 — System metrics row

## Status

Accepted

## Context

Developers use the projects list as the hub home screen. Machine CPU/GPU spikes (many dev servers, Docker, browsers) are easier to diagnose with live metrics above the project table.

## Decision

### UI

- Package: `src/packages/projects/system-metrics-row/`
- Rendered at the top of [`ProjectsTableView`](../src/packages/projects/table/table-view/index.tsx), above the search toolbar
- Polls only while that view is mounted (not on project detail)

### Data

- `GET {NEXT_PUBLIC_API_URL}/api/system-metrics` on hub-express ([express ADR 016](../../../luckee-hub-express-server/.cursor/architecture/016-system-metrics-service.md))
- API client: `src/api/system-metrics/`
- Redux: `systemMetricsBuilder` slice + `fetchSystemMetricsThunk` / `startSystemMetricsPollingThunk` / `stopSystemMetricsPollingThunk`
- No selector modules; whole-slice `useAppSelector` + `useMemo` in the row

### Polling

- Default interval **2000ms**
- Module-level in-flight guard so slow ~800ms samples do not stack
- Keep last snapshot on refresh errors (stale UI + status chip)

## Out of scope

- Metrics when the registry is empty (`ProjectsTable` early return before `ProjectsTableView`)
- Next.js BFF proxy
