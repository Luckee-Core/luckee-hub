# 025 – Terminal sidebar and app init

## Status

Accepted. Supersedes [012 – Terminal dock UI](./012-terminal-dock-ui.md).

## Context

Hub terminals used to live in a bottom dock whose tabs were hand-maintained (`terminalSessionOrder`, `closedTerminalSessionIds`) and only refreshed on explicit actions. on-device-dispatcher moved the same UI into an app-wide right sidebar with a Running list and an always-on sync scheduler (its ADR 018). The hub now matches it.

## Decision

### 1) App-shell component, not a package

`TerminalSidebar` lives in `src/components/terminal-sidebar/` (app shell, like `sidebar/`). `AppLayout` renders it after the main column. `src/packages/` stays screens only.

### 2) App init is independent of screens

- `AppShell` dispatches `initializeAppThunk` once. It holds no state.
- `initializeAppThunk` (idempotent) runs these steps:
  1. `applyTerminalSidebarPreferencesThunk`
  2. `loadHubConfigThunk`
  3. `loadProjectsThunk`
  4. `syncTerminalSessionsThunk({ mode: 'sync' })`
  5. `startRuntimeSyncSchedulerThunk`
- **Screens never poll terminals or project ports.**

### 3) State (flat, ADR 001)

| Slice | Shape | Single writer |
|-------|-------|---------------|
| `terminalSessions` (dump) | `Record<sessionId, TerminalSession>` (hub Express registry) | `syncTerminalSessionsThunk` |
| `projects` (dump) | live port status via `hookStatus` / `storageRunning` | `loadProjectsThunk` (`syncProjectsRuntimeThunk` on the poll) |
| `terminalSidebarBuilder` | primitives: open, width, Running collapsed, active tab, connection epoch, sync timestamps, failures, action feedback | sidebar thunks |

Tab order is derived (`utils/terminals/orderTerminalSessions`: project name, then express → web → storage → scheduler worker). It is not stored.

### 4) Guardrails

| # | Guardrail |
|---|-----------|
| G1 | Single writers (table above). |
| G2 | Full replace from `GET /api/terminals` (`list`) or `POST /api/terminals/sync` (`sync`). |
| G3 | On failure, keep the last known sessions; record `terminalConsecutiveFailures` and `terminalLastSyncError`. |
| G4 | Always-on scheduler: list terminals every 5s, live port probe every 30s, both paused while `document.hidden`. The full `sync` (restores PTYs, probes ports) is heavier, so it is not on the timer. |
| G5 | Full sync + port probe on visible, `focus` and `online`. |
| G6 | `runExclusive` shares the in-flight promise per key; syncs never overlap. |
| G7 | Run / close / storage start / storage close thunks end with a terminal sync instead of editing tabs by hand. |
| G8 | Socket retries exhausted → `reconnectTerminalSessionThunk` (sync, then bump `connectionEpoch` if the session is still live). |
| G9 | `resolveNextActiveTerminalId` after every sync. |
| G10 | Freshness ("synced Ns ago" / warning) is derived from timestamps; there are no loading flags. |
| G11 | ⌘J / Ctrl+J toggles the sidebar (registered by the scheduler). |
| G12 | Tabs cannot be closed; they mirror live sessions. Stop all lives in the Running list (and the existing Stop buttons). |

### 5) Running list

- It shows set-up projects (`enabled`, `hookStatus` not `catalog | disabled | missing`) plus any project with a live terminal, running projects first.
- Tier dots are derived in `resolve-project-runtime.ts`:
  - **A** express: `api_running | ready`
  - **W** web: `web_running | ready`
  - **S** storage: `storageRunning`
  - **L** scheduler worker: a session exists
- Each dot is green when its port is up or its terminal is open, amber while a run job is in flight, and gray otherwise. Clicking a dot focuses that terminal.
- Start = `runProjectThunk(projectId)`. Stop all = `closeProjectTerminalsThunk(projectId)`. Both are wrapped in sidebar thunks that record action feedback.

### 6) Terminals (differences from on-device-dispatcher)

- Interactive PTYs: input and resize go over `ws …/api/terminals/ws/:id` (`api/projects/terminal-connection.ts`).
- Every live session keeps its own xterm mounted (inactive ones are invisible), and the sidebar panel stays mounted while collapsed, so scrollback and sockets survive tab switches and collapse.
- There is no `lastOutputAt` from hub Express, so there are no activity labels.

### 7) Styling exception (ADR 003)

The sidebar width is set with `ref.style.setProperty('--terminal-sidebar-width', …)` and read by `w-[var(--terminal-sidebar-width,480px)]`. It is the only runtime style in the sidebar.

## Related

- [001 – Redux patterns](./001-redux-patterns.md) · [003 – Styling rules](./003-styling-rules.md) · [013 – Projects and project detail](./013-projects-and-project-detail.md)
- on-device-dispatcher-web ADR 018 (`.cursor/architecture/018-terminal-sidebar.md`)
