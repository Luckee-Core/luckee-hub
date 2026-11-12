# Local database panel

Not a tab. A panel **below** the tabs, shown when `localDatabaseSupported: true`.

**Projects:** Code Control, Innertube, My Fundraise, My Health, Finances Manager, Code Commit Summaries, My Gmail Manager, Design Prompter, Speech Therapy Tracker, Make It Sound Like Me, My Many Domains, Estimate & Proposals.

## What it's for

Get a **local Postgres** database ready for the product on your Mac. No form to fill: it runs setup steps.

## Steps it can run

Driven by the project's `localDatabase` block in `projects.registry.json`:

1. Postgres installed (`brew install postgresql@16`)
2. Postgres running (`brew services start ...`)
3. Database created (`databaseName`)
4. Migrations applied (`migrationsDir` + `migrationFiles`)
5. `DATABASE_URL` written to `.env`

Each step can run alone, or **Set up database** runs all runnable steps in order.

## Which `.env` gets `DATABASE_URL`

The Express repo by default. If the registry sets `envRepo: "storage-express"`, it goes into the **Storage Express** repo's `.env` instead.

## On revisit

Hub Express probes live state: is Postgres up, does the DB exist, do `expectedTables` exist, is `DATABASE_URL` set. Nothing is cached in the browser.

## Run gate

**Run** checks the database is ready first (`process-ensure-local-database-for-run.ts`). Hub can also stop Postgres it started when no project needs it.

## Code

- UI: `src/packages/project-detail-page/local-database/`
- Thunks: `src/store/thunks/projects/local-database-thunk.ts`, `run-local-database-step-thunk.ts`
- Server: `luckee-hub-express-server/src/services/local-database/`, helpers in `src/utils/local-database/`
- Endpoints: `GET /api/projects/:id/local-database`, `POST .../setup`, `POST .../cleanup`, `POST .../steps/:stepId/run`
