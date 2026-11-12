# Project detail — repos and workstations

Open a project from `/projects`, then use the **Repos** tab. Each checkout (Web, API Express, Storage, Console, Dispatcher, …) has its own workstation.

## Rules

- Config is written into **that repo's** `.env` on disk (via hub Express). The hub does not store secret values.
- Environment sections come from each repo's **`.env.example`** comment headers.
- Non-secret keys are shown and editable; secret keys and credentialed database URLs return **Set / Missing** only.
- **Data plane** (Supabase vs local Postgres vs remote storage) is chosen on the **API Express** workstation when the registry defines `dataPlane`. That choice hides env sections that belong to inactive modes.

## Registry

`luckee-hub-express-server/data/projects.registry.json`:

- Each repo has `role`: `web`, `express`, `storage`, `console`, `dispatcher`, `dispatcher-web`, `mobile`
- `dataPlane` replaces `expressEnv.groups` for mode-switching projects (e.g. `STORAGE_MODE`, `CANONICAL_DATA_ACCESS_MODE`)

## Code map

| Layer | Location |
|-------|----------|
| Page | `src/packages/project-detail-page/` |
| Workstation UI | `src/packages/project-detail-page/repo-workstation/` |
| Hub API | `luckee-hub-express-server/src/services/project-env/` |

See also [Supabase](./supabase.md) and [Local database](./local-database.md).
