# Luckee Dev Hub (web)

Next.js UI for the local Luckee Dev Hub. Pairs with sibling repo `luckee-hub-express-server`.

## Desktop launcher (Mac + Windows)

Clone both repos as siblings, then install a Desktop icon from this repo:

```bash
git clone <luckee-hub-url> luckee-hub
git clone <luckee-hub-express-server-url> luckee-hub-express-server
cd luckee-hub
npm install
npm run dev:desktop
```

| OS | What gets installed |
|----|---------------------|
| macOS | `~/Desktop/Luckee Dev Hub.app` |
| Windows | `%USERPROFILE%\Desktop\Luckee Dev Hub.lnk` |

Double-click the icon to start Express (`:3001`) + Web (`:3000`) and open the browser.

Override paths with `LUCKEE_HUB_WEB_DIR` / `LUCKEE_HUB_EXPRESS_DIR` if the repos are not siblings.

## Run (without desktop icon)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture & agent rules

Follow **`.cursor/rules/AGENTS.md`** and **`.cursor/architecture/`**.

| Rule | Summary |
|------|---------|
| Redux | **Zero selector functions** — `useAppSelector((s) => s.slice)` only; derive with `useMemo` |
| Routes | **No `[id]`** — use static `/entity-detail-page` + `current*` in Redux |
| Utils | **Generic** helpers (`date/`, `string/`) — not table-specific formatters |

## Layout

- **src/app** — routes and layout
- **src/store** — Redux (store, reducer, one minimal slice)
- **src/utils** — shared utilities
- **src/components** — shared UI (e.g. ReduxProvider)

## As GitHub template

Repo → Settings → General → check **Template repository**. Then use as `GITHUB_TEMPLATE_WEB` when creating new web repos from the panel.
