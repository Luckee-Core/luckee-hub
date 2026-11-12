# Supabase step

Shown on the **API Express** repo workstation when `supabaseSupported: true`.

**Projects:** Lead Studio, Reddit Scraper, Trade Stocks, Make It Sound Like Me, My Many Domains.

## You enter

- Supabase project URL (`https://{ref}.supabase.co`)
- Service role key

Hub never asks for the database password. First-time setup is an inline form; once configured, **Edit keys** opens a modal.

## What gets written

Into the product **Express** `.env`:

| Key | Source |
|-----|--------|
| `SUPABASE_URL` | URL you entered |
| `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY` | Service role key — written under whichever name the registry's `supabase.envKeys` lists (`SUPABASE_SERVICE_ROLE_KEY` by default) |

`DATABASE_URL` is **not** written here — it belongs to local Postgres / the storage data plane.

## On revisit

Hub Express reads the `.env` and reports:

- **Configured** — every key in the registry's `supabase.envKeys` is present
- **Tables exist** — calls the Supabase REST API with the service key (`GET /rest/v1/{table}?limit=0`) for each of `supabase.expectedTables`. Missing tables are listed, with a pointer to the registry's `supabase.bootstrapSql` to run in the Supabase SQL editor. **Check again** re-probes.

Hub does not create tables itself.

## Run gate

**Run** is blocked if Supabase keys are missing (`process-ensure-supabase-config-for-run.ts`). Missing tables do not block Run.

## Code

- UI: `src/packages/project-detail-page/environment/supabase-panel/` (`keys-form/`, `edit-keys-modal/`)
- Thunks: `src/store/thunks/projects/supabase-config-thunk.ts`
- Server: `luckee-hub-express-server/src/services/supabase-config/`, table check in `src/utils/supabase-config/check-supabase-tables.ts`
- Endpoints: `GET /api/projects/:id/supabase`, `POST .../supabase/config`
