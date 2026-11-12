# Gateway tab

Shown when `expressEnvGroupIds` includes `gateway`.

**Projects:** On-device dispatcher, Make It Sound Like Me.

## What it's for

Config for the on-device dispatcher (the studio gateway that lazy-starts Express services and proxies LAN callers).

## Keys (hardcoded in the UI)

| Key | Default |
|-----|---------|
| `DISPATCHER_GATE_SECRET` | empty |
| `DISPATCHER_INFRA_ADMIN_SECRET` | empty |
| `GMAIL_STORAGE_DISPATCHER_SECRET` | empty |
| `DISPATCHER_ALLOWED_CLIENT_IPS` | empty |
| `DISPATCHER_SPAWN_ROOTS` | empty |
| `DISPATCHER_BIND_HOST` | `0.0.0.0` |
| `PORT` | `3010` |

"Configured" needs `DISPATCHER_GATE_SECRET` or `GMAIL_STORAGE_DISPATCHER_SECRET`.

## What gets written

Into the product **Express** `.env`. Restart Run after saving.

## Known issue: Make It Sound Like Me

The UI always sends the dispatcher keys above. Make It Sound Like Me's registry `gateway` group uses **different** keys:

- `ON_DEVICE_DISPATCHER_GATEWAY_URL`
- `DISPATCHER_GATE_SECRET`
- `MISLM_STORAGE_ACCESS_MODE`
- `MISLM_STORAGE_DIRECT_URL`

Hub Express rejects keys not in the registry group, so **saving this tab for Make It Sound Like Me fails** with "Key not allowed". Fix: drive the fields from the registry like the Storage tab does.

## Code

- UI: `src/packages/project-detail-page/overview/tabs/gateway/` (saves via `saveExpressEnvGroupApi` directly, no thunk)
- Server: `luckee-hub-express-server/src/services/express-env/`
- Endpoints: `GET` / `POST /api/projects/:id/express-env/gateway`
