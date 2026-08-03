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
| Data access  | axios instance + per-resource services (external API) |
| Charts       | Hand-rolled SVG (`Components/Charts`) — no chart lib |
| Icons        | Single inline stroked set (`Components/Icons`)      |

No runtime asset dependencies: the logo, avatar, sparklines, area chart and
sidebar line-art are all inline SVG, so the panel renders identically offline.

## Getting started

This project uses **yarn** (1.x), matching the [Jenkinsfile](Jenkinsfile). Use
`yarn`, not `npm` — mixing the two produces a competing `package-lock.json` and
CI installs with `--frozen-lockfile`, so a stale `yarn.lock` fails the build.

```bash
yarn install
cp .env.development .env   # optional: the defaults already work
yarn dev                   # http://localhost:3000
```

Other scripts: `yarn build`, `yarn start`, `yarn lint`, `yarn typecheck`.

```bash
yarn verify           # typecheck + lint — before committing
```

Two failure modes get past `verify`, so check them by eye when you touch either
area. A mistyped CSS Module key (`styles.valuSm`) resolves to `undefined`, so
React drops the attribute and the element renders unstyled with a green `tsc`,
`eslint` **and** `next build`. Likewise a page passing `filters: { x }` to a
service that does not handle `x`: the dropdown moves, the table does not, and
both sides type-check in isolation.

## Structure

Every component is a directory entered through `index.tsx`, with its styles
co-located as a CSS Module beside it. See [STRUCTURE.md](STRUCTURE.md) for the
conventions and the reasoning behind what stays global.

```
app/                            # App Router
├── (app)/                      # behind the session guard, inside the chrome
│   ├── end-users/ cardholders/ cards/ transactions/ card-orders/ float/
│   │   custody/ crypto-txs/ webhooks/ api-keys/ audit-log/ settings/
│   └── layout.tsx  page.tsx  loading.tsx
├── (auth)/                     # no chrome
│   ├── sign-in/  sign-up/
│   └── layout.tsx
└── layout.tsx  not-found.tsx  NotFound.module.scss  icon.svg
                                # no app/api — see "Backend" below

Components/                     # each: index.tsx + <Name>.module.scss
├── DashboardWrapper/           # the shell
│   ├── Components/NavBar/      #   top bar
│   └── Components/SideBar/     #   primary nav
├── Table/                      # index.tsx (DataTable), Table_V2.tsx (shell),
│                               #   table.css (global cell helpers)
├── Charts/{Sparkline,AreaChart,EcgLine}/ + chartMath.ts
├── Dropdown/                   # popover primitive, 6 consumers
├── Button/ PanelCard/ Tag/     # design-system primitives (were global CSS)
├── ListingPage/                # listing scaffolding + StatGrid, 12 modules
├── PopupHandler/               # central modal router
├── AuthWrapper/ AuthShell/ SocialButtons/
├── TextField/ PasswordField/ Checkbox/ Select/ SearchField/
├── SelectFilter/ PerPageSelect/ FilterMenu/ RowMenu/ RefCell/ ExportButton/
├── StatCard/ Badge/ CoinIcon/ Pagination/ DetailGrid/ PageHeader/
├── Popup/ ConfirmPopup/ Toast/ Loader/ CommandPalette/ DateRangePicker/
├── LanguageSelect/ Avatar/NameAvatar.tsx
└── Icons/ Illustrations/       # inline SVG, no image assets

modules/                        # each: index.tsx + <Name>Module.module.scss
├── DashboardModule/Components/{FloatCard,OpsHealthCard,QuickLinks}/
├── EndUsersModule/components/AddEndUserModal/
├── CardholdersModule/components/AddCardholderModal/
├── FloatModule/components/ConvertCard/
├── WebhooksModule/components/WebhookConfigCard/
├── CardsModule/ TransactionModule/ CardOrdersModule/ CustodyModule/
│   CryptoTxsModule/ ApiKeysModule/ AuditLogModule/ SettingsModule/
├── SignInModule/ SignUpModule/
└── notificationdropdown/ ProfileDropdownModule/   # NavBar panels

customHooks/     useServerTable, useClickOutside, useTheme, useSignOut,
                 useCopyToClipboard, useDebounce, useHotkey, useMediaQuery
redux/           store.ts, provider.tsx, hooks/,
                 reducers/{Auth,Config,Filters,PopUps,Toast}Reducer.ts
services/        auth.service.ts, tenant.service.ts   # cross-cutting only
                 list.ts                              # shared paginated fetch
                 (per-resource services live in modules/*/services/)
utils/           axios, helper, Config, session, coins, CountryData,
                 ImageRelativePaths            # leaf layer, no app imports
mockData/        seeded fixtures for every resource (dev-only)
types/           global.ts, constants.ts   # cross-cutting only
                 (per-module types.ts + constants.ts live in modules/*)
libs/            firebase.ts   # optional push wiring, no hard dependency
styles/          _index.scss, App.scss, globals.css, media.scss, mixins.scss
                 # App.scss is utilities only (2KB); globals.css holds tokens
public/          assets/{svgs,pngs,images}, terms-and-conditions.html
config           next.config.ts, postcss.config.mjs, tsconfig.json,
                 eslint.config.mjs, .env.development/.production, Jenkinsfile
```

## Backend

**This app hosts no backend.** There is deliberately no `app/api/` directory —
the panel is a client for a separate service set by `NEXT_PUBLIC_API_BASE_URL`,
and every route builds as static (`○`).

A Next.js route handler would only be justified for work that cannot run in the
browser — a third-party key that must stay server-side, or an httpOnly
session cookie. Neither applies today, so none exist.

`utils/axios.ts` throws in development if `NEXT_PUBLIC_API_BASE_URL` is unset,
rather than letting requests silently resolve against this app's own origin.

## Service layer

Two tiers, mirroring the reference:

- **`services/`** holds only cross-cutting domains — `auth.service.ts` (sign
  in/up/out) and `tenant.service.ts` (read by NavBar, Float and Settings). Named
  `<domain>.service.ts`.
- **`modules/<X>/services/<x>Service.ts`** holds each module's own resource
  access, co-located with its only consumer — the same convention as the
  reference's `Components/FilmoraPopup/services/airdropService.ts`.

`services/list.ts` is the shared piece both tiers build on: `fetchList()` owns
the `NEXT_PUBLIC_ENABLE_MOCK_DATA` switch and the `{ rows, total, page,
pageSize }` contract, so no component ever imports an HTTP client and the flag is
checked in exactly one place.

### Wiring status

| Surface | Path |
| ------- | ---- |
| `auth.service.ts` | live — sign in, sign up, sign out |
| All 13 listing tables | live — `xService.list()` via `useServerTable` |

Every table now asks its service for one page. No page imports a fixture for its
rows; `mockData/*` is reached only through `fetchList`, and only while
`NEXT_PUBLIC_ENABLE_MOCK_DATA` is on. Fixtures are still imported directly for
stat cards and charts, which are not paginated.

Three filter shapes are in use, in order of preference:

| Shape | Use it when | Example |
| ----- | ----------- | ------- |
| `statusOf` + `query.status[]` | multi-select status popover | End users |
| `filterFields: { key }` | a dropdown matches one field exactly | Crypto txs `asset`/`dir`/`reason` |
| `predicate` | the axis is a range or a bucket | Transactions `Success` also covers `Authorized`; audit log `2xx`, `>= 500` |

To add a listing:

1. Give its service a `MockShape` so `fetchList` filters and sorts the fixture
   the way the API will — see
   [endUsersService](modules/EndUsersModule/services/endUsersService.ts).
2. Call `useServerTable({ fetcher: xService.list, status, filters })`.
   It adds `loading`, `error` and `reload` to the `TableState` `<TableCard>` takes.
3. Route writes through the service (`create`) and call `state.reload()` rather
   than holding an optimistic copy in component state.
4. Verify each filter axis by hand in the browser. Every key in the page's
   `filters` object must appear in the service's `filterFields` or be read by its
   `predicate`; a key only one side knows about is a silent no-op that still
   type-checks.

## Types

Same two-tier split as the services:

- **`types/global.ts`** holds only what crosses module boundaries — `Column`
  (the `DataTable` contract, 13 importers), `Paginated` (the `fetchList`
  contract), `Tenant`/`AdminUser`/`Environment`, the chart and tile types
  (`Delta`, `SeriesPoint`, `MetricTile`), `LedgerDirection` (shared by Float and
  Crypto txs), `FloatSummary` and `CustodyBalance` (each read by two modules),
  and the UI vocabulary (`Theme`, `BadgeTone`, `SortDir`, `NavItem`, …).
- **`modules/<X>/types.ts`** holds that module's own record types — the same
  convention as the reference's `Components/FilmoraPopup/types.ts`.
- **`modules/<X>/constants.ts`** holds that module's filter options and status
  vocabularies, for the same reason: a dropdown's options belong with the screen
  that renders them.

`types/constants.ts` keeps only what several places read — `NAV_ITEMS`,
`STATUS_TONES` (the `Badge` tone map), `PAGE_SIZES`, `DATE_RANGES`,
`DIRECTION_OPTIONS` (Float *and* Crypto txs), `CARD_PRODUCTS` (both fixtures),
`AUTH_ROUTES`/`PASSWORD_RULES`/`EMAIL_PATTERN` and the app strings.

A module refers to its own types relatively (`from "../types"`), never by
absolute path.

> **Fixtures and types.** `mockData/*` depends on `modules/*/types`, which is
> unavoidable once modules own their record shapes — the fixtures *are* those
> shapes. It lives at the top level rather than under `utils/` so that `utils/`
> stays a true leaf layer with no app-specific imports.
>
> Splitting the fixtures per module was considered and rejected: `auditLog`
> needs `endUsers` + `cardholders`, `transactions` needs `cards`, `custody` and
> `floatLedger` both need `dashboard`, and all 13 share `seed`. That would trade
> one directional dependency for six sibling module→module imports.

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

Flip the flag to `false` and point `NEXT_PUBLIC_API_BASE_URL` at your backoffice
API. `services/list.ts` already speaks the paginated contract
(`{ rows, total, page, pageSize }`), and each module service is a thin wrapper
over it — so switching is a config change alone: every listing already goes
through a service (see the wiring note above).

## Interaction notes

- `⌘K` / `Ctrl+K` opens the command palette; `Esc` closes any overlay.
- Tables search (debounced 250ms), sort (click a header), filter and paginate
  through their service via `useServerTable`, which holds only the current page
  and discards out-of-order responses.
- While a page is in flight the table says so instead of showing its empty state,
  and a failed fetch shows the error in the same slot — otherwise a slow or down
  API renders as "nothing to show", which reads as a broken screen.
- **Export** builds a CSV in the browser from the current page of rows.
- The sidebar collapses behind a scrim below 1080px.
