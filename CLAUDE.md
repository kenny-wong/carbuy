# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Family car-buying dashboard (UI title "程晞大家庭 - 買車"): a static vanilla HTML/CSS/JS frontend plus Cloudflare Pages Functions backed by a Cloudflare D1 (SQLite) database. Live at https://carbuy.pages.dev. The Pages project uses direct upload, so pushing to GitHub does **not** deploy — `npm run deploy` does. No build step, bundler, linter, or test suite exists.

## Commands

```powershell
npm install
npm run db:migrate:local                          # apply migrations/ to the local D1 (.wrangler/state)
npm run dev                                       # wrangler pages dev: site + /api + local D1 on :8788
npx wrangler d1 migrations create carbuy <name>   # new numbered file in migrations/
npm run db:migrate                                # apply pending migrations to production D1
npm run deploy                                    # upload public/ + functions/ to Pages (production branch main)
npx wrangler d1 execute carbuy --remote --command "SELECT ..."   # ad-hoc query against production
```

Wrangler must be logged in (`npx wrangler whoami`). Port 8788 may already be used by another local project — pass `--port` if `npm run dev` collides.

## Architecture

- **`public/`** is the only folder deployed as static assets: `index.html`, `style.css`, `script.js`, `car_data.json`, `images/`. All client logic lives in one `DOMContentLoaded` closure in `script.js` (filters, sorting, rendering, voting, leaderboard, presence, login, themes). Keep DOM manipulation centralized there.
- **`functions/api/*.js`** — Pages Functions; each file is a route (`/api/cars`, `/api/votes`, `/api/presence`, `/api/audit`, `/api/update-car`) exporting `onRequestGet`/`onRequestPost` and using the D1 binding `env.DB` (configured in `wrangler.jsonc`). Same-origin only, no CORS.
- **D1 quirks**: booleans are stored as `1`/`0`/`NULL` — `api/cars` converts `has_carplay`/`has_rear_camera` back to `true`/`false`/`null` because the client compares with `=== true`. Timestamps are ISO-8601 UTC strings (`...Z`) so `new Date()` parses them and string comparison works (presence uses `last_seen > cutoff`).
- **Car data has two copies that must be kept in sync**: the D1 `cars` table (primary, served by `/api/cars`) and `public/car_data.json` (fallback when the API fails). Cars are keyed by `url` everywhere — `votes.car_url` references it, and updates/deletes match on it.
- **All schema and data changes go through D1 migrations** in `migrations/` (`NNNN_<description>.sql`, created via `wrangler d1 migrations create`). `0001` is the schema, `0002` seeds cars from `car_data.json`.
- **Mock data only when the API is down**: `script.js` injects fake votes and online users only if the API request fails (e.g. plain static preview), never when the API returns empty results.
- **Auth is client-side only**: `familyMembers` in `script.js` maps each name to a "secret" phrase and theme; guests enter a name. Identity is stored in `localStorage` (`carbuy-user`, `carbuy-theme`, `carbuy-guest`) and sent as `user_name` in API bodies. The family list is duplicated in `functions/api/update-car.js`.
- **Phone layout (≤768px)** lives in the last `@media` block of `style.css`: filter groups are wrapped in `.filter-panel`, which is `display: contents` on wider screens (so desktop lays them out directly in `.filter-bar`) and a collapsible 2-column grid on phones behind `#filter-toggle`, which also shows the result summary and active-filter count. The header `.stats` box is hidden on phones, and the theme `<select>` becomes a transparent overlay on a 🎨 button.
- **Themes** (`original`, `xo`, `pochacco`, `kuromi`, `hello-kitty`, `badminton`) are CSS-variable sets in `style.css`, with character images in `public/images/`.

## Car data workflows

Routine data maintenance is defined in `.agent/workflows/` — follow them when asked to add, delete, mark sold, or refresh features of cars:
- `add-cars.md` — scrape Autotrader UK URL(s) for title, price (with `£`), mileage, transmission, engine_fuel, year, horsepower (int), has_carplay, has_rear_camera, image_url (download to `public/images/cars/<listing_id>.jpg` and reference that path, since Autotrader deletes photos when ads expire); **prepend** to `public/car_data.json`; write the INSERT in a new D1 migration using the same `created_at`; `npm run db:migrate`; `npm run deploy`; commit "Add N new car listings" and push.
- `delete-car.md` (also deletes the car's votes), `update-car-status.md` (sets `status = 'SOLD'` and deletes that car's votes), `update-car-features.md`.

## Conventions

- Vanilla JS/CSS only — no frameworks (Tailwind/Bootstrap etc.) unless requested. Keep the existing visual style and layout as much as possible when changing UI.
- "New" badge shows for cars with `created_at` < 3 days old; default sort is Date Added (newest first). Car `status` is `Available`, `SOLD`, or `REMOVED` (family "Remove" button); sold/removed cars get no New badge and can't be voted on.
- **Versioning**: the version appears in `package.json` `version` and twice in `public/index.html` (`<title>` and `<span class="app-version">` in `<h1 id="main-title">`) — bump all together. Feature → minor (reset patch), fix/style → patch, breaking → major.
