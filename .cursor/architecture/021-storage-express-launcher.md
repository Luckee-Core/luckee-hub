# 021 — Storage Express launcher (Gmail Manager)

## Status

Accepted

## Context

My Gmail Manager splits the **dispatcher** Express API from the **storage** Express API (Postgres data plane). Luckee Hub must catalog a third repo, run migrations against storage `.env`, and start storage only from project detail—not from list Run.

## Decision

### Catalog

- Add `repoType: 'storage-express'` to `hub-catalog.ts` and `projects.registry.json`.
- `my-gmail-manager`: storage repo `my-gmail-manager-storage-express-server`, port `3010`, health `/api/storage/health`.
- `localDatabase.envRepo: 'storage-express'` so `DATABASE_URL` and migrations target the storage checkout.

### Launcher

| Action | Behavior |
|--------|----------|
| List **Run** | Dispatcher + web PTYs only (unchanged). |
| Detail **Start storage** | `POST /api/launcher/projects/:id/run-storage-express` → `git pull --ff-only && npm run dev` in `storageExpressDir`. |
| Detail **Close storage** | `POST .../close-storage-express` kills `storage-express` role only. |
| Project **Close** | Kills express, web, and storage-express sessions. |

Terminal role: `storage-express`. Orphan status tabs attach when health passes (same as API/web).

### Express env

Registry `expressEnv.groups.storage` upserts `STORAGE_MODE`, `STORAGE_EXPRESS_URL`, `STORAGE_EXPRESS_SECRET`, `STORAGE_REQUEST_TIMEOUT_MS` into **dispatcher** `.env`.

### Ports

Storage defaults to `3010` (matches storage server). Blog Studio also catalogs `3010`; avoid running both APIs on the same Mac or override `PORT` in storage `.env`.

## Related

- [013 – Projects and project detail](./013-projects-and-project-detail.md)
- [012 – Terminal dock UI](./012-terminal-dock-ui.md)
- Gmail Manager ADR 020 (dispatcher ↔ storage HTTP)
