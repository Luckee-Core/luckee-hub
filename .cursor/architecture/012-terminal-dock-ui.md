# 012 — Terminal dock UI

## Status

Accepted

## Context

Luckee Hub Run spawns embedded PTYs in hub-express. The web UI must show Cursor-style interactive terminals in a bottom dock.

## Decision

### Layout

- [`src/components/app-shell/index.tsx`](../../src/components/app-shell/index.tsx) — one client shell under `ReduxProvider`; mounts `AppLayout` with a single `TerminalDock`. Loads hub config, the non-live catalog, and `syncTerminalSessionsThunk` once.
- [`src/components/app-layout/index.tsx`](../../src/components/app-layout/index.tsx) — flex column; optional `terminalDock` slot below scrollable main (shell is the only caller that passes it)
- [`src/packages/terminal-dock/`](../../src/packages/terminal-dock/) — tabs, xterm panel, collapse toggle
- List and detail pages do **not** each mount a dock. Navigation between `/projects` and `/project-detail-page` keeps sockets alive.

### Collapsed dock

Collapsed dock keeps panels mounted (`hidden`). Inactive tabs already stay mounted via `invisible` in the session panel.

### xterm.js

- `@xterm/xterm` + `@xterm/addon-fit` in `terminal-dock/session-panel/index.tsx`
- Import `@xterm/xterm/css/xterm.css` in the session panel

### WebSocket

- Connect lives in `src/api/projects/terminal-connection.ts`
- Unexpected `onclose` retries (400ms, 800ms, 1600ms). Intentional `close()` does not call `onClose` and does not print a banner.
- `[session disconnected]` means retries failed. A missing server session removes the tab on `POST /api/terminals/sync`.
- Refresh live-probes, syncs sessions, and bumps `projectsBuilder.terminalConnectionEpoch` so panels reopen sockets for the same session ids.

### State (centralized)

- Dump: `terminalSessions`
- Builder primitives: `terminalSessionOrder`, `activeTerminalSessionId`, `terminalDockOpen`, `closedTerminalSessionIds`, `terminalConnectionEpoch`
- Run thunk opens dock and sets sessions from `POST /api/launcher/projects/:id/run` response

### No store inside package

Follow ADR 013 — thunks and API in `src/store/`, `src/api/`, `src/model/`.

## Related

- [013 – Projects and project detail](./013-projects-and-project-detail.md)
- [011 – Dev hub feature](./011-dev-hub-feature.md) (superseded)
