# File structure — TRAVLS-CRYPTO-DASHBOARD conventions

> **Status: complete.** All three phases have been applied and verified —
> `tsc` clean, `lint` clean, clean production build (17 static routes, zero server endpoints), 289 CSS Module
> references resolving across 38 stylesheets with zero unused selectors, 61/61
> runtime assertions passing and all 15 pages returning 200.
>
> What remains below is the record of *why* each decision was made. The one
> thing never verified is pixel fidelity — there was no browser in the
> environment this was done in, so the visual pass is still owed.

This records the conventions extracted from the reference project and how each
one maps onto the Partner Admin Panel's feature set.

## Conventions being adopted

| # | Convention (reference) | Applied here |
| - | ---------------------- | ------------ |
| 1 | A component is a **directory** whose entry is `index.tsx` | every `Components/*` gets `index.tsx` |
| 2 | Styles are **co-located CSS Modules**: `X.module.scss` beside `index.tsx` | ✅ 38 sheets |
| 3 | `styles/` holds **globals only** — `_index.scss`, `App.scss`, `globals.css`, `Home.module.css`, `media.scss`, `mixins.scss` | ✅ App.scss 7.6KB |
| 4 | Nested children live in `Components/` or `components/` under their parent | `DashboardWrapper/Components/{NavBar,SideBar}` |
| 5 | Page features are `modules/XxxModule/index.tsx` + `XxxModule.module.scss` | ✅ |
| 6 | Reducers are `redux/reducers/XxxReducer.ts` | ✅ |
| 7 | Some co-located styles are plain global CSS (`table.css`, `toastStyles.css`) | kept for the table cell helpers |
| 8 | Flat `customHooks/`, `services/*.service.ts`, `utils/`, `types/`, `libs/` | already matches |
| 9 | `utils/ImageRelativePaths.ts` centralises public asset paths | ✅ added |
| 10 | `public/terms-and-conditions.html` served as a static legal page | ✅ added — the sign-up consent links now have a real target instead of a dead route |
| 11 | ~~Nested API segments: `app/api/auth/token/route.ts`~~ | **dropped** — see below |
| 12 | `postcss.config.mjs` at the root | ✅ — see browserslist note below |
| 13 | NavBar dropdowns are their own modules (`modules/notificationdropdown/`, `modules/ProfileDropdownModule/`) | ✅ |
| 14 | `Components/PopupHandler/index.tsx` is a central modal router | ✅ |
| 15 | `Components/Dropdown/index.tsx` is a shared popover component | ✅ 6 consumers |
| 16 | `styles/mixins.scss` + `styles/media.scss` carry no leading underscore | ✅ |
| 17 | Two-tier services: global `<domain>.service.ts` + co-located `modules/*/services/<x>Service.ts` | ✅ 2 global + 12 module |

### `app/api/` — deliberately absent

The reference hosts route handlers because it needs server-only work: `places/`
proxies Google Places (the key must not reach the browser), `auth/token/` mints a
token, `booking-request/` posts server-side.

This panel's backend is a **separate service**. The five handlers that existed
here only re-served `utils/mockData`, held no secrets, and nothing fetched them —
scaffolding from before the service layer existed. They were removed, so every
route now builds static (`○`) and there are zero server endpoints.

`utils/Config.ts` also lost its `"/api"` fallback: it implied a Next-hosted API,
and it meant a missing `NEXT_PUBLIC_API_BASE_URL` resolved silently against this
app's own origin. `utils/axios.ts` now throws in development instead.

Add a route handler back only for work the browser genuinely cannot do — a
server-side third-party key, or an httpOnly session cookie to replace the
`localStorage` token in `utils/session.ts`.

### Not applicable to this product

`web3/` (no wallet connect), `utils/BNB.ts` (no BNB chain),
`redux/reducers/{CoinReducer,PaymentReducer}.ts` (no coin-selection or payment
state), and the reference's feature-specific popups — `AirdropTermsAndConditions`,
`FilmoraPopup`, `LuckySpin`, `OtpForm`, `PaymentPopup`, `WithdrawalOTPPopup`,
`Loginpopup` (this panel has full sign-in *pages*, not a modal).

### `postcss.config.mjs` — done, and why it needed a browserslist

Declaring the file makes Next use it *instead of* its built-ins, so the config
reproduces Next's default plugin list rather than replacing it.

That alone was not enough. With no `browserslist` in `package.json`,
`postcss-preset-env@11` fell back to its own modern default and **dropped
`-webkit-backdrop-filter` (4 occurrences) and `-webkit-sticky` (2)** — which
would have silently killed the blur on the modal overlay, command palette,
sidebar scrim and the auth trust card in Safari.

Pinning Next's own targets (`chrome 64, edge 79, firefox 67, opera 51,
safari 12`) restored them. Verified by diffing the emitted CSS against a
pre-change baseline with module hashes normalised away:

```
declarations  base=2204  fixed=2204
md5           base=0a0058a643602ca1d6356c28c7fe756c
md5           fixed=0a0058a643602ca1d6356c28c7fe756c
differing declarations: 0
```

If you upgrade `postcss-preset-env`, re-run that comparison.

## Naming map

### Components

| Before | After |
| ------ | ----- |
| `AppShell/AppShell.tsx` | `DashboardWrapper/index.tsx` |
| `Topbar/Topbar.tsx` | `DashboardWrapper/Components/NavBar/index.tsx` |
| `Sidebar/Sidebar.tsx` | `DashboardWrapper/Components/SideBar/index.tsx` |
| `Avatar/Avatar.tsx` | `Avatar/NameAvatar.tsx` |
| `Badge/Badge.tsx` | `Badge/index.tsx` |
| `Badge/CoinIcon.tsx` | `CoinIcon/index.tsx` |
| `Charts/Sparkline.tsx` | `Charts/Sparkline/index.tsx` |
| `Charts/AreaChart.tsx` | `Charts/AreaChart/index.tsx` |
| `Charts/EcgLine.tsx` | `Charts/EcgLine/index.tsx` |
| `Icons/Icon.tsx` | `Icons/index.tsx` |
| `PopUps/Modal.tsx` | `Popup/Popup.tsx` |
| `PopUps/ConfirmPopup.tsx` | `ConfirmPopup/index.tsx` |
| `Table/DataTable.tsx` | `Table/index.tsx` |
| `Table/TableCard.tsx` | `Table/Table_V2.tsx` |
| `Table/{SearchField,PerPageSelect,FilterMenu,SelectFilter,RowMenu,RefCell,ExportButton}.tsx` | one directory each |
| `Forms/{TextField,PasswordField,Checkbox}.tsx` | one directory each |
| `AuthGate/AuthGate.tsx` | `AuthWrapper/index.tsx` |
| `modules/Auth/AuthShell.tsx` | `Components/AuthShell/index.tsx` |
| `modules/Auth/SocialButtons.tsx` | `Components/SocialButtons/index.tsx` (shared by both screens) |
| `Loader`, `PageHeader`, `DateRangePicker`, `StatCard`, `DetailGrid`, `CommandPalette`, `LanguageSelect`, `Pagination`, `Toast` | `<dir>/index.tsx` |

### Modules

`Dashboard → DashboardModule`, `EndUsers → EndUsersModule`,
`Cardholders → CardholdersModule`, `Cards → CardsModule`,
`Transactions → TransactionModule`, `CardOrders → CardOrdersModule`,
`Float → FloatModule`, `Custody → CustodyModule`,
`CryptoTxs → CryptoTxsModule`, `Webhooks → WebhooksModule`,
`ApiKeys → ApiKeysModule`, `AuditLog → AuditLogModule`,
`Settings → SettingsModule`, `Auth/SignIn → SignInModule`,
`Auth/SignUp → SignUpModule`.

Child components move under the parent: `DashboardModule/Components/{FloatCard,
OpsHealthCard,QuickLinks}`, `EndUsersModule/components/AddEndUserModal`,
`CardholdersModule/components/AddCardholderModal`,
`FloatModule/components/ConvertCard`,
`WebhooksModule/components/WebhookConfigCard`.

### Reducers

`authSlice → AuthReducer`, `configSlice → ConfigReducer`,
`popupsSlice → PopUpsReducer`, `toastSlice → ToastReducer`,
`filtersSlice → FiltersReducer`. Exported action names are unchanged.

## Phases

**Phase A — moves + renames.** Encoded in [scripts/restructure.sh](scripts/restructure.sh).

**Phase B — import specifier rewrites.** Same script; runs immediately after A
so the repo is never left uncompilable.

```bash
bash scripts/restructure.sh
npx tsc --noEmit && npm run lint && npm run build
```

**Phase C — co-locate styles as CSS Modules.** Not scripted: it edits component
bodies rather than paths, so it needs a compiler in the loop. Per component:

1. Cut that component's rules out of the matching `styles/components/_*.scss`
   or `styles/pages/_*.scss` partial into `<Component>.module.scss`.
2. Head the new file with `@use "index" as *;` — the barrel at
   [styles/_index.scss](styles/_index.scss) forwards every mixin, breakpoint and
   Sass variable, and `next.config.ts` already puts `styles/` on the Sass load
   path.
3. Flatten BEM to local camelCase: `.stat__value` → `.value`,
   `.stat--inline` → `.inline`.
4. In the component, `import styles from "./X.module.scss"` and swap the class
   strings (`cx` already accepts them unchanged).
5. Run `npm run verify`, then rebuild, before moving to the next component.

### Guarding the swap

A mistyped key is the one failure mode CSS Modules hide: `styles.valuSm`
resolves to `undefined`, React drops the attribute, and the element renders
unstyled — with no error and a green `tsc`/`eslint`/`next build`.

[scripts/check-module-classes.mjs](scripts/check-module-classes.mjs) closes that
hole statically. It resolves every `*.module.scss` a file imports, collects the
selectors the sheet really defines, and fails on any `styles.key` with no match
(suggesting near-misses). `--unused` also lists selectors nothing references,
catching rules orphaned when markup changed.

```bash
npm run check:css            # just the module-class guard
npm run check:css -- --unused
npm run verify               # typecheck + check:css + lint
```

Run it after every component in step 4 — it is far faster than a rebuild and
catches the class of mistake a rebuild cannot.

### What stays global — final list

`styles/App.scss` ended at **7.6KB**, down from ~15KB. It keeps only primitives
applied as bare strings across component boundaries, the same split the
reference uses by keeping an `App.scss` alongside its modules:

- token layer and reset — `globals.css`
- `.u-*` utilities
- `.btn` (+ variants), `.link-brand`, `.link-danger` — 45 call sites and no
  `<Button>` component
- `.panel-card`, `.stat-grid`, `.listing`, `.section-title`, `.empty-state`,
  `.tag`
- `.spinner` — the auth submit buttons render it inline as `cx("spinner", …)`
- `.auth-loading` — shared by the session gate and the 404
- table cell helpers (`.dt__mono`, `.dt__muted`, `.dt__strong`, `.dt__ref-id`,
  `.dt__reason`, `.dt__action`) — passed to `DataTable` as `cellClassName`
  strings by every listing, so they live in `Components/Table/table.css` per
  convention #7

Four sets that *were* on this list have since moved out, each into the component
that owns them:

| Was global | Now owned by |
| ---------- | ------------ |
| `.popover`, `.menu-item`, `.check-row` | `Components/Dropdown` |
| `.field`, `.field__*` | `Components/TextField` (+ local `.control` in Settings / WebhookConfigCard) |
| `.select`, `.select__caret` | `Components/Select` |
| `.toggle`, `.kv-list` | `SettingsModule`, `ConvertCard` |

Everything else — shell, nav, sidebar, stat tiles, charts, table shell, page
header, overlays, auth screens and each module's own layout — is a co-located
module.

### Coverage audit

All 100 top-level selectors in the old partials were reconciled against the 34
co-located sheets. Two were initially missed and have been folded in:

| Selector | Now lives in | Why |
| -------- | ------------ | --- |
| `.toggle` | `SettingsModule.module.scss` | only the Settings rows use it |
| `.kv-list` | `ConvertCard.module.scss` | only the quote breakdown uses it |

Five selectors are **dead** — declared but referenced by no component. Delete
them during Phase C rather than migrating them:

`.two-col` · `.env-dot` · `.bar-chart` · `.donut` · `.legend`

(The last three were speculative chart primitives; no BarChart, Donut or Legend
component was ever built.)

### Style file renames (Phase C)

`_mixins.scss → mixins.scss`, `_media.scss → media.scss`,
`_variables.scss` folded into `mixins.scss` (already done),
`styles/components/*` and `styles/pages/*` deleted once emptied.

> Do not create `mixins.scss` while `_mixins.scss` still exists — Sass cannot
> resolve `@use "mixins"` when both are present.
