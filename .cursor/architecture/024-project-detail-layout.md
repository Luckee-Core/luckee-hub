# ADR 024: Project detail layout

**Status:** Accepted
**Date:** 2026-11-11 (updated 2026-03-28)

## Context

Projects are multi-repo systems (Web, API Express, Storage, Console, Dispatcher). A single Environment tab editing only the API express `.env` did not match how setup actually works.

## Decision

The page is a **summary panel** plus **Overview** and **Repos** tabs. **Overview** is a written guide to the project — what it is, who it's for, how its parts fit together, common tasks, troubleshooting — loaded from hub Express `data/project-overviews/<projectId>.json` (`GET /api/projects/:id/overview`, `projectOverviews` dump, `loadProjectOverviewThunk` on project open). Repo status lives only on **Repos**. Selecting a repo hides the tabs and shows its **workstation** directly under the summary ("Back to repos" first):

- **Repo header** — repo name (title), role badge, local path, GitHub (new tab) and Finder buttons, and a **Setup** overview: one chip per walkthrough step with its status; clicking scrolls to the step
- **Walkthrough** — numbered step cards (`WorkstationStep`), only those that apply:
  1. **Choose data plane** — API Express, when the registry defines `dataPlane`
  2. **Connect Supabase** — API Express, when `supabaseSupported` (a. keys → b. seed schema)
  3. **Set up local database** — Storage, when the active data plane uses local Postgres
  4. **Fill in environment** — any cloned repo; numbered sections from `.env.example`, "Save & continue" moves to the next incomplete section. A section is complete when every non-optional key has a value.

Step list and statuses come from `useRepoSetupSteps(repo)` so the header and cards never disagree.

```text
src/packages/project-detail-page/
  index.tsx
  summary/
  tabs/                  # Overview | Repos (hidden while a repo is selected)
  overview/              # project guide (about, capabilities, common tasks, how it fits, troubleshooting, reference)
  repos/                 # repo cards → workstation
  repo-workstation/
    header/              # repo header + setup overview, storage Start/Stop, copy clone command
    setup-steps/         # useRepoSetupSteps
    step/                # WorkstationStep card chrome
    data-plane/
    environment/         # section rail + panel
  environment/supabase-panel/   # express workstation step
  local-database/        # storage workstation step (API Express when the project has no storage repo)
  status/
```

Finder: `POST /api/launcher/projects/:id/open-folder` with `{ role, repoName }` — hub Express resolves the path; the browser never sends one.

### State

- **`projectDetailBuilder`**: `activeTab`, `activeRepo`, `activeEnvSectionId`, `envSectionForms`
- **`envProbes`** keyed by `projectId:role:repoName`
- **`dataPlaneProbes`** keyed by `projectId`
- Thunks: `probeRepoEnvThunk`, `saveActiveEnvSectionThunk`, `selectEnvSectionThunk`, `openRepoFolderThunk`, `probeDataPlaneThunk`, `setDataPlaneThunk`

Hub Express: `GET/POST /api/projects/:id/env`, `GET/POST /api/projects/:id/data-plane`. Registry repos have `role`; multi-mode projects use `dataPlane` instead of `expressEnv.groups`.

## Related

- [013 – Projects and project detail](./013-projects-and-project-detail.md)
- [017 – Package form inputs](./017-package-form-inputs.md)
