# 018 — System metrics row

## Status

Accepted

## Context

Developers use the projects list as the hub home screen. Machine CPU/GPU spikes (many dev servers, Docker, browsers) are easier to diagnose with live metrics above the project table.

## Decision

### UI

- Package: `src/packages/projects/system-metrics-header-item/`
- Compact CPU / GPU bars on the right of the app header. `AppShell` passes it to `AppLayout` as `headerEndContent`; the item renders nothing off `/projects` and is hidden below the `md` breakpoint so it never covers the breadcrumb
- Top CPU processes show in the item's hover title, not inline
- Polls only while the route is `/projects` via `SystemMetricsPollingListener` in root layout (stops on project detail and other routes)

### Data

- `GET {NEXT_PUBLIC_API_URL}/api/system-metrics` on hub-express ([express ADR 016](../../../luckee-hub-express-server/.cursor/architecture/016-system-metrics-service.md))
- API client: `src/api/system-metrics/`
- Redux: `systemMetricsBuilder` slice + `fetchSystemMetricsThunk` / `startSystemMetricsPollingThunk` / `stopSystemMetricsPollingThunk`
- No selector modules; whole-slice `useAppSelector` + `useMemo` in the row

### Polling

- Default interval **5000ms**
- Module-level in-flight guard so slow ~800ms samples do not stack
- Keep last snapshot on refresh errors (dimmed bars, error in the hover title)

## Out of scope

- Next.js BFF proxy
