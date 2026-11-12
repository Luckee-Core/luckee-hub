# AI tab

Shown when `expressEnvGroupIds` includes `ai`.

**Projects:** Lead Studio, Design Prompter, Speech Therapy Tracker, Make It Sound Like Me.

## You enter

- Anthropic API key

## What gets written

`ANTHROPIC_API_KEY=...` into the product **Express** `.env`.

## On revisit

Hub Express checks whether `ANTHROPIC_API_KEY` is set. Shows **Good to go** or **Missing: ANTHROPIC_API_KEY**. The key itself is never shown again.

## Who uses it

The product Express server at runtime (`process.env.ANTHROPIC_API_KEY`). Example in Lead Studio: auto-categorize, website research, contact chat drafts. Restart the product after saving.

## Notes

- The tab hint text mentions Lead Studio specifically, but the tab is shared by all four projects.
- Registry keys per project live under `expressEnv.groups.ai` in `projects.registry.json`.

## Code

- UI: `src/packages/project-detail-page/overview/tabs/ai/`
- Thunk: `saveAiEnvThunk` in `src/store/thunks/projects/express-env-thunk.ts`
- Server: `luckee-hub-express-server/src/services/express-env/`
- Endpoints: `GET` / `POST /api/projects/:id/express-env/ai`
