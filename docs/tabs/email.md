# Emailing tab

Shown when `expressEnvGroupIds` includes `email`.

**Projects:** none in the current catalog. The tab exists but nothing turns it on.

## You enter

| Field | Key | Required |
|-------|-----|----------|
| Gmail service account JSON path | `GMAIL_SERVICE_ACCOUNT_JSON_PATH` | yes |
| Send-as email | `GMAIL_SEND_AS_EMAIL` | yes |
| From name | `GMAIL_FROM_NAME` | no |
| Open-tracking base URL | `EMAIL_OPEN_TRACKING_BASE_URL` | no |

Empty fields are skipped on save.

## What gets written

Those keys into the product **Express** `.env`. "Configured" only needs the two required keys.

## To enable it for a project

Add an `email` group with those keys under that project's `expressEnv.groups` in `projects.registry.json`. Restart hub Express.

## Code

- UI: `src/packages/project-detail-page/overview/tabs/email/`
- Thunk: `saveEmailEnvThunk` in `src/store/thunks/projects/express-env-thunk.ts`
- Server: `luckee-hub-express-server/src/services/express-env/`
