# `src/packages` — Feature modules

**Domain-owned UI** for Luckee Hub: one folder per screen (e.g. **`projects/`**, **`project-detail/`**, **`terminal-dock/`**). Route files under **`src/app`** import the package export only.

## Layout (typical)

```text
src/packages/<feature>/
  index.tsx           # Main exported component — `export const Projects = …`
  index.ts            # Barrel re-exports public API (ADR 005)
  …                   # Subfolders: header/, table/, etc.
```

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
