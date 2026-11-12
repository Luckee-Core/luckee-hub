# Storage tab

Shown when `expressEnvGroupIds` includes `storage`.

**Projects:** Code Control, My Fundraise, Finances Manager, My Gmail Manager, Estimate & Proposals.

## What it's for

Tells the product's main Express API how to reach its **Storage Express** server (the repo that owns the database).

## Keys

Not hardcoded in the UI. The tab renders one field per key in that project's `expressEnv.groups.storage` in `projects.registry.json`. Examples:

| Project | Keys |
|---------|------|
| My Fundraise | `MY_FUNDRAISE_STORAGE_URL`, `MY_FUNDRAISE_STORAGE_SECRET`, `CANONICAL_DATA_ACCESS_MODE`, `STORAGE_REQUEST_TIMEOUT_MS` |
| Finances Manager | `FINANCES_MANAGER_STORAGE_URL`, `FINANCES_MANAGER_STORAGE_SECRET`, `CANONICAL_DATA_ACCESS_MODE` |
| Code Control | `CODE_CONTROL_STORAGE_URL`, `CODE_CONTROL_STORAGE_SECRET`, `MAIN_GATEWAY_URL`, `DISPATCHER_GATE_SECRET`, `STORAGE_ACCESS_MODE`, `STORAGE_REQUEST_TIMEOUT_MS` |

## Prefilled defaults

| Key pattern | Default |
|-------------|---------|
| `*_STORAGE_URL`, `STORAGE_EXPRESS_URL` | `http://127.0.0.1:{storagePort}` |
| `CANONICAL_DATA_ACCESS_MODE` | `direct` |
| `STORAGE_MODE` | `remote` |
| `STORAGE_REQUEST_TIMEOUT_MS` | `120000` |

Secrets start empty. The secret must match what the Storage Express server expects.

## What gets written

Non-empty fields into the product **Express** `.env`. "Configured" ignores `STORAGE_REQUEST_TIMEOUT_MS`.

## Code

- UI: `src/packages/project-detail-page/overview/tabs/storage/` (saves via `saveExpressEnvGroupApi` directly, no thunk)
- Server: `luckee-hub-express-server/src/services/express-env/`
- Endpoints: `GET` / `POST /api/projects/:id/express-env/storage`
