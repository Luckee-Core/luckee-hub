# `src/packages` — Feature modules

**Domain-owned UI** for Luckee Hub: one folder per screen (e.g. **`projects/`**, **`project-detail-page/`**, **`terminal-dock/`**). Route files under **`src/app`** import the package export only.

## Layout (typical)

```text
src/packages/<feature>/
  index.tsx           # Package entry only — `export const FeatureName = …`
  table/index.tsx     # Semantic subfolders (not `ui/` or `actions/`)
  table/row/index.tsx
  header/buttons/…/index.tsx
```

**Package root:** one file — `index.tsx`. Do **not** add a root `index.ts` barrel alongside a separate `{feature}.tsx`. Optional `index.ts` barrels belong **inside** subfolders only (e.g. `header/buttons/index.ts`).

> **Legacy:** `projects/` uses `projects.tsx` + `index.ts` — do not copy that pattern for new packages.

## Redux and API in *this* repo

| Concern | Location |
|---------|----------|
| Slices, builders, dumps | **`src/store/`** |
| Thunks | **`src/store/thunks/<domain>/`** |
| HTTP clients | **`src/api/<domain>/`** |
| Domain **`type`**s | **`src/model/`** |

Packages dispatch thunks via **`useAppDispatch`** / **`useAppSelector`** from **`@/store`**. Do **not** add `store/` or `api/` inside packages.

## Related

- [013 – Projects and project detail](../../.cursor/architecture/013-projects-and-project-detail.md)
- [012 – Terminal dock UI](../../.cursor/architecture/012-terminal-dock-ui.md)
- [001 – Redux patterns](../../.cursor/architecture/001-redux-patterns.md)
- [005 – File organization](../../.cursor/architecture/005-file-organization.md)
