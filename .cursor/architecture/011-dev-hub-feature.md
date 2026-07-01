# 011 — Dev Hub feature (Luckee Hub)

> **Superseded** for list/detail routing and package layout by [013 – Projects and project detail](./013-projects-and-project-detail.md). Current UI lives in [`src/packages/projects/`](../../src/packages/projects/).

## Status

Accepted (historical)

## Context

`luckee-hub` is the local web dashboard for starting Luckee open-source studios. UI lives in `src/packages/dev-hub/`; data and actions call `luckee-hub-express-server` on `127.0.0.1:3001`.

## Decision

### Package layout

```text
src/packages/dev-hub/
  index.tsx
  header/index.tsx
  header/buttons/refresh-studios/index.tsx
  studio-cards/index.tsx
  studio-cards/grid/index.tsx
  studio-cards/grid/card/index.tsx
  studio-cards/grid/card/badges/hook-status/index.tsx
  studio-cards/grid/card/meta/index.tsx
  studio-cards/grid/card/actions/run-studio/index.tsx
  studio-cards/grid/card/actions/open-cursor/index.tsx
  studio-cards/grid/card/actions/open-chrome/index.tsx
```

- Folder = component via `index.tsx` (console pattern).
- **No** `store/` or `api/` inside the package — use centralized `src/store/`, `src/api/`, `src/model/` per lead-studio `packages/README.md`.

### Redux

- Dump: `src/store/dumps/devHubStudios.ts` — `Record<studioId, DevHubStudio>`
- Builder: `src/store/builders/devHubBuilder.ts` — `listLoadStatus`, `runningJobIds`, errors
- Thunks: `src/store/thunks/dev-hub/` — manual `AppThunk<Promise<200 | 400 | 500>>` only

### API

- `src/api/dev-hub/client.ts` → Express `NEXT_PUBLIC_API_URL`
- No Next.js `src/app/api` proxy for dev-hub v1

### Actions

| Button | Thunk | Express |
|--------|-------|---------|
| Run | `runDevHubStudioThunk` | `POST /api/studios/:id/run` |
| Open Cursor | `openDevHubCursorThunk` | `POST /api/studios/:id/open-cursor` |
| Open Chrome | `openDevHubChromeThunk` | `POST /api/studios/:id/open-chrome` |

Run uses async job polling via `pollDevHubJobThunk`.
