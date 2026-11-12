# Google Maps Scraper tab

Shown when `expressEnvGroupIds` includes `google-maps`.

**Projects:** Lead Studio only.

## You enter

- Google Maps API key (Places API)

## What gets written

`GOOGLE_MAPS_API_KEY=...` into the product **Express** `.env`.

## On revisit

Present / missing check only. Value never shown again.

## Who uses it

Lead Studio Express: Places Text Search and Google Maps scrape runs (`process.env.GOOGLE_MAPS_API_KEY`). Restart after saving.

## Code

- UI: `src/packages/project-detail-page/overview/tabs/google-maps/`
- Thunk: `saveGoogleMapsEnvThunk` in `src/store/thunks/projects/express-env-thunk.ts`
- Server: `luckee-hub-express-server/src/services/express-env/`
- Endpoints: `GET` / `POST /api/projects/:id/express-env/google-maps`
