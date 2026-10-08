# Next.js Template — Agent Rules

BEFORE implementing ANY feature, you MUST:
1. Read `.cursor/architecture/README.md`.
2. Read the relevant ADRs (**001–008**, **010**, **016–017**). For hub launcher, terminals, or projects, also read product **011–013**.
3. Follow documented patterns EXACTLY; if no pattern exists, add an ADR first.

## Redux — zero selector functions

- **No** `createSelector`, Reselect, `src/store/selectors/`, or `**/selectors.ts`.
- **`useAppSelector` only** as `(state) => state.<sliceKey>` — one whole top-level slice per call, **no** transforms inside the callback.
- **Derive** with `useMemo` in components (`Object.values`, `[id]` lookup, filters, joins).
- **No** view-models or joined row types stored in Redux.

## Routing — static detail pages

- **Never** `src/app/{entity}/[id]/page.tsx` or `[orderId]` dynamic segments.
- **Use** `src/app/{entity}-detail-page/page.tsx` (e.g. `/order-detail-page`).
- Detail screen reads **`current*`** from Redux; open via thunk + `router.push(DETAIL_PAGE_PATH)`.
- **No** `useParams` / `useSearchParams` for entity id on detail pages.

## Utils — generic only

- `src/utils/{capability}/` — `date/`, `string/`, `number/` (formatters, parsers, clamps).
- **Not** `src/utils/{table}/` — no `utils/orders/format-order-status.ts`.
- Table/screen-specific formatters live in **`src/packages/{feature}/`**.

## Non-negotiable rules

### Redux
1. Flat layers: `dumps/`, `current/`, `builders/`, `config/` per [001](./architecture/001-redux-patterns.md).
2. Manual thunks only (`AppThunk<Promise<200 | 400 | 500>>`); no `createAsyncThunk`.
3. Async side effects in thunks only, not components.
4. Form save thunks take no payload — read `current*` via `getState()` per [017](./architecture/017-package-form-inputs.md).

### Components
1. Thin `src/app/**/page.tsx`; feature UI in `src/packages/<feature>/`.
2. Shared UI in `src/components/`.
3. Call thunks directly — no custom hooks that only wrap thunks.
4. `export const` components; `type` not `interface`.
5. Package tables use `{collection}/index.tsx` + `row/index.tsx`; form modals take no props per [017](./architecture/017-package-form-inputs.md). Existing `packages/projects/actions/` and `packages/project-detail-page/actions/` stay until a later cleanup.

### Styling
1. Styles object pattern per [003](./architecture/003-styling-rules.md).
2. No inline `style={{}}` or per-component CSS modules.

### API
1. Handlers in `src/app/api/**/route.ts`; thin handlers, typed DTOs.

### Files
1. kebab-case, one export per file; package root is `index.tsx` per [005](./architecture/005-file-organization.md). Existing `packages/projects/index.ts` + `projects.tsx` stay.
2. Persisted entities in `src/model/{entity}.ts` per [016](./architecture/016-domain-models.md).

## Quick reference

- [001 – Redux patterns](./architecture/001-redux-patterns.md)
- [002 – Component composition](./architecture/002-component-composition.md)
- [006 – Constants & utilities](./architecture/006-constants-utilities.md)
- [008 – Detail page routing](./architecture/008-detail-page-routing.md)
- [007 – Starter layout](./architecture/007-starter-template-layout.md)
- [010 – Public Express reads](./architecture/010-public-blog-express-fetch.md)
- [012 – Terminal dock UI](./architecture/012-terminal-dock-ui.md)
- [013 – Projects and project detail](./architecture/013-projects-and-project-detail.md)
- [016 – Domain models](./architecture/016-domain-models.md)
- [017 – Package form inputs](./architecture/017-package-form-inputs.md)
