# Setup tab

Shown for **every** project. Read-only checklist. It does **not** write any `.env`.

## What it checks

| Check | Meaning |
|-------|---------|
| Hub configured | Project has an entry in `hub.local.json` |
| Web path | Next.js repo folder exists on disk |
| Express path | Express repo folder exists on disk |
| Storage path | Storage Express repo folder exists (only projects with a `storage-express` repo) |
| Web / Express / Storage installed | `node_modules` present in each repo |

## How things get fixed

- Missing paths or `node_modules` → run **Setup** (launcher clones into `luckee/` and runs `npm install`).
- Paths live in `luckee-hub-express-server/hub.local.json`.

## Code

- UI: `src/packages/project-detail-page/overview/tabs/setup/`
- Data: comes from the project list probe (`GET /api/projects`), not a separate endpoint.
