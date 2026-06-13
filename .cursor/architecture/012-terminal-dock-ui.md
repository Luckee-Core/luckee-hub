# 012 — Terminal dock UI

## Status

Accepted

## Context

Luckee Hub Run spawns embedded PTYs in hub-express. The web UI must show Cursor-style interactive terminals in a bottom dock.

## Decision

### Layout

- [`src/components/app-layout/index.tsx`](../src/components/app-layout/index.tsx) — flex column; optional `terminalDock` slot below scrollable main
- [`src/packages/terminal-dock/`](../src/packages/terminal-dock/) — tabs, xterm panel, collapse toggle

### xterm.js

- `@xterm/xterm` + `@xterm/addon-fit` in `terminal-dock/panel/index.tsx`
- Import `@xterm/xterm/css/xterm.css` in panel component

### State (centralized)

- `projectsBuilder.terminalSessions`, `activeTerminalSessionId`, `terminalDockOpen`
- Run thunk opens dock and sets sessions from `POST /api/launcher/projects/:id/run` response
- WebSocket connect lives in `src/api/projects/terminal-connection.ts`; panel calls it on active tab change

### No store inside package

Follow ADR 013 — thunks and API in `src/store/`, `src/api/`, `src/model/`.

## Related

- [013 – Projects and project detail](./013-projects-and-project-detail.md)
- [011 – Dev hub feature](./011-dev-hub-feature.md) (superseded)
