# `src/packages` — Feature modules

**Domain-owned UI** for Luckee Hub: one folder per screen (e.g. **`dev-hub/`**). Route files under **`src/app`** import the package export only.

## Layout (typical)

```text
src/packages/<feature>/
  index.tsx           # Main exported component — `export const DevHub = …`
  …                   # Subfolders: header/, studio-cards/, etc.
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

- [011 – Dev hub feature](../../.cursor/architecture/011-dev-hub-feature.md)
- [001 – Redux patterns](../../.cursor/architecture/001-redux-patterns.md)
