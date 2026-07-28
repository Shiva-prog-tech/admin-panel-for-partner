# Partner Admin Panel

Swipeo tenant backoffice — a Next.js App Router panel for issuing cards, reviewing
cardholders, and monitoring float, custody and API health for one partner tenant.

Built to the supplied design spec: floating white sidebar, gold accent system,
seeded datasets that reproduce the reference screens row for row (103 end users,
84 cardholders, `$1924.34` USD float, five custody balances).

## Stack

| Concern      | Choice                                             |
| ------------ | -------------------------------------------------- |
| Framework    | Next.js 15 (App Router) + React 19 + TypeScript    |
| Styling      | SCSS (`styles/App.scss`) over CSS custom properties |
| State        | Redux Toolkit (`redux/`)                            |
| Data access  | axios instance + per-resource services             |
| Charts       | Hand-rolled SVG (`Components/Charts`) — no chart lib |
| Icons        | Single inline stroked set (`Components/Icons/Icon.tsx`) |

No runtime asset dependencies: the logo, avatar, sparklines, area chart and
sidebar line-art are all inline SVG, so the panel renders identically offline.

## Getting started

```bash
npm install
cp .env.development .env   # optional: the defaults already work
npm run dev                # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npx tsc --noEmit`.

## Structure

```
app/                     # App Router — routes + API handlers
├── api/{auth,dashboard,end-users,cardholders,custody}/route.ts
├── end-users/, cardholders/, cards/, transactions/, card-orders/,
│   float/, custody/, crypto-txs/, webhooks/, api-keys/,
│   audit-log/, settings/        (each: page.tsx)
├── layout.tsx, page.tsx, loading.tsx, not-found.tsx, icon.svg
Components/              # Shared UI
├── AppShell/, Sidebar/, Topbar/, PageHeader/, DateRangePicker/
├── Table/               # DataTable, TableCard, SearchField, FilterMenu,
│                        #   RowMenu, RefCell, PerPageSelect, ExportButton
├── Charts/              # Sparkline, AreaChart, EcgLine, chartMath
├── StatCard/, Badge/, Pagination/, PopUps/, Toast/, Loader/,
│   Avatar/, Icons/, CommandPalette/
modules/                 # Page-level feature modules, one per nav item
├── Dashboard/, EndUsers/, Cardholders/, Cards/, Transactions/,
│   CardOrders/, Float/, Custody/, CryptoTxs/, Webhooks/,
│   ApiKeys/, AuditLog/, Settings/
customHooks/             # useTableState, useClickOutside, useTheme,
│                        #   useCopyToClipboard, useDebounce, useHotkey, useMediaQuery
redux/                   # store.ts, provider.tsx, hooks/, reducers/
│                        #   (auth, config, filters, popups, toast)
services/                # auth, partner, records
libs/firebase.ts         # optional push wiring (lazy, no hard dependency)
utils/                   # axios, helper, Config, coins, CountryData, mockData/
types/                   # global.ts, constants.ts
styles/                  # globals.css, App.scss, _variables, _mixins, _media,
│                        #   components/*, pages/*
public/assets/           # svgs, pngs, images
config                   # next.config.ts, tsconfig.json, eslint.config.mjs,
                         #   .env.development/.production, Jenkinsfile
```

## Design system

Tokens live in [styles/globals.css](styles/globals.css) as CSS custom properties,
so the theme flips at runtime with no re-render. Light and dark are both
first-class; the boot script in [app/layout.tsx](app/layout.tsx) stamps the
stored theme onto `<html>` before first paint to avoid a flash.

Key values: brand `#dfa124` with a `180deg` gradient for filled actions, page
background `#f2f2f3`, panel radius `22px`, card radius `14px`, status badges at
`6px`. Sass partials only hold static geometry, breakpoints and mixins.

## Data

`NEXT_PUBLIC_ENABLE_MOCK_DATA=true` (the default) serves the seeded datasets in
[utils/mockData](utils/mockData). Every generator is seeded with a deterministic
PRNG and every date is formatted without `Intl`, so server and client markup
match byte for byte — no hydration warnings and stable screenshots.

Flip the flag to `false` and point `NEXT_PUBLIC_API_BASE_URL` at the backoffice
API; `services/records.service.ts` already speaks the paginated contract
(`{ rows, total, page, pageSize }`) that the route handlers in `app/api` mirror.

## Interaction notes

- `⌘K` / `Ctrl+K` opens the command palette; `Esc` closes any overlay.
- Tables search, sort (click a header), filter by status and paginate entirely
  client-side via `useTableState` — swap the body for server paging later without
  touching the pages.
- **Export** builds a CSV in the browser from the current page of rows.
- The sidebar collapses behind a scrim below 1080px.
